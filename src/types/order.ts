export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "card" | "paypal" | "bank_transfer";

export interface Order {
  id: string;
  orderNumber: string; // e.g. "NX-2481"
  customer: string;
  email: string;
  date: string; // ISO date string
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: number;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Card",
  paypal: "PayPal",
  bank_transfer: "Bank transfer",
};
