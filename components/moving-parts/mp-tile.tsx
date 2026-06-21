import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — small floating icon tile, scattered around hero/section compositions.
type MPTileTone = "pure" | "carbon" | "electric"

const tones: Record<MPTileTone, string> = {
  pure: "bg-pure text-onyx border-onyx",
  carbon: "bg-carbon text-pure border-carbon",
  electric: "bg-electric-ink text-pure border-electric-ink",
}

export interface MPFloatingTileProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "square" | "pill"
  tone?: MPTileTone
}

export function MPFloatingTile({
  shape = "square",
  tone = "pure",
  className,
  children,
  ...props
}: MPFloatingTileProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center border shadow-mp-xl",
        shape === "pill" ? "rounded-pill px-5 py-3 gap-2" : "rounded-medium h-16 w-16",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
