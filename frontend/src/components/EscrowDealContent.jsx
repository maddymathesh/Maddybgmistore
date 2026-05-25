import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  ShieldCheck, Users, MapPin, CreditCard, Info, AlertTriangle, 
  HelpCircle, ChevronDown, MessageCircle, Send, Gamepad2, 
  Coins, TrendingUp, Clock, FileText, Check, Award, 
  ChevronRight, ShieldAlert, Sparkles, UserCheck, RefreshCw, Landmark,
  X, BookOpen, Lock
} from "lucide-react";

export default function EscrowDeal() {
  useSEO(
    "Secure Escrow Deal System",
    "Comprehensive guide to Maddy BGMI Store's premium Escrow Deal System. Safe high-value transactions through trusted third-party middlemen."
  );

  // FAQ Accordion State
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Calculator State
  const [accountValue, setAccountValue] = useState(250000);
  const [escrowTier, setEscrowTier] = useState("youtuber");
  const [escrowPercentage, setEscrowPercentage] = useState(3.0);
  const [escrowFee, setEscrowFee] = useState(7500);
  const [totalPayment, setTotalPayment] = useState(257500);

  const escrowPartners = {
    youtuber: { name: "Trusted YouTuber", rate: 3.0, desc: "Prominent content creator mutually agreed by both parties." },
    streamer: { name: "Recognized Streamer", rate: 2.8, desc: "Popular live streamer with verified public gaming track records." },
    esports: { name: "Verified Esports Player", rate: 2.5, desc: "Professional tier-1 roster player with official credentials." },
    dealer: { name: "Trusted Dealer", rate: 2.0, desc: "Maddy Store verified trade coordinators or elite legacy middlemen." }
  };

  useEffect(() => {
    const val = Number(accountValue) || 0;
    const rate = escrowPartners[escrowTier]?.rate || 2.0;
    setEscrowPercentage(rate);
    const fee = Math.round(val * (rate / 100));
    setEscrowFee(fee);
    setTotalPayment(val + fee);
  }, [accountValue, escrowTier]);

  const handleCalculatorChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAccountValue(val === "" ? 0 : Number(val));
  };

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is utilizing the escrow transaction system mandatory?",
      answer: "No, using an escrow is entirely optional. Standard direct online transfers managed by Maddy's administration are active and heavily trusted. Escrow simply acts as an extra layer of assurance for high-value transactions if the buyer prefers neutral custody."
    },
    {
      question: "Who holds the authority to choose the escrow person?",
      answer: "Both the buyer and the seller must mutually agree on the selected escrow middleman. Under no circumstances will a transaction proceed if one party feels uncomfortable with the proposed middleman."
    },
    {
      question: "Who is responsible for covering the escrow service charges?",
      answer: "The buyer is entirely responsible for covering all middleman escrow service charges. These fees are added on top of the final agreed account price and paid directly to the escrow holder upfront."
    },
    {
      question: "Why is escrow highly recommended for high-value BGMI deals?",
      answer: "When transactions involve lakhs of rupees (₹80K up to ₹5 Lakhs+), having a neutral, highly recognized third party hold the payment prevents quick-exit recovery scams, payment chargebacks, or coordinate disputes, giving absolute confidence to both sides."
    },
    {
      question: "When exactly is the payment released to the seller?",
      answer: "The escrow holder releases the payment to the seller ONLY after the buyer has fully verified the login coordinates, verified the cosmetic inventory, and successfully binded their recovery email and phone. Not a second before."
    },
    {
      question: "Can we use any random middleman for the transaction?",
      answer: "Absolutely not. Only verified, highly recognized YouTubers, streamers, official esports roster players, or Maddy Store-approved legacy middlemen are eligible. Unknown individuals or fake profile coordinates are strictly rejected."
    }
  ];

  return (
    <>
      <Navbar />

      {/* Premium Dark Page Wrapper */}
      <div style={{ 
        background: "var(--bg)", 
        color: "#fff", 
        paddingTop: "102px", 
        minHeight: "100vh",
        overflow: "hidden"
      }}>

        {/* ==================================================
            SECTION 1 — HERO SECTION
           ================================================== */}
        <section style={{ 
          position: "relative",
          padding: "90px 20px 70px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.07) 0%, transparent 60%)",
          borderBottom: "1px solid var(--border-gold)"
        }}>
          {/* Decorative glowing backdrops */}
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.03) 0%, transparent 70%)", top: "-100px", right: "-150px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 70%)", bottom: "-100px", left: "-150px", pointerEvents: "none" }} />

          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="badge" style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={13} style={{ color: "var(--gold)" }} />
              Neutral Third-Party Escrow
            </div>

            <h1 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(36px, 6vw, 68px)", 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              Secure Escrow <span className="g">Deal System</span>
            </h1>

            <h2 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(18px, 3vw, 26px)", 
              fontWeight: 700, 
              color: "var(--gold)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "24px"
            }}>
              Safe High-Value Transactions Through Trusted Third Parties
            </h2>

            <p style={{ 
              fontSize: "clamp(14px, 1.8vw, 17px)", 
              color: "var(--muted)", 
              maxWidth: "780px", 
              lineHeight: 1.7, 
              marginBottom: "35px"
            }}>
              Tailored for elite transactions, our escrow module introduces mutually trusted gaming middlemen to protect your funds. The payment is held in neutral custody and released to the seller only when you confirm complete account control and linkage bindings.
            </p>

            {/* Trust Badges */}
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              justifyContent: "center", 
              gap: "12px", 
              marginBottom: "40px"
            }}>
              <div style={trustBadgeStyle}>
                <ShieldCheck size={14} style={{ color: "var(--gold)" }} />
                <span>Secure Transaction</span>
              </div>
              <div style={trustBadgeStyle}>
                <Users size={14} style={{ color: "var(--gold)" }} />
                <span>Trusted Middleman</span>
              </div>
              <div style={trustBadgeStyle}>
                <UserCheck size={14} style={{ color: "var(--gold)" }} />
                <span>Verified Process</span>
              </div>
              <div style={trustBadgeStyle}>
                <CreditCard size={14} style={{ color: "var(--gold)" }} />
                <span>Safe Transfer</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              gap: "16px", 
              flexWrap: "wrap", 
              justifyContent: "center",
              marginBottom: "50px"
            }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <Send size={18} /> Join Telegram
              </a>
              <Link to="/buy" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <Gamepad2 size={18} /> View Premium Accounts
              </Link>
            </div>

            {/* Flowchart Illustration */}
            <div style={{
              width: "100%",
              maxWidth: "850px",
              background: "rgba(17, 21, 32, 0.45)",
              border: "1px solid var(--border-gold)",
              borderRadius: "24px",
              padding: "30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="illustration-flex">
                <div style={illuNodeStyle}>
                  <div style={illuIconWrapStyle}>
                    <Users size={28} style={{ color: "var(--gold)" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px" }}>Verified Buyer</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Funds Sent to Escrow</span>
                </div>

                <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                  <div style={{ 
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                    background: "rgba(14, 17, 24, 1)", border: "1px solid var(--border-gold)", 
                    borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                    color: "var(--gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)" 
                  }}>
                    HOLDS FUNDS SECURELY
                  </div>
                </div>

                <div style={{ ...illuNodeStyle, borderColor: "var(--orange)" }}>
                  <div style={{ ...illuIconWrapStyle, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", color: "var(--orange)" }}>
                    <ShieldCheck size={28} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--orange)" }}>Trusted Escrow</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Releases Upon Verification</span>
                </div>

                <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                  <div style={{ 
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                    background: "rgba(14, 17, 24, 1)", border: "1px solid var(--border-gold)", 
                    borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                    color: "var(--gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)" 
                  }}>
                    TRANSFERS ACCOUNT LOGIN
                  </div>
                </div>

                <div style={illuNodeStyle}>
                  <div style={illuIconWrapStyle}>
                    <UserCheck size={28} style={{ color: "var(--gold)" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px" }}>Verified Seller</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Receives Funds After Deal</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================
            SECTION 2 — WHAT IS ESCROW?
           ================================================== */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Definition & Scope</div>
              <h2 className="stitle">What is Escrow?</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "rgba(17, 21, 32, 0.35)", 
              border: "1px solid rgba(255, 255, 255, 0.05)", 
              borderRadius: "20px", 
              padding: "40px 30px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>
              <p style={{ 
                fontSize: "18px", 
                fontWeight: 600, 
                color: "#fff", 
                lineHeight: 1.6, 
                marginBottom: "28px",
                textAlign: "center",
                fontFamily: "var(--font-h)",
                letterSpacing: "0.5px"
              }}>
                “Escrow is a secure transaction method where a trusted third-party middleman temporarily holds the payment until both buyer and seller complete the deal safely.”
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }} className="info-grid">
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Buyer Protection</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>Payment is held safely. If the seller fails coordinates, your funds are returned immediately.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Seller Protection</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>Confirms that the buyer has real, verified funds deposited before you handover the account details.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Prevents Scams</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>Blocks quick password exit reclaims, identity theft, fake bank transfers, and fraud actions.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>VIP Transactions</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px" }}>The golden security standard for premium BGMI accounts and ultra-rare X-suit collection deals.</span>
                  </div>
                </div>
              </div>

              {/* Highlight Note */}
              <div style={{ 
                background: "rgba(255, 215, 0, 0.03)", 
                border: "1px solid rgba(255, 215, 0, 0.15)", 
                borderRadius: "12px", 
                padding: "16px 20px", 
                display: "flex", 
                alignItems: "center", 
                gap: "12px" 
              }}>
                <Info size={20} style={{ color: "var(--gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "13.5px", color: "var(--gold)", fontWeight: 600 }}>
                  Rule Coordinates: Escrow is only done through mutually trusted and recognized individuals.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 3 — WHO CAN ACT AS ESCROW?
           ================================================== */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Partner Network</div>
              <h2 className="stitle">Authorized Escrow Partners</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "10px" }}>
                Escrow is strictly restricted to prominent public figures to avoid coordinated scams or exit frauds.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "35px" }}>
              <div style={partnerCardStyle}>
                <Send size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h3 style={partnerTitleStyle}>Trusted YouTubers</h3>
                <p style={partnerDescStyle}>Content creators with massive subscriber audiences (e.g. 100K+ channels) and public reputations.</p>
              </div>

              <div style={partnerCardStyle}>
                <Gamepad2 size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h3 style={partnerTitleStyle}>Recognized Streamers</h3>
                <p style={partnerDescStyle}>Verified gaming personalities who stream live regularly and hold verified social profiles.</p>
              </div>

              <div style={partnerCardStyle}>
                <Award size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h3 style={partnerTitleStyle}>Esports Players</h3>
                <p style={partnerDescStyle}>Verified professional competitive players active in recognized tournament organizations.</p>
              </div>

              <div style={partnerCardStyle}>
                <Users size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h3 style={partnerTitleStyle}>Trusted Dealers</h3>
                <p style={partnerDescStyle}>Legacy gaming coordinators and middleman agents vetted by Maddy BGMI Store operations.</p>
              </div>
            </div>

            <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "14px", marginBottom: "25px" }}>
              💡 <span style={{ color: "#fff", fontWeight: 700 }}>Mutual Consent:</span> Both buyer and seller must agree on the escrow person before proceeding.
            </div>

            {/* Warning Box */}
            <div style={{ 
              background: "rgba(239, 68, 68, 0.05)", 
              border: "1px solid rgba(239, 68, 68, 0.2)", 
              borderRadius: "12px", 
              padding: "16px 20px", 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              justifyContent: "center"
            }}>
              <ShieldAlert size={20} style={{ color: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "13.5px", color: "#ff8888", fontWeight: 700 }}>
                WARNING: Unknown, unverified, or random discord/telegram middlemen will never be used.
              </span>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 4 — HOW ESCROW WORKS
           ================================================== */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Deal Flowchart</div>
              <h2 className="stitle">How Escrow Works Step-by-Step</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "10px" }}>A complete roadmap tracking payment safety, credential check, and secure payouts.</p>
            </div>

            <div style={{ position: "relative", paddingLeft: "30px" }}>
              {/* Timeline spine */}
              <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, var(--gold) 0%, var(--orange) 100%)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>1</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Choose Account</h4>
                    <p style={timelineDescStyle}>Buyer reviews specifications and picks their desired premium BGMI stock.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>2</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Select Trusted Escrow</h4>
                    <p style={timelineDescStyle}>Buyer and seller mutually discuss and finalize a reputable public figure to serve as middleman.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>3</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Pay 10% Booking Advance</h4>
                    <p style={timelineDescStyle}>Secure the listing and activate the escrow process by transmitting the mandatory non-refundable booking deposit.</p>
                    <button 
                      onClick={() => setShowBookingModal(true)}
                      style={{
                        marginTop: "12px", background: "linear-gradient(135deg, var(--gold), var(--orange))",
                        color: "#000", border: "none", padding: "8px 16px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px",
                        cursor: "pointer", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "0.5px"
                      }}>
                      <BookOpen size={14} /> View Booking Rules
                    </button>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>4</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Escrow Communication Group Created</h4>
                    <p style={timelineDescStyle}>A secured three-party chat group (WhatsApp/Telegram) is established containing the buyer, seller, and selected middleman.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>5</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Buyer Sends Payment</h4>
                    <p style={timelineDescStyle}>Buyer transfers the full agreed account price plus escrow fee coordinates directly to the middleman's bank account.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>6</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Seller Shares Coordinates</h4>
                    <p style={timelineDescStyle}>Upon receiving payment deposit confirmation, the seller submits all social linking and active passwords to the group.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>7</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Buyer Verifies Credentials</h4>
                    <p style={timelineDescStyle}>Buyer logs in, reviews level achievements, verifies gun skins, and checks matches against original listings.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>8</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Recovery Bindings Updated</h4>
                    <p style={timelineDescStyle}>Buyer bind-swaps their recovery mobile number, locks two-factor security codes, and registers their primary recovery email.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>9</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Buyer Confirms Deal Completion</h4>
                    <p style={timelineDescStyle}>Once the account is fully secured under buyer credentials, the buyer posts deal confirmation in the escrow coordinates group.</p>
                  </div>
                </div>

                <div style={{ ...timelineStepStyle, background: "rgba(255,215,0,0.02)", border: "1px solid var(--border-gold)", borderRadius: "12px", padding: "16px 20px" }}>
                  <div style={{ ...timelineDotStyle, background: "linear-gradient(135deg, var(--gold), var(--orange))", color: "#000", border: "2px solid var(--gold)" }}>10</div>
                  <div>
                    <h4 style={{ ...timelineHeaderStyle, color: "var(--gold)" }}>Escrow Releases Payout</h4>
                    <p style={timelineDescStyle}>The middleman releases the held payment directly to the seller's bank coordinates (deducting middleman commissions).</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>11</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Deal Successfully Completed</h4>
                    <p style={timelineDescStyle}>Ownership fully transferred. Lifetime links signed off under warranty safeguards.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Timline Warning Alert */}
            <div style={{ 
              background: "rgba(239, 68, 68, 0.08)", 
              border: "1px solid rgba(239, 68, 68, 0.3)", 
              borderRadius: "15px", 
              padding: "20px 24px", 
              marginTop: "40px"
            }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <ShieldAlert size={28} style={{ color: "var(--red)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ color: "var(--red)", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                    CUSTODY RELEASE RULE
                  </h4>
                  <p style={{ color: "#fff", fontSize: "14.5px", fontWeight: 700 }}>
                    “Escrow payment will strictly not be released to the seller until the buyer confirms successful account ownership verification and recovery bindings.”
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================
            SECTION 5 — ESCROW FEES
           ================================================== */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Financial Overhead</div>
              <h2 className="stitle">Escrow Charges & Live Calculator</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", alignItems: "stretch" }} className="booking-grid">
              
              {/* Fee Rules Card */}
              <div style={{ 
                background: "rgba(17, 21, 32, 0.45)", 
                border: "1px solid rgba(255, 255, 255, 0.04)", 
                borderRadius: "20px", 
                padding: "35px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px", color: "#fff" }}>
                    Service Charge Regulations
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={bookingRuleItemStyle}>
                      <div style={{ ...bookingNumberStyle, background: "var(--gold)", color: "#000" }}>1</div>
                      <span style={{ fontSize: "14.5px", color: "var(--text)" }}>
                        Escrow coordination involves dedicated logistics. Therefore, **middleman service charges apply** to secure the trade.
                      </span>
                    </div>
                    <div style={bookingRuleItemStyle}>
                      <div style={{ ...bookingNumberStyle, background: "var(--gold)", color: "#000" }}>2</div>
                      <span style={{ fontSize: "14.5px", color: "var(--text)" }}>
                        **Escrow charges are borne 100% by the buyer.** They are not split, unless discussed and agreed by the seller prior.
                      </span>
                    </div>
                    <div style={bookingRuleItemStyle}>
                      <div style={{ ...bookingNumberStyle, background: "var(--gold)", color: "#000" }}>3</div>
                      <span style={{ fontSize: "14.5px", color: "var(--text)" }}>
                        Charges are **separate from the account value** and calculated as a percentage of the total transaction size.
                      </span>
                    </div>
                    <div style={bookingRuleItemStyle}>
                      <div style={{ ...bookingNumberStyle, background: "var(--gold)", color: "#000" }}>4</div>
                      <span style={{ fontSize: "14.5px", color: "var(--text)" }}>
                        Rates vary depending on the chosen partner class (trusted YouTubers typically require 3.0% commission).
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  background: "rgba(255, 215, 0, 0.03)", 
                  border: "1px solid var(--border-gold)", 
                  borderRadius: "12px", 
                  padding: "16px 20px", 
                  marginTop: "30px",
                  textAlign: "center"
                }}>
                  <span style={{ fontSize: "13.5px", color: "var(--gold)", fontWeight: 700 }}>
                    “All escrow-related costs are strictly the buyer's responsibility.”
                  </span>
                </div>
              </div>

              {/* Calculator Widget */}
              <div style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(255, 107, 53, 0.01) 100%), var(--card)",
                border: "1px solid var(--border-gold)",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Coins size={36} style={{ color: "var(--gold)", marginBottom: "8px" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Interactive Fee Calculator</h3>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>Compute transaction commission in real time</span>
                </div>

                {/* Input Account Value */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>Account Value (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)", fontWeight: 700, fontSize: "15px" }}>₹</span>
                    <input 
                      type="text" 
                      value={accountValue.toLocaleString()} 
                      onChange={handleCalculatorChange}
                      style={{ 
                        width: "100%", 
                        background: "rgba(8,10,15,0.7)", 
                        border: "1px solid var(--border-gold)", 
                        borderRadius: "10px", 
                        padding: "12px 16px 12px 35px", 
                        color: "#fff", 
                        fontSize: "16px", 
                        fontWeight: 700,
                        outline: "none"
                      }} 
                    />
                  </div>
                </div>

                {/* Range Slider */}
                <div style={{ marginBottom: "16px" }}>
                  <input 
                    type="range" 
                    min="50000" 
                    max="1000000" 
                    step="10000"
                    value={accountValue < 50000 ? 50000 : accountValue > 1000000 ? 1000000 : accountValue} 
                    onChange={e => setAccountValue(Number(e.target.value))}
                    style={{ 
                      width: "100%", 
                      accentColor: "var(--gold)",
                      cursor: "pointer"
                    }} 
                  />
                </div>

                {/* Escrow Partner Tier */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>Escrow Middleman Tier</label>
                  <select 
                    value={escrowTier}
                    onChange={e => setEscrowTier(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(8,10,15,0.7)",
                      border: "1px solid var(--border-gold)",
                      borderRadius: "10px",
                      padding: "12px 16px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="youtuber">Trusted YouTuber (3.0%)</option>
                    <option value="streamer">Recognized Streamer (2.8%)</option>
                    <option value="esports">Esports Player (2.5%)</option>
                    <option value="dealer">Vetted MBS Dealer (2.0%)</option>
                  </select>
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>Account Price</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>₹{accountValue.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>Escrow Charges ({escrowPercentage}%)</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold)" }}>₹{escrowFee.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "13.5px", color: "#fff", fontWeight: 700 }}>Total Paid to Escrow</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--gold)" }}>₹{totalPayment.toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 6 — ACCOUNT SECURITY PROCESS
           ================================================== */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Secure Handoff</div>
              <h2 className="stitle">Account Verification & Safeguards</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "rgba(17, 21, 32, 0.45)", 
              border: "1px solid rgba(255, 255, 255, 0.04)", 
              borderRadius: "20px", 
              padding: "35px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
            }}>
              <p style={{ color: "var(--text)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "25px", textAlign: "justify" }}>
                Once the middleman secures the funds, the buyer gains full verification authority. Maddy BGMI Store enforces a rigid social linkage swap protocol to make reclaims technically impossible.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="info-grid">
                <div style={secPointStyle}>
                  <Check size={14} style={{ color: "var(--gold)" }} />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Recovery Email Bound</h4>
                    <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>Primary recovery email is updated to the buyer's coordinates.</p>
                  </div>
                </div>

                <div style={secPointStyle}>
                  <Check size={14} style={{ color: "var(--gold)" }} />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Recovery Phone Updated</h4>
                    <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>Two-factor authentication mobile bindings swapped to the buyer.</p>
                  </div>
                </div>

                <div style={secPointStyle}>
                  <Check size={14} style={{ color: "var(--gold)" }} />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Login Credentials Checked</h4>
                    <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>Buyer physically verifies the cosmetic inventory and unlinks.</p>
                  </div>
                </div>

                <div style={secPointStyle}>
                  <Check size={14} style={{ color: "var(--gold)" }} />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Final Transition Signed</h4>
                    <p style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>Total ownership rights are legally declared as successfully completed.</p>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: "rgba(255, 215, 0, 0.03)", 
                border: "1px dashed var(--border-gold)", 
                borderRadius: "12px", 
                padding: "16px 20px", 
                marginTop: "30px",
                textAlign: "center"
              }}>
                <span style={{ fontSize: "13.5px", color: "var(--gold)", fontWeight: 700 }}>
                  “Full account ownership transfer is completed only after successful verification.”
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 7 — WHY ESCROW IS SAFER
           ================================================== */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Security Pillars</div>
              <h2 className="stitle">Why Escrow is Safer</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "10px" }}>Six foundational reasons that make our escrow systems the premier safe-deal architecture.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={trustCardStyle}>
                <UserCheck size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Neutral Protection</h4>
                <p style={trustCardDescStyle}>Middleman maintains complete neutrality, strictly locking payment coordinates to guard interests of both parties.</p>
              </div>

              <div style={trustCardStyle}>
                <ShieldCheck size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Reduced Scam Risk</h4>
                <p style={trustCardDescStyle}>Renders quick password exit reclaims, fake payment confirmations, and trade disputes physically impossible.</p>
              </div>

              <div style={trustCardStyle}>
                <CreditCard size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Secure Payment Holding</h4>
                <p style={trustCardDescStyle}>Your lakhs of rupees are locked in safe verified accounts rather than being wired directly to unknown sellers.</p>
              </div>

              <div style={trustCardStyle}>
                <Gamepad2 size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Safer Premium Deals</h4>
                <p style={trustCardDescStyle}>Specially optimized to execute flawless handovers for ultra-premium BGMI collector accounts.</p>
              </div>

              <div style={trustCardStyle}>
                <MessageCircle size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Real-time Communication</h4>
                <p style={trustCardDescStyle}>Direct group coordination ensures active assistance, clearing social link coordinates in minutes.</p>
              </div>

              <div style={trustCardStyle}>
                <Award size={24} style={{ color: "var(--gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>High-Value Deal Trust</h4>
                <p style={trustCardDescStyle}>Ensures smooth transaction safety that protects hard-earned money and high-tier account inventory.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 8 — EXAMPLE ESCROW SCENARIO
           ================================================== */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Case Study</div>
              <h2 className="stitle">Example Escrow Scenario</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "rgba(17, 21, 32, 0.45)", 
              border: "1px solid rgba(255, 255, 255, 0.04)", 
              borderRadius: "20px", 
              padding: "35px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
            }}>
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-h)" }}>
                  Storyboard: Simulated ₹250K VIP Deal
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>1</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Negotiation & Selection:** Buyer initiates purchase of a ₹2.5 Lakh BGMI account, and both parties agree to use a mutually recognized **Trusted YouTuber** as middleman.
                  </span>
                </div>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>2</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Security Deposit:** Buyer deposits the ₹2.5 Lakh plus the YouTuber's 3.0% service fee directly into the middleman's bank account.
                  </span>
                </div>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>3</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Login Handoff:** Once the YouTuber logs receipt, the seller shares the active social logins and unlinking coordinates in the secure group.
                  </span>
                </div>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>4</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Buyer Verification:** The buyer logs in, confirms cosmetic items, and bind-swaps their personal recovery phone and 2FA credentials.
                  </span>
                </div>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>5</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Deal Confirmed:** Once the account is fully secured under buyer credentials, the buyer posts deal confirmation in the group.
                  </span>
                </div>
                <div style={scenarioStepStyle}>
                  <div style={scenarioNumStyle}>6</div>
                  <span style={{ fontSize: "13.5px", color: "var(--text)" }}>
                    **Payment Release:** The YouTuber releases the held payment directly to the seller's coordinates, completing a **safe transaction for both sides**.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 9 — VERIFICATION & ID POLICY
           ================================================== */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">KYC Protection</div>
              <h2 className="stitle">Identity Safety Coordinates</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "rgba(17, 21, 32, 0.45)", 
              border: "1px solid rgba(255, 255, 255, 0.04)", 
              borderRadius: "20px", 
              padding: "35px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
            }}>
              <div style={{ display: "flex", gap: "24px", alignItems: "center" }} className="kyc-flex">
                <div style={{ 
                  width: "70px", 
                  height: "70px", 
                  borderRadius: "50%", 
                  background: "rgba(255, 215, 0, 0.05)", 
                  border: "2px solid var(--gold)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }} className="kyc-badge-wrap">
                  <ShieldCheck size={36} style={{ color: "var(--gold)" }} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px", fontFamily: "var(--font-h)" }}>Verification & Legal Integrity</h3>
                  <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    In rare circumstances (high-value deals or cyber-fraud alerts), basic government identity proof (for example, Aadhaar, PAN Card, or Driving License copies) may be requested from the transaction parties to confirm legal payment names.
                  </p>
                </div>
              </div>

              <div style={{ margin: "24px 0", height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="info-grid">
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Check size={16} style={{ color: "var(--gold)", marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>**Strict Privacy:** All KYC files are held securely in private offline vaults and are never broadcasted or shared.</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Check size={16} style={{ color: "var(--gold)", marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--muted)" }}>**Fraud Defense:** Essential to protect against unauthorized credit cards, fake payment screenshots, and bank freeze attempts.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 10 — IMPORTANT ESCROW RULES
           ================================================== */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel" style={{ color: "var(--red)" }}>Warning Rules</div>
              <h2 className="stitle">Mandatory Escrow Rules</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "10px" }}>Failure to follow these protocols results in immediate deal voiding and blacklisting.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              
              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Users size={20} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Pre-approved Contacts Only</h4>
                    <p style={ruleCardDescStyle}>Escrows are conducted purely through mutually trusted public YouTubers, streamers, or verified legacy middlemen.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Coins size={20} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Buyer Pays Service Fee</h4>
                    <p style={ruleCardDescStyle}>All commission rates (typically 2% to 5%) charged by the escrow holder are paid entirely by the buyer upfront.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <ShieldCheck size={20} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Full Verification First</h4>
                    <p style={ruleCardDescStyle}>Payments will not be released by the middleman until the buyer confirms recovery binds are 100% updated.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <ShieldAlert size={20} style={{ color: "var(--red)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={{ ...ruleCardTitleStyle, color: "var(--red)" }}>No Unknown Middlemen</h4>
                    <p style={ruleCardDescStyle}>Unknown or unverified third parties are strictly forbidden. Any attempt will immediately cancel the transaction.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <AlertTriangle size={20} style={{ color: "var(--red)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={{ ...ruleCardTitleStyle, color: "var(--red)" }}>Fake Screenshot Ban</h4>
                    <p style={ruleCardDescStyle}>Any submission of fake payment screenshots or altered deposit logs leads to instant coordinate blacklisting and legal reports.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <FileText size={20} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Follow Guidelines Carefully</h4>
                    <p style={ruleCardDescStyle}>Both parties must strictly follow the middleman's standardized handbook instructions for an immaculate trade.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 11 — FAQ SECTION
           ================================================== */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Help Center</div>
              <h2 className="stitle">Common Escrow Doubts Resolved</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--gold), var(--orange))", margin: "12px auto" }} />
            </div>

            {/* Accordion list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} style={{
                    background: "rgba(17, 21, 32, 0.45)",
                    border: isExpanded ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    boxShadow: isExpanded ? "0 10px 30px rgba(255,215,0,0.01)" : "none"
                  }}>
                    <button
                      onClick={() => toggleFAQ(idx)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                        cursor: "pointer",
                        color: isExpanded ? "var(--gold)" : "#fff",
                        fontFamily: "var(--font-h)",
                        fontWeight: 700,
                        fontSize: "15.5px",
                        letterSpacing: "0.5px"
                      }}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={18} style={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        color: isExpanded ? "var(--gold)" : "var(--muted)",
                        flexShrink: 0,
                        marginLeft: "15px"
                      }} />
                    </button>

                    <div style={{
                      maxHeight: isExpanded ? "250px" : "0",
                      opacity: isExpanded ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease",
                      background: "rgba(0,0,0,0.15)",
                      borderTop: isExpanded ? "1px solid rgba(255,255,255,0.03)" : "none"
                    }}>
                      <p style={{
                        padding: "20px 24px",
                        color: "var(--muted)",
                        fontSize: "14px",
                        lineHeight: 1.6
                      }}>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 12 — FINAL CTA SECTION
           ================================================== */}
        <section style={{ 
          padding: "100px 20px", 
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 107, 53, 0.05) 0%, transparent 60%)",
          position: "relative"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="badge" style={{ marginBottom: "20px" }}>High-Value Security System</div>
            
            <h2 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(32px, 5vw, 52px)", 
              fontWeight: 900, 
              lineHeight: 1.1,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              Need Maximum <span className="g">Transaction Security?</span>
            </h2>

            <p style={{ 
              color: "var(--muted)", 
              fontSize: "16px", 
              lineHeight: 1.6, 
              maxWidth: "600px", 
              margin: "0 auto 35px" 
            }}>
              Establish a secure transaction today. Connect with Maddy Store support administrators to coordinate trusted middlemen escrow channels.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "35px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <Send size={18} /> Join Telegram
              </a>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <ShieldCheck size={18} /> Start Secure Escrow Deal
              </a>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: "var(--gold)", fontWeight: 700, fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "var(--font-h)" }}>
              <ShieldCheck size={18} />
              <span>Trusted by 2000+ Buyers Across India</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            STICKY MOBILE CTA BUTTONS
           ================================================== */}
        <div style={stickyMobileCTAStyle} className="mobile-cta-sticky">
          <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" style={stickyBtnGreenStyle}>
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" style={stickyBtnTgStyle}>
            <Send size={18} /> Telegram
          </a>
        </div>

      </div>

      <Footer />

      {/* 10% Booking Pop-up Modal */}
      {showBookingModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(8, 10, 15, 0.85)", backdropFilter: "blur(8px)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--card)", border: "1px solid var(--border-gold)",
            borderRadius: "20px", width: "100%", maxWidth: "550px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)", position: "relative",
            overflow: "hidden", animation: "modalFadeIn 0.3s ease"
          }}>
            {/* Header */}
            <div style={{
              background: "rgba(255, 215, 0, 0.05)", borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
              padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Lock size={20} style={{ color: "var(--gold)" }} />
                <h3 style={{ margin: 0, color: "#fff", fontSize: "18px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px" }}>Booking Protocol</h3>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div style={{ padding: "24px" }}>
              <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                To secure any premium account and filter out non-serious queries, we enforce a strict booking policy.
              </p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>1</div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px", marginBottom: "4px" }}>10% Total Price</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>The booking amount is exactly calculated as 10% of the finalized deal value.</span>
                  </div>
                </li>
                
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(239,68,68,0.05)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>2</div>
                  <div>
                    <strong style={{ display: "block", color: "#ff8888", fontSize: "14px", marginBottom: "4px" }}>Strictly Non-Refundable</strong>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: 1.5 }}>If you cancel the deal or fail to pay the balance, the deposit is completely forfeited.</span>
                  </div>
                </li>
                
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>3</div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px", marginBottom: "4px" }}>No Early Access</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>Booking secures the item, but account credentials are NEVER handed over until full payment is made.</span>
                  </div>
                </li>
                
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>4</div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px", marginBottom: "4px" }}>Limited Window</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>The booking temporarily locks the listing, typically valid for only 24 hours.</span>
                  </div>
                </li>
              </ul>
              
              <button 
                onClick={() => setShowBookingModal(false)}
                style={{
                  width: "100%", marginTop: "24px", padding: "14px", borderRadius: "10px",
                  background: "rgba(255, 215, 0, 0.1)", border: "1px solid var(--gold)", color: "var(--gold)",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "1px"
                }}>
                I Understand
              </button>
            </div>
            
            <style>{`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Media styling overrides */}
      <style>{`
        .hero-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 768px) {
          .illustration-flex {
            flex-direction: column;
            gap: 30px;
          }
          .illustration-line {
            display: none !important;
          }
          .compare-grid, .booking-grid, .info-grid, .expense-grid {
            grid-template-columns: 1fr !important;
          }
          .kyc-flex {
            flex-direction: column;
            text-align: center;
          }
          .kyc-badge-wrap {
            margin: 0 auto;
          }
          .mobile-cta-sticky {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

// ========================================
// STYLING DECLARATIONS
// ========================================

const trustBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  color: "#fff",
  fontFamily: "var(--font-h)",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "8px 18px",
  borderRadius: "30px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
};

const illuNodeStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  background: "rgba(8,10,15,0.7)",
  border: "1px solid var(--border-gold)",
  padding: "20px 24px",
  borderRadius: "18px",
  flex: 1,
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
};

const illuIconWrapStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "rgba(255,215,0,0.06)",
  border: "1px solid rgba(255,215,0,0.2)",
  color: "var(--gold)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 15px rgba(255,215,0,0.05)"
};

const infoBulletStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: "12px",
  padding: "16px 20px"
};

