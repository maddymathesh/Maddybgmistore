# Maddy BGMI Store 🎮

Welcome to the **Maddy BGMI Store**, South India's most trusted, premium, and secure marketplace for Battlegrounds Mobile India (BGMI) accounts, premium in-game assets, and direct gaming services. Since 2019, we have built a reputation for high-fidelity trading, cinematic UX, and uncompromised cybersecurity.

This repository hosts a full-stack, enterprise-ready web application utilizing a **dual-database sync system** (Supabase + Firebase) alongside high-performance edge architectures, customized Progressive Web App (PWA) utilities, and dynamic visual layouts.

---

## 🚀 Key Modules & Customer Experience

The platform is designed to provide gamers with an elite, friction-free journey across multiple dedicated pages:

*   **Ready Stocks Marketplace (`/readystocks`)**: A real-time inventory engine featuring filtered lists of premium accounts. Every listing includes a YouTube video showcase link, rich account parameters, and a sleek checkout CTA.
*   **Comprehensive Direct Services**:
    *   **UC Purchase (`/services/uc`)**: Seamless ordering for in-game UC packages at discounted rates.
    *   **X-Suit gifting (`/services/xsuit`)**: Request and coordinate gifts for rare X-Suits.
    *   **Supercars gifting (`/services/supercar`)**: Catalog listing for high-tier sportscar and SUV gifting.
*   **Booking System & Face-to-Face Escrows**:
    *   **F2F Deal Room (`/f2f-deal`)** & **F2F Guide (`/f2f-sell-guide`)**: Support for physical/in-person localized transitions.
    *   **Escrow System (`/escrow-deal`)**: Secure middleman-assisted trades preventing buyer/seller scams.
    *   **Booking System (`/booking-system`)**: Booking queue for customized orders or personal admin consultations.
*   **Tactical Safety & Operational Guides**:
    *   **KYC Portal (`/kyc-guide`)**: Outlining safe compliance rules to verify users.
    *   **Payout Guide (`/payout-guide`)**: Step-by-step documentation on how sellers receive payouts.
    *   **Unlinking Guide (`/unlinking-guide`)**: Tactical guide on how to safely unlink game credentials (Twitter, Facebook, Google Play, Apple ID) without leaving recovery backdoors.
    *   **No Returns & Policies (`/no-returns-policy`, `/terms`, `/privacy`, `/refunds`)**: Legal safeguards protecting the digital store from fraudulent chargebacks.
*   **Authentic Reviews & Proofs (`/reviews`, `/proofs`)**: A verified feedback timeline powered by approved transactions, user rating distributions, and admin-approved transaction screenshot cards.

---

## 🔒 Enterprise-Grade Admin Dashboards

Access to our administration panels is strictly gated behind Firebase Authentication and backed by automated, serverless authorization flows.

### 1. Dynamic Stock Admin Panel (`/admin`)
An advanced command center enabling store managers to control the storefront dynamically:
*   **Manage Stock**: Direct additions, edits, and deletions of BGMI accounts (complete with Cloudinary image arrays, YouTube showcase URLs, and login types).
*   **Order Tracking**: View and triage incoming orders, services requests, and recovery applications.
*   **Review Moderation**: Admin interface to approve, archive, or reject incoming customer reviews before they are made public.
*   **Description Maker**: Integrated text template generator designed to output standard, eye-catching copy for social media and Telegram broadcasts.

### 2. Advanced Transactions Hub (`/transactions`)
A financial and logistics command dashboard designed for live operations:
*   **Financial Overview**: Interactive cash flow charts, revenue trends, and dynamic transaction summaries (categorized by UC, Supercar, X-Suit, and Account Sales).
*   **Real-time Transactions Manager**: Instantly generate PIN-secured single-use payment checkouts, modify transaction states (`active`, `paid`, `expired`, `revoked`), and view customer details.
*   **Admin Activity Log**: Auditing logs tracking administrative changes (e.g., product updates, payment configurations, or newly registered support staff).
*   **Customer & Guarantees Catalog**: Centralized directories detailing active customer profiles and warranties.
*   **Tasks & Alerts Panel**: Sticky notes and system-level alerts indicating pending orders or failed payment checkouts.
*   **Settings Control**: Instantly customize the default store-wide UPI ID, bank details, and payment link expiration timers.

