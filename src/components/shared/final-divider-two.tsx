import { cn } from "@/lib/utils";

/**
 * ---------------------------------------------------------------------------
 * `<FinalDividerTwo/>` — the SECOND divider artwork.
 * ---------------------------------------------------------------------------
 *
 * Geometrically identical to `@/components/layout/section-divider`
 * (`<SectionDivider/>`): 5% gutter, 1px #382e30 frame on all four sides,
 * 120px desktop / 64px phone artwork, `object-cover`.
 *
 * The ONLY difference is the desktop image. Webflow ships two divider assets and
 * the designer picked per-instance:
 *
 *   "Final Divider  1.svg"  -> /images/final-divider-1.svg  -> <SectionDivider/>
 *   "final divider 2.svg"   -> /images/final-divider-2.svg  -> <FinalDividerTwo/>
 *
 * The phone artwork (`/images/frame-1948758809-3.svg`) is the same for both, so
 * below 992px the two components render identically.
 *
 * Measured usage on the live site (desktop image src per divider, y offset):
 *
 *   /faqs             2498 one · 3189 TWO
 *   /imprint           993 one · 1681 TWO · 2372 TWO
 *   /privacy         12870 TWO · 13537 TWO
 *   /terms           11978 TWO · 12645 TWO
 *   /terms-suppliers  9076 TWO ·  9743 TWO
 *   /career           5286 TWO (every other divider on / and /about-us is "one")
 */
export interface FinalDividerTwoProps {
  className?: string;
  /** Hide the whole divider below the `lg` breakpoint (Webflow `.hide-mobile-landscape`). */
  desktopOnly?: boolean;
  /** Only render below the `lg` breakpoint (Webflow `.show-mobile`). */
  mobileOnly?: boolean;
}

export function FinalDividerTwo({
  className,
  desktopOnly = false,
  mobileOnly = false,
}: FinalDividerTwoProps) {
  return (
    <div
      className={cn(
        "padding-global",
        desktopOnly && "hidden lg:block",
        mobileOnly && "block lg:hidden",
        className,
      )}
      aria-hidden="true"
    >
      <div className="border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/final-divider-2.svg"
          alt=""
          loading="lazy"
          className="hidden h-[7.5rem] w-full object-cover lg:inline-block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/frame-1948758809-3.svg"
          alt=""
          loading="lazy"
          className="inline-block h-16 w-full object-cover md:h-[7.5rem] lg:hidden"
        />
      </div>
    </div>
  );
}