const partnerCardStyle = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "18px",
  padding: "28px 20px",
  textAlign: "center",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
};

const partnerTitleStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "16px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#fff",
  marginBottom: "8px"
};

const partnerDescStyle = {
  fontSize: "12.5px",
  color: "var(--muted)",
  lineHeight: 1.6
};

const bookingRuleItemStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "flex-start"
};

const bookingNumberStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "var(--red)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  fontFamily: "var(--font-h)",
  flexShrink: 0
};

const secPointStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  padding: "16px",
  borderRadius: "12px"
};

const timelineStepStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  position: "relative",
  zIndex: 2
};

const timelineDotStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "var(--bg3)",
  border: "2px solid var(--border-gold)",
  color: "var(--gold)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: 800,
  fontFamily: "var(--font-h)",
  flexShrink: 0,
  boxShadow: "0 0 10px rgba(0,0,0,0.5)"
};

const timelineHeaderStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "16px",
  fontWeight: 700,
  color: "#fff",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const timelineDescStyle = {
  fontSize: "13.5px",
  color: "var(--muted)",
  lineHeight: 1.5
};

const trustCardStyle = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "18px",
  padding: "28px 20px",
  textAlign: "center",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0 5px 20px rgba(0,0,0,0.1)"
};

const trustCardTitleStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "16px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#fff",
  marginBottom: "8px"
};

const trustCardDescStyle = {
  fontSize: "12.5px",
  color: "var(--muted)",
  lineHeight: 1.6
};

const ruleCardStyle = {
  background: "rgba(17, 21, 32, 0.35)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "14px",
  padding: "20px",
  transition: "all 0.25s ease"
};

const ruleCardTitleStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "15px",
  fontWeight: 700,
  color: "#fff",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const ruleCardDescStyle = {
  fontSize: "12.5px",
  color: "var(--muted)",
  lineHeight: 1.5
};

const scenarioStepStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: "12px",
  padding: "16px 20px"
};

const scenarioNumStyle = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  background: "var(--gold-dim)",
  border: "1px solid var(--gold-border)",
  color: "var(--gold)",
  fontFamily: "var(--font-h)",
  fontSize: "12px",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const stickyMobileCTAStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  background: "rgba(8, 10, 15, 0.95)",
  backdropFilter: "blur(12px)",
  borderTop: "1px solid var(--border-gold)",
  padding: "12px 16px",
  display: "none",
  gap: "12px"
};

const stickyBtnGreenStyle = {
  flex: 1,
  background: "var(--green)",
  color: "#000",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "var(--font-h)",
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "12px 0",
  borderRadius: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textDecoration: "none"
};

const stickyBtnTgStyle = {
  flex: 1,
  background: "#229ED9",
  color: "#fff",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "var(--font-h)",
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "12px 0",
  borderRadius: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textDecoration: "none"
};
