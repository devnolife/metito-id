import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Next.js 16 mengganti nama `middleware` menjadi `proxy`.
 *
 * Satu aplikasi internal dengan tiga tingkat akses di bawah shell yang sama:
 *   /sales/*                    — baca & pantau (ADMIN + SALES)
 *   /dashboard/quotations/*     — tim sales menyusun penawarannya (ADMIN + SALES)
 *   /dashboard/crm/activities   — Log Aktivitas, juga terbuka untuk MAGANG
 *   /dashboard/* lainnya        — data master (khusus ADMIN)
 * Semuanya dijaga JWT `auth-token` — satu login di /login. Pengguna yang
 * membuka halaman di luar haknya dikembalikan ke area kerjanya masing-masing,
 * bukan ke /login, agar tidak tampak seperti sesi kedaluwarsa.
 *
 * Rute /admin/* lama dialihkan permanen ke padanannya agar tautan/bookmark
 * lama tidak mati. API (/api/*) tetap memakai daftar path admin + whitelist
 * API publik dengan injeksi header x-user-*.
 */

// Verifikasi JWT ringan (duplikat logika tanpa mengimpor auth.ts yang
// bergantung pada prisma) agar proxy tetap ringan.
const JWT_SECRET = process.env.JWT_SECRET || "metito-tempur";

/** Satu-satunya halaman yang boleh dibuka peran MAGANG. */
const AKTIVITAS_PATH = "/dashboard/crm/activities";
async function verifyTokenSimple(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as any;
  } catch {
    return null;
  }
}

// API yang membutuhkan autentikasi admin
const adminApiPaths = [
  "/api/products",
  "/api/categories",
  "/api/blog",
  "/api/testimonials",
  "/api/services",
  "/api/certifications",
  "/api/gallery",
  "/api/newsletter",
  // '/api/customers'  // GET publik; mutasi dijaga di handler
];

// API yang membutuhkan autentikasi apa pun
const protectedPaths = ["/api/cart"];

/** Peta pengalihan rute konsol lama → rute baru di dalam shell. */
function legacyAdminTarget(pathname: string): string {
  if (pathname === "/admin" || pathname === "/admin/") return "/sales";
  if (pathname === "/admin/login") return "/login";
  if (pathname.startsWith("/admin/quotations")) {
    return pathname.replace("/admin/quotations", "/dashboard/quotations");
  }
  if (pathname.startsWith("/admin/letters")) {
    return pathname.replace("/admin/letters", "/dashboard/letters");
  }
  if (pathname.startsWith("/admin/crm")) {
    return pathname.replace("/admin/crm", "/dashboard/crm");
  }
  if (pathname.startsWith("/admin/settings")) {
    return pathname.replace("/admin/settings", "/dashboard/settings");
  }
  // Modul situs lama yang dinonaktifkan (products, blog, gallery, ...)
  return "/sales";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /* ==== 0. Pengalihan rute /admin lama ==== */
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = legacyAdminTarget(pathname);
    return NextResponse.redirect(url, 308);
  }

  // Mode pengembangan tanpa database: seluruh penjagaan dilewati.
  // Sengaja ditulis ulang di sini (bukan impor lib/dev-auth.ts) agar tetap
  // ringan; keduanya harus konsisten.
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_AUTH_BYPASS === "1") {
    return NextResponse.next();
  }

  /* ==== 1. Area internal (/sales, /dashboard) & halaman masuk ==== */
  //   /sales/*                — baca & pantau; ADMIN + SALES.
  //   /dashboard/quotations/* — tim sales menyusun penawarannya sendiri.
  //   /dashboard/crm/activities — Log Aktivitas; satu-satunya halaman MAGANG.
  //   /dashboard/* lainnya    — data master (CRM, surat, pengaturan): ADMIN.
  const isKelolaPage = pathname.startsWith("/dashboard");
  const isPenawaranPage = pathname.startsWith("/dashboard/quotations");
  const isAktivitasPage = pathname.startsWith("/dashboard/crm/activities");
  const isInternalPage = isKelolaPage || pathname.startsWith("/sales");

  if (isInternalPage || pathname === "/login") {
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    const payload = token ? await verifyTokenSimple(token) : null;
    const isAdmin = payload?.role === "ADMIN";
    const isSales = payload?.role === "SALES";
    const isMagang = payload?.role === "MAGANG";
    const isInternalUser = isAdmin || isSales || isMagang;
    // Halaman pertama setelah masuk, sesuai hak masing-masing peran.
    const homeFor = isMagang ? AKTIVITAS_PATH : "/sales";

    if (isInternalPage && !isInternalUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url);
    }

    // MAGANG hanya berhak atas Log Aktivitas; halaman internal lain ditutup.
    if (isMagang && isInternalPage && !isAktivitasPage) {
      const url = request.nextUrl.clone();
      url.pathname = AKTIVITAS_PATH;
      url.search = "";
      return NextResponse.redirect(url);
    }

    // Pengguna SALES sudah masuk tetapi tak berhak mengelola data master:
    // kembalikan ke area kerjanya. Log Aktivitas tetap terbuka karena tim
    // sales-lah yang mencatat follow-up pelanggan.
    if (isSales && isKelolaPage && !isPenawaranPage && !isAktivitasPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/sales";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (pathname === "/login" && isInternalUser) {
      const url = request.nextUrl.clone();
      url.pathname = homeFor;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  /* ==== 2. API ==== */

  // Lewati untuk aset publik dan rute auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/certificates") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Ambil token dari cookie atau header Authorization
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const requiresAdmin = adminApiPaths.some((path) => pathname.startsWith(path));
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));

  // GET ke endpoint API publik diizinkan tanpa autentikasi
  const publicApiEndpoints = [
    "/api/categories",
    "/api/products",
    "/api/blog",
    "/api/services",
    "/api/certifications",
    "/api/gallery",
    "/api/testimonials",
  ];

  if (
    request.method === "GET" &&
    publicApiEndpoints.some(
      (endpoint) => pathname === endpoint || pathname.startsWith(endpoint + "/")
    )
  ) {
    return NextResponse.next();
  }

  if (requiresAdmin || requiresAuth) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Authentication required",
            error: "UNAUTHORIZED",
          },
          { status: 401 }
        );
      }
    }

    const payload = token ? await verifyTokenSimple(token) : null;

    if (token && !payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
            error: "INVALID_TOKEN",
          },
          { status: 401 }
        );
      }
    }

    if (requiresAdmin && payload && payload.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Admin access required",
            error: "FORBIDDEN",
          },
          { status: 403 }
        );
      }
    }

    // Injeksi info user ke header untuk API
    if (pathname.startsWith("/api/") && payload) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path KECUALI:
     * - api/auth (rute autentikasi)
     * - _next/static, _next/image
     * - favicon.ico dan aset gambar statis
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
