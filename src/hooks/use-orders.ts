"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getOrder, listOrders, updateOrderStatus } from "@/lib/api/orders";
import type { OrderStatus } from "@/types/order";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => ["orders", id] as const,
};

export function useOrders() {
  return useQuery({ queryKey: orderKeys.all, queryFn: listOrders });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (order) => {
      toast.success(`Order ${order.orderNumber} marked as ${order.status}.`);
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({
        queryKey: orderKeys.detail(order.id),
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update order status.",
      );
    },
  });
}
