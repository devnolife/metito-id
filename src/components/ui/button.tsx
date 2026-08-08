import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/**
 * METITO `.button` system.
 *
 *  base        border 1px / radius 4px / 12px 24px / transition all .2s
 *  primary     orange #f04e00 (logo "E" gradient tone) / white text — hover #d64300
 *  secondary   navy-tinted ghost on light surfaces — hover deeper tint
 *  alternate   solid navy #012966 / white text
 *  small       padding 8px 20px
 */
export const buttonVariants = cva(
  "inline-block rounded-[4px] border text-center text-regular font-medium leading-1-5 transition-all duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "border-brand bg-brand text-[#fff] hover:bg-[#d64300] hover:border-[#d64300]",
        secondary:
          "border-navy/15 bg-navy/[0.06] text-navy hover:bg-navy/10",
        alternate: "border-navy bg-navy text-[#fff] hover:bg-[#0a3a82] hover:border-[#0a3a82]",
        link: "border-transparent bg-transparent px-0 py-1 leading-none text-navy hover:text-brand",
      },
      size: {
        default: "px-6 py-3",
        small: "px-5 py-2",
        none: "",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & { className?: string };

export type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "color"> & { href: string };

export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = cn(buttonVariants({ variant, size }), className);

  if (isExternal) {
    return <a className={classes} href={href} {...props} />;
  }
  return <Link className={classes} href={href} {...props} />;
}

export type ButtonProps = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
