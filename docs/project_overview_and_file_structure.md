# Project Overview & File Structure

This document provides a comprehensive overview of the **MaddyBgmistoreV2** platform, detailing its business purpose, module design, application routing structure, shared packages, and developer workflows.

---

## 1. Project Overview

**MaddyBgmistoreV2** is a premium, high-performance web platform built to handle Battlegrounds Mobile India (BGMI) trading and service transactions. It is designed to deliver a visually stunning, secure, and responsive user experience for buyers and sellers.

### Core Portals:
1. **Storefront Portal (`apps/web`)**: A custom-branded storefront featuring a premium dark-themed interface, fluid CSS animations, and reactive UI elements. Users can explore readystocks (accounts), purchase UC, purchase X-Suits or supercar gifts, read community reviews, submit feedback, and view deal verification proofs.
2. **Admin Portal (`apps/admin`)**: A restricted dashboard allowing administrators to log transactions, manage products/UC packages, adjust global payment details (UPI/Bank accounts), inspect incoming customer feedback, and generate secure payment links.

---

## 2. Directory & File Structure

The project is structured as a Monorepo managed by **Turborepo** and npm workspaces. This enables separate building and deployment of applications while sharing code across packages.

### Monorepo Overview
```
MaddyBgmistoreV2/
├── apps/                         # Standalone deployment apps (Next.js App Router)
│   ├── web/                      # The Public Storefront
│   └── admin/                    # The Admin Dashboard (basePath: /admin)
├── packages/                     # Reusable monorepo package dependencies
│   ├── db/                       # Drizzle ORM database schema and clients
│   ├── auth/                     # Clerks auth helper functions and validation
│   ├── typescript-config/        # Base TypeScript config presets
│   ├── eslint-config/            # Base ESLint rule presets
│   ├── ui/                       # Reusable visual components and design tokens
│   ├── types/                    # Shared TypeScript interface declarations
│   ├── validation/               # Zod validation schemas
│   └── lib/                      # Common helpers (Sentry, formatters, API utilities)
├── docs/                         # Architecture, migration, and structural docs
├── package.json                  # Workspace definitions & run tasks
└── turbo.json                    # Turborepo task pipeline rules
```

---

## 3. Storefront Structure (`apps/web`)

The storefront application is a Next.js App Router project located in `apps/web/`.

```
apps/web/
├── app/                          # Core App Routing & Pages
│   ├── actions.ts                # Server Actions (review posting, feedback logs)
│   ├── globals.css               # Core CSS variables, typography, and utility classes
│   ├── layout.tsx                # App shell containing Navbar, Footer, and providers
│   ├── page.tsx                  # Landing page with high-fidelity animations
│   ├── booking-system/           # Booking guide details page
│   ├── buy/                      # Buying instructions
│   ├── connectwithus/            # Social links and customer support index
│   ├── escrow/                   # Escrow service explanation
│   ├── escrow-deal/              # Guide for conducting escrow deals
│   ├── exchange/                 # Account exchange instructions
│   ├── f2f-sell-guide/           # Face-to-Face selling information
│   ├── faq/                      # Frequently Asked Questions
│   ├── feedback/                 # Feedback submission forms
│   ├── guides/                   # Detailed static guides (kyc, unlinking, payouts)
│   ├── kyc-guide/                # KYC process guide
│   ├── no-returns-policy/        # No-returns policy overview
│   ├── pay/                      # Dynamic payment portals e.g., `/pay/[paymentId]`
│   ├── payout-guide/             # Seller payout instruction page
│   ├── privacy/                  # Privacy policy page
│   ├── proofs/                   # Deal proofs (completed screenshots catalog)
│   ├── readystocks/              # Available BGMI Accounts catalog list
│   ├── refunds/                  # Refund policy page
│   ├── reviews/                  # Customer reviews list
│   ├── sell/                     # Selling procedure page
│   ├── services/                 # Gifting service catalogs (supercars, UC, X-Suits)
│   └── terms/                    # Terms and conditions page
├── components/                   # Storefront components (Navbar, Footer, Ticker)
├── public/                       # Static assets (images, badges, logos)
├── next.config.js                # Next.js configurations & Sentry plugin integration
├── tsconfig.json                 # TypeScript compiler setup
└── package.json                  # Frontend dependencies
```

---

## 4. Admin Portal Structure (`apps/admin`)

The administrative portal runs on a separate port with a base routing prefix of `/admin` (configured in `next.config.js`).

```
apps/admin/
├── app/                          # Core Routing & Administrative Pages
│   ├── actions.ts                # Administrative Server Actions (database updates)
│   ├── globals.css               # Admin layout styling overrides
│   ├── layout.tsx                # Admin shell containing providers and theme tokens
│   ├── page.tsx                  # Authentication check page
│   ├── transactions/             # Core Admin Transaction Console
│   │   ├── page.tsx              # Transactions route index
│   │   └── components/           # Dashboard views, Lists, and Transaction Creators
│   ├── utils/                    # Utility tools (e.g., date formats, currency)
│   ├── services/                 # Admin page service API hooks
│   └── lib/                      # Admin-specific client initialization script
├── components/                   # Admin UI components
├── middleware.ts                 # Clerk RBAC Middleware checks
├── next.config.js                # basePath & Sentry configurations
├── tsconfig.json                 # TypeScript compiler setup
└── package.json                  # Admin dependencies and workspaces
```

---

## 5. Shared Packages (`packages/*`)

These shared modules prevent duplication and maintain consistent definitions across the applications.

*   **`packages/db`**: Represents the database persistence layer.
    *   `src/schema.ts`: Holds Drizzle table schemas (products, payment links, customer feedback, and transactions logs).
    *   `src/index.ts`: Database client instantiation.
    *   `drizzle.config.ts`: Configuration file for Drizzle Kit migration runs.
*   **`packages/auth`**: Shared security context helpers wrapping Clerk for custom session verification.
*   **`packages/lib`**: Housing unified API logic, date utilities, and global error capturing instances (Sentry configurations).
*   **`packages/validation`**: Houses unified Zod validation schemas used on both the client (form inputs) and server (Server Actions validation).
*   **`packages/ui`**: Base design system tokens, typography, and reusable layout components.

---

## 6. Execution Workflows

### Running Locally
To launch both applications concurrently in development mode, run from the root directory:
```bash
npm run dev
```
This starts:
- The Storefront: `http://localhost:3000`
- The Admin Portal: `http://localhost:3001/admin`

### Building for Production
To build all applications and packages within the monorepo:
```bash
npm run build
```

### Code Quality & Formatting
Ensure typescript schemas align and lint rules are met:
```bash
npm run lint          # Run ESLint rules check
npm run check-types   # Compile typescript types across the workspace
npm run format        # Code formatter (Prettier)
```
