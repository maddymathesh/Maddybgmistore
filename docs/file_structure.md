# MaddyBgmistoreV2 File Structure

This document provides a complete folder and file map of the **MaddyBgmistoreV2** workspace, detailing every component, route, package, and configuration file.

---

## 1. Monorepo Repository Tree

The complete repository directory layout is organized as follows:

```
MaddyBgmistoreV2/
├── .git/                         # Git repository metadata
├── apps/                         # Main user interfaces
│   ├── web/                      # The Public Storefront Application
│   │   ├── app/                  # Next.js App Router (Layouts & Routes)
│   │   │   ├── booking-system/   # Booking guides layout
│   │   │   ├── buy/              # Buyer guide pages
│   │   │   ├── connectwithus/    # Customer support link tree
│   │   │   ├── escrow/           # Escrow guides
│   │   │   ├── escrow-deal/      # Escrow instructions
│   │   │   ├── exchange/         # Exchange service guides
│   │   │   ├── f2f-sell-guide/   # Face-to-Face guidelines
│   │   │   ├── faq/              # FAQs page
│   │   │   ├── feedback/         # Feedback submission form
│   │   │   ├── fonts/            # Local asset typography fonts
│   │   │   ├── guides/           # Generic guidebook layout
│   │   │   ├── kyc-guide/        # Verification guide
│   │   │   ├── no-returns-policy/# Store return terms
│   │   │   ├── pay/              # Payment portal page `/pay/[paymentId]`
│   │   │   ├── payout-guide/     # Seller payout rules
│   │   │   ├── privacy/          # Privacy policy page
│   │   │   ├── proofs/           # Completed deals gallery catalog
│   │   │   ├── readystocks/      # BGMI Accounts listing index
│   │   │   ├── refunds/          # Refund policy terms
│   │   │   ├── reviews/          # Moderated user reviews list
│   │   │   ├── sell/             # Account selling instruction page
│   │   │   ├── services/         # UC, X-Suits, & Supercars gift catalog routes
│   │   │   ├── terms/            # Terms of service page
│   │   │   ├── unlinking-guide/  # Safe unlinking steps
│   │   │   ├── actions.ts        # Server Actions (form postings, DB entries)
│   │   │   ├── globals.css       # Style sheets, theme definitions
│   │   │   ├── layout.tsx        # Global page layout wrapping theme provider
│   │   │   └── page.tsx          # Storefront Homepage
│   │   ├── components/           # Specific components (Navbar, Footer, Ticker)
│   │   ├── public/               # Public assets (images, logos)
│   │   ├── eslint.config.js      # App ESLint configuration
│   │   ├── proxy.ts              # Public proxy (Clerk setup)
│   │   ├── next-env.d.ts         # Next.js types
│   │   ├── next.config.js        # Next.js configurations
│   │   ├── postcss.config.mjs    # PostCSS configs
│   │   ├── sentry.*.config.ts    # Sentry configs (client, edge, server)
│   │   ├── tsconfig.json         # TypeScript config
│   │   └── package.json          # Dependency packages
│   │
│   └── admin/                    # The Administrative Control Panel
│       ├── app/                  # Next.js App Router (basePath: /admin)
│       │   ├── fonts/            # Local typography assets
│       │   ├── lib/              # Client-side bootstrap scripts
│       │   ├── services/         # Administrative helper API scripts
│       │   ├── transactions/     # Transaction panel dashboard views
│       │   │   ├── components/   # Sub-layouts (Dashboard, TransactionsList, etc.)
│       │   │   └── page.tsx      # Entrypoint page for `/admin/transactions`
│       │   ├── utils/            # Shared formatting helpers
│       │   ├── actions.ts        # Admin DB operations (Server Actions)
│       │   ├── globals.css       # CSS style rules and overrides
│       │   ├── layout.tsx        # Admin dashboard shell layout
│       │   └── page.tsx          # Clerk validation check
│       ├── components/           # Shared administrative components
│       ├── proxy.ts              # Clerk role-based access proxy
│       ├── next.config.js        # basePath redirect & Sentry configs
│       ├── tsconfig.json         # TypeScript config
│       └── package.json          # Admin dependency packages
│
├── packages/                     # Workspace shared libraries
│   ├── db/                       # Persistence client & database structures
│   │   ├── drizzle/              # Drizzle migrations schema snapshots
│   │   ├── src/                  # Schema definition and database client connection
│   │   │   ├── index.ts          # DB instantiation export
│   │   │   └── schema.ts         # Database table layout schemas
│   │   ├── drizzle.config.ts     # Drizzle Kit migration configuration
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # DB workspace dependencies
│   │
│   ├── auth/                     # Clerk authentication middleware configs
│   │   ├── src/                  # Authentication helpers
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # Authentication packages
│   │
│   ├── lib/                      # External APIs integrations
│   │   ├── src/                  # Integration helpers
│   │   │   ├── index.ts          # Export utilities
│   │   │   ├── cloudinary.ts     # Cloudinary media upload handler
│   │   │   ├── posthog.ts        # PostHog tracking instances
│   │   │   └── resend.ts         # Resend email client configuration
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # Library dependencies
│   │
│   ├── ui/                       # Design system and UI primitives
│   │   ├── src/                  # Reusable components
│   │   │   ├── button.tsx        # Styled button primitive
│   │   │   ├── card.tsx          # Card container layout
│   │   │   ├── code.tsx          # Code block renderer
│   │   │   └── dropdown.tsx      # Stacking interactive navbar dropdown
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # UI dependencies
│   │
│   ├── validation/               # Zod API validation schemas
│   │   ├── src/                  # Zod validation models
│   │   │   └── index.ts          # Schemas (Transaction, Product schema etc.)
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # Validation packages
│   │
│   ├── types/                    # Domain typescript definitions
│   │   ├── src/                  # Custom domain models
│   │   │   └── index.ts          # Interfaces and shared enum types
│   │   ├── tsconfig.json         # TS Compiler setup
│   │   └── package.json          # Types package config
│   │
│   ├── typescript-config/        # Shared tsconfig presets
│   └── eslint-config/            # Shared ESLint configuration rules
│
├── docs/                         # Technical documentation catalogs
├── package.json                  # Root monorepo configuration
├── turbo.json                    # Turborepo task runner caching configurations
└── package-lock.json             # Locked npm package dependencies
```

