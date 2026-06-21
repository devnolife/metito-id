import * as React from "react"
import { cn } from "@/lib/utils"

// Moving Parts — inverted dark showcase panel (#121212). Internal dark cards lift to coal (#1e1e1e).
export function MPDarkPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-cards bg-carbon text-pure p-8 md:p-12", className)} {...props}>
      {children}
    </div>
  )
}

// Moving Parts — flat yellow accent panel (#fffc52). No border, no shadow — contrast does the lifting.
export function MPYellowPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-large-cards bg-hi-vis-yellow text-onyx p-8 md:p-12", className)} {...props}>
      {children}
    </div>
  )
}
