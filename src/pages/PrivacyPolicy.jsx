import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Lock, Database, UserCheck, Share2, HelpCircle, ChevronRight, Eye } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "collection",
      icon: <Database size={20} style={{ color: "var(--gold)" }} />,
      title: "1. Data We Collect",
      content: [
        "To provide a seamless, secure transaction flow at Maddy BGMI Store, we only collect essential customer information. This includes your BGMI Character ID, in-game name, and communication coordinates (such as your WhatsApp number or Telegram username).",
        "During payment settlements, we collect transaction screenshots or reference numbers to automate verification and counter fraudulent attempts. We NEVER collect or store direct credit/debit card numbers or bank account passwords; all transactions are routed through securely encrypted third-party UPI gateways.",
        "We also collect voluntary reviews and feedback that you choose to submit publicly on our website to showcase the trust of South India's gaming community."
      ]
    },
    {
      id: "credentials",
      icon: <Lock size={20} style={{ color: "var(--gold)" }} />,
      title: "2. Absolute Credentials Safety",
      content: [
        "For specific services requiring direct in-game action (such as View Login UC purchases or account verification checkups), we temporarily ask for your linked social network logins (Facebook or X/Twitter).",
        "Zero Logging Guarantee: We treat your credentials with absolute security. All shared credentials are strictly used by our senior administrators inside isolated systems. The very moment your UC injection or account security audit is successfully completed, all login details are wiped clean and deleted permanently from our systems.",
        "We do NOT store, backup, or keep records of passwords under any circumstances. Once the session is concluded, we officially recommend that users change their temporary passwords for complete peace of mind."
      ]
    },
    {
      id: "security",
      icon: <Shield size={20} style={{ color: "var(--gold)" }} />,
      title: "3. Encrypted Data Security",
      content: [
        "Your privacy is our priority. We employ industry-standard encryption protocols and secure administrative tunnels to safeguard transaction coordinates from unauthorized access, alteration, or disclosure.",
        "Only authorized administrators have access to transaction records for verification purposes. Security audits are performed regularly to ensure that user data is held strictly under confidential conditions."
      ]
    },
    {
      id: "sharing",
      icon: <Share2 size={20} style={{ color: "var(--gold)" }} />,
      title: "4. No Third-Party Sharing",
      content: [
        "Maddy BGMI Store operates on a foundation of absolute trust. We do not sell, rent, trade, or share your personal identifiers, Character IDs, or contact coordinates with third-party marketing companies, advertisers, or unaffiliated services.",
        "Your data is used exclusively to verify payments, fulfill orders (such as UC packages and Gifting items), and coordinate safe customer support resolutions directly in our chat rooms."
      ]
    },
    {
      id: "cookies",
      icon: <Eye size={20} style={{ color: "var(--gold)" }} />,
      title: "5. Cookies & Local Storage",
      content: [
        "Our website utilizes local storage and technical cookies solely to optimize page performance, remember your display preferences (such as language and layout selections), and power active user authentication states.",
        "We also utilize session state records to track aggregate total site views for milestone calculations, ensuring no persistent personal tracking or targeting takes place during your browsing session."
      ]
    },
    {
      id: "consent",
      icon: <UserCheck size={20} style={{ color: "var(--gold)" }} />,
      title: "6. Customer Consent",
      content: [
        "By utilizing our website, participating in our buying/selling marketplaces, or coordinating orders on our Telegram and WhatsApp support lines, you explicitly consent to our Privacy Policy and agree to its terms.",
        "If you are under 18, you confirm you are accessing this site with the express consent and supervision of a parent or legal guardian who accepts these data practices on your behalf."
      ]
    },
    {
      id: "contact",
      icon: <HelpCircle size={20} style={{ color: "var(--gold)" }} />,
      title: "7. Privacy Inquiries",
      content: [
        "If you have questions about our privacy guidelines, want to request the immediate erasure of any chat records, or wish to verify what data is temporarily stored, connect with our privacy team:",
        "• WhatsApp Support: +91 90253 91516",
        "• Support Email: maddybgmistoreog@gmail.com",
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
          <div className="badge" style={{ marginBottom: "16px", letterSpacing: "2px" }}>PRIVACY ASSURANCE</div>
          <h1 
            style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(32px, 5vw, 56px)", 
              fontWeight: 900, 
              color: "#fff",
              lineHeight: 1.2
            }}
          >
            Privacy <span style={{ color: "var(--gold)" }}>Policy</span>
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
            Effective Date: May 20, 2026. We are dedicated to ensuring your gaming identifiers and temporary credentials remain completely secure.
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
            
            {/* Zero Retention Security Notice */}
            <div 
              style={{
                background: "rgba(34, 197, 94, 0.03)",
                border: "1px dashed rgba(34, 197, 94, 0.25)",
                borderRadius: "16px",
                padding: "20px 25px",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start"
              }}
            >
              <Shield size={24} style={{ color: "#22C55E", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <h4 style={{ color: "#22C55E", fontWeight: 700, fontSize: "14px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Zero-Retention Credentials Policy</h4>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>
                  All social logins submitted for view-login injection or verification checkups are permanently erased from our systems immediately after delivery. We hold zero persistent logs of customer passwords.
                </p>
              </div>
            </div>

            {/* Privacy Clauses List */}
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
