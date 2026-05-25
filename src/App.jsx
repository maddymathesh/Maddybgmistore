import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ReactLenis } from "lenis/react";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollDownIndicator from "./components/ScrollDownIndicator";
import SocialFloat from "./components/SocialFloat";
import { supabase } from "./utils/supabase";
import { Trophy, Sparkles } from "lucide-react";
import InitialPageLoader from "./components/InitialPageLoader";

let hasIncremented = false;

function launchGoldenConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ["#FFD700", "#FFA500", "#FF8C00", "#EEE8AA", "#B8860B"];
  const particles = [];

  // Emit confetti upwards from the bottom-center
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: width / 2,
      y: height + 20,
      vx: (Math.random() - 0.5) * 22,
      vy: -Math.random() * 18 - 14,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.28,
      drag: 0.98,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    let alive = false;

    particles.forEach((p) => {
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (Math.random() > 0.4) {
          ctx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  animate();
}

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
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const CustomerFeedbackPage = lazy(() => import("./pages/CustomerFeedbackPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const F2FDeal = lazy(() => import("./pages/F2FDeal"));
const EscrowDeal = lazy(() => import("./pages/EscrowDeal"));
const BookingSystem = lazy(() => import("./pages/BookingSystem"));
const F2FSellGuide = lazy(() => import("./pages/F2FSellGuide"));
const NoReturnsPolicy = lazy(() => import("./pages/NoReturnsPolicy"));
const KYCGuide = lazy(() => import("./pages/KYCGuide"));
const PayoutGuide = lazy(() => import("./pages/PayoutGuide"));
const UnlinkingGuide = lazy(() => import("./pages/UnlinkingGuide"));



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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#080A0F",
        fontFamily: "var(--font-h)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Top running cinematic indicator */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, var(--gold), var(--orange), transparent)",
          boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)",
          zIndex: 999999,
          animation: "pageBarSweep 1.8s infinite ease-in-out"
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255, 215, 0, 0.005) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.005) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "center",
          opacity: 0.6,
          pointerEvents: "none"
        }}
      />

      {/* Central HUD elements */}
      <div style={{ position: "relative", textAlign: "center", zIndex: 2 }}>
        {/* Pulsing micro emblem */}
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(255, 215, 0, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.1)",
            animation: "microPulse 1.2s infinite alternate"
          }}
        >
          <Trophy size={18} style={{ color: "var(--gold)", opacity: 0.8 }} />
        </div>

        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase"
          }}
        >
          LOADING CONTENT...
        </div>
      </div>

      <style>{`
        @keyframes pageBarSweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes microPulse {
          0% { transform: scale(0.95); opacity: 0.7; box-shadow: 0 0 10px rgba(255, 215, 0, 0.1); }
          100% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("mbs_intro_loaded");
  });

  // Delay Lenis to avoid blocking initial render
  const [enableSmooth, setEnableSmooth] = useState(false);
  const [celebrationUser, setCelebrationUser] = useState(null);

  useEffect(() => {
    setEnableSmooth(true);

    if (hasIncremented) return;
    hasIncremented = true;



    async function handleViewsFlow() {
      const dbCounted = sessionStorage.getItem("mbs_db_counted");
      let activeCount = 14852;

      try {
        if (!dbCounted) {
          // 1. First load of this browser session -> Write & increment views in Supabase
          const { data, error } = await supabase.rpc("increment_views");
          if (!error && data !== null) {
            activeCount = Number(data);
            localStorage.setItem("mbs_live_views", String(activeCount));
            sessionStorage.setItem("mbs_db_counted", "true");
            window.dispatchEvent(new CustomEvent("mbs_views_updated", { detail: activeCount }));

            if (activeCount % 10 === 0) {
              setCelebrationUser(activeCount);
              setTimeout(launchGoldenConfetti, 400);
            }
          } else {
            // Standard update fallback for Supabase
            const { data: selectData, error: selectError } = await supabase
              .from("site_views")
              .select("count")
              .eq("id", "total_views")
              .single();

            if (!selectError && selectData) {
              activeCount = Number(selectData.count) + 1;
              await supabase.from("site_views").update({ count: activeCount }).eq("id", "total_views");
              localStorage.setItem("mbs_live_views", String(activeCount));
              sessionStorage.setItem("mbs_db_counted", "true");
              window.dispatchEvent(new CustomEvent("mbs_views_updated", { detail: activeCount }));

              if (activeCount % 10 === 0) {
                setCelebrationUser(activeCount);
                setTimeout(launchGoldenConfetti, 400);
              }
            } else {
              throw new Error("Supabase first visit increment failed");
            }
          }
        } else {
          // 2. Already counted in this session -> Simply fetch the count to read
          const { data, error } = await supabase
            .from("site_views")
            .select("count")
            .eq("id", "total_views")
            .single();

          if (!error && data) {
            activeCount = Number(data.count);
            localStorage.setItem("mbs_live_views", String(activeCount));
            window.dispatchEvent(new CustomEvent("mbs_views_updated", { detail: activeCount }));
          } else {
            throw new Error("Supabase subsequent visit fetch failed");
          }
        }
      } catch (err) {
        console.warn("View tracking DB handle fallback triggered:", err.message);

        // 3. LocalStorage Fallback (100% Offline/Quota Safe)
        let localViews = localStorage.getItem("mbs_fallback_views");
        if (!localViews) {
          localViews = "14852";
        }

        if (!dbCounted) {
          activeCount = Number(localViews) + 1;
          localStorage.setItem("mbs_fallback_views", String(activeCount));
          sessionStorage.setItem("mbs_db_counted", "true");
        } else {
          activeCount = Number(localViews);
        }

        localStorage.setItem("mbs_live_views", String(activeCount));
        window.dispatchEvent(new CustomEvent("mbs_views_updated", { detail: activeCount }));

        if (!dbCounted && activeCount % 10 === 0) {
          setCelebrationUser(activeCount);
          setTimeout(launchGoldenConfetti, 400);
        }
      }

    }

    handleViewsFlow();
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

      <SocialFloat />

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
            path="/terms"
            element={
              <Suspense fallback={<PageLoader />}>
                <TermsConditions />
              </Suspense>
            }
          />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<PageLoader />}>
                <PrivacyPolicy />
              </Suspense>
            }
          />
          <Route
            path="/refunds"
            element={
              <Suspense fallback={<PageLoader />}>
                <RefundPolicy />
              </Suspense>
            }
          />
          <Route
            path="/faq"
            element={
              <Suspense fallback={<PageLoader />}>
                <FAQ />
              </Suspense>
            }
          />
          <Route
            path="/feedback"
            element={
              <Suspense fallback={<PageLoader />}>
                <CustomerFeedbackPage />
              </Suspense>
            }
          />
          <Route
            path="/f2f-deal"
            element={
              <Suspense fallback={<PageLoader />}>
                <F2FDeal />
              </Suspense>
            }
          />
          <Route
            path="/escrow-deal"
            element={
              <Suspense fallback={<PageLoader />}>
                <EscrowDeal />
              </Suspense>
            }
          />
          <Route
            path="/booking-system"
            element={
              <Suspense fallback={<PageLoader />}>
                <BookingSystem />
              </Suspense>
            }
          />
          <Route
            path="/f2f-sell-guide"
            element={
              <Suspense fallback={<PageLoader />}>
                <F2FSellGuide />
              </Suspense>
            }
          />
          <Route
            path="/no-returns-policy"
            element={
              <Suspense fallback={<PageLoader />}>
                <NoReturnsPolicy />
              </Suspense>
            }
          />
          <Route
            path="/kyc-guide"
            element={
              <Suspense fallback={<PageLoader />}>
                <KYCGuide />
              </Suspense>
            }
          />
          <Route
            path="/payout-guide"
            element={
              <Suspense fallback={<PageLoader />}>
                <PayoutGuide />
              </Suspense>
            }
          />
          <Route
            path="/unlinking-guide"
            element={
              <Suspense fallback={<PageLoader />}>
                <UnlinkingGuide />
              </Suspense>
            }
          />


          <Route
            path="/pay/:paymentId"
            element={
              <Suspense fallback={<PageLoader />}>
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
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
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

      {celebrationUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8, 10, 15, 0.85)",
            backdropFilter: "blur(10px)",
            animation: "fadeIn 0.4s ease forwards",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "480px",
              background: "linear-gradient(135deg, #111520 0%, #0a0d14 100%)",
              border: "2px solid #FFD700",
              borderRadius: "24px",
              padding: "40px 30px",
              textAlign: "center",
              boxShadow: "0 0 50px rgba(255, 215, 0, 0.25)",
              animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Golden radial background glow */}
            <div style={{ position: "absolute", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)", top: "-100px", left: "90px", zIndex: 0, pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px", animation: "bounce 1s infinite alternate" }}>
                <Trophy size={56} style={{ color: "var(--gold)", filter: "drop-shadow(0 0 10px rgba(255,215,0,0.4))" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 900, color: "var(--gold)", letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" }}>
                Congratulations!
              </h2>
              <p style={{ color: "#fff", fontSize: "16px", fontWeight: 500, lineHeight: 1.6, marginBottom: "20px" }}>
                You are visitor number <span style={{ color: "var(--gold)", fontWeight: 800, fontSize: "22px", textShadow: "0 0 8px rgba(255,215,0,0.4)" }}>{celebrationUser.toLocaleString()}</span> to the Maddy BGMI Store!
              </p>
              <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "30px", maxWidth: "380px", margin: "0 auto 30px" }}>
                South India's most trusted BGMI marketplace since 2019. Thank you for celebrating this milestone with us! <Sparkles size={14} style={{ display: "inline-block", verticalAlign: "middle", color: "var(--gold)", marginLeft: "4px" }} />
              </p>

              <button
                onClick={() => {
                  setCelebrationUser(null);
                  launchGoldenConfetti(); // Play a nice celebratory second burst
                }}
                className="btn btn-gold"
                style={{
                  padding: "12px 35px",
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: "30px",
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                  transition: "transform 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                Awesome, Let's Shop!
              </button>
            </div>

            <style>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
              @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
            `}</style>
          </div>
        </div>
      )}
    </BrowserRouter>
  );

  // Apply Lenis only after initial render
  const mainApp = enableSmooth ? (
    <ReactLenis
      root
      options={{
        duration: 0.5,
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

  return (
    <>
      {mainApp}
      {showIntro && (
        <InitialPageLoader
          onComplete={() => {
            sessionStorage.setItem("mbs_intro_loaded", "true");
            setShowIntro(false);
          }}
        />
      )}
    </>
  );
}