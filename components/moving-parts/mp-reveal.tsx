"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — scroll-triggered staggered reveal. Wrap any block; it fades/slides in once when
// it enters the viewport. Respects prefers-reduced-motion via the .mp-reveal CSS guard.
export interface MPRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  as?: "div" | "section" | "li" | "span"
}

export function MPReveal({ delay = 0, as = "div", className, style, children, ...props }: MPRevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible")
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as as any
  return (
    <Tag
      ref={ref}
      className={cn("mp-reveal", className)}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}
