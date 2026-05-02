import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";
import { Banknote, Zap, MessageCircle } from "lucide-react";

export default function Sell() {
  return (
    <>
      <Navbar />
      <Ticker />
      <div style={{ paddingTop: "84px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          height: "clamp(300px, 52vw, 520px)",
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
            <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
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
                <Banknote size={15} /> Hold &amp; Sell
              </a>
              <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20sell%20my%20BGMI%20account%20instantly."
                target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", borderRadius: "10px", background: "#22C55E", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.5px" }}>
                <Zap size={15} /> Sell Instantly
              </a>
            </div>
          </div>
        </section>

        {/* HOLD & SELL */}
        <section className="section-alt">
          <div style={{ background:"var(--card)", border:"1px solid var(--border-gold)", borderRadius:"18px", overflow:"hidden", marginBottom:"28px" }}>
            <div style={{ padding:"28px 32px 20px" }}>
              <span className="badge-tag">🔒 Option 1</span>
              <h2 className="stitle" style={{ marginTop:"12px" }}>Hold & Sell (Maximum Value)</h2>
              <p style={{ color:"var(--muted)", maxWidth:"600px" }}>Get the best possible price by listing your account with us. We handle everything — evaluation, listing, and transfer.</p>
            </div>
            <div style={{ padding:"0 32px 32px" }}>
              <ol className="steps-list">
                <li><div className="step-text">🎥 <strong>Record a video of your account</strong><small>Show Inventory, Gun Labs, Supercars, Outfits, Rank — everything visible.</small></div></li>
                <li><div className="step-text">📝 <strong>Provide a detailed description</strong><small>X-Suits, Gun Labs, rare items, upgrades. Don't know how? Just share login for evaluation.</small></div></li>
                <li><div className="step-text">📊 <strong>We evaluate at current market value</strong><small>Fair, transparent pricing based on real market rates — no lowballing.</small></div></li>
                <li><div className="step-text">📢 <strong>If you agree, we take over</strong><small>Secure one login · List in our group & channels · Sell within 1–2 weeks</small></div></li>
                <li><div className="step-text">💰 <strong>Get paid after sale</strong><small>Account is securely transferred to buyer. Payment released to you immediately.</small></div></li>
              </ol>
              <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20Hold%20and%20Sell%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-gold" style={{ marginTop:"24px" }}>
                📤 Start Hold & Sell
              </a>
            </div>
          </div>
        </section>

        {/* INSTANT SALE */}
        <section className="section">
          <div style={{ background:"var(--card)", border:"1px solid var(--border-gold)", borderRadius:"18px", overflow:"hidden" }}>
            <div style={{ padding:"28px 32px 20px" }}>
              <span className="badge-tag">⚡ Option 2</span>
              <h2 className="stitle" style={{ marginTop:"12px" }}>Instant Sale (Quick Cash)</h2>
              <p style={{ color:"var(--muted)", maxWidth:"600px" }}>Need cash fast? Sell your account immediately without waiting for a buyer.</p>
            </div>
            <div style={{ padding:"0 32px 32px" }}>
              <ol className="steps-list">
                <li><div className="step-text">🎥 <strong>Record a video of your account</strong><small>Show everything — Gun Labs, Outfits, Rank, Inventory.</small></div></li>
                <li><div className="step-text">📝 <strong>Share details or give login for evaluation</strong><small>We'll assess the account value quickly and fairly.</small></div></li>
                <li><div className="step-text">⚡ <strong>Get an instant price offer</strong><small>⚠️ May be slightly lower than market value — you're paying for speed and certainty.</small></div></li>
                <li><div className="step-text">✅ <strong>Accept and get paid instantly</strong><small>We secure the account · Payment released immediately after verification 💰</small></div></li>
              </ol>
              <a href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20sell%20my%20BGMI%20account%20instantly." target="_blank" rel="noreferrer" className="btn btn-green" style={{ marginTop:"24px" }}>
                ⚡ Sell Instantly Now
              </a>
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
