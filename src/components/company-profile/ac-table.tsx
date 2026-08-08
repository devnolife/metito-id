import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The `.ac-table` HTML embed used all over /company-profile, restyled for the
 * light METITO theme:
 *
 *   --ac-pad-y .85rem · --ac-pad-x 1.25rem · --ac-text-size 1rem
 *   --ac-label-size .8125rem · --ac-big-size 1.375rem
 *   labels → var(--ac-gray) #5a6b81 · rules → var(--ac-line) #d9e2ee
 */
export type AcTableVariant = "plain" | "grid" | "gridBig" | "rowlabel" | "timeline";

const BASE =
  "m-0 w-full border-collapse border border-line text-left text-body " +
  "[&_th]:box-border [&_td]:box-border " +
  "[&_th]:px-5 [&_td]:px-5 [&_th]:py-[0.85rem] [&_td]:py-[0.85rem] " +
  "[&_th]:font-normal [&_td]:font-normal " +
  "[&_th]:border-t [&_td]:border-t [&_th]:border-line [&_td]:border-line " +
  "[&_tr:first-child>th]:border-t-0 [&_tr:first-child>td]:border-t-0 " +
  "[&_thead_th]:font-mono [&_thead_th]:text-[0.8125rem] [&_thead_th]:font-medium " +
  "[&_thead_th]:tracking-[0.06em] [&_thead_th]:uppercase [&_thead_th]:text-gray";

const RAIL = "[&_th+th]:border-l [&_td+td]:border-l";

const ROW_LABEL =
  "[&_tbody_th]:font-mono [&_tbody_th]:text-[0.8125rem] [&_tbody_th]:font-medium " +
  "[&_tbody_th]:tracking-[0.06em] [&_tbody_th]:uppercase [&_tbody_th]:text-gray " +
  "[&_tbody_th]:w-[30%] [&_tbody_th]:pr-10";

const TIMELINE =
  "[&_tbody_th]:w-[30%] [&_tbody_th]:text-gray [&_tbody_th]:pr-6";

const VARIANT: Record<AcTableVariant, string> = {
  plain: "",
  grid: RAIL,
  gridBig: RAIL,
  rowlabel: ROW_LABEL,
  timeline: TIMELINE,
};

export interface AcTableProps {
  variant?: AcTableVariant;
  /** Extra classes on the `<table>` (e.g. the ≤600px `min-width` rules). */
  className?: string;
  /** Extra classes on the `.w-embed` wrapper (e.g. the `.code-embed` 20px top margin). */
  wrapperClassName?: string;
  children: ReactNode;
}

export function AcTable({
  variant = "plain",
  className,
  wrapperClassName,
  children,
}: AcTableProps) {
  // `.ac-table--big td` and `.ac-table--rowlabel th/td` override base declarations that
  // Tailwind would emit with the same selector, so they are resolved here instead.
  const cellText =
    variant === "gridBig"
      ? "[&_th]:text-regular [&_th]:leading-[1.375] [&_td]:text-[1.375rem] [&_td]:leading-[1.3]"
      : "[&_th]:text-regular [&_td]:text-regular [&_th]:leading-[1.375] [&_td]:leading-[1.375]";
  const cellAlign =
    variant === "rowlabel"
      ? "[&_th]:align-middle [&_td]:align-middle"
      : "[&_th]:align-top [&_td]:align-top";

  return (
    <div className={wrapperClassName}>
      <div className="w-full overflow-x-auto">
        <table className={cn(BASE, cellText, cellAlign, VARIANT[variant], className)}>
          {children}
        </table>
      </div>
    </div>
  );
}
