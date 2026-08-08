import { cn } from "@/lib/utils";

/**
 * Full-bleed grid divider that sits between every section.
 *
 * Wrapper  padding-inline 5%  (72px @ 1440)
 * Content  1px solid var(--ac-line) border on all four sides
 * Art      light diagonal-hatch pattern (`.divider-pattern`), h-7.5rem desktop / h-4rem phone
 */
export type DividerVariant = "default" | "alt";

export interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  /** `display:none` below 768px. */
  desktopOnly?: boolean;
  /** `display:none` by default, `display:block` below 768px. */
  mobileOnly?: boolean;
}

export function SectionDivider({
  variant = "default",
  className,
  desktopOnly = false,
  mobileOnly = false,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "padding-global",
        desktopOnly && "hidden md:block",
        mobileOnly && "block md:hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="border border-line">
        <div
          className={cn(
            "divider-pattern h-16 w-full md:h-[7.5rem]",
            variant === "alt" && "opacity-60"
          )}
        />
      </div>
    </div>
  );
}
