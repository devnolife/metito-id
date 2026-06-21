import { DockButtonLink } from "./dock-button"

// Dock — signature final CTA banner. Diagonal cobalt gradient bleeds from the lower-right corner
// into the quiet cream page. One filled action below the headline.
export interface DockCtaBannerProps {
  eyebrow?: string
  title: string
  subtitle?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export function DockCtaBanner({
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: DockCtaBannerProps) {
  return (
    <section className="px-6 py-20">
      <div className="dock-cta-bg relative mx-auto max-w-page overflow-hidden rounded-dock-card border border-hairline px-8 py-20 text-center">
        <div className="relative mx-auto max-w-2xl">
          {eyebrow && (
            <span className="font-space text-dock-caption font-semibold uppercase tracking-[0.077em] text-electric-cobalt">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-4 font-space text-dock-heading-xl font-bold leading-[1.1] tracking-[-0.02em] text-ink-charcoal md:text-dock-display">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-[52ch] font-roobert text-dock-subheading text-ink-charcoal/70">
              {subtitle}
            </p>
          )}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DockButtonLink href={primaryHref} arrow>
              {primaryLabel}
            </DockButtonLink>
            {secondaryLabel && secondaryHref && (
              <DockButtonLink href={secondaryHref} variant="ghost">
                {secondaryLabel}
              </DockButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
