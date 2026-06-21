"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — animated count-up for metrics ("smooth stat reveal"). Counts once when scrolled
// into view. Respects prefers-reduced-motion by rendering the final value immediately.
export interface MPCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export function MPCounter({ value, prefix = "", suffix = "", duration = 1600, className }: MPCounterProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = React.useState(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      setDisplay(value)
      return
    }

    let raf = 0
    let started = false

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        // easeOutExpo for a premium, decelerating count
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setDisplay(Math.round(eased * value))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true
            run()
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display.toLocaleString("id-ID")}
      {suffix}
    </span>
  )
}
