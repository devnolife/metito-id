/**
 * Formerly `.partner_main_wrapper` — Andercore's university / consulting logo
 * wall (WHU, HSG, RWTH, McKinsey, …). Repurposed as a text-only strip of the
 * industries METITO serves; the export name is kept so `/career` compiles.
 */
import { cn } from "@/lib/utils";

const INDUSTRIES: readonly string[] = [
  "Mining",
  "Petrochemical",
  "Oil & Gas",
  "Palm Oil Refinery",
  "Water Treatment",
  "Power Plants",
];

export function TalentPartnersSection() {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <div className="mx-auto flex max-w-[36rem] flex-col items-center justify-start gap-3 pt-xlarge pb-large text-center max-md:px-4">
          <div className="tagline">Industri yang Kami Layani</div>
          <h2 className="text-center text-h2 font-medium leading-1-1 tracking-h2 text-navy">
            Bergabung berarti bekerja untuk sektor-sektor ini
          </h2>
        </div>

        <div>
          <div role="list" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {INDUSTRIES.map((industry, index) => (
              <div
                key={industry}
                role="listitem"
                className={cn(
                  "border-t border-r border-line",
                  index % 2 === 1 && "max-md:border-r-0",
                  index % 3 === 2 && "md:max-lg:border-r-0",
                  index === INDUSTRIES.length - 1 && "lg:border-r-0"
                )}
              >
                <div className="flex h-full flex-col items-center justify-center px-4 py-9 text-center">
                  <span className="font-mono text-tiny font-bold uppercase tracking-wide text-navy">
                    {industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
