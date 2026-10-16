"use client";

import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductFormDialog } from "@/components/forms/product-form-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-state";
import { ProductImage } from "@/components/shared/product-image";
import { StatusBadge } from "@/components/shared/status-badge";
import { Pagination } from "@/components/tables/pagination";
import { RowActions } from "@/components/tables/row-actions";
import { TableToolbar } from "@/components/tables/table-toolbar";
import { Button } from "@/components/ui/button";
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
import { useDeleteProduct, useProducts } from "@/hooks/use-products";
import { PAGE_SIZE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const productsQuery = useProducts();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const set = new Set(
      (productsQuery.data ?? []).map((product) => product.category),
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [productsQuery.data]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (productsQuery.data ?? []).filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [productsQuery.data, search, statusFilter, categoryFilter]);

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

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deletingProduct) return;
    deleteMutation.mutate(deletingProduct.id, {
      onSettled: () => setDeletingProduct(null),
    });
  }

  const hasActiveFilters =
    search.length > 0 || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage the catalog, pricing, and stock levels."
      >
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Create product
        </Button>
      </PageHeader>

      <Card>
        <div className="border-b border-border p-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={(value) => updateFilters(() => setSearch(value))}
            searchPlaceholder="Search products…"
            searchLabel="Search products"
          >
            <Select
              value={categoryFilter}
              onValueChange={(value) => updateFilters(() => setCategoryFilter(value))}
            >
              <SelectTrigger className="w-40" aria-label="Filter by category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => updateFilters(() => setStatusFilter(value))}
            >
              <SelectTrigger className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </TableToolbar>
        </div>

        {productsQuery.isLoading ? (
          <TableSkeleton rows={7} columns={6} />
        ) : productsQuery.isError ? (
          <ErrorState
            title="Couldn't load products"
            description={
              productsQuery.error instanceof Error
                ? productsQuery.error.message
                : "An unexpected error occurred."
            }
            onRetry={() => void productsQuery.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={hasActiveFilters ? "No products match your filters" : "No products yet"}
            description={
              hasActiveFilters
                ? "Try adjusting the search or clearing the filters."
                : "Create the first product to build your catalog."
            }
            action={
              !hasActiveFilters ? (
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create product
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-14">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        href={`/products/${product.id}`}
                        className="group flex items-center gap-3 outline-none"
                      >
                        <ProductImage
                          src={product.imageUrl}
                          alt={product.name}
                          className="size-10"
                        />
                        <span className="min-w-0">
                          <span className="block max-w-56 truncate font-medium text-foreground transition-colors group-hover:text-primary">
                            {product.name}
                          </span>
                          <span className="block max-w-56 truncate text-xs text-muted-foreground">
                            {product.description || "—"}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell
                      className={`hidden text-right tabular-nums sm:table-cell ${
                        product.stock === 0
                          ? "font-medium text-destructive"
                          : product.stock < 10
                            ? "font-medium text-warning"
                            : "text-muted-foreground"
                      }`}
                    >
                      {product.stock === 0 ? "Out" : formatNumber(product.stock)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        detailHref={`/products/${product.id}`}
                        onEdit={() => openEdit(product)}
                        onDelete={() => setDeletingProduct(product)}
                      />
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

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
      />

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(next) => !next && setDeletingProduct(null)}
        title={`Delete ${deletingProduct?.name ?? "this product"}?`}
        description="This permanently removes the product from the catalog. This action cannot be undone."
        confirmLabel="Delete product"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </>
  );
}
