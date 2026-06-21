import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Moving Parts — Primary CTA (filled #0000ff) and Ghost/Text (black hairline) buttons.
// Flat fills only: no gradient, glow, or glass. One primary action per screen.
// Premium polish: subtle hover lift + a sliding arrow when `arrow` is set.
export type MPButtonVariant = "primary" | "ghost"

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-unica77 font-semibold text-[18px] leading-none rounded-buttons px-7 py-3.5 transition-[transform,background-color,color,box-shadow] duration-300 ease-out cursor-pointer select-none active:scale-[0.98] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-ink focus-visible:ring-offset-2 focus-visible:ring-offset-pure"

const variants: Record<MPButtonVariant, string> = {
  primary: "bg-electric-ink text-pure hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(0,0,255,0.6)]",
  ghost: "bg-transparent text-onyx border border-onyx hover:bg-onyx hover:text-pure hover:-translate-y-0.5",
}

function Arrow() {
  return (
    <ArrowRight
      className="h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover/btn:translate-x-1"
      aria-hidden
    />
  )
}

export interface MPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MPButtonVariant
  arrow?: boolean
}

export function MPButton({ variant = "primary", arrow = false, className, children, ...props }: MPButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

export interface MPButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: MPButtonVariant
  arrow?: boolean
}

export function MPButtonLink({ variant = "primary", arrow = false, className, children, ...props }: MPButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </a>
  )
}
