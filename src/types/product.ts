export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  status: ProductStatus;
  createdAt: string; // ISO date string
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  status: ProductStatus;
}
