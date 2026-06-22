"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Direction = "up" | "down" | "left" | "right" | "none"

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Stagger step (0–5). Each step adds 90ms of delay. */
  delay?: number
  /** Direction the content travels from while fading in. */
  direction?: Direction
  /** Only animate the first time it enters the viewport. */
  once?: boolean
}

/**
 * Reveals its children with a smooth fade + slide when scrolled into view.
 * Uses IntersectionObserver so the transition fires as the user reaches the
 * section, and respects the user's reduced-motion preference.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const delayClass = delay > 0 ? `reveal-delay-${Math.min(delay, 5)}` : undefined

  return (
    <div
      ref={ref}
      data-direction={direction}
      className={cn("reveal", visible && "is-visible", delayClass, className)}
    >
      {children}
    </div>
  )
}
