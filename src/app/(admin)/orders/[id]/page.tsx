"use client";

import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Loader2,
  Mail,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder, useUpdateOrderStatus } from "@/hooks/use-orders";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { ORDER_STATUSES, PAYMENT_METHOD_LABELS, type OrderStatus } from "@/types/order";

/** Displays the fulfillment pipeline up to the current status. */
function StatusTimeline({ status }: { status: OrderStatus }) {
  const steps = ["pending", "processing", "shipped", "delivered"] as const;
  const currentIndex = steps.indexOf(status as (typeof steps)[number]);

  if (status === "cancelled") {
    return (
      <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
        This order was cancelled and left the fulfillment pipeline.
      </p>
    );
  }

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const reached = index <= currentIndex;
        const isLast = index === steps.length - 1;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className={`mt-1 size-2.5 rounded-full ${
                  reached ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
              {!isLast && (
                <span
                  aria-hidden
                  className={`w-px flex-1 ${
                    index < currentIndex ? "bg-primary/50" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className={isLast ? "pb-1" : "pb-5"}>
              <p
                className={`text-sm font-medium capitalize ${
                  reached ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {step}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderQuery = useOrder(params.id);
  const statusMutation = useUpdateOrderStatus();

  const order = orderQuery.data;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [syncedOrderId, setSyncedOrderId] = useState<string | null>(null);

  // Derive the selector from fetched data without an effect: re-sync when a
  // different order loads (React's "adjusting state during render" pattern).
  if (order && (order.id !== syncedOrderId || selectedStatus === "")) {
    setSyncedOrderId(order.id);
    setSelectedStatus(order.status);
  }

  if (orderQuery.isLoading) {
    return (
      <>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <TableSkeleton rows={6} columns={2} />
            </Card>
          </div>
          <Skeleton className="h-72" />
        </div>
      </>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this order"
          description={
            orderQuery.error instanceof Error
              ? orderQuery.error.message
              : "The order may not exist."
          }
          onRetry={() => void orderQuery.refetch()}
        />
        <div className="flex justify-center pb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/orders">
              <ArrowLeft className="size-4" /> Back to orders
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const dirty = selectedStatus !== "" && selectedStatus !== order.status;

  function applyStatus() {
    if (!order || !dirty || !selectedStatus) return;
    statusMutation.mutate({ id: order.id, status: selectedStatus });
  }

  return (
    <>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatDateTime(order.date)} by ${order.customer}.`}
      >
        <StatusBadge status={order.status} className="px-3 py-1 text-[13px]" />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                <div className="flex items-center gap-3 py-3">
                  <Package className="size-4 shrink-0 text-muted-foreground" />
                  <dt className="w-32 text-sm text-muted-foreground">Items</dt>
                  <dd className="text-sm font-medium tabular-nums">
                    {order.items} {order.items === 1 ? "item" : "items"}
                  </dd>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <dt className="w-32 text-sm text-muted-foreground">Customer</dt>
                  <dd className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {order.customer}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {order.email}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                  <dt className="w-32 text-sm text-muted-foreground">Date</dt>
                  <dd className="text-sm font-medium">{formatDateTime(order.date)}</dd>
                </div>
                <div className="flex items-center gap-3 py-3">
                  <CreditCard className="size-4 shrink-0 text-muted-foreground" />
                  <dt className="w-32 text-sm text-muted-foreground">Payment</dt>
                  <dd className="text-sm font-medium">
                    {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  </dd>
                </div>
              </dl>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Order total</p>
                <p className="text-xl font-semibold tracking-tight tabular-nums">
                  {formatCurrency(order.total)}
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
                Item-level detail is not part of the demo order schema — totals
                come straight from the data source.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fulfillment</CardTitle>
              <CardDescription>Current position in the pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusTimeline status={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update status</CardTitle>
              <CardDescription>
                Changes are written to the data source immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger aria-label="Order status" className="capitalize">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status} className="capitalize">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={!dirty || statusMutation.isPending}
                onClick={applyStatus}
              >
                {statusMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {statusMutation.isPending ? "Updating…" : "Apply status"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/orders">
            <ArrowLeft className="size-4" /> Back to orders
          </Link>
        </Button>
      </div>
    </>
  );
}
