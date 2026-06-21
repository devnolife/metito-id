import * as React from "react"
import { cn } from "@/lib/utils"
import { MPLabel } from "./mp-label"

// Moving Parts — Product Detail Card. White surface, 90px radius, single heavy shadow.
// Image bleeds at top, 30px padding below holds tag / name / price.
export interface MPProductCardProps {
  image: string
  name: string
  price?: string
  tag?: string
  href?: string
  className?: string
}

export function MPProductCard({ image, name, price, tag, href, className }: MPProductCardProps) {
  const Wrapper: any = href ? "a" : "div"
  return (
    <Wrapper
      href={href}
      className={cn(
        "group block overflow-hidden rounded-cards bg-pure shadow-mp-xl transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-chalk">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 p-[30px]">
        {tag && <MPLabel tone="ash">{tag}</MPLabel>}
        <h3 className="font-unica77 font-bold text-subheading text-onyx">{name}</h3>
        {price && <div className="font-unica77 font-bold text-heading-sm text-onyx">{price}</div>}
      </div>
    </Wrapper>
  )
}
