import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  Scale, 
  Shield, 
  CreditCard, 
  Truck, 
  UserCheck, 
  HelpCircle, 
  AlertTriangle, 
  ChevronRight, 
  Gavel, 
  FileText, 
  Users, 
  RefreshCw, 
  Coins, 
  Flame, 
  Car 
} from "lucide-react";

export default function TermsConditions() {
  useSEO(
    "Terms & Conditions — Legal Guidelines",
    "Official terms and conditions declaring Chennai jurisdiction, copyright details, DMCA takedown SLAs, and transaction rules."
  );

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
      id: "buy-service",
      icon: <Shield size={20} style={{ color: "var(--gold)" }} />,
      title: "2. Account Buying (Purchase Protocol)",
      content: [
        "Escrow Guarantee: Maddy BGMI Store acts as South India's premium curated marketplace for Battlegrounds Mobile India (BGMI) accounts. We guarantee the initial integrity and validity of all account credentials listed on our platform.",
        "Social Linkages: BGMI accounts may possess single or dual logins linked to various social platforms (including X/Twitter, Facebook, Google Play Games, Apple ID, or Game Center). The linking configuration is clearly described on each product catalog page.",
        "Buyer Responsibility & Password Wipe: Upon completion of a transaction, all credentials are transferred directly to the buyer. At that moment, the buyer assumes absolute responsibility for maintaining account security (including enabling two-factor authentication, changing linked passwords, and updating phone numbers). The Maddy BGMI Store permanently erases all credentials from its logs upon successful transfer.",
        "Zero-Ban Risk Guarantee: We guarantee that all listed accounts are free from active bans or developer blacklists at the time of purchase. However, any subsequent bans resulting from the buyer's gameplay, usage of third-party modifications, hacks, or violations of Krafton's end-user agreements are the sole responsibility of the buyer."
      ]
    },
    {
      id: "sell-service",
      icon: <Flame size={20} style={{ color: "var(--gold)" }} />,
      title: "3. Account Selling (Instant Sell vs. Hold & Sell)",
      content: [
        "Instant Sell: Under the Instant Sell option, sellers receive direct cash payouts. We conduct a thorough market evaluation and present a cash offer. The seller must share all linked logins for credential verification. Once our verification team secures the account and alters the linkages to prevent rollbacks, payment (via UPI, Bank Transfer, or Cash) is made immediately. Under no circumstances will the account be returned to the original seller once secured.",
        "Hold & Sell (Hold-to-Earn): Under the Hold & Sell option, sellers contract MBS to broadcast their listing. The seller must agree to secure one primary login with our verification coordinate to ensure listing exclusivity and prevent dual-selling fraud. We create a custom showcase review and broadcast it to our highly engaged Telegram, Instagram, and WhatsApp channels. Most accounts sell within a 3-7 day window; if unsold, mutual price revisions may be adjusted.",
        "Owner Payout & Safety Auditing: For Hold & Sell listings, final owner payout is initiated immediately after the buyer completes verification of the newly secured social linkages. Before final payment processing under either Sell mode, MBS requires the owner to submit a valid government-issued ID proof (e.g. Aadhaar Card, PAN Card, or Driving License). This information is kept encrypted and is solely retained to deter recovery scams or rollback fraud.",
        "Legal Warning on Rollback Scams: Any seller attempting to initiate a security rollback, exploit recovery algorithms, or reclaim a sold account will be permanently blacklisted across South Indian gaming networks. MBS reserves the absolute right to dispatch their verified government ID records directly to competent Indian cyber-crime cells for prosecution."
      ]
    },
    {
      id: "exchange-service",
      icon: <RefreshCw size={20} style={{ color: "var(--gold)" }} />,
      title: "4. Account Exchanges (Trade-In Protocol)",
      content: [
        "Trade-In Valuation: Customers may trade in their existing verified BGMI account to purchase a higher-tier listing. We conduct an official market evaluation of the customer's trade-in account, and issue a trade credit quotation.",
        "Balance Offsets: If the trade credit is lower than the value of the desired upgrade account, the customer must settle the difference (balance offset) via UPI or bank transfer. If the trade credit is higher than the desired account, MBS will secure the trade-in account and pay the surplus difference to the customer.",
        "Secure Sequencing: For security purposes, MBS must completely secure and verify all linked logins of the trade-in account before credentials for the new, upgraded account are handed over to the customer. All exchange actions are final, and ID proof is mandatory."
      ]
    },
    {
      id: "uc-service",
      icon: <Coins size={20} style={{ color: "var(--gold)" }} />,
      title: "5. Unknown Cash (UC) Purchases",
      content: [
        "Sourcing and Pricing: We offer highly optimized UC packages with dynamic pricing based on server availability and bulk imports.",
        "Direct Character ID Recharge: This option requires no account access. The customer must input their exact numeric Character ID. MBS delivers the UC packages officially in-game. The customer bears absolute responsibility for providing the correct Character ID; we cannot retrieve or refund UC sent to an incorrect ID provided by the customer.",
        "Login-Based UC Recharge: For high-tier packs requiring secure in-game top-ups, the customer provides encrypted login credentials. MBS guarantees that these credentials are encrypted during transmission and are immediately deleted from all communications upon delivery verification."
      ]
    },
    {
      id: "gift-service",
      icon: <Car size={20} style={{ color: "var(--gold)" }} />,
      title: "6. X-Suits & Supercar Gifting Services",
      content: [
        "In-Game Gifting Limits: Premium cosmetics, legendary upgradable X-Suits, and custom showroom supercars (available in 1-card, 2-card, or 3-card gifting formats) are delivered officially via the in-game gifting system.",
        "Friendship Latency Clause: The BGMI game engine enforces a strict 72-hour friendship cooldown period before premium gifts can be successfully dispatched to a newly added Character ID. Customers must accept our in-game friend request immediately upon booking to initiate this timer.",
        "Irreversibility: Once a gift is sent to the verified Character ID, the transaction is irreversible and 100% final. Due to the high cost of supercar showroom cards and mythic X-Suits, changes to the target Character ID cannot be made once friend coordinates are locked."
      ]
    },
    {
      id: "payments",
      icon: <CreditCard size={20} style={{ color: "var(--gold)" }} />,
      title: "7. Pricing, Payments & Refunds",
      content: [
        "Pricing Integrity: All pricing is dynamically set based on currency exchange rates and asset rarity. MBS reserves the right to adjust prices without notice.",
        "Scouting & Booking Deposits: For custom bespoke account sourcing requests, we collect a 15% scouting deposit. If our scouts cannot locate a suitable account match matching the customer's specified parameters within 24-48 hours, the deposit is fully refunded. If a matching account within budget parameters is scouted and subsequently rejected by the customer, the deposit is retained as a search labor fee. Upon selection and confirmation, the deposit locks as a non-refundable booking fee.",
        "Digital Irreversibility: Due to the immediate, digital, and consumable nature of virtual goods and account ownership transfers, ALL SALES ARE FINAL. Refunds or cancellations will not be issued once credentials have been shared or UC has been successfully credited, except in proven cases where delivery is impossible."
      ]
    },
    {
      id: "disclaimer",
      icon: <AlertTriangle size={20} style={{ color: "var(--gold)" }} />,
      title: "8. Krafton Disclaimer & IP Notice",
      content: [
        "Maddy BGMI Store is an independent, third-party player-to-player service and digital goods provider. We are NOT officially affiliated with, endorsed by, sponsored by, or associated with KRAFTON, Inc., PUBG Corporation, Tencent Games, or any of their parent companies or subsidiaries.",
        "All copyrights, trademarks, game names, character assets, and graphics belong entirely to their respective intellectual property owners (Krafton, Inc. / Tencent Games). We claim no ownership over the game's actual proprietary codes or assets.",
        "Buying, selling, or trading virtual assets may technically violate the standard Terms of Service (ToS) of the game developers. By proceeding with a purchase or sale, users acknowledge and accept any associated risk of in-game actions or bans."
      ]
    },
    {
      id: "jurisdiction",
      icon: <Gavel size={20} style={{ color: "var(--gold)" }} />,
      title: "9. Governing Law & Jurisdiction",
      content: [
        "These Terms and Conditions are governed by, and shall be construed in accordance with, the laws of the Republic of India.",
        "You explicitly agree that any legal dispute, controversy, claim, or transaction issue arising out of or in connection with Maddy BGMI Store services, website listings, or marketplace trades shall be subject exclusively to the jurisdiction of the competent courts of Chennai, Tamil Nadu, India."
      ]
    },
    {
      id: "dmca",
      icon: <FileText size={20} style={{ color: "var(--gold)" }} />,
      title: "10. Copyright Notice & DMCA Takedown Procedure",
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
      title: "11. Contact & Support Coordination",
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
              maxWidth: "650px", 
              margin: "12px auto 0", 
              fontSize: "14px", 
              lineHeight: 1.6 
            }}
          >
            Effective Date: May 22, 2026. Fully updated to incorporate Buy, Sell (Instant vs. Hold & Sell), Trade-In Exchanges, UC top-ups, and Gifting regulations. Please read these terms carefully.
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
                        border: "1px solid rgba(255, 215, 0, 0.2)",
                        flexShrink: 0
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
