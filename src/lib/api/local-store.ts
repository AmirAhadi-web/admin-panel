import { STORAGE_KEYS } from "@/lib/constants";
import { seedOrders, seedProducts, seedUsers } from "@/lib/api/demo-data";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

/**
 * Browser-backed demo data store.
 *
 * It provides working CRUD with realistic latency and persists non-sensitive
 * sample content to localStorage. Resource repository modules isolate this
 * implementation so it can be replaced by the primary database integration
 * without changing pages or query hooks.
 */

class DataStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataStoreError";
  }
}

interface LocalDb {
  users: User[];
  products: Product[];
  orders: Order[];
}

let cache: LocalDb | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function freshSeed(): LocalDb {
  return {
    users: seedUsers.map((u) => ({ ...u })),
    products: seedProducts.map((p) => ({ ...p })),
    orders: seedOrders.map((o) => ({ ...o })),
  };
}

function load(): LocalDb {
  if (cache) return cache;
  if (isBrowser()) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.demoData);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LocalDb>;
        if (
          parsed &&
          Array.isArray(parsed.users) &&
          Array.isArray(parsed.products) &&
          Array.isArray(parsed.orders)
        ) {
          cache = parsed as LocalDb;
          return cache;
        }
      }
    } catch {
      // Corrupted payload — fall through and reseed.
    }
  }
  cache = freshSeed();
  return cache;
}

function persist(): void {
  if (!isBrowser() || !cache) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS.demoData, JSON.stringify(cache));
  } catch {
    // Storage may be full or unavailable; the in-memory cache still works
    // for the current session.
  }
}

function latency(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, 180 + Math.random() * 320),
  );
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}`;
}

function byCreatedDesc<T extends { createdAt?: string; date?: string }>(
  a: T,
  b: T,
): number {
  const aTime = Date.parse(a.createdAt ?? a.date ?? "") || 0;
  const bTime = Date.parse(b.createdAt ?? b.date ?? "") || 0;
  return bTime - aTime;
}

interface Collection<T extends { id: string }> {
  list(): Promise<T[]>;
  get(id: string): Promise<T>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: string, patch: Partial<Omit<T, "id">>): Promise<T>;
  remove(id: string): Promise<void>;
}

function collection<T extends { id: string; createdAt?: string; date?: string }>(
  key: keyof LocalDb,
  prefix: string,
  label: string,
): Collection<T> {
  return {
    async list() {
      await latency();
      return [...(load()[key] as unknown as T[])].sort(byCreatedDesc);
    },
    async get(id) {
      await latency();
      const item = (load()[key] as unknown as T[]).find((entry) => entry.id === id);
      if (!item) throw new DataStoreError(`${label} not found.`);
      return { ...item };
    },
    async create(input) {
      await latency();
      const item = {
        ...input,
        id: nextId(prefix),
        createdAt: new Date().toISOString(),
      } as unknown as T;
      (load()[key] as unknown as T[]).unshift(item);
      persist();
      return { ...item };
    },
    async update(id, patch) {
      await latency();
      const items = load()[key] as unknown as T[];
      const index = items.findIndex((entry) => entry.id === id);
      if (index === -1) throw new DataStoreError(`${label} not found.`);
      items[index] = { ...items[index], ...patch, id };
      persist();
      return { ...items[index] };
    },
    async remove(id) {
      await latency();
      const db = load();
      const items = db[key] as unknown as T[];
      const index = items.findIndex((entry) => entry.id === id);
      if (index === -1) throw new DataStoreError(`${label} not found.`);
      items.splice(index, 1);
      persist();
    },
  };
}

export const localUsers = collection<User>("users", "u", "User");
export const localProducts = collection<Product>("products", "p", "Product");
export const localOrders = collection<Order>("orders", "o", "Order");

