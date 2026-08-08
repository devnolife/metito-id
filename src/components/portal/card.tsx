import type { ReactNode } from "react";

import {
  Card as UICard,
  CardAction,
  CardDescription,
  CardHeader as UICardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Portal surface, built on the shadcn `Card` primitives with the Andercore
 * treatment: flush padding (tables bleed to the edges), 1px `border` line and
 * the marketing radius scale (`rounded-md` = 1.25rem from the Webflow tokens).
 */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <UICard className={cn("gap-0 rounded-md border border-border py-0 ring-0", className)}>
      {children}
    </UICard>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <UICardHeader className={cn("border-b border-border px-5 py-4", className)}>
      <CardTitle className="truncate text-medium font-medium text-foreground">{title}</CardTitle>
      {subtitle ? (
        <CardDescription className="text-small text-muted-foreground">{subtitle}</CardDescription>
      ) : null}
      {action ? <CardAction>{action}</CardAction> : null}
    </UICardHeader>
  );
}

/** Space Mono uppercase micro-label, matching the marketing site's taglines. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-tiny uppercase tracking-wide text-muted-foreground", className)}>
      {children}
    </span>
  );
}
