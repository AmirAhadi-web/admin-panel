"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "@/lib/api/products";
import type { ProductInput } from "@/types/product";

export const productKeys = {
  all: ["products"] as const,
  detail: (id: string) => ["products", id] as const,
};

export function useProducts() {
  return useQuery({ queryKey: productKeys.all, queryFn: listProducts });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: (product) => {
      toast.success(`Product "${product.name}" created.`);
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) =>
      updateProduct(id, input),
    onSuccess: (product) => {
      toast.success(`Product "${product.name}" updated.`);
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
      void queryClient.invalidateQueries({
        queryKey: productKeys.detail(product.id),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted.");
      void queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    },
  });
}
