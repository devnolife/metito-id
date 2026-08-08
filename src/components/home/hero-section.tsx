import { WaterDrop } from "@/components/icons";
import { ButtonLink } from "@/components/ui/button";
import { EXTERNAL } from "@/lib/site";

/** Category strip mirroring the logo lockup: CHEMICAL | ENGINEERING | EQUIPMENT | SPARE PARTS */
const CATEGORIES = [
  { label: "Chemical", className: "text-navy" },
  { label: "Engineering", className: "text-green" },
  { label: "Equipment", className: "text-navy" },
  { label: "Spare Parts Supplier", className: "text-brand" },
];

export function HeroSection() {
  return (
    <section className="padding-global overflow-hidden">
      <div className="relative z-10 flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden border-x border-line px-medium py-xlarge max-md:px-4">
        {/* soft water-blue wash as the backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-[100] bg-[radial-gradient(80%_60%_at_85%_20%,rgba(9,106,174,0.10),transparent_60%),radial-gradient(60%_50%_at_10%_90%,rgba(251,133,1,0.08),transparent_60%)]"
        />

        <div className="relative z-20 mx-auto flex w-full max-w-[52rem] flex-col items-center gap-medium text-center">
          <div className="flex flex-col items-center gap-xsmall">
            <div className="tagline">PT Multi Enviro Tirta Teknologi</div>
            <h1 className="text-h1 font-medium leading-1-1 tracking-h1 text-navy">
              Integrated Solutions for Water, Industry and Mining
            </h1>
            <p className="max-w-[38rem] text-regular leading-1-5 text-body">
              Solusi satu atap untuk kebutuhan operasional, perawatan, dan rekayasa industri Anda —
              chemical supply, engineering services, equipment, hingga spare parts untuk sistem
              pengolahan air dan proses industri secara menyeluruh.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-xsmall">
            <ButtonLink href={EXTERNAL.whatsapp}>Konsultasi via WhatsApp</ButtonLink>
            <ButtonLink variant="secondary" href="/#lini-bisnis">
              Lihat Lini Bisnis
            </ButtonLink>
          </div>

          {/* logo-style rule: blue line · water drop · green line */}
          <div className="brand-rule w-full max-w-[34rem]">
            <WaterDrop className="text-blue" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {CATEGORIES.map((category, index) => (
              <span key={category.label} className="flex items-center gap-4">
                {index > 0 && (
                  <span aria-hidden="true" className="text-line">
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
