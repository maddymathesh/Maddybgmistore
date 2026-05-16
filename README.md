# Maddy BGMI Store 🎮

Welcome to the **Maddy BGMI Store**, South India's most trusted marketplace for premium Battlegrounds Mobile India (BGMI) accounts, in-game services, and secure account recovery. Built for speed, security, and a premium user experience, this platform ensures safe transactions and authentic interactions for the BGMI community.

![Maddy BGMI Store Banner](/public/ready-stocks-banner.png) <!-- Update banner path if necessary -->

## 🚀 Features

- **Dynamic Ready Stocks**: Browse real-time inventory of verified BGMI accounts, complete with YouTube video showcases and secure checkout flows.
- **In-Game Services**: Request direct in-game services like UC purchases, X-Suit gifts, and Supercar gifting.
- **Account Management**: Buy, sell, or exchange your BGMI accounts securely.
- **Authentic Reviews**: A dedicated "Reviews & Proofs" section powered by verified tracking IDs and admin-approved screenshots.
- **Admin Dashboard**: Secure Firebase-backed admin panel to manage products, reviews, and dynamic, one-time payment links.
- **Premium UI/UX**: Cinematic, dark-themed aesthetic with `Lenis` smooth scrolling and `GSAP`/`Framer Motion` animations.
- **PWA Ready**: Optimized as a Progressive Web App for a native app-like mobile experience.

## 🛠️ Tech Stack

This project is built using modern web development tools:

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom CSS Modules
- **Animations & Scrolling**: [Lenis](https://lenis.studiofreight.com/), [GSAP](https://greensock.com/gsap/), & [Motion](https://motion.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Hosting)
- **Deployment**: [Vercel](https://vercel.com/) / Firebase Hosting

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MBSxWebsite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory based on the provided `env.example`. You will need to configure your Firebase project credentials.
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

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── assets/             # Global assets
│   ├── components/         # Reusable UI components (Navbar, Footer, Forms)
│   ├── context/            # React Context providers (AuthContext)
│   ├── pages/              # Application routes (Home, Buy, Sell, Reviews)
│       └── admin/          # Admin Dashboard routes
│   ├── styles/             # Global styles and tailwind configs
│   ├── App.jsx             # Main application component & routing
│   ├── firebase.js         # Firebase initialization & exports
│   └── main.jsx            # React DOM entry point
├── .env                    # Environment variables (do not commit!)
├── firebase.json           # Firebase hosting & rules configuration
├── firestore.rules         # Security rules for Firestore database
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite bundler configuration
```

## 🔒 Security & Admin Access

Access to the `/admin` dashboard is strictly controlled.
- A user must be authenticated via Firebase Auth.
- Their UID must match the `VITE_ADMIN_UID` or `VITE_ADMIN_UID_2` specified in your `.env` file.
- Firestore security rules (`firestore.rules`) enforce write operations strictly to these admin UIDs, ensuring that even if the frontend logic is bypassed, the database remains secure.

## 📜 Deployment

The project is configured for deployment on Vercel and Firebase Hosting.

**Vercel:**
The repository includes a `vercel.json` file designed to handle React Router's client-side routing. Vercel automatically detects the Vite build commands.

**Firebase Hosting:**
You can deploy directly to Firebase using the Firebase CLI:
```bash
npm run build
firebase deploy --only hosting
```

---

<div align="center">
  <i>Made with ❤️ in South India for the BGMI Community.</i>
</div>
