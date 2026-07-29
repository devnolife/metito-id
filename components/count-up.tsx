"use client"

import { useEffect, useRef, useState } from "react"

/** Splits "150+" into { value: 150, prefix: "", suffix: "+" }. */
function parse(raw: string) {
  const match = raw.match(/^(\D*?)([\d.,]+)(.*)$/s)
  if (!match) return null

  const numeric = Number(match[2].replace(/[.,]/g, ""))
  if (!Number.isFinite(numeric)) return null

  return { prefix: match[1], value: numeric, suffix: match[3] }
}

/**
 * Counts up to a numeric stat when it scrolls into view. Non-numeric values are
 * rendered verbatim, so editors can still put arbitrary text in the CMS field.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(parsed ? 0 : null)

  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(parsed.value)
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const duration = 1400
        const start = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // easeOutExpo — fast start, long settle.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
          setDisplay(Math.round(parsed.value * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!parsed) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}
      {(display ?? 0).toLocaleString("id-ID")}
      {parsed.suffix}
    </span>
  )
}
