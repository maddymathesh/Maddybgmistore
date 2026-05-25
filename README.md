# Maddy BGMI Store 🎮

Welcome to the **Maddy BGMI Store**, South India's most trusted marketplace for premium Battlegrounds Mobile India (BGMI) accounts, in-game services, and secure account recovery. Built for speed, security, and a premium user experience, this platform ensures safe transactions and authentic interactions for the BGMI community.

## 🚀 Features

- **Dynamic Ready Stocks**: Browse real-time inventory of verified BGMI accounts, complete with YouTube video showcases and secure checkout flows.
- **In-Game Services**: Request direct in-game services like UC purchases, X-Suit gifts, and Supercar gifting.
- **Account Management**: Buy, sell, or exchange your BGMI accounts securely.
- **Authentic Reviews**: A dedicated "Reviews & Proofs" section powered by verified tracking IDs and admin-approved screenshots.
- **Admin Dashboard**: Secure Firebase-backed admin panel to manage products, reviews, and dynamic, one-time payment links.
- **Premium UI/UX**: Cinematic, dark-themed aesthetic with `Lenis` smooth scrolling and `GSAP`/`Framer Motion` animations.
- **PWA Ready**: Optimized as a Progressive Web App for a native app-like mobile experience.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | [React 18](https://react.dev/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS |
| **Animations** | [Lenis](https://lenis.studiofreight.com/), [GSAP](https://greensock.com/gsap/), [Framer Motion](https://motion.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Auth & Database** | [Firebase](https://firebase.google.com/) (Auth, Firestore) |
| **Serverless Functions** | [Firebase Cloud Functions](https://firebase.google.com/docs/functions) |
| **Secondary DB** | [Supabase](https://supabase.com/) (Payment links, feedback) |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend) / Firebase (Functions) |

## 📂 Project Structure

The project is split into two top-level directories — **`frontend/`** and **`backend/`** — for a clean separation of concerns.

```text
MBS Webapp/
├── frontend/                    # React/Vite web application
│   ├── src/
│   │   ├── assets/              # Global assets (images, fonts)
│   │   ├── components/          # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/             # React Context providers (AuthContext)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Third-party library configs
│   │   ├── pages/               # Route-level page components
│   │   │   └── admin/           # Admin Dashboard routes
│   │   ├── services/            # API & Firebase service functions
│   │   ├── store/               # Zustand global state
│   │   ├── styles/              # Global CSS & Tailwind config
│   │   ├── App.jsx              # Root component & routing
│   │   ├── firebase.js          # Firebase initialization
│   │   └── main.jsx             # React DOM entry point
│   ├── public/                  # Static assets (icons, images)
│   ├── index.html               # HTML entry point
│   ├── vite.config.js           # Vite bundler configuration
│   ├── vercel.json              # Vercel deployment config
│   ├── package.json             # Frontend dependencies
│   └── .env                     # Frontend environment variables (do not commit!)
│
├── backend/                     # Server-side & database layer
│   ├── functions/               # Firebase Cloud Functions
│   │   ├── index.js             # Cloud Functions entry point
│   │   └── package.json         # Functions dependencies
│   ├── supabase/                # Supabase SQL migrations
│   │   ├── payment_links.sql
│   │   └── supabase_security_hardening.sql
│   ├── sql/                     # Additional database setup scripts
│   │   ├── complete_supabase_setup.sql
│   │   ├── feedback_setup.sql
│   │   ├── payment_settings_setup.sql
│   │   ├── bgmi_description_maker_setup.sql
│   │   └── supabase_setup.sql
│   ├── firestore.rules          # Firestore security rules
│   ├── firebase.json            # Firebase hosting & functions config
│   └── .firebaserc              # Firebase project alias
│
├── .gitignore
└── README.md
```

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli) — for backend deployment

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "MBS Webapp"
```

### 2. Set Up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` based on `env.example`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_ADMIN_UID=your_admin_uid_here
VITE_ADMIN_UID_2=your_secondary_admin_uid_here
```

### 3. Set Up the Backend (Cloud Functions)

```bash
cd backend/functions
npm install
```

### 4. Run the Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🔒 Security & Admin Access

Access to the `/admin` dashboard is strictly controlled:
- The user must be authenticated via **Firebase Auth**.
- Their UID must match `VITE_ADMIN_UID` or `VITE_ADMIN_UID_2` in your `.env` file.
- **Firestore security rules** (`backend/firestore.rules`) enforce this at the database level — even if frontend logic is bypassed, all writes are rejected for unauthorized users.

## 📜 Deployment

### Frontend → Vercel

The `frontend/vercel.json` handles React Router's client-side routing. In your Vercel project settings, set the **Root Directory** to `frontend`.

```bash
# Vercel auto-detects Vite — just push to your connected branch
```

### Backend → Firebase

Deploy Cloud Functions and Firestore rules from inside `backend/`:

```bash
cd backend
firebase deploy --only functions
firebase deploy --only firestore:rules
```

---

<div align="center">
  <i>Made with ❤️ in South India for the BGMI Community.</i>
</div>
