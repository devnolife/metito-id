import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * `.andercore_main_header` — the centred tagline / heading / intro block that opens
 * every `.principle_main_wrapper` on /about-us and /company-profile.
 *
 * padding  4rem 1rem 3rem  (>= 768)  ·  3rem 1rem 2rem  (< 768)
 * gap      .75rem
 */
export interface SectionHeadingProps {
  tagline: string;
  heading: string;
  intro?: ReactNode;
  className?: string;
}

export function SectionHeading({ tagline, heading, intro, className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start gap-3 px-4 pt-12 pb-8 text-center md:pt-16 md:pb-12",
        className
      )}
    >
      <div className="tagline">{tagline}</div>
      <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">{heading}</h2>
      {intro ? <p className="text-regular leading-1-5 text-body">{intro}</p> : null}
    </div>
  );
}

/** One `.principle_main_div` card — heading + body copy. */
export interface PrincipleCard {
  title: string;
  body: string;
}

export interface PrincipleSectionProps {
  tagline: string;
  heading: string;
  intro?: ReactNode;
  /**
   * `.principle_main_grid` — two equal `1fr` tracks (one below 768px).
   * Odd-indexed cards carry `.no-left`, i.e. no right border.
   */
  cards?: readonly PrincipleCard[];
  /** Extra body content (stat grids, embedded tables …) rendered after the header. */
  children?: ReactNode;
}

/**
 * `.principle_main_wrapper` > `.principle_main_container`.
 *
 * The container has no vertical padding of its own — the header and the grid
 * supply all the spacing.
 */
export function PrincipleSection({
  tagline,
  heading,
  intro,
  cards,
  children,
}: PrincipleSectionProps) {
  return (
    <section className="padding-global">
      <div className="border-x border-line">
        <SectionHeading tagline={tagline} heading={heading} intro={intro} />

        {cards ? (
          <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr]">
            {cards.map((card, index) => (
              <div
                key={card.title}
                className={cn(
                  "flex flex-col items-start justify-start gap-3 border-t border-line px-4 py-6 md:px-6 md:py-8",
                  index % 2 === 0 && "md:border-r"
                )}
              >
                <h3 className="text-h3 font-medium leading-1-2 tracking-h3 text-navy">
                  {card.title}
                </h3>
                <p className="text-regular leading-1-5 text-body">{card.body}</p>
              </div>
            ))}
          </div>
        ) : null}

        {children}
      </div>
    </section>
  );
}
