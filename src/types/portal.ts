/** Buyer-portal domain types. All data is mock/demo. */

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "in_production"
  | "in_transit"
  | "delivered"
  | "delayed"
  | "cancelled";

export type QuoteStatus = "draft" | "sent" | "accepted" | "expired" | "declined";

export type ShipmentStatus = "scheduled" | "in_transit" | "customs" | "out_for_delivery" | "delivered" | "delayed";

export type InvoiceStatus = "paid" | "due" | "overdue" | "scheduled";

export type MaterialCategory =
  | "Steel & Metals"
  | "Cement & Aggregates"
  | "Energy & Cabling"
  | "Insulation"
  | "Pipes & Fittings";

export type Availability = "in_stock" | "low_stock" | "lead_time";

export type Trend = "up" | "down" | "flat";

export interface Money {
  amount: number;
  currency: "EUR";
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  raw: number;
  delta: number; // percentage vs previous period
  trend: Trend;
  spark: number[];
  hint: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface CategorySplit {
  label: string;
  value: number;
  color: string;
}

export interface OrderItem {
  material: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface OrderEvent {
  label: string;
  timestamp: string;
  done: boolean;
}

export interface Order {
  id: string;
  reference: string;
  supplier: string;
  category: MaterialCategory;
  status: OrderStatus;
  placedAt: string;
  eta: string;
  origin: string;
  destination: string;
  total: number;
  currency: "EUR";
  items: OrderItem[];
  channel: "App" | "WhatsApp" | "Email" | "Phone";
}

export interface Quote {
  id: string;
  reference: string;
  material: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  status: QuoteStatus;
  createdAt: string;
  validUntil: string;
  unitPrice: number;
  total: number;
  leadTimeDays: number;
  suppliers: number;
  destination: string;
}

export interface ShipmentLeg {
  label: string;
  location: string;
  status: "done" | "active" | "pending";
  timestamp: string;
  detail: string;
}

export interface Shipment {
  id: string;
  orderRef: string;
  carrier: string;
  mode: "Road" | "Sea" | "Rail" | "Multimodal";
  status: ShipmentStatus;
  progress: number; // 0..100
  origin: string;
  destination: string;
  dispatchedAt: string;
  eta: string;
  temperature?: string;
  weightTons: number;
  legs: ShipmentLeg[];
}

export interface Material {
  id: string;
  name: string;
  sku: string;
  category: MaterialCategory;
  grade: string;
  unit: string;
  pricePerUnit: number;
  priceDelta: number;
  availability: Availability;
  leadTimeDays: number;
  origin: string;
  moq: number;
  certified: string[];
}

export interface Invoice {
  id: string;
  number: string;
  orderRef: string;
  issuedAt: string;
  dueAt: string;
  amount: number;
  status: InvoiceStatus;
  method: "Credit line" | "SEPA" | "Wire" | "Card";
}

export interface CreditLine {
  limit: number;
  used: number;
  available: number;
  currency: "EUR";
  rate: string;
  termDays: number;
  nextPaymentAmount: number;
  nextPaymentDate: string;
  provider: string;
}

export interface Activity {
  id: string;
  kind: "order" | "quote" | "shipment" | "payment" | "message";
  title: string;
  detail: string;
  timestamp: string;
}
