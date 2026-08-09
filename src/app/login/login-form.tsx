"use client";

import { useState } from "react";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

/** Peran yang berhak masuk aplikasi internal. */
const INTERNAL_ROLES = ["ADMIN", "SALES", "MAGANG"] as const;

/** Halaman pertama tiap peran; MAGANG hanya berhak atas Log Aktivitas. */
const AKTIVITAS_PATH = "/dashboard/crm/activities";

/** Hanya izinkan path internal agar parameter next/redirect tak bisa dipakai
    untuk open-redirect ke situs lain. */
function safeTarget(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/sales";
}

/**
 * Halaman asal dibaca dari alamat saat formulir dikirim, bukan lewat
 * useSearchParams. Hook itu memaksa halaman yang sudah diprarender melepas
 * render server untuk seluruh subpohonnya, sehingga formulir hilang dari HTML
 * dan baru muncul setelah JavaScript selesai dimuat — bila berkasnya gagal
 * diambil, yang tersisa hanyalah kartu masuk tanpa isi.
 */
function requestedTarget(): string {
  if (typeof window === "undefined") return "/sales";
  const params = new URLSearchParams(window.location.search);
  return safeTarget(params.get("next") ?? params.get("redirect"));
}

/** Tujuan setelah masuk, dibatasi hak peran agar tidak mendarat di halaman
    yang justru akan memantulkannya kembali. */
function targetForRole(role: string, requested: string): string {
  if (role === "MAGANG") return AKTIVITAS_PATH;
  if (role === "SALES" && requested.startsWith("/dashboard") &&
      !requested.startsWith("/dashboard/quotations") &&
      !requested.startsWith(AKTIVITAS_PATH)) {
    return "/sales";
  }
  return requested;
}

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Isi email dan kata sandi untuk melanjutkan.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setError(
          response.status === 401
            ? "Login gagal. Periksa email dan kata sandi Anda."
            : data?.message || "Terjadi kesalahan pada server. Coba lagi."
        );
        return;
      }

      const { user, token } = data.data ?? {};

      if (!INTERNAL_ROLES.includes(user?.role)) {
        // Aplikasi internal hanya untuk staf — bersihkan sesi yang terlanjur dibuat.
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        setError("Akun ini tidak memiliki akses ke aplikasi internal.");
        return;
      }

      // Token disimpan untuk halaman konsol lama yang memakai header Bearer.
      // localStorage dapat melempar galat pada mode penjelajahan privat atau
      // saat kuotanya penuh; kegagalannya tidak boleh membatalkan perpindahan
      // halaman, sebab sesi sebenarnya sudah ada di cookie.
      try {
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("adminUser", JSON.stringify(user));
        }
      } catch {
        // abaikan: sesi tetap sah lewat cookie
      }

      window.location.href = targetForRole(user.role, requestedTarget());
    } catch (err) {
      setError(
        err instanceof Error
          ? `Tidak dapat menghubungi server: ${err.message}`
          : "Tidak dapat menghubungi server. Periksa koneksi Anda."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-4">
        <Field data-invalid={error ? true : undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="admin@metito.id"
            aria-invalid={error ? true : undefined}
            className="h-12 bg-card"
          />
        </Field>

        <Field data-invalid={error ? true : undefined}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
            <span className="text-tiny text-muted-foreground">Lupa kata sandi?</span>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={error ? true : undefined}
            className="h-12 bg-card"
          />
        </Field>

        {error ? (
          <FieldDescription className="rounded-[0.375rem] border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">
            {error}
          </FieldDescription>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-primary text-regular font-medium text-primary-foreground transition-colors hover:bg-[#d64300] disabled:opacity-60"
        >
          {pending ? (
            <>
              <Spinner /> Sedang masuk…
            </>
          ) : (
            "Masuk ke Dashboard"
          )}
        </button>
      </FieldGroup>
    </form>
  );
}
