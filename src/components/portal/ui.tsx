import Link from "next/link";
import type { ReactNode } from "react";

import { Card } from "@/components/portal/card";
import { Sparkline } from "@/components/portal/charts";
import { TrendDown, TrendUp } from "@/components/portal/icons";
import type { KpiMetric } from "@/types/portal";
import { cn } from "@/lib/utils";

export function StatCard({ metric }: { metric: KpiMetric }) {
  const positive = metric.trend === "up";
  // A falling lead time is good; a falling spend delta is bad. Colour by sign of delta.
  const good = metric.delta >= 0 ? metric.id !== "leadtime" : metric.id === "leadtime";
  const Arrow = metric.delta >= 0 ? TrendUp : TrendDown;
  const sparkColor = good ? "#1e7226" : "#d92d20";

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="font-mono text-tiny uppercase tracking-wide text-tag">{metric.label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-tiny font-medium",
            good ? "bg-green/10 text-green" : "bg-destructive/10 text-destructive"
          )}
        >
          <Arrow className="h-3 w-3" />
          {Math.abs(metric.delta)}%
        </span>
      </div>
      <p className="mt-3 text-[1.75rem] font-semibold leading-none text-navy">{metric.value}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-tiny text-tag">{metric.hint}</p>
        <div className="h-8 w-24 shrink-0" style={{ color: sparkColor }}>
          <Sparkline data={metric.spark} className="h-8 w-24" />
        </div>
      </div>
      <span className="sr-only">{positive ? "trending up" : "trending down"}</span>
    </Card>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-h3 font-medium tracking-h3 text-navy">{title}</h1>
        {description ? <p className="mt-1 text-regular text-body">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function LinkPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-small text-body transition-colors hover:border-navy/20 hover:text-navy"
    >
      {children}
    </Link>
  );
}
