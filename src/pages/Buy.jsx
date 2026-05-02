import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";
import {
  ShoppingCart, Lock, Banknote, CheckCircle,
  MessageCircle, Target, Shield, Gamepad2, Flame, Star
} from "lucide-react";

export default function Buy() {
  return (
    <>
      <Navbar />
      <Ticker />
      <div style={{ paddingTop: "84px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          height: "clamp(320px, 55vw, 560px)",
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

        {/* ── OPTION 1: READY SECURED ACCOUNTS ───── */}
        <section className="section-alt">
          <div style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
              <span style={{
                background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff",
                fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "100px",
                fontFamily: "var(--font-h)", letterSpacing: "1px",
                display:"inline-flex", alignItems:"center", gap:"5px",
              }}><Star size={11} /> OPTION 1</span>
              <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(22px,4vw,36px)" }}>Ready Secured Accounts</h2>
            </div>
            <p className="ssub" style={{ marginBottom: "24px" }}>
              Browse our verified, ready-to-play accounts. New listings posted regularly. Buy instantly via WhatsApp or Telegram.
            </p>

            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "14px", padding: "28px 32px", marginBottom: "24px" }}>
              <ol className="steps-list">
                {[
                  [<Gamepad2 size={16} />, "Watch the account Inventory video and description", ""],
                  [<Lock size={16} />, "Check the login and price details mentioned", ""],
                  [<ShoppingCart size={16} />, "Click Buy now on using whats app or telegram button", ""],
                  [<MessageCircle size={16} />, "Talk With Our Seller and Book The Account with 10% Advance of the accoutn worth", "(Booking Amount willl not refunded once booked)"],
                  [<Banknote size={16} />, "Pay the Remaing Amount", "(UPI,BANK TRAnssfer,usdt,wise Transfer and Share a Screenshot after payment)"],
                  [<Shield size={16} />, "Share Your Phone and Email", "To give the account safe seculry to your accesss"],
                ].map(([icon, title, desc], i) => (
                  <li key={i}>
                    <div className="step-text">
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"var(--gold)" }}>{icon} <strong>{title}</strong></span>
                      <small>{desc}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <Link to="/readystocks" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "14px 32px", borderRadius: "10px",
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
              fontSize: "15px", textDecoration: "none", letterSpacing: "0.5px",
              transition: "opacity .2s, transform .2s",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Gamepad2 size={17} /> View Ready to Play Secured Accounts →
            </Link>
          </div>
        </section>

        {/* ── OPTION 2: CUSTOM REQUIREMENT ─────────── */}
        <section className="section">
          <div style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
              <span style={{
                background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff",
                fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "100px",
                fontFamily: "var(--font-h)", letterSpacing: "1px",
                display:"inline-flex", alignItems:"center", gap:"5px",
              }}><Flame size={11} /> OPTION 2</span>
              <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(22px,4vw,36px)" }}>Custom Requirement Account</h2>
            </div>
            <p className="ssub" style={{ marginBottom: "24px" }}>
              Get a personalized BGMI account based on your exact budget and preferences.
            </p>

            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "14px", padding: "28px 32px", marginBottom: "24px" }}>
              <ol className="steps-list">
                {[
                  [<Target size={16} />, "share your Requirments and Budget", "(Requirments Should be according to budget)"],
                  [<Banknote size={16} />, "Pay The Advance Payment and wait for 24 - 48hrs", ""],
                  [<Gamepad2 size={16} />, "We will find give the reqiment and give to u", ""],
                  [<MessageCircle size={16} />, "Talk With Our Seller and Book The Account with 10% Advance of the accoutn worth", ""],
                  [<Banknote size={16} />, "Pay the Remaing Amount", "(UPI,BANK TRAnssfer,usdt,wise Transfer and Share a Screenshot after payment)"],
                  [<Shield size={16} />, "Share Your Phone and Email", "To give the account safe seculry to your accesss"],
                ].map(([icon, title, desc], i) => (
                  <li key={i}>
                    <div className="step-text">
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"6px", color:"var(--gold)" }}>{icon} <strong>{title}</strong></span>
                      <small>{desc}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <a
              href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20a%20custom%20BGMI%20account.%20My%20budget%20is%20₹"
              target="_blank" rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "14px 32px", borderRadius: "10px",
                background: "#22C55E",
                color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "15px", textDecoration: "none", letterSpacing: "0.5px",
                transition: "opacity .2s, transform .2s",
                boxShadow: "0 4px 20px rgba(34,197,94,0.3)",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <MessageCircle size={17} /> Request Custom Account on WhatsApp →
            </a>
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
