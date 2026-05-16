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
            src="/buy-banner.webp"
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
                <Gamepad2 size={16} /> Ready to Play Accounts
              </Link>
              <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20a%20custom%20BGMI%20account."
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "13px 28px", borderRadius: "10px",
                  background: "linear-gradient(135deg,#f97316,#ef4444)",
                  color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                }}>
                <MessageCircle size={16} /> Customized Account
              </a>
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID ─────────────────────────────────── */}
        <section className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.02), transparent)" }}>
          <div className="options-grid">
            {/* OPTION 1: READY SECURED ACCOUNTS */}
            <div className="option-card-wrap">
              <div className="option-header">
                <span className="badge badge-blue">
                  <Star size={11} fill="#fff" /> OPTION 1
                </span>
                <h2 className="stitle" style={{ margin: 0 }}>Ready to Play</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px" }}>
                Browse our verified, ready-to-play accounts. New listings posted regularly. Buy instantly via WhatsApp or Telegram.
              </p>

              <div className="glass-card option-card">
                <ul className="steps-list-premium">
                  {[
                    [<Gamepad2 size={18} />, "Watch Preview", "Check Gun Labs, cars, and outfits."],
                    [<Lock size={18} />, "Check Logins", "Verified and secured credentials."],
                    [<ShoppingCart size={18} />, "Select & Buy", "Direct access to our official links."],
                    [<MessageCircle size={18} />, "Book with 10%", "Secure your account instantly."],
                    [<Banknote size={18} />, "Final Payment", "UPI, Bank, USDT, or Wise."],
                    [<Shield size={18} />, "Instant Delivery", "Secure transfer to your details."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i} className="step-item">
                      <div className="step-icon-wrap">{icon}</div>
                      <div className="step-content">
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/readystocks" className="btn btn-gold" style={{ marginTop: "30px", width: "100%", height: "55px" }}>
                  <Gamepad2 size={20} /> View Ready Stocks
                </Link>
              </div>
            </div>

            {/* OPTION 2: CUSTOM REQUIREMENT */}
            <div className="option-card-wrap">
              <div className="option-header">
                <span className="badge badge-red">
                  <Flame size={11} fill="#fff" /> OPTION 2
                </span>
                <h2 className="stitle" style={{ margin: 0 }}>Custom Order</h2>
              </div>
              <p className="ssub" style={{ marginBottom: "24px" }}>
                Get a personalized BGMI account based on your exact budget and preferences.
              </p>

              <div className="glass-card option-card">
                <ul className="steps-list-premium">
                  {[
                    [<Target size={18} />, "Requirements", "Tell us exactly what you need."],
                    [<Banknote size={18} />, "Search Fee", "Small advance for search results."],
                    [<Gamepad2 size={18} />, "Review Options", "We find the best specification accounts."],
                    [<MessageCircle size={18} />, "Finalize Deal", "Lock your choice with a deposit."],
                    [<Banknote size={18} />, "Pay Balance", "Secure payment via trusted methods."],
                    [<Shield size={18} />, "Full Handover", "Complete access transfer to you."],
                  ].map(([icon, title, desc], i) => (
                    <li key={i} className="step-item">
                      <div className="step-icon-wrap" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>{icon}</div>
                      <div className="step-content">
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "12px", marginTop: "30px", flexDirection: "column" }}>
                  <a href="https://wa.me/+919025391516?text=Hi!%20I%20have%20a%20custom%20BGMI%20account%20requirement." target="_blank" rel="noreferrer" className="btn btn-green" style={{ width: "100%", height: "55px" }}>
                    <MessageCircle size={20} /> Request on WhatsApp
                  </a>
                  <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ width: "100%", height: "55px" }}>
                    <Send size={20} /> Request on Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY TRUST US */}
        <section className="section-alt" style={{ textAlign: "center" }}>
          <h2 className="stitle" style={{ display:"inline-flex", alignItems:"center", gap:"15px", marginBottom: "40px" }}>
            <Shield size={32} className="g-svg" /> Why Trust <span className="g">Maddy Store?</span>
          </h2>
          <div className="trust-grid">
            {[
              { t: "100% Trusted Deals", d: "Over 5000+ satisfied customers globally." },
              { t: "Safe Transfers", d: "Proprietary security protocol for handovers." },
              { t: "24/7 Support", d: "Dedicated team for after-sales assistance." },
              { t: "Verified Listings", d: "Every account is manually checked by Maddy." }
            ].map(w => (
              <div key={w.t} className="trust-item card">
                <CheckCircle size={24} color="var(--green)" />
                <h4>{w.t}</h4>
                <p>{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        <style>{`
          .options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
          }
          .option-card-wrap { display: flex; flex-direction: column; }
          .option-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
          .badge-blue { background: linear-gradient(135deg,#3b82f6,#6366f1) !important; border: none !important; }
          .badge-red { background: linear-gradient(135deg,#f97316,#ef4444) !important; border: none !important; }
          
          .glass-card {
            background: rgba(17, 21, 32, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-gold);
            border-radius: 24px;
            padding: 30px;
            flex: 1;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          }
          
          .steps-list-premium { list-style: none; padding: 0; }
          .step-item { display: flex; gap: 18px; margin-bottom: 20px; align-items: center; }
          .step-icon-wrap {
            width: 44px; height: 44px; border-radius: 14px;
            background: var(--gold-dim); border: 1px solid var(--gold-border);
            color: var(--gold); display: flex; alignItems: center; justifyContent: center;
            flex-shrink: 0;
          }
          .step-content { display: flex; flex-direction: column; }
          .step-content strong { color: #fff; font-size: 15px; font-family: var(--font-h); letter-spacing: 0.5px; }
          .step-content span { color: var(--muted); font-size: 12px; }

          .trust-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            max-width: 1100px;
            margin: 0 auto;
          }
          .trust-item { padding: 30px !important; text-align: center; }
          .trust-item h4 { margin: 15px 0 8px; font-family: var(--font-h); font-size: 18px; color: #fff; }
          .trust-item p { color: var(--muted); font-size: 13px; line-height: 1.5; }
          
          .g-svg { color: var(--gold); filter: drop-shadow(0 0 10px rgba(255,215,0,0.3)); }

          @media (max-width: 600px) {
            .options-grid { gap: 30px; }
            .glass-card { padding: 25px 20px; }
            .step-item { gap: 14px; }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
