import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Full METITO lockup — kingfisher mark + "METITO / Multi Enviro Tirta Teknologi"
 * wordmark + category strip, from the official letterhead (core/Kop Metito 2.png).
 * Rendered on a white chip so it stays legible on any surface.
 */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-[4px] bg-white", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/metito-logo-full.png"
        alt="METITO — Multi Enviro Tirta Teknologi"
        className="h-full w-auto object-contain"
      />
    </span>
  );
}

/** METITO kingfisher mark (recycle ring + water-drop "M"). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-[4px]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/metito-mark.png"
        alt="METITO"
        className="h-full w-auto object-contain"
      />
    </span>
  );
}

/** Water-drop glyph in the METITO divider, colour via currentColor — 12 x 16 */
export function WaterDrop(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 0C6 0 0 7.1 0 10.4 0 13.5 2.7 16 6 16s6-2.5 6-5.6C12 7.1 6 0 6 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Solid down-pointing triangle used by the locale dropdown — 7 x 4 */
export function CaretDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="7"
      height="4"
      viewBox="0 0 7 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 3.5L0 0H7L3.5 3.5Z" fill="currentColor" />
    </svg>
  );
}

/** Vertical dashed connector with a white square cap — 12 x 152 */
export function DashedConnector(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="12"
      height="152"
      viewBox="0 0 12 152"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 5V152" stroke="#B9C7DD" strokeDasharray="2 2" />
      <rect width="12" height="12" fill="#012966" />
    </svg>
  );
}

/** Hamburger / close icon for the mobile nav */
export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
