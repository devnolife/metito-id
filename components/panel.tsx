"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Draws the instrument-panel corner tick in the top-right. */
  ticked?: boolean
  children: React.ReactNode
}

/**
 * Surface used across the marketing pages. Tracks the cursor and exposes it as
 * `--mx` / `--my` so the `.panel` sheen in globals.css can follow the pointer.
 */
export function Panel({ ticked, className, children, ...props }: PanelProps) {
  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`)
  }, [])

  return (
    <div
      onMouseMove={handleMove}
      className={cn("panel", ticked && "ticked", className)}
      {...props}
    >
      {children}
    </div>
  )
}
