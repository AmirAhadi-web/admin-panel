"use client";

import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  Pencil,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProductFormDialog } from "@/components/forms/product-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-state";
import { ProductImage } from "@/components/shared/product-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteProduct, useProduct } from "@/hooks/use-products";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productQuery = useProduct(params.id);
  const deleteMutation = useDeleteProduct();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const product = productQuery.data;

  function confirmDelete() {
    if (!product) return;
    deleteMutation.mutate(product.id, {
      onSuccess: () => router.replace("/products"),
      onSettled: () => setDeleteOpen(false),
    });
  }

  if (productQuery.isLoading) {
    return (
      <>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-72" />
          <div className="lg:col-span-2">
            <Card>
              <TableSkeleton rows={5} columns={2} />
            </Card>
          </div>
        </div>
      </>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this product"
          description={
            productQuery.error instanceof Error
              ? productQuery.error.message
              : "The product may have been deleted."
          }
          onRetry={() => void productQuery.refetch()}
        />
        <div className="flex justify-center pb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/products">
              <ArrowLeft className="size-4" /> Back to products
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const inventoryValue = product.price * product.stock;

  return (
    <>
      <PageHeader title={product.name} description={product.description || "No description provided."}>
        <Button variant="outline" onClick={() => setEditOpen(true)}>
          <Pencil className="size-4" /> Edit
        </Button>
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="size-4" /> Delete
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full rounded-none border-0"
            iconClassName="size-10"
          />
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold tracking-tight tabular-nums">
                {formatCurrency(product.price)}
              </span>
              <StatusBadge status={product.status} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">In stock</p>
                <p
                  className={`mt-0.5 font-semibold tabular-nums ${
                    product.stock === 0
                      ? "text-destructive"
                      : product.stock < 10
                        ? "text-warning"
                        : ""
                  }`}
                >
                  {product.stock === 0 ? "Out of stock" : `${formatNumber(product.stock)} units`}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inventory value</p>
                <p className="mt-0.5 font-semibold tabular-nums">
                  {formatCurrency(inventoryValue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Product details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              <div className="flex items-center gap-3 py-3">
                <Tag className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Category</dt>
                <dd className="text-sm font-medium">{product.category}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Boxes className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Status</dt>
                <dd className="text-sm font-medium capitalize">{product.status}</dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Created</dt>
                <dd className="text-sm font-medium">
                  {formatDateTime(product.createdAt)}
                </dd>
              </div>
              <div className="flex items-start gap-3 py-3">
                <Tag className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Description</dt>
                <dd className="text-sm leading-relaxed text-foreground/90">
                  {product.description || "—"}
                </dd>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Tag className="size-4 shrink-0 text-muted-foreground" />
                <dt className="w-32 text-sm text-muted-foreground">Product ID</dt>
                <dd className="font-mono text-xs text-muted-foreground">{product.id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/products">
            <ArrowLeft className="size-4" /> Back to products
          </Link>
        </Button>
      </div>

      <ProductFormDialog open={editOpen} onOpenChange={setEditOpen} product={product} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${product.name}?`}
        description="This permanently removes the product and returns you to the catalog. This action cannot be undone."
        confirmLabel="Delete product"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
