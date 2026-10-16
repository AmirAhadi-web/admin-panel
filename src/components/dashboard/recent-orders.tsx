"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Order } from "@/types/order";

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="w-10">
            <span className="sr-only">Open</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-xs font-medium text-foreground">
              {order.orderNumber}
            </TableCell>
            <TableCell>
              <Link
                href={`/orders/${order.id}`}
                className="text-foreground transition-colors hover:text-primary"
              >
                {order.customer}
              </Link>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {formatDate(order.date)}
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {formatCurrency(order.total)}
            </TableCell>
            <TableCell>
              <Link
                href={`/orders/${order.id}`}
                aria-label={`View order ${order.orderNumber}`}
                className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowRight className="size-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
