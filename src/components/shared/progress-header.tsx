import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * `.progress_main_header` — the left-aligned tagline / heading / intro block used by
 * `.progress_main_wrapper` on /about-us and /company-profile (and by the "References"
 * section, which reuses the same markup inside a `.principle_main_wrapper`).
 *
 * max-width 37rem · gap 1rem · padding-left 2rem (>= 768) / 1rem both sides (< 768)
 */
export interface ProgressHeaderProps {
  tagline: string;
  heading: string;
  intro?: ReactNode;
  /**
   * `true`  → the intro sits inside `.progress_header_content` (gap .75rem, /company-profile)
   * `false` → the intro is a sibling of it (gap 1rem, /about-us)
   */
  introInside?: boolean;
  className?: string;
}

export function ProgressHeader({
  tagline,
  heading,
  intro,
  introInside = false,
  className,
}: ProgressHeaderProps) {
  const introNode = intro ? (
    <p className="text-regular leading-1-5 text-body">{intro}</p>
  ) : null;

  return (
    <div
      className={cn(
        "flex max-w-[37rem] flex-col items-start justify-start gap-4 px-4 md:pr-0 md:pl-8",
        className
      )}
    >
      <div className="flex flex-col items-start justify-start gap-3">
        <div className="tagline">{tagline}</div>
        <h2 className="text-h2 font-medium leading-1-1 tracking-h2 text-navy">{heading}</h2>
        {introInside ? introNode : null}
      </div>
      {introInside ? null : introNode}
    </div>
  );
}
