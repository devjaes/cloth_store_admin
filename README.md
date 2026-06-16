# Ambivalence — Admin (2023)

> Admin app for the Ambivalence two-app e-commerce platform — catalog, inventory, and order management.

## Overview

Admin surface for the Ambivalence clothing brand, paired with the customer-facing storefront. The owner manages stores, categories, products, sizes, and orders directly — no SaaS CMS in the middle. Mutations run through Next.js server actions; Clerk gates every route except the public API; Prisma persists to PostgreSQL; Cloudinary handles product imagery; Stripe webhooks reconcile order state.

## Stack

| Layer       | Tech                                                |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 13.4 (App Router + Server Actions)          |
| Language    | TypeScript 5                                        |
| ORM         | Prisma 4.16                                         |
| Database    | PostgreSQL (`relationMode = "prisma"`, PlanetScale-compatible) |
| Auth        | Clerk (`@clerk/nextjs`)                             |
| UI          | Tailwind CSS + Radix primitives + shadcn/ui         |
| Forms       | react-hook-form + Zod                               |
| Tables      | TanStack Table                                      |
| State       | Zustand                                             |
| Media       | Cloudinary (`next-cloudinary`)                      |
| Payments    | Stripe (checkout + webhooks)                        |
| Charts      | Recharts                                            |

## Repo scope

- **Admin (this repo):** stores, products, categories, sizes, orders, billboard/overview dashboard.
- **Storefront:** [devjaes/clothstore](https://github.com/devjaes/clothstore) — consumes this admin's API and renders the public catalog/checkout.

## Local setup

```bash
git clone https://github.com/devjaes/cloth_store_admin.git
cd cloth_store_admin
pnpm install            # postinstall runs `prisma generate`
cp .env.example .env    # fill in keys (see below)
npx prisma db push      # sync schema to your Postgres instance
pnpm dev                # http://localhost:3000
```

### Required env vars

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

DATABASE_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
FRONTEND_STORE_URL=http://localhost:3001
```

## Status

Earlier project (2023). The brand has since closed and the production deployment is no longer maintained. The repository is kept public for the career timeline.

## Portfolio

[Project entry on devjaes.dev →](https://devjaes.dev/work/ambivalence)
