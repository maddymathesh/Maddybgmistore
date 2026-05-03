import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShoppingCart, Lock, Banknote, CheckCircle,
  MessageCircle, Target, Shield, Gamepad2, Flame, Star
} from "lucide-react";

export default function Buy() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "95vh",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Background image */}
          <img
            src="/buy-banner.jpg"
            alt="BGMI Battlefield" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.7)",
            }}
          />
          {/* Gradient overlays — top + bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.95) 100%)",
          }} />
          {/* Top-left vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "780px",
          }}>
            <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
              <ShoppingCart size={14} /> Buy BGMI Accounts
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(32px,5.5vw,68px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}>
              Choose Your<br />
              <span style={{ color: "var(--gold)" }}>Account</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,18px)",
              maxWidth: "560px", margin: "0 auto 28px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Custom-built for your preferences or ready to purchase instantly — we have both.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/readystocks" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "13px 28px", borderRadius: "10px",
                background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              }}>
                <Gamepad2 size={16} /> Ready Stock Accounts
              </Link>
              <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20a%20custom%20BGMI%20account."
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "13px 28px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
                }}>
                <MessageCircle size={16} /> Custom Account
              </a>
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID ─────────────────────────────────── */}
        <section className="section">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", 
            gap: "32px",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            {/* OPTION 1: READY SECURED ACCOUNTS */}
            <div style={{ background:"var(--card)", border:"1px solid var(--border-gold)", borderRadius:"18px", overflow:"hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding:"28px 32px 20px" }}>
                <span className="badge-tag" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>⭐ Option 1</span>
                <h2 className="stitle" style={{ marginTop:"12px", fontSize: "24px" }}>Ready Stocks</h2>
                <p style={{ color:"var(--muted)", fontSize: "14px" }}>Browse our verified, ready-to-play accounts. New listings posted regularly.</p>
              </div>
              <div style={{ padding:"0 32px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  <li><div className="step-text">🎥 <strong>Watch Video</strong><small>Check inventory, Gun Labs & price details.</small></div></li>
                  <li><div className="step-text">💬 <strong>Book Now</strong><small>Pay 10% advance to book your dream account.</small></div></li>
                  <li><div className="step-text">💰 <strong>Complete Pay</strong><small>Pay remaining via UPI, Bank, or USDT.</small></div></li>
                  <li><div className="step-text">🛡️ <strong>Fast Handover</strong><small>Safe transfer to your phone and email.</small></div></li>
                </ol>
                <Link to="/readystocks" className="btn" style={{ marginTop:"24px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff" }}>
                  <Gamepad2 size={16} style={{ marginRight: "8px" }} /> View Ready Stocks
                </Link>
              </div>
            </div>

            {/* OPTION 2: CUSTOM REQUIREMENT */}
            <div style={{ background:"var(--card)", border:"1px solid var(--border-gold)", borderRadius:"18px", overflow:"hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding:"28px 32px 20px" }}>
                <span className="badge-tag" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}>🔥 Option 2</span>
                <h2 className="stitle" style={{ marginTop:"12px", fontSize: "24px" }}>Custom Search</h2>
                <p style={{ color:"var(--muted)", fontSize: "14px" }}>Get a personalized BGMI account based on your exact budget and specs.</p>
              </div>
              <div style={{ padding:"0 32px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  <li><div className="step-text">📝 <strong>Share Specs</strong><small>Tell us your requirements and budget.</small></div></li>
                  <li><div className="step-text">💰 <strong>Advance Pay</strong><small>Small deposit to start the custom search.</small></div></li>
                  <li><div className="step-text">🔍 <strong>We Find It</strong><small>We scan the market to find your perfect match.</small></div></li>
                  <li><div className="step-text">✅ <strong>Finalize</strong><small>Pay the balance and get your custom account.</small></div></li>
                </ol>
                <a href="https://wa.me/+919025391516?text=Hi!%20I%20have%20a%20custom%20BGMI%20account%20requirement." target="_blank" rel="noreferrer" className="btn btn-green" style={{ marginTop:"24px" }}>
                  <MessageCircle size={16} style={{ marginRight: "8px" }} /> Share Requirements
                </a>
              </div>
            </div>
          </div>
        </section>


        {/* WHY TRUST US */}
        <section className="section-alt">
          <h2 className="stitle" style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <Shield size={28} style={{ color:"var(--gold)" }} /> Why Trust Maddy Store?
          </h2>
          <div className="why-grid" style={{ maxWidth: "800px" }}>
            {["100% Trusted Deals", "Safe & Secure Transfers", "Verified Support Team", "Fast Delivery After Payment"].map(w => (
              <div key={w} className="why-item">
                <div className="why-check"><CheckCircle size={16} /></div>
                <span>{w}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "32px" }}>
            <a href="https://wa.me/+919025391516?text=Hi!%20I%20need%20help%20with%20buying%20a%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px" }}>
              <MessageCircle size={15} /> Contact Us on WhatsApp
            </a>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
