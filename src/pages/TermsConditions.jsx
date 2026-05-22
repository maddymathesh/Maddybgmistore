import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  Scale, 
  AlertTriangle, 
  Users, 
  UserCheck, 
  Coins, 
  Flame, 
  Shield, 
  Handshake, 
  AlertOctagon, 
  FileText, 
  Gavel, 
  Lock, 
  ShieldAlert, 
  HelpCircle, 
  RefreshCw,
  ChevronRight
} from "lucide-react";

export default function TermsConditions() {
  useSEO(
    "Terms & Conditions — Legal Guidelines",
    "Official terms and conditions declaring neutral intermediary status, P2P escrow rules, KYC requirements, and risk disclosures."
  );

  const sections = [
    {
      id: "introduction",
      icon: <Scale size={20} style={{ color: "var(--gold)" }} />,
      title: "1. Introduction & Agreement to Terms",
      content: [
        "Welcome to Maddy BGMI Store (referred to as 'we', 'our', 'us', the 'Platform', or 'maddybgmistore.in'). By accessing, browsing, or using our website, services, communication channels, or digital coordination portals, you agree to be bound by these Terms and Conditions and all applicable laws and regulations of the Republic of India.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials, visual assets, and database designs contained in this website are protected by applicable copyright and trademark laws.",
        "We reserve the absolute right to review, modify, or update these terms at any time. Any changes will be updated directly on this page with an updated 'Effective Date', and your continued use of the Platform constitutes your automatic acceptance of the revised terms."
      ]
    },
    {
      id: "non-affiliation",
      icon: <AlertTriangle size={20} style={{ color: "var(--gold)" }} />,
      title: "2. Non-Affiliation Disclaimer",
      content: [
        "Maddy BGMI Store is an independent, third-party marketplace platform and service provider. We are NOT officially affiliated with, endorsed by, sponsored by, or associated with KRAFTON, Inc., PUBG Corporation, Tencent Games, or any of their parent companies, subsidiaries, or game publishers.",
        "All copyrights, trademarks, game names, character assets, skins, outfits, and graphics belong entirely to their respective intellectual property owners (including KRAFTON, Inc. and Tencent Games). We claim no ownership over the game's actual proprietary codes, virtual items, or game developer assets."
      ]
    },
    {
      id: "marketplace-facilitator",
      icon: <Users size={20} style={{ color: "var(--gold)" }} />,
      title: "3. Marketplace Facilitator Clause",
      content: [
        "Maddy BGMI Store acts strictly as a neutral peer-to-peer (P2P) marketplace platform and escrow coordinator. We facilitate transactions, list catalog offers, perform security inspections, and coordinate escrow handovers between independent third-party buyers and sellers.",
        "The Platform does not own, stock, manufacture, or directly sell any game accounts, virtual items, or digital assets listed on our site. All sales are P2P transactions between the respective buyer and seller, and the Platform acts solely as an intermediary broker providing escrow security safeguards."
      ]
    },
    {
      id: "user-responsibility",
      icon: <UserCheck size={20} style={{ color: "var(--gold)" }} />,
      title: "4. User Responsibility & Publisher ToS",
      content: [
        "Users are solely responsible for ensuring their compliance with all applicable third-party terms of service, including Krafton's BGMI End-User License Agreement (EULA) and game rules.",
        "Users acknowledge that buying, selling, or trading game accounts, virtual items, or services may violate the standard Terms of Service (ToS) of the game developers and publishers. By proceeding with any transaction on this Platform, users accept all associated risks, including but not limited to character locks, account bans, or virtual asset deactivations by the game publisher."
      ]
    },
    {
      id: "booking-fee",
      icon: <Coins size={20} style={{ color: "var(--gold)" }} />,
      title: "5. Booking Fee & Sourcing Deposits",
      content: [
        "A 10% non-refundable booking fee applies to all transactions coordinated through the Platform. This fee covers our administrative overhead, verification coordination, and listing broker resources.",
        "Once a transaction coordinate is agreed upon and a booking is finalized (including custom spec sourcing or midpoint travel allocations), the 10% booking deposit is completely non-refundable and will be retained as a service coordination fee."
      ]
    },
    {
      id: "no-returns",
      icon: <Flame size={20} style={{ color: "var(--gold)" }} />,
      title: "6. No Returns / No Refunds Policy",
      content: [
        "Due to the immediate, digital, and irreversible nature of virtual goods and account ownership transfers, ALL COMPLETED TRANSACTIONS ARE FINAL.",
        "Once digital credentials have been delivered, unlinked, or transferred to the buyer, or UC recharges/gifting items have been successfully credited to a Character ID, no refunds, returns, exchanges, or order cancellations will be issued under any circumstances. Virtual assets cannot be returned or resold back to the Platform."
      ]
    },
    {
      id: "escrow-process",
      icon: <Shield size={20} style={{ color: "var(--gold)" }} />,
      title: "7. Escrow Process & Coordination",
      content: [
        "The Platform provides a structured escrow coordination protocol as a procedural safeguard to ensure safe, verifiable transactions between parties.",
        "However, Maddy BGMI Store does not operate as a licensed bank, financial institution, or trust company. The escrow service is a manual procedural security mechanism where we hold credentials and coordinate funds transfer until delivery is audited. Users rely on this process at their own discretion and assume all standard digital commerce risks."
      ]
    },
    {
      id: "f2f-deals",
      icon: <Handshake size={20} style={{ color: "var(--gold)" }} />,
      title: "8. Face-to-Face P2P Deals",
      content: [
        "For voluntary in-person meetups (Face-to-Face Deals) coordinated via the Platform, users assume all physical, financial, and logistical risks.",
        "Such meetups are strictly voluntary. The Platform coordinates the computed midpoint travel split coordinates, but is not responsible for any physical safety issues, travel delays, or cancellations. All associated travel, food, lodging, and logistics expenses are borne entirely by the customer. Meetups are strictly conducted in highly public, CCTV-monitored public commercial centers to ensure transparency."
      ]
    },
    {
      id: "no-guarantees",
      icon: <AlertOctagon size={20} style={{ color: "var(--gold)" }} />,
      title: "9. Assumption of Risk & No Guarantees",
      content: [
        "The Platform does not provide any warranty or guarantee regarding the permanent safety, recovery options, or future integrity of any game account post-handover.",
        "Game publishers use automated algorithms that can flag and ban accounts for IP changes, device switches, or suspicious P2P trade activities. Because these events are beyond our control, we make no representation that accounts will remain accessible forever. All transactions carry inherent risk, and the buyer assumes all future liability."
      ]
    },
    {
      id: "kyc-verification",
      icon: <FileText size={20} style={{ color: "var(--gold)" }} />,
      title: "10. KYC / ID Verification",
      content: [
        "To prevent identity theft, recovery scams, and rollback fraud, the Platform mandates strict government-issued ID verification (such as Aadhaar, PAN Card, or Driving License) along with live location validation before finalizing high-value handovers or releasing payout balances.",
        "Sellers agree that providing fraudulent, expired, or stolen ID documents is a direct offense. We retain KYC records securely in our database to ensure historical tracing in case of post-sale recovery disputes."
      ]
    },
    {
      id: "limitation-of-liability",
      icon: <Gavel size={20} style={{ color: "var(--gold)" }} />,
      title: "11. Limitation of Liability",
      content: [
        "Under no circumstances shall the Platform, its coordinators, directors, or representatives be held liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or transactions.",
        "This includes, but is not limited to, account deactivations, in-game bans, rollback disputes, financial losses, recovery pullbacks, or developer-enforced lockdowns. Our maximum aggregate liability for any dispute shall never exceed the service fee paid to the Platform."
      ]
    },
    {
      id: "privacy-policy",
      icon: <Lock size={20} style={{ color: "var(--gold)" }} />,
      title: "12. Privacy & Data Protection",
      content: [
        "The Platform is committed to securing your personal information. All sensitive documents, including government ID proofs and live location records, are stored in encrypted offline databases with restricted access control.",
        "We will never share, rent, leak, or sell your private personal data or identification proofs to third parties without your explicit consent, unless compelled by authorized Indian law enforcement agencies or cyber-crime cells during a formal recovery scam investigation."
      ]
    },
    {
      id: "user-conduct",
      icon: <ShieldAlert size={20} style={{ color: "var(--gold)" }} />,
      title: "13. Prohibited User Conduct",
      content: [
        "Users are strictly prohibited from engaging in any fraudulent activity on the Platform. This includes, but is not limited to, account rollback scams, double-selling, providing stolen credentials, attempting password recovery after receiving payment, impersonating Platform staff, or uploading malicious files.",
        "Any violation will result in permanent blacklisting from our network and immediate dispatch of all collected KYC data to cyber-crime authorities."
      ]
    },
    {
      id: "dispute-resolution",
      icon: <HelpCircle size={20} style={{ color: "var(--gold)" }} />,
      title: "14. Dispute Resolution & Governing Law",
      content: [
        "In the event of a dispute between a buyer and a seller, both parties are responsible for resolving their grievances directly. The Platform will provide transaction logs, coordinate communication, and offer administrative review assistance where possible, but is not legally obligated to provide arbitration, legal representation, or financial compensation for P2P transaction disputes.",
        "Any legal dispute, controversy, or claim arising out of or in connection with the Platform's services shall be governed by, and construed in accordance with, the laws of the Republic of India. You agree that any such legal dispute shall be subject exclusively to the jurisdiction of the competent courts of India, without reference to any specific city, state, or municipal territory."
      ]
    },
    {
      id: "policy-updates",
      icon: <RefreshCw size={20} style={{ color: "var(--gold)" }} />,
      title: "15. Policy Updates & Amendments",
      content: [
        "These Terms and Conditions may be revised, updated, or amended periodically to reflect operational, regulatory, or legal changes. All updates will be published directly on this page with an updated 'Effective Date'.",
        "Your continued access to the website or utilization of our services post-update constitutes your automatic acceptance of the revised Terms and Conditions."
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
              maxWidth: "650px", 
              margin: "12px auto 0", 
              fontSize: "14px", 
              lineHeight: 1.6 
            }}
          >
            Effective Date: May 22, 2026. Fully updated to define neutral marketplace intermediary protocols, P2P escrow safeguards, voluntary F2F guidelines, and comprehensive risk disclosures under Indian laws.
          </p>
        </section>

        {/* Content Section */}
        <section className="section" style={{ padding: "60px 5% 100px" }}>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              maxWidth: "1200px", 
              margin: "0 auto", 
              gap: "40px" 
            }}
            className="terms-grid-layout"
          >
            {/* Sidebar Table of Contents */}
            <div className="terms-sidebar-wrapper">
              <div style={{
                position: "sticky",
                top: "120px",
                maxHeight: "calc(100vh - 160px)",
                overflowY: "auto",
                background: "var(--card)",
                border: "1px solid var(--border-gold)",
                borderRadius: "20px",
                padding: "24px 20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
              }}>
                <h4 style={{
                  fontFamily: "var(--font-h)",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingBottom: "8px"
                }}>
                  Legal Index
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        const el = document.getElementById(sec.id);
                        if (el) {
                          const offset = 110;
                          const bodyRect = document.body.getBoundingClientRect().top;
                          const elementRect = el.getBoundingClientRect().top;
                          const elementPosition = elementRect - bodyRect;
                          const offsetPosition = elementPosition - offset;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                        }
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        fontSize: "12.5px",
                        textAlign: "left",
                        cursor: "pointer",
                        fontFamily: "var(--font-h)",
                        fontWeight: 600,
                        padding: "8px 10px",
                        borderRadius: "8px",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        width: "100%"
                      }}
                      className="sidebar-index-btn"
                    >
                      <ChevronRight size={11} style={{ color: "var(--gold)", opacity: 0.6 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sec.title.split(". ")[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Terms List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
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
                  <h4 style={{ color: "var(--gold)", fontWeight: 700, fontSize: "14px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Important Intermediary Notice</h4>
                  <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>
                    Maddy BGMI Store operates purely as an intermediary listing broker and escrow platform. By buying, selling, or exchanging assets on our digital channels, you confirm that you have read, understood, and agreed to be bound by all our rules, risk disclaimers, and game publisher policies.
                  </p>
                </div>
              </div>

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
                  className="terms-card"
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
                        border: "1px solid rgba(255, 215, 0, 0.2)",
                        flexShrink: 0
                      }}
                    >
                      {sec.icon}
                    </div>
                    <h3 
                      style={{ 
                        fontFamily: "var(--font-h)", 
                        fontSize: "19px", 
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
                          fontSize: "13.5px", 
                          lineHeight: 1.7,
                          textAlign: "justify",
                          margin: 0
                        }}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

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
                    borderRadius: "30px",
                    textDecoration: "none"
                  }}
                >
                  Go Back to Store Home <ChevronRight size={16} />
                </a>
              </div>

            </div>

          </div>
        </section>

        <style>{`
          .terms-grid-layout {
            grid-template-columns: 1fr;
          }
          
          .terms-sidebar-wrapper {
            display: none;
          }
          
          .sidebar-index-btn:hover {
            color: var(--gold) !important;
            background: rgba(255, 215, 0, 0.04) !important;
          }
          
          .terms-card:hover {
            border-color: rgba(255, 215, 0, 0.4) !important;
            transform: translateY(-2px);
          }
          
          @media (min-width: 992px) {
            .terms-grid-layout {
              grid-template-columns: 280px 1fr !important;
            }
            .terms-sidebar-wrapper {
              display: block !important;
            }
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}

