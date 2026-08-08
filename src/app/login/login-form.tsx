"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

/** Hanya izinkan path internal agar parameter next/redirect tak bisa dipakai
    untuk open-redirect ke situs lain. */
function safeTarget(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/sales";
}

function LoginFormInner() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const target = safeTarget(searchParams.get("next") ?? searchParams.get("redirect"));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
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

      if (user?.role !== "ADMIN") {
        // Dashboard internal hanya untuk admin — bersihkan sesi yang terlanjur dibuat.
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        setError("Akun ini tidak memiliki akses ke dashboard internal.");
        return;
      }

      // Simpan token untuk halaman konsol admin yang memakai header Bearer.
      if (typeof window !== "undefined" && token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
      }

      window.location.href = target;
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi Anda.");
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

export function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormInner />
    </Suspense>
  );
}
