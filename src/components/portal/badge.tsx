import { Badge as UIBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Status badge for the buyer portal, built on the shadcn `Badge` with the
 * METITO tone palette layered on top (status colours are domain-specific,
 * so they live here rather than in the shared ui variant set).
 */
type Tone = "green" | "blue" | "amber" | "red" | "neutral" | "brand";

const TONES: Record<Tone, string> = {
  green: "border-green/30 bg-green/10 text-green",
  blue: "border-blue/30 bg-blue/10 text-blue",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  red: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-navy/15 bg-navy/5 text-card-foreground",
  brand: "border-brand/30 bg-brand/10 text-brand",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <UIBadge variant="outline" className={cn("gap-1.5 px-2.5", TONES[tone], className)}>
      {dot ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </UIBadge>
  );
}

// ---- status -> tone maps ---------------------------------------------------

export const ORDER_TONE: Record<string, Tone> = {
  processing: "neutral",
  confirmed: "blue",
  in_production: "amber",
  in_transit: "blue",
  delivered: "green",
  delayed: "red",
  cancelled: "neutral",
};

export const QUOTE_TONE: Record<string, Tone> = {
  draft: "neutral",
  sent: "blue",
  accepted: "green",
  expired: "amber",
  declined: "red",
};

export const SHIPMENT_TONE: Record<string, Tone> = {
  scheduled: "neutral",
  in_transit: "blue",
  customs: "amber",
  out_for_delivery: "blue",
  delivered: "green",
  delayed: "red",
};

export const INVOICE_TONE: Record<string, Tone> = {
  paid: "green",
  due: "blue",
  overdue: "red",
  scheduled: "neutral",
};

export const AVAILABILITY_TONE: Record<string, Tone> = {
  in_stock: "green",
  low_stock: "amber",
  lead_time: "blue",
};
