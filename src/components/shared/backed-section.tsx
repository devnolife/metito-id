import { cn } from "@/lib/utils";

/** One text tile inside the tile grid (replaces the old partner-logo images). */
export interface BackedItem {
  title: string;
  detail?: string;
}

/** Industri yang dilayani METITO — menggantikan grid logo investor Andercore. */
export const INDUSTRY_ITEMS: readonly BackedItem[] = [
  { title: "Mining", detail: "Batubara, nikel, dan emas" },
  { title: "Petrochemical" },
  { title: "Oil & Gas" },
  { title: "Palm Oil Refinery" },
  { title: "Water Treatment" },
  { title: "Power Plants" },
];

export const BACKED_TAGLINE = "Industri yang Dilayani";
export const BACKED_HEADING = "Hadir untuk berbagai sektor industri";

export interface BackedSectionProps {
  tagline: string;
  heading: string;
  intro: string;
  /** Mono eyebrow rendered above the tile grid. */
  itemsLabel: string;
  items: readonly BackedItem[];
}

/**
 * `.backed_main_wrapper` — repurposed for METITO: a centred header followed by a
 * bordered grid of text tiles (sektor industri), replacing the Andercore
 * investor / financing logo grids.
 *
 * container   padding-top 4rem (3rem < 768), no bottom padding — the tile grid
 *             runs flush against the section's bottom edge
 * header      max-width 37rem, centred (left-aligned + 1rem gutter < 768)
 * grid        3 tracks >= 992 · 2 tracks 768–991 · 1 track < 768
 */
export function BackedSection({
  tagline,
  heading,
  intro,
  itemsLabel,
  items,
}: BackedSectionProps) {
  return (
    <section className="padding-global">
      <div className="border-x border-line pt-12 md:pt-16">
        <div className="mx-auto flex max-w-[37rem] flex-col items-start justify-start gap-4 px-4 md:items-center md:px-0 md:text-center">
          <div className="flex flex-col items-start justify-start gap-3 md:items-center">
            <div className="tagline">{tagline}</div>
            <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">{heading}</h2>
          </div>
          <p className="text-regular leading-1-5 text-body">{intro}</p>
        </div>

        <div className="mt-8 flex justify-center md:mt-12">
          <div className="tagline pb-4">{itemsLabel}</div>
        </div>

        <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr]">
          {items.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "flex flex-col items-center justify-center gap-1 border-t border-line px-4 py-8 text-center",
                index % 2 === 0 && "md:border-r",
                index % 3 !== 2 && "lg:border-r",
                index % 3 === 2 && "lg:border-r-0"
              )}
            >
              <div className="text-h5 font-medium leading-1-4 tracking-h3 text-navy">
                {item.title}
              </div>
              {item.detail ? (
                <p className="text-small leading-1-5 text-body">{item.detail}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
