import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReactLenis } from "lenis/react";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollDownIndicator from "./components/ScrollDownIndicator";
import WhatsAppFloat from "./components/WhatsAppFloat";

// ── Lazy-loaded pages ─────────────
const Home = lazy(() => import("./pages/Home"));
const Buy = lazy(() => import("./pages/Buy"));
const Sell = lazy(() => import("./pages/Sell"));
const Exchange = lazy(() => import("./pages/Exchange"));
const UCPurchase = lazy(() => import("./pages/services/UCPurchase"));
const XsuitGift = lazy(() => import("./pages/services/XsuitGift"));
const SupercarGift = lazy(() => import("./pages/services/SupercarGift"));
const Recovery = lazy(() => import("./pages/Recovery"));
const Reviews = lazy(() => import("./pages/Reviews"));
const ProofAndFeedback = lazy(() => import("./pages/ProofAndFeedback"));
const ConnectWithUs = lazy(() => import("./pages/ConnectWithUs"));
const ReadyStocks = lazy(() => import("./pages/ReadyStocks"));
const Login = lazy(() => import("./pages/Login"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function DefaultLayout() {
  return (
    <>
      <Outlet />
      <ScrollDownIndicator />
    </>
  );
}

// Loader (kept same)
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0c14",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid rgba(255,215,0,0.15)",
          borderTopColor: "#FFD700",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  // Delay Lenis to avoid blocking initial render
  const [enableSmooth, setEnableSmooth] = useState(false);

  useEffect(() => {
    setEnableSmooth(true);
  }, []);

  const AppContent = (
    <BrowserRouter>
      <ScrollToTop />

      {/* Global UI (NOT blocked anymore) */}
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

      <WhatsAppFloat />

      <Routes>
        <Route element={<DefaultLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/buy"
            element={
              <Suspense fallback={<PageLoader />}>
                <Buy />
              </Suspense>
            }
          />
          <Route
            path="/sell"
            element={
              <Suspense fallback={<PageLoader />}>
                <Sell />
              </Suspense>
            }
          />
          <Route
            path="/exchange"
            element={
              <Suspense fallback={<PageLoader />}>
                <Exchange />
              </Suspense>
            }
          />
          <Route
            path="/services/uc"
            element={
              <Suspense fallback={<PageLoader />}>
                <UCPurchase />
              </Suspense>
            }
          />
          <Route
            path="/services/xsuit"
            element={
              <Suspense fallback={<PageLoader />}>
                <XsuitGift />
              </Suspense>
            }
          />
          <Route
            path="/services/supercar"
            element={
              <Suspense fallback={<PageLoader />}>
                <SupercarGift />
              </Suspense>
            }
          />
          <Route
            path="/recovery"
            element={
              <Suspense fallback={<PageLoader />}>
                <Recovery />
              </Suspense>
            }
          />
          <Route
            path="/reviews"
            element={
              <Suspense fallback={<PageLoader />}>
                <Reviews />
              </Suspense>
            }
          />
          <Route
            path="/proofs"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProofAndFeedback />
              </Suspense>
            }
          />
          <Route
            path="/connectwithus"
            element={
              <Suspense fallback={<PageLoader />}>
                <ConnectWithUs />
              </Suspense>
            }
          />
          <Route
            path="/readystocks"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReadyStocks />
              </Suspense>
            }
          />

              <Route
            path="/pay/:paymentId"
            element={
              <Suspense fallback={ <PageLoader />}>
                <PaymentPage />
              </Suspense>
            }
          />

          {/* Protected route */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/transactions"
          element={
            <Suspense fallback={<PageLoader />}>
              <Transactions />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );

  // Apply Lenis only after initial render
  return enableSmooth ? (
    <ReactLenis
      root
      options={{
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
      }}
    >
      {AppContent}
    </ReactLenis>
  ) : (
    AppContent
  );
}