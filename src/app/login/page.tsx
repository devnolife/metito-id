import type { Metadata } from "next";
import Link from "next/link";

import { LogoWordmark } from "@/components/icons";
import { EXTERNAL } from "@/lib/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Masuk | METITO",
  description: "Masuk ke dashboard internal PT. Multi Enviro Tirta Teknologi.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg-shade px-5 py-10">
      <div className="w-full max-w-[400px]">
        <Link href="/" aria-label="Beranda METITO" className="mb-8 flex justify-center">
          <LogoWordmark className="h-11" />
        </Link>

        <div className="rounded-md border border-line bg-card p-6 md:p-8">
          <p className="font-mono text-tiny uppercase tracking-wide text-tag">
            Dashboard internal
          </p>
          <h1 className="mt-2 text-h4 font-medium tracking-h3 text-navy">Masuk</h1>

          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <p className="mt-6 text-center text-tiny text-tag">
          Akses terbatas untuk personel PT. Multi Enviro Tirta Teknologi.
          <br />
          Kendala akses?{" "}
          <a
            href={EXTERNAL.whatsapp}
            className="underline underline-offset-2 hover:text-navy"
          >
            Hubungi via WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
