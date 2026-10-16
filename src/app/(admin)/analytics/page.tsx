"use client";

import {
  Banknote,
  ClipboardList,
  PackageCheck,
  Percent,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryChart, type CategoryDatum } from "@/components/analytics/category-chart";
import { OrdersBarChart } from "@/components/analytics/orders-bar-chart";
import { OrdersDonut } from "@/components/dashboard/orders-donut";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/loading-state";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revenueByMonth, statusBreakdown, totalRevenue } from "@/lib/chart-utils";
import { formatCurrency, formatNumber, trendFromKey } from "@/lib/format";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";

export default function AnalyticsPage() {
  const ordersQuery = useOrders();
  const productsQuery = useProducts();
  const [range, setRange] = useState("6");

  const isLoading = ordersQuery.isLoading || productsQuery.isLoading;
  const isError = ordersQuery.isError || productsQuery.isError;
  const errorMessage =
    ordersQuery.error instanceof Error
      ? ordersQuery.error.message
      : productsQuery.error instanceof Error
        ? productsQuery.error.message
        : "An unexpected error occurred.";

  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
  const products = useMemo(() => productsQuery.data ?? [], [productsQuery.data]);

  const months = Number(range);
  const revenueSeries = useMemo(
    () => revenueByMonth(orders, months),
    [orders, months],
  );
  const breakdown = useMemo(() => statusBreakdown(orders), [orders]);

  const metrics = useMemo(() => {
    const valid = orders.filter((o) => o.status !== "cancelled");
    const revenue = totalRevenue(orders);
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;

    return {
      revenue,
      avgOrderValue: valid.length > 0 ? revenue / valid.length : 0,
      fulfillmentRate: orders.length > 0 ? (delivered / orders.length) * 100 : 0,
      cancellationRate: orders.length > 0 ? (cancelled / orders.length) * 100 : 0,
    };
  }, [orders]);

  const categoryData = useMemo<CategoryDatum[]>(() => {
    const perCategory = new Map<string, number>();
    for (const product of products) {
      if (product.status === "archived") continue;
      const value = product.price * product.stock;
      perCategory.set(
        product.category,
        (perCategory.get(product.category) ?? 0) + value,
      );
    }
    return Array.from(perCategory.entries())
      .map(([category, value]) => ({
        category,
        value: Math.round(value * 100) / 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [products]);

  const topProducts = useMemo(
    () =>
      [...products]
        .filter((p) => p.status !== "archived")
        .map((p) => ({ ...p, inventoryValue: p.price * p.stock }))
        .sort((a, b) => b.inventoryValue - a.inventoryValue)
        .slice(0, 6),
    [products],
  );

  function retryAll() {
    void ordersQuery.refetch();
    void productsQuery.refetch();
  }

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Deeper trends computed live from orders and products."
      >
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-40" aria-label="Analytics date range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {isError ? (
        <Card>
          <ErrorState
            title="Couldn't load analytics"
            description={errorMessage}
            onRetry={retryAll}
          />
        </Card>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Revenue (all time)"
                  value={formatCurrency(metrics.revenue)}
                  icon={Banknote}
                  trend={trendFromKey("analytics-revenue")}
                />
                <StatCard
                  title="Avg. order value"
                  value={formatCurrency(metrics.avgOrderValue)}
                  icon={ClipboardList}
                  trend={trendFromKey("analytics-aov")}
                />
                <StatCard
                  title="Fulfillment rate"
                  value={`${metrics.fulfillmentRate.toFixed(1)}%`}
                  icon={PackageCheck}
                  trend={trendFromKey("analytics-fulfillment")}
                  caption="orders delivered"
                />
                <StatCard
                  title="Cancellation rate"
                  value={`${metrics.cancellationRate.toFixed(1)}%`}
                  icon={Percent}
                  trend={-Math.abs(trendFromKey("analytics-cancel"))}
                  caption="lower is better"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue trend</CardTitle>
                <CardDescription>
                  Non-cancelled revenue, monthly buckets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <TableSkeleton rows={5} columns={2} />
                ) : (
                  <RevenueChart data={revenueSeries} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order volume</CardTitle>
                <CardDescription>Orders placed per month.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <TableSkeleton rows={5} columns={2} />
                ) : (
                  <OrdersBarChart data={revenueSeries} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order mix</CardTitle>
                <CardDescription>Current status distribution.</CardDescription>
              </CardHeader>
              <CardContent className="grid place-items-center pt-2">
                {isLoading ? (
                  <TableSkeleton rows={4} columns={2} />
                ) : (
                  <OrdersDonut data={breakdown} />
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Top products by inventory value</CardTitle>
                <CardDescription>
                  Unit price × stock, archived products excluded.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-2">
                {isLoading ? (
                  <TableSkeleton rows={5} columns={4} />
                ) : topProducts.length === 0 ? (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No product data available.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="max-w-52 truncate font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="hidden text-muted-foreground sm:table-cell">
                            {product.category}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground tabular-nums">
                            {formatNumber(product.stock)}
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {formatCurrency(product.inventoryValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventory value by category</CardTitle>
              <CardDescription>
                Where the catalog&apos;s value currently sits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton rows={5} columns={2} />
              ) : categoryData.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No product data available.
                </p>
              ) : (
                <CategoryChart data={categoryData} />
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground/80">
            {`Analytics are computed in the browser from the active data source
            (${"orders"} and products). No separate tracking service is used.`}
          </p>
        </div>
      )}
    </>
  );
}
