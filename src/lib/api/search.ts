import { listOrders } from "@/lib/api/orders";
import { listProducts } from "@/lib/api/products";
import { listUsers } from "@/lib/api/users";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

export interface GlobalSearchResults {
  users: User[];
  products: Product[];
  orders: Order[];
}

/** Header search across all resources, capped per group. */
export async function searchAll(query: string): Promise<GlobalSearchResults> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return { users: [], products: [], orders: [] };

  const [users, products, orders] = await Promise.all([
    listUsers(),
    listProducts(),
    listOrders(),
  ]);

  return {
    users: users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
      .slice(0, 4),
    products: products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
      .slice(0, 4),
    orders: orders
      .filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q),
      )
      .slice(0, 4),
  };
}
