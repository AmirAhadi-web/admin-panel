"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import type { RevenuePoint } from "@/lib/chart-utils";

interface TooltipPayloadItem {
  value?: number | string;
  payload?: RevenuePoint;
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-[0_12px_32px_rgb(0_0_0/0.45)]">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">
        {formatCurrency(Number(payload[0]?.value ?? 0))}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {point?.orders ?? 0} orders
      </p>
    </div>
  );
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="h-[280px] w-full" role="img" aria-label="Revenue over time area chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6EE7A0" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#6EE7A0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#292D32"
            vertical={false}
          />
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
            tickFormatter={(value: number) => formatCompactCurrency(value)}
            width={52}
          />
          <Tooltip
            content={<RevenueTooltip />}
            cursor={{ stroke: "#6EE7A0", strokeOpacity: 0.25 }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6EE7A0"
            strokeWidth={2}
            fill="url(#revenueFill)"
            dot={false}
            activeDot={{ r: 4, fill: "#6EE7A0", stroke: "#111315", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
