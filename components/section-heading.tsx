import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  /** Small gold label above the title, e.g. "CONTACT US". */
  eyebrow?: string
  title: string
  /** Optional supporting line under the gold rule. */
  subtitle?: string
  align?: "center" | "left"
  className?: string
  /** Renders the title in uppercase, matching the profile slides. */
  uppercase?: boolean
}

/**
 * Section heading that mirrors the company profile slides:
 * centered title with a short gold underline bar.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  uppercase = true,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <span className="block text-[var(--gold)] text-xs font-bold uppercase tracking-[0.22em] mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        data-align={align === "left" ? "left" : undefined}
        className={cn(
          "profile-heading font-display font-bold text-white tracking-[-0.01em] leading-[1.15] text-3xl md:text-4xl lg:text-[2.75rem]",
          uppercase && "uppercase"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base md:text-lg text-[var(--body-text)] leading-relaxed",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
