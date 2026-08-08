/**
 * Formerly `.review_main_wrapper` — Andercore's "Life at Andercore" testimonial
 * grid with staff photos and quotes. Repurposed as a text-only overview of what
 * working at METITO involves (no invented testimonials); the photo slot is
 * replaced by the light `divider-pattern` hatch.
 */
import { cn } from "@/lib/utils";

interface WorkHighlight {
  title: string;
  body: string;
  detail: string;
}

const HIGHLIGHTS: readonly WorkHighlight[] = [
  {
    title: "Proyek lintas industri",
    body: "Bekerja langsung dengan pelanggan di berbagai sektor — dari tambang hingga pembangkit listrik — dalam menjaga keandalan sistem pengolahan air mereka.",
    detail: "Mining · Petrochemical · Oil & Gas · Palm Oil Refinery · Power Plants",
  },
  {
    title: "Keahlian teknis yang dalam",
    body: "Terlibat dalam design WTP/WWTP/STP, RO system, demineralization plant, chlorine dioxide system, hingga installation & commissioning di lapangan.",
    detail: "Engineering · Instalasi · Commissioning",
  },
  {
    title: "Tanggung jawab nyata",
    body: "Dari plant audit, troubleshooting, dan chemical dosing system hingga fabrikasi tangki, piping, struktur baja, serta shutdown & turnaround support.",
    detail: "Maintenance · Fabrikasi · Site Support",
  },
];

export function LifeSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <div className="w-full pt-huge" />

        <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center justify-start gap-3 text-center max-md:px-4">
          <div className="tagline">Bekerja di METITO</div>
          <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Tempat bertumbuh bagi teknisi dan engineer
          </h2>
        </div>

        <div>
          <div className="mt-12 grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr]">
            {HIGHLIGHTS.map((item) => (
              <div key={item.title}>
                <div
                  className={cn(
                    "flex h-full flex-col gap-6 border-t border-r border-line max-md:border-r-0"
                  )}
                >
                  <div className="divider-pattern h-28 w-full border-b border-line" aria-hidden="true" />

                  <div className="flex h-full flex-col justify-between gap-3 px-small pb-10 max-md:h-auto max-md:px-4">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                        {item.title}
                      </h3>
                      <div>
                        <p className="text-regular leading-1-5 text-body">{item.body}</p>
                      </div>
                    </div>

                    <div className="mt-3 font-mono text-tiny uppercase leading-1-5 text-blue">
                      {item.detail}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
