import type { Order, OrderStatus } from "@/types/order";

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });

/**
 * Buckets order revenue per calendar month for the trailing `months` window
 * (including the current month). Derived from real order data — no invented
 * series.
 */
export function revenueByMonth(orders: Order[], months: number): RevenuePoint[] {
  const now = new Date();
  const buckets: RevenuePoint[] = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      label: MONTH_FORMATTER.format(date),
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const time = Date.parse(order.date);
    if (Number.isNaN(time)) continue;
    const date = new Date(time);
    const monthsBack =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    if (monthsBack >= 0 && monthsBack < months) {
      const bucket = buckets[months - 1 - monthsBack];
      bucket.revenue += order.total;
      bucket.orders += 1;
    }
  }

  for (const bucket of buckets) {
    bucket.revenue = Math.round(bucket.revenue * 100) / 100;
  }
  return buckets;
}

export interface StatusBreakdownEntry {
  status: OrderStatus;
  count: number;
}

export function statusBreakdown(orders: Order[]): StatusBreakdownEntry[] {
  const counts = new Map<OrderStatus, number>();
  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }
  return (["pending", "processing", "shipped", "delivered", "cancelled"] as const)
    .map((status) => ({ status, count: counts.get(status) ?? 0 }))
    .filter((entry) => entry.count > 0);
}

/** Sum of non-cancelled order totals. */
export function totalRevenue(orders: Order[]): number {
  return Math.round(
    orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0) * 100,
  ) / 100;
}
