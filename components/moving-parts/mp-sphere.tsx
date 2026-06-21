import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — the hero conic-gradient sphere. The ONLY ornamental gradient in the system.
// Premium: optional soft glow halo + slow rotation (pass `spin`).
export interface MPConicSphereProps {
  className?: string
  size?: number
  spin?: boolean
  glow?: boolean
}

export function MPConicSphere({ className, size = 320, spin = false, glow = false }: MPConicSphereProps) {
  return (
    <div aria-hidden className={cn("relative", className)} style={{ width: size, height: size }}>
      {glow && (
        <div
          className="mp-conic-sphere absolute inset-0 rounded-full blur-3xl opacity-50"
          style={{ transform: "scale(1.15)" }}
        />
      )}
      <div className={cn("mp-conic-sphere relative h-full w-full rounded-full", spin && "mp-spin")} />
    </div>
  )
}
