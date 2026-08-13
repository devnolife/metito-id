import type { CSSProperties } from "react";

import { WaterDrop } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { EXTERNAL } from "@/lib/site";

import { HeroBackdrop } from "./hero-backdrop";

/**
 * Category strip mirroring the logo lockup: CHEMICAL | ENGINEERING | EQUIPMENT | SPARE PARTS
 *
 * Warna lockup aslinya tidak bisa dipakai di atas hero bervideo: pada scrim
 * 0,62 navy #012966 hanya 0,53:1, hijau #1e7226 1,22:1, dan oranye #f04e00
 * 2,03:1 — ketiganya jauh di bawah ambang 4,5:1. Padanan terangnya menjaga
 * pengodean warna yang sama sambil tetap terbaca.
 */
const CATEGORIES = [
  { label: "Chemical", className: "text-[#fff]" },
  { label: "Engineering", className: "text-[#86efac]" },
  { label: "Equipment", className: "text-[#fff]" },
  { label: "Spare Parts Supplier", className: "text-[#fed7aa]" },
];

export function HeroSection() {
  return (
    <section className="padding-global overflow-hidden">
      <div className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden border-x border-line px-medium py-xlarge max-md:px-4">
        {/* video profil METITO + scrim navy, dua lapis paling bawah */}
        <HeroBackdrop />

        <div className="relative z-20 mx-auto flex w-full max-w-[52rem] flex-col items-center gap-medium text-center">
          <div className="flex flex-col items-center gap-xsmall">
            <div className="tagline reveal-load text-[#bae6fd]">PT Multi Enviro Tirta Teknologi</div>
            <h1
              className="reveal-load text-h1 font-medium leading-1-1 tracking-h1 text-[#fff]"
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
            >
              Integrated Solutions for Water, Industry and Mining
            </h1>
            <p
              className="reveal-load max-w-[38rem] text-regular leading-1-5 text-[#fff]/85"
              style={{ "--reveal-delay": "180ms" } as CSSProperties}
            >
              Solusi satu atap untuk kebutuhan operasional, perawatan, dan rekayasa industri Anda —
              chemical supply, engineering services, equipment, hingga spare parts untuk sistem
              pengolahan air dan proses industri secara menyeluruh.
            </p>
          </div>

          <div
            className="reveal-load flex flex-wrap items-center justify-center gap-xsmall"
            style={{ "--reveal-delay": "270ms" } as CSSProperties}
          >
            <ButtonLink href={EXTERNAL.whatsapp}>Konsultasi via WhatsApp</ButtonLink>
            <ButtonLink variant="secondaryOnDark" href="/#lini-bisnis">
              Lihat Lini Bisnis
            </ButtonLink>
          </div>

          {/* logo-style rule: blue line · water drop · green line.
              `--ac-blue` / `--ac-green` diwariskan ke pseudo-element ::before
              dan ::after, jadi menimpanya di sini cukup untuk menerangkan
              kedua garis tanpa menyentuh kelas global. */}
          <div
            className="brand-rule reveal-load w-full max-w-[34rem] [--ac-blue:#bae6fd] [--ac-green:#86efac]"
            style={{ "--reveal-delay": "360ms" } as CSSProperties}
          >
            <WaterDrop className="text-[#bae6fd]" />
          </div>

          <div
            className="reveal-load flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
            style={{ "--reveal-delay": "430ms" } as CSSProperties}
          >
            {CATEGORIES.map((category, index) => (
              <span key={category.label} className="flex items-center gap-4">
                {index > 0 && (
                  <span aria-hidden="true" className="text-[#fff]/25">
                    |
                  </span>
                )}
                <span
                  className={`font-mono text-tiny font-bold uppercase tracking-wide ${category.className}`}
                >
                  {category.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
