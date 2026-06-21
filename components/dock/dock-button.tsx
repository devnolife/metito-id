import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Dock — paired pill buttons. Filled cobalt = single primary action color; ghost = white with a
// hairline border. 48px (pill) radius, featherlight, no heavy shadow.
export type DockButtonVariant = "primary" | "ghost"

const base =
  "group/btn inline-flex items-center justify-center gap-2 font-roobert font-medium text-[15px] leading-none rounded-dock-button px-6 py-3.5 transition-all duration-200 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-cream"

const variants: Record<DockButtonVariant, string> = {
  primary: "bg-electric-cobalt text-white hover:bg-deep-cobalt",
  ghost: "bg-white text-ink-charcoal border border-hairline hover:border-faint-gray hover:bg-canvas-cream",
}

function Arrow() {
  return (
    <ArrowRight
      className="h-[17px] w-[17px] transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5"
      aria-hidden
    />
  )
}

export interface DockButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DockButtonVariant
  arrow?: boolean
}

export function DockButton({ variant = "primary", arrow = false, className, children, ...props }: DockButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

export interface DockButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: DockButtonVariant
  arrow?: boolean
}

export function DockButtonLink({ variant = "primary", arrow = false, className, children, ...props }: DockButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </a>
  )
}
