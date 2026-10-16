import { localOrders } from "@/lib/api/local-store";
import type { Order, OrderStatus } from "@/types/order";

/**
 * Order data repository; currently backed by the local demo store.
 * Orders expose read + status-update operations for the admin experience.
 */
export async function listOrders(): Promise<Order[]> {
  return localOrders.list();
}

export async function getOrder(id: string): Promise<Order> {
  return localOrders.get(id);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return localOrders.update(id, { status });
}
