import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { CreditCard, Clock, ArrowLeft, CheckCircle, Zap, ShieldCheck, AlertCircle } from "lucide-react";

export default function PayoutGuide() {
  useSEO(
    "Payout & Unlinking Timeline Guide",
    "Detailed guide on payout methods, unlinking scenarios, and timeline guarantees for BGMI accounts."
  );

  const containerStyle = {
    background: "var(--bg)",
    color: "#fff",
    paddingTop: "102px",
    minHeight: "100vh",
    fontFamily: "'Outfit', 'Inter', sans-serif"
  };

  const cardStyle = {
    background: "rgba(17, 21, 32, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    position: "relative",
    overflow: "hidden"
  };

  const scenarioGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    marginTop: "24px"
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        
        {/* ── HERO BANNER ──────────────────────────────── */}
        <section style={{
          position: "relative",
          padding: "80px 5% 50px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/sell" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
              <ArrowLeft size={14} /> Back to Sell Portal
            </Link>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 215, 0, 0.08)", border: "1px solid rgba(255, 215, 0, 0.25)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <CreditCard size={13} /> Payout & Unlinking Guide
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase",
              letterSpacing: "1px", marginBottom: "18px"
            }}>
              Payout Methods & <br/>
              <span style={{ background: "linear-gradient(135deg, var(--gold), var(--orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Timeline Scenarios</span>
            </h1>
            
            <p style={{
              color: "var(--muted)", fontSize: "clamp(14px, 1.8vw, 16px)",
              maxWidth: "640px", margin: "0 auto", lineHeight: 1.7
            }}>
              Get clear visibility on payout workflows, unlinking schedules, and the exact timeline required to secure and transfer your BGMI account.
            </p>
          </div>
        </section>

        {/* ── DETAIL BODY ───────────────────────────────── */}
        <section style={{ padding: "50px 5% 80px", maxWidth: "1000px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
            
            {/* Payout Channels section */}
            <div style={cardStyle}>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Zap size={20} style={{ color: "var(--gold)" }} /> Payout Disbursement Channels
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
                Depending on your preferred transaction method, funds are disbursed securely through verified pipelines once the account audit and isolation are complete.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--gold)", fontWeight: 700, margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={18} /> Escrow Method Payout
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    For escrow transactions, the payout is handled directly by the trusted third-party middleman (known streamer, YouTuber, or mutual dealer). The middleman holds the payout in a safe vault during our technical audit and releases it directly to your bank account/UPI immediately after we verify full, exclusive custody of the logins.
                  </p>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", color: "#4ade80", fontWeight: 700, margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Zap size={18} /> Face-to-Face Payout
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                    For instant face-to-face deals, payouts are made immediately at the midpoint meeting location. Once our executive physically audits the account and secures the logins, the payout is released in cash or via instant UPI / IMPS bank transfer on the spot.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Scenarios Card */}
            <div style={{ ...cardStyle, border: "1px solid rgba(255, 215, 0, 0.25)" }}>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 900, color: "#fff", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock size={22} style={{ color: "var(--gold)" }} /> Account Unlinking Timeline Scenarios
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                BGMI accounts usually contain social linkages (Facebook, Twitter, Google, Apple ID, or Email). Krafton's systems enforce specific unlinking schedules. We categorize every deal into one of two timeline scenarios:
              </p>

              <div style={scenarioGridStyle}>
                {/* Scenario A */}
                <div style={{
                  background: "rgba(17, 21, 32, 0.65)",
                  border: "1px solid rgba(255, 165, 0, 0.15)",
                  borderRadius: "14px",
                  padding: "24px",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: "rgba(255, 165, 0, 0.15)", color: "var(--orange)",
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 800
                  }}>
                    SCENARIO A
                  </div>
                  <h3 style={{ fontSize: "18px", color: "var(--orange)", fontWeight: 800, margin: "0 0 12px" }}>
                    Dual-Linked Login
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>7 – 15</span>
                    <span style={{ fontSize: "14px", color: "var(--muted)" }}>Days unlinking window</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                    If the account is bound to two social links (e.g., both Facebook and Google Play Games are active), Krafton enforces a strict security queue to unlink a connection.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <AlertCircle size={14} style={{ color: "var(--orange)", flexShrink: 0, marginTop: "2px" }} />
                      <span>The first login link is handed over to Maddy Store instantly.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <AlertCircle size={14} style={{ color: "var(--orange)", flexShrink: 0, marginTop: "2px" }} />
                      <span>The second link triggers a 7-day or 15-day unlinking wait.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <AlertCircle size={14} style={{ color: "var(--orange)", flexShrink: 0, marginTop: "2px" }} />
                      <span>Full payment is held and released upon final unlink completion.</span>
                    </div>
                  </div>
                </div>

                {/* Scenario B */}
                <div style={{
                  background: "rgba(17, 21, 32, 0.65)",
                  border: "1px solid rgba(74, 222, 128, 0.15)",
                  borderRadius: "14px",
                  padding: "24px",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: "rgba(74, 222, 128, 0.15)", color: "#4ade80",
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 800
                  }}>
                    SCENARIO B
                  </div>
                  <h3 style={{ fontSize: "18px", color: "#4ade80", fontWeight: 800, margin: "0 0 12px" }}>
                    Single Active Login
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>1 – 2</span>
                    <span style={{ fontSize: "14px", color: "var(--muted)" }}>Hours payout speed</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                    If the account has only a single active social link or is unlinked with only play games / e-mail login active, transfer is immediate.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "14px" }}>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <CheckCircle size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: "2px" }} />
                      <span>Exclusive control is established in less than 60 minutes.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <CheckCircle size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: "2px" }} />
                      <span>No secondary unlink timers or cooldown windows are triggered.</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12.5px", color: "#e2e2e2" }}>
                      <CheckCircle size={14} style={{ color: "#4ade80", flexShrink: 0, marginTop: "2px" }} />
                      <span>100% of the calculated payout is released immediately.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/sell" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
              fontSize: "13.5px", cursor: "pointer", textDecoration: "none", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(255,215,0,0.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
              Return to Sell Page
            </Link>
          </div>

        </section>

      </div>
      <Footer />
    </>
  );
}
