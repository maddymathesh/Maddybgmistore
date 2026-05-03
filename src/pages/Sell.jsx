import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Banknote, Zap, MessageCircle, Lock } from "lucide-react";

export default function Sell() {
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
          <img
            src="/sell-banner.jpg"
            alt="BGMI Soldier in wheat field" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              filter: "brightness(0.65)",
            }}
          />
          {/* dark gradient bottom fade */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.4) 0%, transparent 40%, transparent 50%, rgba(8,10,15,0.97) 100%)" }} />
          {/* subtle warm vignette left */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.07) 0%, transparent 60%)" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: "760px" }}>
            <div className="badge" style={{ marginBottom: "20px" }}>
              <Banknote size={14} /> Sell Your Account
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(30px,5.5vw,66px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "14px",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}>
              Turn Your Account<br /><span style={{ color: "var(--gold)" }}>Into Cash</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(13px,1.6vw,17px)",
              maxWidth: "520px", margin: "0 auto 26px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Wait for best value or get instant payment — we have both options.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20Hold%20and%20Sell%20my%20BGMI%20account."
                target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", borderRadius: "10px", background: "var(--gold)", color: "#000", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.5px" }}>
                <Banknote size={15} /> Hold & Sell
              </a>
              <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20sell%20my%20BGMI%20account%20instantly."
                target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", borderRadius: "10px", background: "#22C55E", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.5px" }}>
                <Zap size={15} /> Sell Instantly
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
            {/* OPTION 1: HOLD & SELL */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none" }}>
                  <Lock size={11} fill="#fff" /> OPTION 1
                </span>
                <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(24px,4vw,32px)" }}>Hold & Sell</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px", minHeight: "44px" }}>
                Get the maximum price by listing with us. We handle the evaluation, marketing, and final secure transfer.
              </p>

              <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "18px", padding: "32px", marginBottom: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  {[
                    ["🎥", "Record Account Video", "Show Inventory, Gun Labs, Supercars, and Outfits."],
                    ["📝", "Detailed Description", "List X-Suits and rare items (or give login for evaluation)."],
                    ["📊", "Market Evaluation", "We price it fairly based on current real market rates."],
                    ["📢", "Listing & Marketing", "We list in our VIP group & channels (Sale in 1-2 weeks)."],
                    ["💰", "Secure Payment", "Get paid immediately after the secure account handover."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                      <div className="step-text">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "2px" }}>
                          <span style={{ fontSize: "16px" }}>{icon}</span> <strong style={{ fontSize: "15px" }}>{title}</strong>
                        </div>
                        <small style={{ display: "block", color: "var(--muted)", fontSize: "12px" }}>{desc}</small>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20Hold%20and%20Sell%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-gold" style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}>
                  📤 Start Hold & Sell →
                </a>
              </div>
            </div>

            {/* OPTION 2: INSTANT SALE */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none" }}>
                  <Zap size={11} fill="#fff" /> OPTION 2
                </span>
                <h2 className="stitle" style={{ margin: 0, fontSize: "clamp(24px,4vw,32px)" }}>Instant Sale</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px", minHeight: "44px" }}>
                Need cash fast? Sell your account immediately to us without waiting for a private buyer.
              </p>

              <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "18px", padding: "32px", marginBottom: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <ol className="steps-list" style={{ flex: 1 }}>
                  {[
                    ["🎥", "Quick Video Review", "Share a recording of your account assets for review."],
                    ["📝", "Assessment & Details", "We'll evaluate the account value quickly and fairly."],
                    ["⚡", "Instant Price Offer", "Get a direct offer for a fast sale (Speed guaranteed)."],
                    ["✅", "Accept & Get Paid", "We secure the account and release payment instantly."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                      <div className="step-text">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold)", marginBottom: "2px" }}>
                          <span style={{ fontSize: "16px" }}>{icon}</span> <strong style={{ fontSize: "15px" }}>{title}</strong>
                        </div>
                        <small style={{ display: "block", color: "var(--muted)", fontSize: "12px" }}>{desc}</small>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20sell%20my%20BGMI%20account%20instantly." target="_blank" rel="noreferrer" className="btn btn-green" style={{ marginTop: "24px", width: "100%", justifyContent: "center" }}>
                  ⚡ Sell Instantly Now →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="section-alt">
          <h2 className="stitle">🛡️ Why Choose Maddy Store?</h2>
          <div className="why-grid" style={{ maxWidth:"800px", marginBottom:"32px" }}>
            {["Trusted Since 2019","Safe & Secure Handling","Transparent Pricing Always","Fast Payouts After Sale"].map(w => (
              <div key={w} className="why-item"><div className="why-check">✔</div><span>{w}</span></div>
            ))}
          </div>
          <a href="https://wa.me/+919025391516?text=Hi!%20I%20need%20help%20selling%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green">
            💬 WhatsApp +91 90253 91516
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
