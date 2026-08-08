import { ButtonLink } from "@/components/ui/button";
import { COMPANY, EXTERNAL } from "@/lib/site";

/**
 * `/career` hero — Andercore's team-photo hero (black gradient over a group
 * shot) is replaced with a METITO brand-gradient panel (navy → water blue).
 * White copy is kept deliberately: this is a dark, coloured panel.
 */
export function CareerHeroSection() {
  return (
    <section className="padding-global overflow-hidden">
      <div className="relative z-10 flex min-h-[70vh] w-full flex-col items-start justify-end overflow-hidden border-x border-line bg-gradient-to-br from-[#012966] via-[#0a4a8c] to-[#096aae] px-8 py-xlarge max-md:min-h-[60vh] max-md:px-4">
        {/* soft light wash + oversized ring as the decorative backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(70%_60%_at_85%_10%,rgba(255,255,255,0.10),transparent_60%),radial-gradient(50%_45%_at_10%_100%,rgba(30,114,38,0.22),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 z-0 h-[34rem] w-[34rem] rounded-full border border-[#fff]/10"
        />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 z-0 h-[22rem] w-[22rem] rounded-full border border-[#fff]/10"
        />

        <div className="relative z-20 flex flex-col items-start justify-start gap-medium max-md:w-full">
          <div className="flex flex-col items-start justify-start gap-xsmall">
            <div className="font-mono text-tiny uppercase leading-1-5 text-[#fff]/70">
              Karier di {COMPANY.brand}
            </div>
            <h1 className="text-h1 font-medium leading-1-1 tracking-h1 text-[#fff]">
              Bangun karier di bidang air, industri, dan pertambangan
            </h1>
            <p className="max-w-[34.5rem] text-regular leading-1-5 text-[#fff]/80">
              {COMPANY.name} selalu terbuka untuk talenta terbaik — teknisi, engineer, sales,
              dan tenaga administrasi yang ingin tumbuh bersama penyedia solusi terintegrasi
              untuk water treatment, industrial supply, dan mining support services.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 max-xs:w-full">
            <ButtonLink href="#career-apply" className="max-xs:w-full">
              Lamar Sekarang
            </ButtonLink>
            <ButtonLink
              href={EXTERNAL.email}
              variant="secondary"
              className="border-[#fff]/25 bg-[#fff]/10 text-[#fff] hover:bg-[#fff]/20 max-xs:w-full"
            >
              Kirim CV via Email
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
