import { cn } from "@/lib/utils"

interface SectionMarkerProps {
  /** Two-digit section index rendered in the mono rail, e.g. "03". */
  index: string
  /** Short mono label sitting next to the index. */
  label: string
  title: React.ReactNode
  lead?: string
  align?: "left" | "center"
  className?: string
}

/**
 * Section heading for the marketing pages.
 *
 * Deliberately left-aligned and rail-led (index + label + hairline) rather than
 * the centred title-with-underline of the old company-profile slides, which is
 * what made every section read as another PowerPoint page.
 */
export function SectionMarker({
  index,
  label,
  title,
  lead,
  align = "left",
  className,
}: SectionMarkerProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        <span className="rail text-[var(--aqua)]">{index}</span>
        <span className="h-px w-8 bg-aqua/45" />
        <span className="rail text-[var(--body-muted)]">{label}</span>
      </div>

      <h2
        className={cn(
          "font-display mt-5 text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white",
          align === "center" && "mx-auto max-w-4xl"
        )}
      >
        {title}
      </h2>

      {lead && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-[var(--body-muted)] md:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  )
}
