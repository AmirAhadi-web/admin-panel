"use client";

import {
  CalendarRange,
  CircleAlert,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { OrdersDonut } from "@/components/dashboard/orders-donut";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatCardSkeleton, TableSkeleton } from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
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
import { seedActivity } from "@/lib/api/demo-data";
import {
  revenueByMonth,
  statusBreakdown,
  totalRevenue,
} from "@/lib/chart-utils";
import { formatCurrency, formatNumber, trendFromKey } from "@/lib/format";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";

export default function DashboardPage() {
  const ordersQuery = useOrders();
  const productsQuery = useProducts();
  const usersQuery = useUsers();
  const [revenueRange, setRevenueRange] = useState("6");

  const isLoading =
    ordersQuery.isLoading || productsQuery.isLoading || usersQuery.isLoading;
  const failedQuery = [ordersQuery, productsQuery, usersQuery].find(
    (query) => query.isError,
  );

  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
  const products = productsQuery.data ?? [];
  const users = usersQuery.data ?? [];

  const revenueSeries = useMemo(
    () => revenueByMonth(orders, Number(revenueRange)),
    [orders, revenueRange],
  );
  const breakdown = useMemo(() => statusBreakdown(orders), [orders]);

  const activeProducts = products.filter((p) => p.status === "active").length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const openOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  function retryAll() {
    void ordersQuery.refetch();
    void productsQuery.refetch();
    void usersQuery.refetch();
  }

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your workspace.">
        <Badge variant="outline" className="gap-1.5 py-1">
          <CalendarRange className="size-3.5" />
          Last 30 days
        </Badge>
      </PageHeader>

      {failedQuery ? (
        <Card>
          <ErrorState
            title="Couldn't load dashboard data"
            description={
              failedQuery.error instanceof Error
                ? failedQuery.error.message
                : "An unexpected error occurred."
            }
            onRetry={retryAll}
          />
        </Card>
      ) : (
        <div className="space-y-5">
          {/* Stat cards */}
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
                  title="Total Revenue"
                  value={formatCurrency(totalRevenue(orders))}
                  icon={TrendingUp}
                  trend={trendFromKey("revenue")}
                />
                <StatCard
                  title="Total Orders"
                  value={formatNumber(orders.length)}
                  icon={ShoppingCart}
                  trend={trendFromKey("orders")}
                />
                <StatCard
                  title="Total Products"
                  value={formatNumber(products.length)}
                  icon={Package}
                  trend={trendFromKey("products")}
                  caption={`${activeProducts} active`}
                />
                <StatCard
                  title="Total Users"
                  value={formatNumber(users.length)}
                  icon={Users}
                  trend={trendFromKey("users")}
                  caption={`${activeUsers} active`}
                />
              </>
            )}
          </div>

          {/* Revenue + status breakdown */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Revenue</CardTitle>
                  <CardDescription>
                    Non-cancelled order revenue per month.
                  </CardDescription>
                </div>
                <Select value={revenueRange} onValueChange={setRevenueRange}>
                  <SelectTrigger className="h-8 w-32 text-xs" aria-label="Revenue range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Last 3 months</SelectItem>
                    <SelectItem value="6">Last 6 months</SelectItem>
                    <SelectItem value="12">Last 12 months</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[280px]">
                    <TableSkeleton rows={5} columns={2} />
                  </div>
                ) : (
                  <RevenueChart data={revenueSeries} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order status</CardTitle>
                <CardDescription>Distribution across all orders.</CardDescription>
              </CardHeader>
              <CardContent className="grid place-items-center pt-2">
                {isLoading ? (
                  <TableSkeleton rows={4} columns={2} />
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingCart}
                    title="No orders yet"
                    description="Orders will appear here once they are created."
                  />
                ) : (
                  <OrdersDonut data={breakdown} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Open orders alert strip */}
          {!isLoading && openOrders > 0 && (
            <Card className="border-warning/25 bg-warning/[0.06]">
              <div className="flex items-center gap-3 px-5 py-3.5">
                <CircleAlert className="size-4 shrink-0 text-warning" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold tabular-nums">{openOrders}</span>{" "}
                  {openOrders === 1 ? "order needs" : "orders need"} attention
                  (pending or processing).
                </p>
                <Button asChild variant="ghost" size="sm" className="ml-auto">
                  <Link href="/orders">Review orders</Link>
                </Button>
              </div>
            </Card>
          )}

          {/* Recent orders + activity */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="overflow-hidden xl:col-span-2">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">Recent orders</CardTitle>
                  <CardDescription>Latest activity across the store.</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/orders">View all</Link>
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-2">
                {isLoading ? (
                  <TableSkeleton rows={5} columns={5} />
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={ShoppingCart}
                    title="No orders yet"
                    description="When orders arrive they will show up here."
                  />
                ) : (
                  <RecentOrders orders={orders.slice(0, 6)} />
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Recent activity</CardTitle>
                <CardDescription>Demo feed of workspace events.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-2">
                <ActivityList entries={seedActivity.slice(0, 7)} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
