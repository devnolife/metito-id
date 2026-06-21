import * as React from "react"
import { cn } from "@/lib/utils"

// Dock — eyebrow + confident heading + calm subtitle. Tight leading at large sizes is signature.
export interface DockHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: "center" | "left"
  className?: string
  children?: React.ReactNode
}

export function DockHeading({ eyebrow, title, subtitle, align = "center", className, children }: DockHeadingProps) {
  const centered = align === "center"
  return (
    <div className={cn("flex flex-col gap-4", centered ? "items-center text-center" : "items-start text-left", className)}>
      {eyebrow && (
        <span className="font-space text-dock-caption font-semibold uppercase tracking-[0.077em] text-electric-cobalt">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-space font-semibold tracking-[-0.02em] text-ink-charcoal text-dock-heading-lg md:text-dock-heading-xl leading-tight",
          centered ? "max-w-[20ch]" : "max-w-[24ch]"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("font-roobert text-dock-subheading text-slate-gray leading-relaxed", centered ? "max-w-[60ch]" : "max-w-[54ch]")}>
          {subtitle}
        </p>
      )}
      {children && <div className={cn("mt-2", centered && "flex justify-center")}>{children}</div>}
    </div>
  )
}
