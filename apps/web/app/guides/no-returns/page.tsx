"use client";




import Link from "next/link";
import { ShieldCheck, AlertTriangle, HelpCircle, ArrowLeft, TrendingDown } from "lucide-react";

export default function NoReturnsPolicy() {
  return (
    <>
      
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
        
        {/* HERO BANNER */}
        <section style={{
          position: "relative",
          padding: "120px 5% 50px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(239, 68, 68, 0.08) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link href="/sell" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
              className="back-btn">
              <ArrowLeft size={14} /> Back to Sell Portal
            </Link>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "#ff6b6b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <AlertTriangle size={13} /> Irrevocable Handover Policy
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase",
              letterSpacing: "1px", marginBottom: "18px", color: "#fff"
            }}>
              No Returns After <br/>
              <span className="g">Handover Policy</span>
            </h1>
            
            <p style={{
              color: "var(--color-muted)", fontSize: "clamp(14px, 1.8vw, 16px)",
              maxWidth: "640px", margin: "0 auto", lineHeight: 1.7
            }}>
              To maintain the integrity of our premium marketplace, protect store profit margins, and guarantee absolute transaction finality, all completed sell deals are permanent.
            </p>
          </div>
        </section>

        {/* POLICY DETAIL BODY */}
        <section style={{ padding: "50px 5% 80px", maxWidth: "900px", margin: "0 auto" }}>
          
          <div 
            style={{
              background: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "30px"
            }}
          >
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <AlertTriangle size={24} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 800, color: "#ff6b6b", margin: "0 0 8px" }}>
                  Immutable Sell Handover Mandate
                </h3>
                <p style={{ color: "#ffb3b3", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                  Once account credentials have been successfully transferred, secured under Maddy Store's isolation protocol, and payment has been released, the account **cannot be returned, cancelled, or resold back to us at a later price**. All trades are final.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)"
              }}
              className="policy-card"
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <TrendingDown size={20} style={{ color: "var(--color-orange)" }} /> 1. Protection of Store Profit Margins
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                Wholesale payouts for **Instant Sell** options are carefully calculated in real-time based on current BGMI skin market valuations and strict store profit margins. Allowing returns or post-sale price adjustments disrupts carrying models, introduces inventory risks, and harms marketplace operational liquidity. Guaranteeing finality keeps wholesale prices competitive for future sellers.
              </p>
            </div>

            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)"
              }}
              className="policy-card"
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck size={20} style={{ color: "#22c55e" }} /> 2. Complete Transaction Security
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                During the handover phase, Maddy Store coordinates intensive credential detachments. We bind new recovery emails, secondary linking cooldowns, and secure fresh buyers. Reversing this sequence exposes the account to security locks, IP quarantines by Krafton, and high dispute risks. Keeping transactions final ensures absolute safety for the seller, buyer, and Maddy Store.
              </p>
            </div>

            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)"
              }}
              className="policy-card"
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <HelpCircle size={20} style={{ color: "var(--color-gold)" }} /> 3. Why This Ensures Absolute Fairness
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                This rule creates a balanced ecosystem that guards both parties:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-gold)", marginTop: "8px", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    <strong>Seller Guarantee:</strong> Your payment is locked, verified, and 100% immune to subsequent reversals or buyer claims once verified by Maddy Store.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-gold)", marginTop: "8px", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    <strong>Buyer Guarantee:</strong> The buyer receives a thoroughly audited, isolated, and permanently bound account free of security retrieval risks.
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/sell" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 28px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
              fontSize: "13.5px", cursor: "pointer", textDecoration: "none", transition: "all 0.2s"
            }}
            className="ret-btn">
              Return to Sell Page
            </Link>
          </div>

        </section>

      </div>
      
      

      <style>{`
        .back-btn:hover {
          color: #fff !important;
        }
        .policy-card:hover {
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .ret-btn:hover {
          border-color: #ff6b6b !important;
          background: rgba(239,68,68,0.03) !important;
        }
      `}</style>
    </>
  );
}
