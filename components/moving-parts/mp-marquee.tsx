import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — infinite marquee ticker. Renders the children twice for a seamless loop.
// Used for trust signals / capability tags below the hero. Pauses on hover.
export interface MPMarqueeProps {
  items: React.ReactNode[]
  className?: string
}

export function MPMarquee({ items, className }: MPMarqueeProps) {
  const row = (
    <div className="mp-marquee-track flex shrink-0 items-center gap-12 pr-12">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-3 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-electric-ink" />
          <span className="font-whyte text-caption uppercase tracking-[0.04em] text-onyx/70">{item}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn("mp-marquee group relative flex overflow-hidden", className)} aria-hidden>
      {row}
      {row}
    </div>
  )
}
