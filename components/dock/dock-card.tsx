import * as React from "react"
import { cn } from "@/lib/utils"

// Dock — base surface card: white, 16px radius, hairline border, featherlight micro-shadow.
export function DockCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-dock-card border border-hairline bg-white p-6 shadow-dock-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Dock — customer stat / social-proof card. Large metric in cobalt or violet (varies per card
// for rhythm), label + company mark above. No heavy shadow.
export interface DockStatCardProps {
  metric: React.ReactNode
  label: string
  caption?: string
  accent?: "cobalt" | "violet"
  icon?: React.ReactNode
  className?: string
}

export function DockStatCard({ metric, label, caption, accent = "cobalt", icon, className }: DockStatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-dock-card border border-hairline bg-surface-ivory p-6 shadow-dock-subtle transition-transform duration-300 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-dock-icon bg-lavender-mist text-ink-charcoal">
            {icon}
          </span>
        )}
        <span className="font-space text-dock-caption font-semibold uppercase tracking-[0.077em] text-slate-gray">
          {label}
        </span>
      </div>
      <span
        className={cn(
          "font-space text-dock-heading-lg font-bold leading-none md:text-dock-heading-xl tracking-tight",
          accent === "violet" ? "text-vivid-violet" : "text-electric-cobalt"
        )}
      >
        {metric}
      </span>
      {caption && <span className="font-roobert text-dock-body text-slate-gray">{caption}</span>}
    </div>
  )
}
