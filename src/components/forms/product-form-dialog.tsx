"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import {
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product";
import type { Product } from "@/types/product";

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isEdit = Boolean(product);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      imageUrl: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? {
              name: product.name,
              description: product.description,
              price: product.price,
              category: product.category,
              stock: product.stock,
              imageUrl: product.imageUrl ?? "",
              status: product.status,
            }
          : {
              name: "",
              description: "",
              price: 0,
              category: "",
              stock: 0,
              imageUrl: "",
              status: "draft",
            },
      );
    }
  }, [open, product, reset]);

  const submitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: ProductFormValues) {
    const input = {
      ...values,
      description: values.description ?? "",
      imageUrl: values.imageUrl ? values.imageUrl : undefined,
    };
    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({ id: product.id, input });
      } else {
        await createMutation.mutateAsync(input);
      }
      onOpenChange(false);
    } catch {
      // Error toast handled by the mutation hooks; keep dialog open.
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Create product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this product's details and inventory."
              : "Add a new product to the catalog."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="product-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <FormField label="Name" htmlFor="product-name" error={errors.name?.message} required>
            <Input
              id="product-name"
              placeholder="Aurora Wireless Headphones"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="product-description"
            error={errors.description?.message}
          >
            <Textarea
              id="product-description"
              placeholder="Short product description…"
              rows={3}
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Price (USD)"
              htmlFor="product-price"
              error={errors.price?.message}
              required
            >
              <Input
                id="product-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                aria-invalid={Boolean(errors.price)}
                {...register("price")}
              />
            </FormField>

            <FormField
              label="Stock"
              htmlFor="product-stock"
              error={errors.stock?.message}
              required
            >
              <Input
                id="product-stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                aria-invalid={Boolean(errors.stock)}
                {...register("stock")}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Category"
              htmlFor="product-category"
              error={errors.category?.message}
              required
            >
              <Input
                id="product-category"
                placeholder="Audio"
                autoComplete="off"
                aria-invalid={Boolean(errors.category)}
                {...register("category")}
              />
            </FormField>

            <FormField
              label="Status"
              htmlFor="product-status"
              error={errors.status?.message}
              required
            >
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="product-status" aria-invalid={Boolean(errors.status)}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Image URL"
            htmlFor="product-image"
            error={errors.imageUrl?.message}
            hint="Optional — a placeholder is shown when empty or broken."
          >
            <Input
              id="product-image"
              type="url"
              inputMode="url"
              placeholder="https://example.com/image.jpg"
              autoComplete="off"
              aria-invalid={Boolean(errors.imageUrl)}
              {...register("imageUrl")}
            />
          </FormField>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
