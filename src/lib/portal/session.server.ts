import { cookies } from "next/headers";

import { verifyJWTEdge } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Sesi dashboard internal — dibaca dari JWT `auth-token` yang sama dengan
 * konsol admin (satu login di /login). Importing `next/headers` sudah membuat
 * modul ini server-only.
 */

export interface DashboardSession {
  name: string;
  email: string;
  company: string;
  initials: string;
}

const COMPANY_NAME = "PT Multi Enviro Tirta Teknologi";

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Nama tampilan darurat dari email bila profil DB tidak terjangkau. */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] || "admin";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getSession(): Promise<DashboardSession | null> {
  // Mode pengembangan tanpa database (selaras dengan bypass di proxy.ts).
  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_AUTH_BYPASS === "1") {
    return {
      name: "Dev Admin",
      email: "dev@metito.id",
      company: COMPANY_NAME,
      initials: "DA",
    };
  }

  const store = await cookies();
  const token = store.get("auth-token")?.value;
  if (!token) return null;

  const payload = await verifyJWTEdge(token);
  if (!payload || payload.role !== "ADMIN" || typeof payload.email !== "string") {
    return null;
  }

  // Nama lengkap diambil dari profil user; bila DB sedang tidak terjangkau,
  // sesi tetap valid dengan nama yang diturunkan dari email.
  let name = nameFromEmail(payload.email);
  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { name: true },
    });
    if (user?.name) name = user.name;
  } catch {
    // biarkan fallback nama-dari-email
  }

  return {
    name,
    email: payload.email,
    company: COMPANY_NAME,
    initials: initialsOf(name),
  };
}
