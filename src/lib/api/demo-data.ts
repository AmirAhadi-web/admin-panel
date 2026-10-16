import type { Order } from "@/types/order";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

/**
 * Deterministic demo dataset. Uses a seeded PRNG so every visitor (and every
 * reload) starts from the same realistic-looking data. Dates are anchored to
 * "now" so charts and feeds always look alive.
 */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260304);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)];
}

function int(min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

const DAY = 86_400_000;

function daysAgo(days: number, jitterHours = 0): string {
  return new Date(
    Date.now() - days * DAY - jitterHours * 3_600_000,
  ).toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

/* ── Users ─────────────────────────────────────────────────────────────── */

const USER_SEED: ReadonlyArray<
  readonly [string, string, User["role"], User["status"], number]
> = [
  ["Maya Chen", "maya.chen@panelo.dev", "admin", "active", 2],
  ["Jonas Weber", "jonas.weber@acme.io", "editor", "active", 6],
  ["Amara Okafor", "amara.okafor@lumen.co", "editor", "active", 12],
  ["Elias Roth", "elias.roth@northwind.dev", "viewer", "active", 18],
  ["Sofia Marino", "sofia.marino@atlas.studio", "editor", "invited", 21],
  ["Daniel Kim", "daniel.kim@vertexlabs.io", "viewer", "active", 27],
  ["Priya Nair", "priya.nair@panelo.dev", "admin", "active", 33],
  ["Tomas Silva", "tomas.silva@brightpath.co", "editor", "suspended", 41],
  ["Nora Haddad", "nora.haddad@cedarworks.io", "editor", "active", 48],
  ["Felix Braun", "felix.braun@kontor.de", "viewer", "active", 55],
  ["Ines Costa", "ines.costa@brightpath.co", "editor", "active", 63],
  ["Marcus Lee", "marcus.lee@halcyon.dev", "viewer", "invited", 70],
  ["Hana Sato", "hana.sato@fieldnotes.jp", "editor", "active", 78],
  ["Oliver Grant", "oliver.grant@atlas.studio", "viewer", "suspended", 86],
  ["Leila Ahmadi", "leila.ahmadi@panelo.dev", "admin", "active", 95],
  ["Victor Petrov", "victor.petrov@northwind.dev", "editor", "active", 104],
  ["Chloe Dubois", "chloe.dubois@maison.fr", "viewer", "active", 118],
  ["Sam Carter", "sam.carter@vertexlabs.io", "editor", "active", 131],
  ["Aisha Bello", "aisha.bello@lumen.co", "viewer", "invited", 149],
  ["Ruben Vargas", "ruben.vargas@solstice.mx", "editor", "active", 167],
  ["Emma Novak", "emma.novak@kontor.de", "viewer", "active", 188],
  ["David Osei", "david.osei@cedarworks.io", "editor", "suspended", 214],
  ["Julia Lind", "julia.lind@nordlys.se", "viewer", "active", 246],
  ["Noah Meyer", "noah.meyer@halcyon.dev", "editor", "active", 281],
];

export const seedUsers: User[] = USER_SEED.map(
  ([name, email, role, status, age], index) => ({
    id: `u_${String(index + 1).padStart(3, "0")}`,
    name,
    email,
    role,
    status,
    createdAt: daysAgo(age, int(0, 20)),
  }),
);

/* ── Products ──────────────────────────────────────────────────────────── */

const PRODUCT_SEED: ReadonlyArray<
  readonly [string, string, number, string, number, Product["status"], number]
> = [
  ["Aurora Wireless Headphones", "Over-ear ANC headphones with 40h battery life and multipoint Bluetooth.", 249, "Audio", 84, "active", 3],
  ["Echo ANC Earbuds", "Compact true-wireless earbuds with adaptive noise cancelling.", 129, "Audio", 210, "active", 5],
  ["Vertex Mechanical Keyboard", "Hot-swappable 75% keyboard with gasket mount and PBT keycaps.", 159, "Keyboards", 64, "active", 9],
  ["Drift Low-Profile Keyboard", "Slim wireless mechanical keyboard for travel setups.", 119, "Keyboards", 0, "active", 14],
  ["Nimbus Laptop Stand", "CNC-milled aluminium stand with cable routing channel.", 79, "Workspace", 132, "active", 16],
  ["Terra Felt Desk Mat", "Extra-large merino felt desk mat with anti-slip base.", 39, "Workspace", 240, "active", 20],
  ["Halo Monitor Light Bar", "Asymmetric LED light bar with auto-dimming sensor.", 59, "Displays", 58, "active", 25],
  ["Canvas 27\" 4K Monitor", "Factory-calibrated IPS panel, 98% DCI-P3, USB-C 90W.", 429, "Displays", 23, "active", 31],
  ["Flux 100W GaN Charger", "Dual USB-C GaN fast charger in a pocketable body.", 69, "Power", 175, "active", 38],
  ["Orbit 3-in-1 Wireless Charger", "MagSafe stand charging phone, watch and earbuds at once.", 89, "Power", 8, "active", 44],
  ["Slate USB-C Hub 8-in-1", "HDMI 2.1, 2.5GbE, SD reader and 100W pass-through.", 99, "Accessories", 96, "active", 52],
  ["Beacon 4K Webcam", "4K HDR webcam with AI framing and dual mics.", 139, "Accessories", 41, "active", 61],
  ["Ridge Laptop Sleeve", "Waxed canvas sleeve with recycled fleece lining.", 45, "Accessories", 120, "draft", 75],
  ["Atlas Cable Organizer", "Magnetic cable management kit for desks.", 19, "Workspace", 300, "active", 88],
  ["Keystone Macro Pad", "Programmable 12-key macro pad with OLED display.", 75, "Keyboards", 34, "draft", 105],
  ["Summit Soundbar", "Reference compact soundbar for desktop setups.", 189, "Audio", 0, "archived", 140],
];

export const seedProducts: Product[] = PRODUCT_SEED.map(
  ([name, description, price, category, stock, status, age], index) => ({
    id: `p_${String(index + 1).padStart(3, "0")}`,
    name,
    description,
    price,
    category,
    stock,
    status,
    imageUrl: `https://picsum.photos/seed/panelo-product-${index + 1}/640/480`,
    createdAt: daysAgo(age, int(0, 20)),
  }),
);

/* ── Orders ────────────────────────────────────────────────────────────── */

const ORDER_STATUS_POOL: readonly Order["status"][] = [
  "delivered",
  "delivered",
  "delivered",
  "delivered",
  "shipped",
  "shipped",
  "processing",
  "processing",
  "pending",
  "cancelled",
];

const PAYMENT_POOL: readonly Order["paymentMethod"][] = [
  "card",
  "card",
  "card",
  "paypal",
  "bank_transfer",
];

export const seedOrders: Order[] = Array.from({ length: 32 }, (_, index) => {
  const customer = pick(USER_SEED);
  const itemCount = int(1, 4);
  let total = 0;
  for (let i = 0; i < itemCount; i += 1) {
    const product = pick(PRODUCT_SEED);
    total += product[2] * int(1, 3);
  }
  const daysBack = Math.round((index / 32) * 165 + rand() * 4);
  return {
    id: `o_${String(1000 + index)}`,
    orderNumber: `NX-${2410 + index}`,
    customer: customer[0],
    email: customer[1],
    date: daysAgo(daysBack, int(0, 22)),
    total: round2(total),
    status: daysBack < 2 ? pick(["pending", "processing"] as const) : pick(ORDER_STATUS_POOL),
    paymentMethod: pick(PAYMENT_POOL),
    items: itemCount,
  };
});

/* ── Activity feed & notifications (presentation-only demo content) ────── */

export interface ActivityEntry {
  id: string;
  type: "order" | "user" | "product" | "payment" | "alert";
  title: string;
  description: string;
  timestamp: string;
}

export const seedActivity: ActivityEntry[] = [
  { id: "a_1", type: "order", title: "New order NX-2501", description: "Leila Ahmadi placed an order for $357.00", timestamp: hoursAgo(0.5) },
  { id: "a_2", type: "payment", title: "Payment received", description: "$1,240.00 payout from Felix Braun cleared", timestamp: hoursAgo(2) },
  { id: "a_3", type: "user", title: "New team member invited", description: "Sofia Marino was invited as an editor", timestamp: hoursAgo(5) },
  { id: "a_4", type: "alert", title: "Low stock warning", description: "Orbit 3-in-1 Wireless Charger dropped below 10 units", timestamp: hoursAgo(8) },
  { id: "a_5", type: "order", title: "Order shipped", description: "NX-2498 was handed to the carrier", timestamp: hoursAgo(13) },
  { id: "a_6", type: "product", title: "Product updated", description: "Canvas 27\" 4K Monitor price changed to $429.00", timestamp: hoursAgo(26) },
  { id: "a_7", type: "user", title: "Role changed", description: "Priya Nair was promoted to admin", timestamp: hoursAgo(31) },
  { id: "a_8", type: "order", title: "Order delivered", description: "NX-2495 was delivered to Hana Sato", timestamp: hoursAgo(47) },
];

export interface NotificationEntry {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export const seedNotifications: NotificationEntry[] = [
  { id: "n_1", title: "3 orders awaiting review", description: "NX-2501, NX-2500 and NX-2499 are still pending.", timestamp: hoursAgo(1), read: false },
  { id: "n_2", title: "Weekly report ready", description: "Your revenue summary for last week is available.", timestamp: hoursAgo(7), read: false },
  { id: "n_3", title: "Low stock alert", description: "Orbit 3-in-1 Wireless Charger has 8 units left.", timestamp: hoursAgo(8), read: false },
  { id: "n_4", title: "Payout processed", description: "$4,210.00 was transferred to your bank account.", timestamp: hoursAgo(30), read: true },
  { id: "n_5", title: "Scheduled maintenance", description: "Demo data resets nightly at 02:00 UTC.", timestamp: hoursAgo(52), read: true },
];
