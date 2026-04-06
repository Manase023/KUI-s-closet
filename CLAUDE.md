# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Development Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint (flat config, Next.js Core Web Vitals + TypeScript rules)
- `node scripts/init-db.mjs` — Initialize/reset SQLite database with schema and seed data
- `node scripts/migrate.mjs` — Run database migrations

## Architecture

**Stack:** Next.js 16 + React 19 + SQLite (no ORM, raw queries via `sqlite` npm package)

**This is a fashion e-commerce storefront (KUI)** with an admin dashboard. Checkout is handled via WhatsApp — there is no payment processing.

### Data Flow

All database operations go through **server actions** in `src/app/actions.ts`. This is the single entry point for all data reads and writes. Server actions call SQLite directly via the helper in `src/lib/db.ts`, which opens `data/kui.db` with WAL mode.

Mutations call `revalidatePath()` to invalidate cached pages.

### Client vs Server Split

- **Server Components** (default): Homepage (`page.tsx`), product pages, category pages — these fetch data directly via server actions
- **Client Components** (`'use client'`): Cart, search, admin dashboard, product options — anything with interactivity
- Pages use `export const dynamic = 'force-dynamic'` to bypass static caching

### State Management

- **CartContext** (`src/app/store/CartContext.tsx`) — React Context for cart state (client-only, not persisted to DB). Cart items keyed by `${productId}-${size}-${color}`.
- **AdminContext** (`src/app/admin/AdminContext.tsx`) — React Context for admin auth and navigation state. Session is in-memory only (no cookies/JWT).

### Database Schema (SQLite)

7 tables defined in `scripts/init-db.mjs`: `users`, `categories`, `products`, `orders`, `hero_settings`, `store_settings`, `visits`. Products store `photos` and `sizes`/`colors` as JSON strings.

### Styling

Pure CSS with custom properties — no Tailwind. Design tokens in `globals.css`: `--bg`, `--cream`, `--accent` (#ff2a75), `--serif` (Cormorant Garamond), `--sans` (DM Sans). Admin styles in `src/app/admin/admin.css`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
