import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Lock, ArrowLeft, Check, CheckCircle, Info } from "lucide-react";

export default function KYCGuide() {
  useSEO(
    "KYC & ID Verification Security Guide",
    "Learn about our encrypted ID verification protocol ensuring complete seller safety and fraud-free transactions."
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

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        
        {/* ── HERO BANNER ──────────────────────────────── */}
        <section style={{
          position: "relative",
          padding: "80px 5% 50px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/sell" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
              <ArrowLeft size={14} /> Back to Sell Portal
            </Link>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <ShieldCheck size={13} /> Secure Identity Verification
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase",
              letterSpacing: "1px", marginBottom: "18px"
            }}>
              ID Verification <br/>
              <span style={{ background: "linear-gradient(135deg, #4ade80, var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>KYC Security Guide</span>
            </h1>
            
            <p style={{
              color: "var(--muted)", fontSize: "clamp(14px, 1.8vw, 16px)",
              maxWidth: "640px", margin: "0 auto", lineHeight: 1.7
            }}>
              Verifying identities ensures a reliable, safe environment. Learn how KYC assists during logins and why your data is fully secure.
            </p>
          </div>
        </section>

        {/* ── KYC DETAIL BODY ──────────────────────────── */}
        <section style={{ padding: "50px 5% 80px", maxWidth: "900px", margin: "0 auto" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* Why is ID Verification Required? */}
            <div style={cardStyle}>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={20} style={{ color: "#22c55e" }} /> Why ID Verification is Required
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "16px" }}>
                ID proofs (Aadhaar Card, PAN Card, Driving License) are necessary checks for high-value sales. This process keeps our community fraud-free by verifying the account owner and preventing dispute claims.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", background: "rgba(34,197,94,0.02)", border: "1px dashed rgba(34,197,94,0.2)", borderRadius: "12px", padding: "20px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle size={15} style={{ color: "#22c55e", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    **Authenticity Validation:** Confirms that the seller is the genuine owner who holds original custody of the bindings.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle size={15} style={{ color: "#22c55e", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    **Login Lock Recovery:** During account isolation, Krafton occasionally triggers location-based security freezes. Having verified owner credentials helps our team coordinate bypasses and retrieve frozen access fast.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle size={15} style={{ color: "#22c55e", flexShrink: 0, marginTop: "3px" }} />
                  <span style={{ fontSize: "13.5px", color: "#e2e2e2", lineHeight: 1.5 }}>
                    **Secure Buyer Ecosystem:** Assures premium buyers that their high-tier accounts are permanently secure, protecting them from recovery attempts.
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy & Encryption Mandate */}
            <div style={{ ...cardStyle, border: "1px solid rgba(34, 197, 94, 0.3)", background: "radial-gradient(circle at top right, rgba(34, 197, 94, 0.05) 0%, transparent 60%)" }}>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Lock size={20} style={{ color: "var(--gold)" }} /> 100% Confidentiality & Server Encryption
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>
                Seller privacy is our highest priority. All collected government IDs and address proofs are strictly isolated:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                {[
                  { title: "Offline Storage", body: "Files are moved from web pipelines to offline storage grids immediately after verification." },
                  { title: "AES-256 Encryption", body: "All credentials are encrypted, securing your information from data breaches." },
                  { title: "Strict Confidentiality", body: "IDs are never leaked, sold, or shared, and are strictly used to resolve recovery locks." },
                ].map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "16px" }}>
                    <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{item.title}</strong>
                    <span style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{item.body}</span>
                  </div>
                ))}
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
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4ade80"; e.currentTarget.style.background = "rgba(34,197,94,0.03)"; }}
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
