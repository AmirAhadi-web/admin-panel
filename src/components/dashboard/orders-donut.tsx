"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatusBreakdownEntry } from "@/lib/chart-utils";
import { formatNumber } from "@/lib/format";
import type { OrderStatus } from "@/types/order";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#E8B464",
  processing: "#7FA6C9",
  shipped: "#B6A4E0",
  delivered: "#6EE7A0",
  cancelled: "#F87171",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrdersDonut({ data }: { data: StatusBreakdownEntry[] }) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div
        className="relative h-[180px] w-[180px] shrink-0"
        role="img"
        aria-label="Orders by status donut chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              formatter={(value) => [`${formatNumber(Number(value ?? 0))} orders`, ""]}
              contentStyle={{
                background: "#1B1E21",
                border: "1px solid #292D32",
                borderRadius: 8,
                fontSize: 12,
                color: "#F3F4F6",
              }}
              itemStyle={{ color: "#F3F4F6" }}
              labelStyle={{ color: "#92979E" }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-xl leading-none font-semibold tabular-nums">
              {formatNumber(total)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">orders</p>
          </div>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center gap-2.5 text-sm">
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[entry.status] }}
            />
            <span className="text-muted-foreground">
              {STATUS_LABELS[entry.status]}
            </span>
            <span className="ml-auto font-medium text-foreground tabular-nums">
              {entry.count}
            </span>
            <span className="w-11 text-right text-xs text-muted-foreground/70 tabular-nums">
              {total > 0 ? `${Math.round((entry.count / total) * 100)}%` : "0%"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