---

## 2. Shared Workspace Module Details

### `packages/db`
*   Contains the database schema definitions inside [schema.ts](file:///Users/maddy/Current%20Project/MaddyBgmistoreV2/packages/db/src/schema.ts).
*   Manages Drizzle migrations mapping and connection clients using Postgres.

### `packages/lib`
*   **Resend Integration**: Sends transactional emails on deal notifications ([resend.ts](file:///Users/maddy/Current%20Project/MaddyBgmistoreV2/packages/lib/src/resend.ts)).
*   **Cloudinary Integration**: Uploads screenshots and proofs to Cloudinary hosting ([cloudinary.ts](file:///Users/maddy/Current%20Project/MaddyBgmistoreV2/packages/lib/src/cloudinary.ts)).
*   **PostHog Integration**: Tracks analytics and user flows ([posthog.ts](file:///Users/maddy/Current%20Project/MaddyBgmistoreV2/packages/lib/src/posthog.ts)).

### `packages/ui`
*   Defines core design blocks like `Button`, `Card`, and the customized `Dropdown` component reused inside Next.js pages.

### `packages/validation`
*   Defines compile-time and runtime validation models using Zod to sanitize server action inputs (e.g., transaction inputs, billing validation).

---

## 3. Configuration & Compilation Files

*   **`package.json`**: Declares workspaces (`apps/*`, `packages/*`) to npm to build symlinks for internal resolutions.
*   **`turbo.json`**: Sets up compile order and dependencies (e.g., `build` tasks require dependency package compilations first, outputs are cached).
*   **`.gitignore`**: Excludes Next.js local files (`.next/`), dependency folders (`node_modules`), Vercel runtime directories (`.vercel`), and local environment configurations (`.env*`).
