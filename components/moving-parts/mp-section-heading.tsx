import * as React from "react"
import { cn } from "@/lib/utils"
import { MPLabel } from "./mp-label"

// Moving Parts — Section Headline Stack: eyebrow label + oversized Unica77 700 headline +
// subtitle, with an optional CTA slot below.
export interface MPSectionHeadingProps {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: "center" | "left"
  tone?: "light" | "dark"
  className?: string
  children?: React.ReactNode
}

export function MPSectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  className,
  children,
}: MPSectionHeadingProps) {
  const isDark = tone === "dark"
  const centered = align === "center"
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <MPLabel tone={isDark ? "fog" : "electric"}>{eyebrow}</MPLabel>}
      <h2
        className={cn(
          "mp-salt font-unica77 font-bold text-heading md:text-heading-lg max-w-[18ch] text-balance",
          isDark ? "text-pure" : "text-onyx",
          centered && "mx-auto"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "font-unica77 text-subheading max-w-[54ch]",
            isDark ? "text-fog" : "text-onyx/70",
            centered && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
      {children && <div className={cn("mt-2", centered && "flex justify-center")}>{children}</div>}
    </div>
  )
}
