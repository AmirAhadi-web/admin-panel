# Panelo — Premium Dark Admin Dashboard

A polished, responsive admin panel built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, shadcn/ui-style components, **TanStack Query**, **React Hook Form + Zod**, and **Recharts**.

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### Demo login

| Field    | Value       |
| -------- | ----------- |
| Username | `amirahadi` |
| Password | `Admin123!` |

These are public demo credentials displayed on the login page. The current
client-side session flow is for interface demonstration only and is not an
authorization boundary.

## Pages

| Route            | Features |
| ---------------- | -------- |
| `/login`         | Username validation, password visibility, remember username, errors |
| `/dashboard`     | Metrics, revenue chart, order status, recent orders, activity |
| `/users`         | Search, filters, pagination, create/edit/delete |
| `/users/[id]`    | User details and management actions |
| `/products`      | Catalog CRUD, filters, stock levels, image fallback |
| `/products/[id]` | Product and inventory details |
| `/orders`        | Search, status filter, pagination, order value |
| `/orders/[id]`   | Order summary, fulfillment timeline, status update |
| `/analytics`     | Revenue, order trends, inventory and product performance |
| `/settings`      | Profile photo, name, email, phone, notifications and appearance |

## Current data repository

The dashboard UI currently runs against a seeded browser-backed repository in
`src/lib/api/local-store.ts`. It supports the complete demo CRUD experience and
persists non-sensitive sample data in localStorage.

There is no external demo REST service integration and no related public base
URL environment variable. Resource modules are intentionally isolated:

- `src/lib/api/users.ts`
- `src/lib/api/products.ts`
- `src/lib/api/orders.ts`

When the primary database/backend is connected, replace the implementations in
these repository modules. Pages, forms, domain types, and TanStack Query hooks
can remain unchanged.

## Architecture

```text
src/
├── app/
│   ├── (auth)/login/
│   └── (admin)/
│       ├── dashboard/  users/  products/  orders/  analytics/  settings/
├── components/
│   ├── ui/
│   ├── layout/
│   └── dashboard/  analytics/  forms/  tables/  shared/
├── hooks/                  # Query hooks and local UI preferences
├── lib/
│   ├── api/                # Typed repositories, local store, sample seeds
│   ├── validations/        # Zod schemas
│   └── utilities
└── types/                  # User, product and order domain types
```

Data flow:

```text
Pages → TanStack Query hooks → typed repository modules → current data adapter
```

Successful mutations invalidate the affected query keys, keeping lists and
detail pages synchronized.

## Environment

`.env.example` contains the starter infrastructure database URL used by the
health endpoint. Add the server-only environment variables required by the
primary backend when its repository adapter is implemented. Never expose
secrets through `NEXT_PUBLIC_*` variables.

## Security notes

- Demo authentication checks credentials in the browser and stores a local
  session flag. Replace it with server-side sessions and middleware before
  production.
- Remember-me stores only the username, never the password.
- Profile and notification preferences are local to the browser.

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |

## Current limitations

- Order records do not include line-item details.
- Notification and activity feeds use sample presentation content.
- The interface currently ships with its dark theme only.
- The starter `src/db` files support the health endpoint but are not yet the
  dashboard's data repository.
