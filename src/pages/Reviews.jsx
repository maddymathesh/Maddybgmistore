import { Link } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Gamepad2, ShoppingCart, Banknote, CheckCircle, Zap,
  Shield, Star, Trophy, Lock, Smartphone, CircleDollarSign
} from "lucide-react";

// 🔥 Lazy load heavy components
const CountUp = lazy(() => import("../components/CountUp"));
const LightRays = lazy(() => import("../components/LightRays"));

export default function Home() {
  // 🔥 Delay heavy UI
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowEffects(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        {/* HERO */}
        <section style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 5% 60px",
          position: "relative",
          overflow: "hidden"
        }}>

          {/* ✅ Optimized Hero Image */}
          <img
            src="/hero-banner.webp"
            alt="BGMI battlefield hero banner"
            loading="eager"
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              zIndex: 0
            }}
          />

          {/* Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, rgba(8,10,15,0.72) 60%, rgba(8,10,15,0.97) 100%)"
          }} />

          {/* 🔥 LightRays (delayed + optimized) */}
          {showEffects && (
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
              <Suspense fallback={null}>
                <LightRays
                  raysOrigin="top-center"
                  raysColor="#FFD700"
                  raysSpeed={1.5}
                  lightSpread={0.8}
                  rayLength={1.2}
                  followMouse={false} // ⚡ important fix
                />
              </Suspense>
            </div>
          )}

          <div style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "820px",
            margin: "0 auto"
          }}>
            <div className="badge">South India's #1 Trusted BGMI Account Marketplace</div>

            <h1 style={{
              fontFamily: "var(--font-h)",
              fontSize: "clamp(42px,8vw,92px)",
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "2px",
              marginBottom: "22px"
            }}>
              Your Dream<br />
              <span className="g">BGMI Account</span><br />
              Awaits
            </h1>

            <p style={{
              color: "var(--muted)",
              fontSize: "clamp(14px,2vw,17px)",
              maxWidth: "560px",
              margin: "0 auto 40px"
            }}>
              Buy and sell verified BGMI accounts safely — budget to premium.
            </p>

            <div style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>
              <Link to="/buy" className="btn btn-gold">
                <ShoppingCart size={15} /> Buy
              </Link>
              <Link to="/sell" className="btn btn-outline">
                <Banknote size={15} /> Sell
              </Link>
            </div>
          </div>
        </section>

        {/* 🔥 STATS (lazy) */}
        {showEffects && (
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-n">
                <Suspense fallback={"2000+"}>
                  <CountUp from={0} to={2000} duration={2} />+
                </Suspense>
              </div>
              <div className="stat-l">Happy Buyers</div>
            </div>

            <div className="stat">
              <div className="stat-n">
                ₹
                <Suspense fallback={"60L"}>
                  <CountUp from={0} to={60} duration={2} />L+
                </Suspense>
              </div>
              <div className="stat-l">Accounts Sold</div>
            </div>
          </div>
        )}

        {/* 🔥 Remaining sections delayed */}
        {showEffects && (
          <>
            {/* Keep your other sections SAME */}
            {/* BUY/SELL, CONNECT, ABOUT, WHY US, CTA */}
          </>
        )}

      </div>
      <Footer />
    </>
  );
}