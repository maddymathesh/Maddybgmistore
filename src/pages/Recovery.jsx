import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Zap, CheckCircle } from "lucide-react";

export default function Recovery() {
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
            src="/recovery-banner.webp"
            alt="BGMI motorbike desert scene" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "30% center",
              filter: "brightness(0.6)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.45) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.97) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 50%, rgba(255,215,0,0.06) 0%, transparent 55%)" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: "740px" }}>
            <div className="badge" style={{ marginBottom: "20px" }}>
              <Shield size={14} /> Account Recovery
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(30px,5.5vw,66px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "14px",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}>
              BGMI Account<br /><span style={{ color: "var(--gold)" }}>Recovery</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(13px,1.6vw,17px)",
              maxWidth: "520px", margin: "0 auto 26px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Lost your BGMI account? Our dedicated recovery service gets it back — fast & safe.
            </p>
            <a href="https://www.maddyrecoveryhub.in" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 30px", borderRadius: "10px", background: "var(--gold)", color: "#000", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px", boxShadow: "0 4px 20px rgba(255,215,0,0.35)" }}>
              <Shield size={16} /> Visit Recovery Hub →
            </a>
          </div>
        </section>


        <section className="section" style={{ textAlign: "center" }}>
          <p style={{ color:"var(--muted)", marginBottom:"32px", fontSize:"13px" }}>
            Founded in 2019 · Over 2000+ Accounts Recovered · ₹30L+ Worth of BGMI Accounts Restored
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"20px", maxWidth:"700px", margin:"60px auto 0" }}>
            {[["🛡️","Safe Process","Secure and verified recovery method"],["⚡","Fast Recovery","Quick turnaround time on all cases"],["✅","High Success Rate","2000+ accounts recovered since 2019"]].map(([icon,h,p]) => (
              <div key={h} className="card" style={{ textAlign:"center" }}>
                <div style={{ fontSize:"40px", marginBottom:"12px" }}>{icon}</div>
                <h3 style={{ fontFamily:"var(--font-h)", fontSize:"18px", fontWeight:700, marginBottom:"6px" }}>{h}</h3>
                <p style={{ color:"var(--muted)", fontSize:"13px" }}>{p}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