---

## 🛡️ Hardened Security & Anti-Brute Defenses

Our transactional backend runs strictly isolated inside **Firebase Cloud Functions (V2)** to guarantee total payment flow integrity:

*   **JWT-Signed Payment Tokens**: When an admin generates a payment link, the server constructs an immutable `accessToken` signed with a secure, 32-character `HS256` token key (`PAYMENT_JWT_SECRET`). The client cannot modify payment amounts, customer names, or destination UPI details.
*   **Brute-Force Lockout Defense**: Each checkout link requires a unique, administrator-defined **4 to 6-digit PIN**. To prevent automated dictionary attacks:
    *   Every failed attempt increments a `failedAttempts` counter directly in the Firebase transactional doc.
    *   Upon reaching **5 failed PIN attempts**, the cloud function permanently transitions the payment status to `revoked`, sets a `revokedReason` of `too_many_failed_attempts`, and locks out the user.
*   **Strict Firestore Security Rules**: Database integrity is enforced at the network boundaries. Writing or changing products, settings, or admin roles is restricted to accounts possessing custom JWT `{ admin: true }` claims or explicitly whitelisted UIDs inside `.env` configurations.

---

## 📊 Dual-Database Architecture

To benefit from the best properties of both technologies, the system implements a high-performance hybrid storage layout:

| Database | Managed Datasets & Responsibilities | Security Enforcement |
|:---|:---|:---|
| **Firebase / Firestore** | • Dynamic Admin Users & Role Claims<br>• Temporary Payment Links & Settings<br>• Serverless Cloud Functions (Auth validation, lockout) | **Firestore Security Rules (`firestore.rules`)** gates direct writes; custom JWT claims block unauthenticated access. |
| **Supabase (PostgreSQL)** | • Store Catalog (Products, UC prices, Gifts)<br>• Feedback & Star Ratings<br>• Approved reviews & month-by-month Proof image URLs<br>• Global view analytics (`site_views` table) | **Row Level Security (RLS)**. Public can perform reads & inserts (reviews default to `status = 'pending'`). Writes require a custom `x-maddy-admin-token` header. |

---

## ⚡ Performance, Build & PWA Stack

Built using **Vite 7** and **Tailwind CSS v4**, the application is optimized for sub-second load times on mobile connections:

*   **Brotli & Gzip Compression**: Build pipeline generates dual Brotli (`.br`) and Gzip (`.gz`) pre-compressed build chunks to reduce transfer sizes.
*   **Fine-Grained Rollup Split**: Manual Rollup chunk splitting separates framework components into individual cached vendors (`vendor-react`, `vendor-firebase`, `vendor-motion`, `vendor-gsap`, etc.), allowing lazyloaded page chunks to download immediately.
*   **Advanced PWA Setup (`vite-plugin-pwa`)**:
    *   **AutoUpdate**: Automated service worker lifecycle updates.
    *   **Runtime Cache Policies**: Google Fonts are stored locally via `CacheFirst`. Firebase product images and Supabase API payloads use a custom `StaleWhileRevalidate` strategy, enabling offline listing views.
*   **Production Log Stripper**: Build files strip away all standard `console.*` statements automatically inside production environments, enhancing security.
*   **Image Optimizer**: Assets are automatically compressed (82% png/jpeg/webp quality, 72% avif quality) using `vite-plugin-image-optimizer`.
*   **Cinematic Motion & Animations**: Visuals are controlled via **Lenis** smooth scrolling, **GSAP**, and **Framer Motion**, delivering micro-interactions that feel premium and modern.

---

## 🔍 SEO & Resiliency Controls

To drive organic growth and maintain uninterrupted operations:

1.  **Dynamic SEO Meta Engine (`usePageMeta`)**: A customized React hook dynamically updates titles, standard description tags, and OpenGraph (OG) properties (`og:title`, `og:description`, `og:url`) on route changes, enabling granular crawling.
2.  **Milestone Celebration popups**: Integrated with Supabase, visiting counts increment atomically. Hits on milestones (e.g., multiples of 10) trigger canvas-drawn golden confetti bursts to increase engagement.
3.  **High-Fidelity Error Boundaries**: A comprehensive custom `ErrorBoundary` component wraps our page templates. If any child component encounters a runtime crash, it intercepts the exception and serves a cinematic, dark-themed fallback interface with recovery prompts, maintaining app uptime.

