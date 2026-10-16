"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/lib/chart-utils";
import { formatNumber } from "@/lib/format";

export function OrdersBarChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div
      className="h-[260px] w-full"
      role="img"
      aria-label="Orders per month bar chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#292D32" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#92979E", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#92979E", fontSize: 12 }}
            allowDecimals={false}
            width={36}
          />
          <Tooltip
            cursor={{ fill: "#24282C", opacity: 0.4 }}
            formatter={(value) => [
              `${formatNumber(Number(value ?? 0))} orders`,
              "Orders",
            ]}
            contentStyle={{
              background: "#1B1E21",
              border: "1px solid #292D32",
              borderRadius: 8,
              fontSize: 12,
              color: "#F3F4F6",
            }}
            labelStyle={{ color: "#92979E" }}
          />
          <Bar dataKey="orders" fill="#7FA6C9" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
