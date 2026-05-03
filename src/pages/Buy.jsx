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
            <div className="badge" style={{ marginBottom: "20px" }}>
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", 
            gap: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
            alignItems: "stretch" 
          }}>
            {/* OPTION 1: READY SECURED ACCOUNTS */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none" }}>
                  <Star size={11} fill="#fff" /> OPTION 1
                </span>
                <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(24px,4vw,32px)" }}>Ready Stocks</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px", minHeight: "44px" }}>
                Browse our verified, ready-to-play accounts. New listings posted regularly. Buy instantly via WhatsApp or Telegram.
              </p>

              <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "18px", padding: "32px", marginBottom: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  {[
                    [<Gamepad2 size={16} />, "Watch the account Inventory video", "Check Gun Labs, cars, and outfits."],
                    [<Lock size={16} />, "Check login & price details", "Verified and secured account credentials."],
                    [<ShoppingCart size={16} />, "Click Buy Now button", "Direct access to WhatsApp or Telegram."],
                    [<MessageCircle size={16} />, "Book with 10% Advance", "Secure your account instantly (Non-refundable)."],
                    [<Banknote size={16} />, "Complete the Payment", "UPI, Bank Transfer, USDT, or Wise."],
                    [<Shield size={16} />, "Fast Account Handover", "Secure transfer to your phone and email."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i}>
                      <div className="step-text">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "2px" }}>
                          {icon} <strong style={{ fontSize: "15px" }}>{title}</strong>
                        </div>
                        <small style={{ display: "block", color: "var(--muted)", fontSize: "12px" }}>{desc}</small>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link to="/readystocks" className="btn btn-gold" style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}>
                  <Gamepad2 size={18} /> View Ready Stocks →
                </Link>
              </div>
            </div>

            {/* OPTION 2: CUSTOM REQUIREMENT */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", border: "none" }}>
                  <Flame size={11} fill="#fff" /> OPTION 2
                </span>
                <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(24px,4vw,32px)" }}>Custom Search</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px", minHeight: "44px" }}>
                Get a personalized BGMI account based on your exact budget and preferences.
              </p>

              <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "18px", padding: "32px", marginBottom: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  {[
                    [<Target size={16} />, "Share Requirements & Budget", "Tell us exactly what you need."],
                    [<Banknote size={16} />, "Pay Advance (₹500 - ₹1000)", "Wait 24-48 hours for our search results."],
                    [<Gamepad2 size={16} />, "Review the Options", "We find the best accounts matching your specs."],
                    [<MessageCircle size={16} />, "Finalize & Book", "Talk with us to lock your choice with 10%."],
                    [<Banknote size={16} />, "Pay the Remaining Balance", "Secure payment via any trusted method."],
                    [<Shield size={16} />, "Secure Account Delivery", "Full access transferred to your own details."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i}>
                      <div className="step-text">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "2px" }}>
                          {icon} <strong style={{ fontSize: "15px" }}>{title}</strong>
                        </div>
                        <small style={{ display: "block", color: "var(--muted)", fontSize: "12px" }}>{desc}</small>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="https://wa.me/+919025391516?text=Hi!%20I%20have%20a%20custom%20BGMI%20account%20requirement." target="_blank" rel="noreferrer" className="btn btn-green" style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}>
                  <MessageCircle size={18} /> Request Custom Account →
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
