import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle, RotateCcw, ShieldAlert, Award, FileText, CheckCircle2, ChevronRight } from "lucide-react";

export default function RefundPolicy() {
  const sections = [
    {
      id: "finality",
      icon: <ShieldAlert size={20} style={{ color: "var(--gold)" }} />,
      title: "1. Digital Assets - All Sales Final",
      content: [
        "Due to the intangible, virtual, and instant nature of digital goods and services provided at Maddy BGMI Store, all transactions are officially subject to a strictly non-refundable policy once delivery is fulfilled.",
        "This policy directly applies to: Battlegrounds Mobile India (BGMI) Account Handovers (once logins are transferred to you), Unknown Cash (UC) Direct Credit (once transmitted to your character ID), and In-Game Item Giftings (including X-Suits and Supercars once friendship parameters are complete).",
        "We officially secure and audit every account login method to protect transaction safety. Once a buyer takes over full custody of both logins, rollback requests or refund requests will not be entertained."
      ]
    },
    {
      id: "custom-sourcing",
      icon: <RotateCcw size={20} style={{ color: "var(--gold)" }} />,
      title: "2. Customized Sourcing Deposit Policy",
      content: [
        "We offer a premium Customized Sourcing Svc where our account scouts search the South Indian marketplace for an account matching your specific requirements (skins, weapons, garments, or rankings).",
        "15% Security Deposit: Sourcing requires a refundable 15% security deposit of the finalized realistic target budget.",
        "Refundable Sourcing Window: Within 24 to 48 hours, our team works to find the closest matching accounts. If we are unable to find any matching accounts within this 48-hour window, your 15% deposit will be refunded in full immediately.",
        "Non-Refundable Booking conversion: If we find a matching account and you agree to finalize the selection, the security deposit is instantly converted into a non-refundable booking fee to lock the seller's inventory in custody.",
        "Full Delivery: Once the remaining 85% balance is paid in full, we secure the logins and transfer ownership to you, completing the transaction."
      ]
    },
    {
      id: "exact-match",
      icon: <AlertCircle size={20} style={{ color: "var(--gold)" }} />,
      title: "3. Exact Match & Sourcing Limitations",
      content: [
        "Notice of Sourcing Limits: We search the live secondary player-to-player market to find the best available matching accounts. We do NOT manufacture, inject, or 'factory-make' custom skins or outfits into existing accounts.",
        "Therefore, we cannot guarantee a 100% exact skin-for-skin match. We will find the closest possible matching inventory within your declared budget.",
        "If you reject an account that perfectly matches all main criteria agreed upon in the initial consultation, your 15% security deposit will not be refunded, as it covers the scout's market labor costs."
      ]
    },
    {
      id: "proven-undelivery",
      icon: <CheckCircle2 size={20} style={{ color: "var(--gold)" }} />,
      title: "4. Exception - Proven Undeliverability",
      content: [
        "The only circumstance under which a full refund is issued for accounts or digital recharges is in the proven event of undeliverability.",
        "If an account listing is sold out, or if in-game server blocks prevent the delivery of UC or X-Suits to your Character ID, and we are unable to resolve the issue within 72 hours of your payment, we will issue a 100% refund of all paid amounts.",
        "Refunds are cleared back to your originating payment method (UPI, Bank Transfer, or Cash) within 2 to 5 business days after administration approval."
      ]
    },
    {
      id: "disputes",
      icon: <FileText size={20} style={{ color: "var(--gold)" }} />,
      title: "5. Dispute Resolution & Reclaim Scams",
      content: [
        "We maintain a ZERO-TOLERANCE policy towards double-reclaims, chargeback scams, or fraudulent rollback reports.",
        "Sellers who attempt to rollback sold logins or buyers who claim unauthorized transaction disputes after successful delivery will have their government IDs (Aadhaar/PAN verified during KYC checks) forwarded directly to relevant Cyber Crime police cells in South India.",
        "We keep secure copies of all pre-handover lobbies and chat screenshots to serve as legally binding proof of transaction fulfillment."
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", background: "var(--bg)", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section 
          style={{ 
            position: "relative", 
            width: "100%", 
            padding: "80px 20px 60px", 
            textAlign: "center",
            background: "radial-gradient(circle at center, rgba(255,215,0,0.06) 0%, transparent 70%)",
            borderBottom: "1px solid rgba(255, 215, 0, 0.08)"
          }}
        >
          <div className="badge" style={{ marginBottom: "16px", letterSpacing: "2px" }}>REFUND GUIDE</div>
          <h1 
            style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(32px, 5vw, 56px)", 
              fontWeight: 900, 
              color: "#fff",
              lineHeight: 1.2
            }}
          >
            Refund & <span style={{ color: "var(--gold)" }}>Return Policy</span>
          </h1>
          <p 
            style={{ 
              color: "var(--muted)", 
              maxWidth: "600px", 
              margin: "12px auto 0", 
              fontSize: "14px", 
              lineHeight: 1.6 
            }}
          >
            Effective Date: May 20, 2026. Please understand our policies on digital assets and custom sourcing before making transactions.
          </p>
        </section>

        {/* Content Section */}
        <section className="section" style={{ padding: "60px 5% 100px" }}>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              maxWidth: "960px", 
              margin: "0 auto", 
              gap: "30px" 
            }}
          >
            
            {/* Quick Warning Notice */}
            <div 
              style={{
                background: "rgba(239, 68, 68, 0.03)",
                border: "1px dashed rgba(239, 68, 68, 0.25)",
                borderRadius: "16px",
                padding: "20px 25px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start"
              }}
            >
              <AlertCircle size={24} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ color: "#ef4444", fontWeight: 700, fontSize: "14px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Important Refund Notice</h4>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>
                  Because digital assets (accounts, UC, and gifts) are consumed instantly upon delivery and cannot be restored to original states, all finalized transactions are strictly non-refundable. Please review all details prior to completing payment.
                </p>
              </div>
            </div>

            {/* Clauses List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {sections.map((sec) => (
                <div 
                  key={sec.id}
                  id={sec.id}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border-gold)",
                    borderRadius: "20px",
                    padding: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.4)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border-gold)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <div 
                      style={{ 
                        width: "42px", 
                        height: "42px", 
                        borderRadius: "12px", 
                        background: "rgba(255, 215, 0, 0.08)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        border: "1px solid rgba(255, 215, 0, 0.2)"
                      }}
                    >
                      {sec.icon}
                    </div>
                    <h3 
                      style={{ 
                        fontFamily: "var(--font-h)", 
                        fontSize: "20px", 
                        fontWeight: 700, 
                        color: "#fff",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {sec.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {sec.content.map((p, pIdx) => (
                      <p 
                        key={pIdx} 
                        style={{ 
                          color: "var(--muted)", 
                          fontSize: "14px", 
                          lineHeight: 1.7,
                          textAlign: "justify"
                        }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Home Button */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <a 
                href="/" 
                className="btn btn-gold" 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  padding: "12px 30px", 
                  fontSize: "14px",
                  borderRadius: "30px" 
                }}
              >
                Go Back to Store Home <ChevronRight size={16} />
              </a>
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
