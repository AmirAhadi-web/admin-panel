"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";

export interface CategoryDatum {
  category: string;
  value: number;
}

export function CategoryChart({ data }: { data: CategoryDatum[] }) {
  return (
    <div
      className="h-[260px] w-full"
      role="img"
      aria-label="Inventory value by category bar chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#292D32" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#92979E", fontSize: 12 }}
            tickFormatter={(value: number) => formatCompactCurrency(value)}
          />
          <YAxis
            type="category"
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#92979E", fontSize: 12 }}
            width={88}
          />
          <Tooltip
            cursor={{ fill: "#24282C", opacity: 0.4 }}
            formatter={(value) => [formatCurrency(Number(value ?? 0)), "Inventory value"]}
            contentStyle={{
              background: "#1B1E21",
              border: "1px solid #292D32",
              borderRadius: 8,
              fontSize: 12,
              color: "#F3F4F6",
            }}
            labelStyle={{ color: "#92979E" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry, index) => (
              <Cell
                key={entry.category}
                fill={index % 2 === 0 ? "#6EE7A0" : "#4C9A6C"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