---

## 📂 Project Structure

```text
MBS Webapp/
├── frontend/                    # Vite + React 18 Application
│   ├── src/
│   │   ├── assets/              # Static media (emblems, logos, banner images)
│   │   ├── components/          # Global UI components (Navbar, Footer, ErrorBoundary, Loader)
│   │   ├── context/             # React Context Providers (AuthContext)
│   │   ├── hooks/               # Custom React hooks (usePageMeta)
│   │   ├── lib/                 # Third-party library initializations
│   │   ├── pages/               # Route components
│   │   │   ├── admin/           # Standard admin views (Stock, Reviews, Orders)
│   │   │   ├── services/        # Services catalogs (UC, X-Suit, Supercar)
│   │   │   └── Transactions/    # Financial & transaction management hub
│   │   ├── services/            # Direct Firebase & Supabase API functions
│   │   ├── store/               # Zustand global state modules
│   │   ├── styles/              # Global CSS & Tailwind CSS v4 configurations
│   │   ├── utils/               # Supabase and utility configurations
│   │   ├── App.jsx              # Application router & main bootstrap
│   │   └── main.jsx             # React entry point
│   ├── public/                  # Static web resources (icons, manifest configuration)
│   ├── index.html               # Main HTML wrapper
│   ├── vite.config.js           # Production-optimized Vite bundler config
│   ├── vercel.json              # Vercel SPA routing fallback rules
│   └── package.json             # Frontend script, assets & dependencies
│
├── backend/                     # Database schemas & serverless functions
│   ├── functions/               # Firebase Cloud Functions (V2 Node.js)
│   │   ├── index.js             # API routes (JWT signer, Lockouts, Admin managers)
│   │   └── package.json         # Node.js dependencies
│   ├── supabase/                # PostgreSQL schemas
│   └── sql/                     # Supabase SQL initialization & security setups
│
├── README.md                    # Main Project Documentation
└── .env                         # Master configuration (git-ignored)
```

---

## 💻 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) v18+ and `npm`
*   [Firebase CLI](https://firebase.google.com/docs/cli) installed globally (`npm install -g firebase-tools`)
*   Active Firebase and Supabase project instances

### 1. Environment Configurations

Create a `.env` file in the root of the project (or inside `frontend/`) and set up your system tokens:

```env
# Firebase Client SDK Credentials
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=bgmistore-XXXX.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bgmistore-XXXX
VITE_FIREBASE_STORAGE_BUCKET=bgmistore-XXXX.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=909XXXXXXXX
VITE_FIREBASE_APP_ID=1:909XXXX:web:8cXXXXXX
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX

# Whitelisted Super Admin UIDs (Firebase Authentication)
VITE_ADMIN_UID=yJDe1mSh28W1nfoVifZSomR6TiO2
VITE_ADMIN_UID_2=FOv8lMfou9cy6QPtaep5zF2qiP92

# Supabase Configurations
VITE_SUPABASE_URL=https://jpndxwivezindljsgtgo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XXXX...
VITE_SUPABASE_ADMIN_TOKEN=mbs_admin_supabase_token_2026_xyz

# Cloudinary Integration
VITE_CLOUDINARY_CLOUD_NAME=dkvyv4ooq
VITE_CLOUDINARY_UPLOAD_PRESET=mbs_reviews

# Google Sheets Analytics & Apps Script
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX...
VITE_APPS_SCRIPT_API_KEY=mbs_secure_api_key_2026_xyz
```

### 2. Frontend Installation & Local Server

To install packages and run the client-side server locally:

```bash
cd frontend
npm install
npm run dev
```

The app will mount at `http://localhost:5173`.

### 3. Serverless Cloud Functions Setup

Install dependencies and start emulator or deploy:

```bash
cd backend/functions
npm install
```

To deploy rules and functions to live environment:

```bash
cd backend
firebase deploy --only functions
firebase deploy --only firestore:rules
```

---

<div align="center">
  <i>Made with ❤️ in South India for the Global BGMI Community.</i>
</div>
