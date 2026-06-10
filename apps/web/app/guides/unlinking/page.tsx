"use client";




import Link from "next/link";
import { UserCheck, Key, ArrowLeft, RefreshCw, CheckCircle, Info, Lock } from "lucide-react";

export default function UnlinkingGuide() {
  return (
    <>
      
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
        
        {/* HERO BANNER */}
        <section style={{
          position: "relative",
          padding: "120px 5% 50px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link href="/sell" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
              className="back-btn">
              <ArrowLeft size={14} /> Back to Sell Portal
            </Link>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <UserCheck size={13} /> Login Security & Custody
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase",
              letterSpacing: "1px", marginBottom: "18px", color: "#fff"
            }}>
              Personal Logins & <br/>
              <span className="g">Unlinking Guidelines</span>
            </h1>
            
            <p style={{
              color: "var(--color-muted)", fontSize: "clamp(14px, 1.8vw, 16px)",
              maxWidth: "640px", margin: "0 auto", lineHeight: 1.7
            }}>
              We ensure a clear boundary between your game data and your personal identity. Learn how we handle linkages while protecting your personal email addresses.
            </p>
          </div>
        </section>

        {/* DETAIL BODY */}
        <section style={{ padding: "50px 5% 80px", maxWidth: "900px", margin: "0 auto" }}>
          
          <div 
            style={{
              background: "rgba(59, 130, 246, 0.04)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "30px"
            }}
          >
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <Lock size={24} style={{ color: "#60a5fa", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 800, color: "#60a5fa", margin: "0 0 8px" }}>
                  Seller Personal Account Protection
                </h3>
                <p style={{ color: "#a5f3fc", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                  We **never** demand that you hand over permanent custody of your personal social profiles (e.g., your primary personal Facebook or personal Gmail accounts). Maddy BGMI Store only takes custody of the actual game login credentials, ensuring your private emails remain strictly in your ownership.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Custody of Logins */}
            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)"
              }}
              className="guide-card"
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Key size={20} style={{ color: "#60a5fa" }} /> 1. Separation of Custody
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                During a BGMI transaction, we establish a strict separation between game credentials and personal social media profiles:
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", background: "rgba(96,165,250,0.02)", border: "1px dashed rgba(96,165,250,0.2)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle size={15} style={{ color: "#60a5fa", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    <strong>Game Login Custody:</strong> Maddy Store secures primary active logins (e.g., Twitter/X link or dedicated game-linked email) to pass to the buyer.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle size={15} style={{ color: "#60a5fa", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    <strong>Personal Logins Remain Yours:</strong> If the account has secondary linkages (such as a personal Gmail or personal Facebook), you retain absolute control over these assets. We guide you on unlinking them safely without ever requesting their login credentials.
                  </span>
                </div>
              </div>
            </div>

            {/* Guaranteed Unlinking Window */}
            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)"
              }}
              className="guide-card"
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <RefreshCw size={20} style={{ color: "var(--color-gold)" }} /> 2. Guaranteed Unlinking Window
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                Krafton enforces a strict cooldown timer for social network linkages (ranging from 7 to 15 days). We guarantee a highly structured unlinking window:
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {[
                  { title: "Safe Cooldown Window", body: "We initiate the unlinking process for your personal linkages under our direct observation, setting a secure countdown." },
                  { title: "Guaranteed Seller Access", body: "You will retain active access and absolute ownership of your personal social profiles (Facebook, personal email) throughout the unlinking period." },
                  { title: "Automated Finalization", body: "Once Krafton's unlinking timer hits zero, the link detaches completely, cementing the transaction with 100% security." }
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px" }}>
                    <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{item.title}</strong>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)", lineHeight: 1.5 }}>{item.body}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div 
              style={{
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px dashed rgba(255, 215, 0, 0.3)",
                borderRadius: "20px",
                padding: "35px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
                backgroundColor: "rgba(255,215,0,0.01)"
              }}
            >
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 800, color: "var(--color-gold)", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Info size={18} /> Safety Compliance Policy
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>
                To comply with international security practices and prevent fraud, any unlinking process must be initiated under the supervision of a Maddy BGMI Store representative. Once unlinking is successfully triggered, changing or cancelling the unlink process without prior approval will void the transaction and block future listings.
              </p>
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
            className="return-btn">
              Return to Sell Page
            </Link>
          </div>

        </section>

      </div>
      
      

      <style>{`
        .back-btn:hover {
          color: #fff !important;
        }
        .guide-card:hover {
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .return-btn:hover {
          border-color: #60a5fa !important;
          background: rgba(96,165,250,0.03) !important;
        }
      `}</style>
    </>
  );
}
