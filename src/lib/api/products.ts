import { localProducts } from "@/lib/api/local-store";
import type { Product, ProductInput } from "@/types/product";

/** Product data repository; currently backed by the local demo store. */
export async function listProducts(): Promise<Product[]> {
  return localProducts.list();
}

export async function getProduct(id: string): Promise<Product> {
  return localProducts.get(id);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return localProducts.create({ ...input, createdAt: "" });
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  return localProducts.update(id, input);
}

export async function deleteProduct(id: string): Promise<void> {
  return localProducts.remove(id);
}
