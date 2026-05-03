import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollDownIndicator from "./components/ScrollDownIndicator";
import WhatsAppFloat from "./components/WhatsAppFloat";

// ── Lazy-loaded pages (code splitting per route) ─────────────
const Home          = lazy(() => import("./pages/Home"));
const Buy           = lazy(() => import("./pages/Buy"));
const Sell          = lazy(() => import("./pages/Sell"));
const Recovery      = lazy(() => import("./pages/Recovery"));
const Reviews       = lazy(() => import("./pages/Reviews"));
const ConnectWithUs = lazy(() => import("./pages/ConnectWithUs"));
const ReadyStocks   = lazy(() => import("./pages/ReadyStocks"));
const Login         = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Minimal full-screen loading state
function ScrollToTop() {
  const { pathname } = useLocation();
  // console.log(pathname)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#0a0c14",
    }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        border: "3px solid rgba(255,215,0,0.15)",
        borderTopColor: "#FFD700",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111520",
            color: "#EAEAEA",
            border: "1px solid rgba(255,215,0,0.2)",
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <ScrollDownIndicator />
        <WhatsAppFloat />
        <Routes>
          {/* Public Pages */}
          <Route path="/"             element={<Home />} />
          <Route path="/buy"          element={<Buy />} />
          <Route path="/sell"         element={<Sell />} />
          <Route path="/recovery"     element={<Recovery />} />
          <Route path="/reviews"      element={<Reviews />} />
          <Route path="/connectwithus" element={<ConnectWithUs />} />
          <Route path="/readystocks"  element={<ReadyStocks />} />
          <Route path="/login"        element={<Login />} />

          {/* Admin - Firebase protected */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

