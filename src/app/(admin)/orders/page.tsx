"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/tables/pagination";
import { TableToolbar } from "@/components/tables/table-toolbar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/use-orders";
import { PAGE_SIZE } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { ORDER_STATUSES, PAYMENT_METHOD_LABELS } from "@/types/order";

export default function OrdersPage() {
  const ordersQuery = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (ordersQuery.data ?? []).filter((order) => {
      const matchesSearch =
        query.length === 0 ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ordersQuery.data, search, statusFilter]);

  function updateFilters(update: () => void) {
    update();
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const filteredTotal = filtered.reduce(
    (sum, order) => (order.status === "cancelled" ? sum : sum + order.total),
    0,
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track, review, and update customer orders."
      >
        <div className="rounded-lg border border-border bg-card px-3.5 py-2">
          <p className="text-[11px] text-muted-foreground">Filtered value</p>
          <p className="text-sm leading-tight font-semibold tabular-nums">
            {formatCurrency(Math.round(filteredTotal * 100) / 100)}
          </p>
        </div>
      </PageHeader>

      <Card>
        <div className="border-b border-border p-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={(value) => updateFilters(() => setSearch(value))}
            searchPlaceholder="Search by order # or customer…"
            searchLabel="Search orders"
          >
            <Select
              value={statusFilter}
              onValueChange={(value) => updateFilters(() => setStatusFilter(value))}
            >
              <SelectTrigger className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status} value={status} className="capitalize">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableToolbar>
        </div>

        {ordersQuery.isLoading ? (
          <TableSkeleton rows={7} columns={6} />
        ) : ordersQuery.isError ? (
          <ErrorState
            title="Couldn't load orders"
            description={
              ordersQuery.error instanceof Error
                ? ordersQuery.error.message
                : "An unexpected error occurred."
            }
            onRetry={() => void ordersQuery.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={
              search || statusFilter !== "all"
                ? "No orders match your filters"
                : "No orders yet"
            }
            description={
              search || statusFilter !== "all"
                ? "Try adjusting the search or status filter."
                : "Orders are created by the storefront and will appear here."
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Payment</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-mono text-xs font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-44 truncate">{order.customer}</span>
                      <span className="block max-w-44 truncate text-xs text-muted-foreground">
                        {order.email}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </TableCell>
                    <TableCell className="hidden text-right text-muted-foreground tabular-nums sm:table-cell">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>
    </>
  );
}
