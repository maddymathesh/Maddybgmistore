import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Scale, Shield, CreditCard, Truck, UserCheck, HelpCircle, AlertTriangle, ChevronRight, Gavel, FileText } from "lucide-react";

export default function TermsConditions() {
  const sections = [
    {
      id: "introduction",
      icon: <Scale size={20} style={{ color: "var(--gold)" }} />,
      title: "1. Agreement to Terms",
      content: [
        "Welcome to Maddy BGMI Store (referred to as 'we', 'our', 'us', or 'the Store'). By accessing, browsing, or using our website, services, or purchasing products, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.",
        "We reserve the right to review and modify these terms at any time. Any changes will be updated directly on this page, and your continued use of the store constitutes acceptance of the revised terms."
      ]
    },
    {
      id: "services",
      icon: <Shield size={20} style={{ color: "var(--gold)" }} />,
      title: "2. Services & Digital Goods",
      content: [
        "Maddy BGMI Store acts as South India's premium curated marketplace for Battlegrounds Mobile India (BGMI) related services, including but not limited to BGMI account purchases, sales, account exchanges, Unknown Cash (UC) pack purchases, and premium item gifting (X-Suits, Supercars).",
        "We guarantee the initial verification and validity of accounts listed on our platform. However, once account credentials are legally transferred to the buyer, all security, linked social logins, and subsequent maintenance are the sole responsibility of the buyer.",
        "All transactions must follow our official verification and secure escrow protocol to ensure the safety of both buyers and sellers."
      ]
    },
    {
      id: "payments",
      icon: <CreditCard size={20} style={{ color: "var(--gold)" }} />,
      title: "3. Pricing, Payments & Refunds",
      content: [
        "Pricing for all products (UC, Accounts, Gifting) is dynamically set and displayed. We reserve the right to modify prices at any time without prior notice based on market demand and developer updates.",
        "Payments must be initiated through our designated automated transaction links or direct verified admin coordinates. Every transaction is tracked via a unique payment ID to ensure integrity and anti-fraud compliance.",
        "Refund Policy: Due to the immediate, digital, and consumable nature of virtual goods and account ownership transfers, ALL SALES ARE FINAL. Refunds or cancellations will not be issued once credentials have been shared or UC has been successfully credited, except in proven cases where delivery is impossible. Sourcing deposits are handled under our dedicated Refund & Return Policy rules."
      ]
    },
    {
      id: "delivery",
      icon: <Truck size={20} style={{ color: "var(--gold)" }} />,
      title: "4. Verification & Delivery Times",
      content: [
        "Account Delivery: Upon successful verification of payment, account credentials are typically handed over within 30 minutes to 3 hours, depending on administrative verification, social linkage safety checks, and queue sizes.",
        "UC Packs & Gifting: UC recharges and special cosmetic gifts (X-Suits, Supercars) are sent directly to the provided BGMI Character ID. Delivery usually takes 10 to 45 minutes but can sometimes take up to 24 hours in case of game server latency.",
        "Providing an incorrect Character ID or social login link is the buyer's responsibility, and we cannot recover or refund assets sent to an incorrect ID provided by the customer."
      ]
    },
    {
      id: "obligations",
      icon: <UserCheck size={20} style={{ color: "var(--gold)" }} />,
      title: "5. User Conduct & Eligibility",
      content: [
        "By participating in our marketplace, you confirm that you are at least 18 years of age or possess legal parental/guardian consent to make online financial transactions.",
        "Users agree not to list or attempt to sell fraudulent, stolen, or blacklisted accounts. Any seller attempting to initiate a security rollback or reclaim a sold account ('recovery scam') will be permanently banned from the community, blacklisted across South Indian gaming networks, and reported to relevant cyber law enforcement.",
        "You agree to provide true, accurate, and current information when filling out transaction forms or submitting reviews."
      ]
    },
    {
      id: "disclaimer",
      icon: <AlertTriangle size={20} style={{ color: "var(--gold)" }} />,
      title: "6. Krafton Disclaimer & IP Notice",
      content: [
        "Maddy BGMI Store is an independent, third-party player-to-player service and digital goods provider. We are NOT officially affiliated with, endorsed by, sponsored by, or associated with KRAFTON, Inc., PUBG Corporation, Tencent Games, or any of their parent companies or subsidiaries.",
        "All copyrights, trademarks, game names, character assets, and graphics belong entirely to their respective intellectual property owners (Krafton, Inc. / Tencent Games). We claim no ownership over the game's actual proprietary codes or assets.",
        "Buying, selling, or trading virtual assets may technically violate the standard Terms of Service (ToS) of the game developers. By proceeding with a purchase or sale, users acknowledge and accept any associated risk of in-game actions or bans."
      ]
    },
    {
      id: "jurisdiction",
      icon: <Gavel size={20} style={{ color: "var(--gold)" }} />,
      title: "7. Governing Law & Jurisdiction",
      content: [
        "These Terms and Conditions are governed by, and shall be construed in accordance with, the laws of the Republic of India.",
        "You explicitly agree that any legal dispute, controversy, claim, or transaction issue arising out of or in connection with Maddy BGMI Store services, website listings, or marketplace trades shall be subject exclusively to the jurisdiction of the competent courts of Chennai, Tamil Nadu, India."
      ]
    },
    {
      id: "dmca",
      icon: <FileText size={20} style={{ color: "var(--gold)" }} />,
      title: "8. Copyright Notice & DMCA Takedown Procedure",
      content: [
        "All original website layouts, custom graphics, text descriptions, branding, logo identities, and database systems are Copyright © 2026 Maddy BGMI Store. All rights reserved.",
        "Intellectual Property Takedown: We respect the copyright claims of others. If you are a copyright owner or authorized agent and believe that any listing or user-uploaded media infringes upon your copyright, you may submit a formal notification under standard intellectual property laws.",
        "Takedown requests must be emailed directly to our administrative desk: maddybgmistoreog@gmail.com.",
        "Claims must include: 1) Physical/electronic signature of the authorized copyright owner, 2) Clear identification of the copyrighted work claimed to have been infringed, 3) Direct URL link(s) of the listing on our store, and 4) Complete contact coordinates (email, phone, address).",
        "Upon receipt of a verified claim, we guarantee a strict 48-hour response window to review, investigate, and deactivate any infringing asset."
      ]
    },
    {
      id: "support",
      icon: <HelpCircle size={20} style={{ color: "var(--gold)" }} />,
      title: "9. Contact & Support Coordination",
      content: [
        "For any inquiries regarding our terms, payment issues, transaction verification, or account handovers, please connect with us directly using our official channels:",
        "• WhatsApp Support: +91 90253 91516",
        "• Email Inquiries: maddybgmistoreog@gmail.com",
        "• Official Channels: Telegram (@MBSxMADDY17) & Instagram (@maddy_bgmistore)"
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
          <div className="badge" style={{ marginBottom: "16px", letterSpacing: "2px" }}>LEGAL PORTAL</div>
          <h1 
            style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(32px, 5vw, 56px)", 
              fontWeight: 900, 
              color: "#fff",
              lineHeight: 1.2
            }}
          >
            Terms & <span style={{ color: "var(--gold)" }}>Conditions</span>
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
            Effective Date: May 20, 2026. Please read these terms carefully before utilizing our marketplace.
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
                background: "rgba(255, 215, 0, 0.03)",
                border: "1px dashed rgba(255, 215, 0, 0.25)",
                borderRadius: "16px",
                padding: "20px 25px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start"
              }}
            >
              <AlertTriangle size={24} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ color: "var(--gold)", fontWeight: 700, fontSize: "14px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Important Legal Notice</h4>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>
                  By buying, selling, or exchanging assets on our store, you confirm that you have read, understood, and agreed to be bound by all our rules, transaction safety protocols, and Krafton developer policies.
                </p>
              </div>
            </div>

            {/* Terms List */}
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
