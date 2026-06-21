import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — monospace small-caps label (Whyte Semi-Mono substitute). Used for eyebrows,
// nav chrome, category tags, captions. Never body copy.
type MPLabelTone = "onyx" | "fog" | "electric" | "pure" | "ash"

const tones: Record<MPLabelTone, string> = {
  onyx: "text-onyx",
  fog: "text-fog",
  electric: "text-electric-ink",
  pure: "text-pure",
  ash: "text-ash",
}

export interface MPLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: MPLabelTone
}

export function MPLabel({ tone = "onyx", className, children, ...props }: MPLabelProps) {
  return (
    <span
      className={cn("font-whyte uppercase text-caption tracking-[0.04em]", tones[tone], className)}
      {...props}
    >
      {children}
    </span>
  )
}
