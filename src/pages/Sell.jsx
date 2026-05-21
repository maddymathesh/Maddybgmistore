import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Banknote, Zap, Lock, Video, FileText, BarChart, ShieldCheck, 
  Megaphone, Clock, Handshake, CheckCircle, MessageCircle, 
  ChevronDown, ChevronUp, AlertTriangle, Shield, Award, Sparkles, Info,
  Smartphone, Key, Users, QrCode, MapPin, CreditCard, HelpCircle, Check
} from "lucide-react";

export default function Sell() {
  const [activeOption, setActiveOption] = useState(0); // 0 = Hold & Sell, 1 = Instant Sell
  const [activeTrustCard, setActiveTrustCard] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState(0); // 0 = Checklist, 1 = Rules, 2 = Guarantee

  // Steps data for Hold & Sell
  const holdAndSellSteps = [
    {
      title: "Customer Contact & Sharing",
      body: "Contact us via WhatsApp or Telegram and securely share your account video, inventory description, or logins.",
      icon: <MessageCircle size={18} />,
    },
    {
      title: "Market Price Evaluation",
      body: "We evaluate the true market price of your inventory based on upgrading labs, classic skins, etc., and inform you of the value.",
      icon: <BarChart size={18} />,
    },
    {
      title: "Verification & Login Lock",
      body: "Once we agree on the market price, we add an official login or secure one login method for complete ownership verification.",
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "Professional Listing & Channel Broadcast",
      body: "We record a new professional preview video, write a comprehensive description, and broadcast your listing across our VIP channels (Telegram, WhatsApp, etc.).",
      icon: <Megaphone size={18} />,
    },
    {
      title: "3-7 Days Typical Listing Cycle",
      body: "Typically, listings sell in 3 to 7 days. If the account does not sell in this window, we adjust the price and re-list it.",
      icon: <Clock size={18} />,
    },
    {
      title: "Double-Login Securing for Buyer",
      body: "Once a buyer is secured, we take over custody and secure both logins for the buyer to ensure a safe, permanent transfer.",
      icon: <Lock size={18} />,
    },
    {
      title: "Owner Government ID KYC Proof",
      body: "Before releasing the final payment, we collect the owner's valid government ID proof (Aadhaar or PAN Card) for future reference and keep it secure.",
      icon: <FileText size={18} />,
    },
    {
      title: "Payout Release & Delivery Confirmation",
      body: "We pay the original owner after the buyer confirms successful delivery. Full or partial payment depends on guarantees, cleared via UPI, Bank Transfer, USDT, BTC, or F2F Cash for large accounts.",
      icon: <CreditCard size={18} />,
    }
  ];

  // Steps data for Instant Sell
  const instantSellSteps = [
    {
      title: "Support Connection & Logins",
      body: "Message us on WhatsApp or Telegram and securely share temporary credentials for audit access.",
      icon: <MessageCircle size={18} />,
    },
    {
      title: "Live Inventory Scan",
      body: "Our analysts perform an immediate valuation and present a solid, direct wholesale cash buyout offer within hours.",
      icon: <BarChart size={18} />,
    },
    {
      title: "Select Mode of Dealing",
      body: "Choose secure Online Transfer or Face-to-Face meetup (strictly reserved for premium ₹80,000+ accounts).",
      icon: <MapPin size={18} />,
    },
    {
      title: "KYC & Identity Verification",
      body: "Submit government-issued ID proof (Aadhaar or PAN Card) to verify ownership and authorize buyout.",
      icon: <FileText size={18} />,
    },
    {
      title: "Single/Dual Login Security",
      body: "We audit bindings. For dual logins, we secure the primary login and submit the secondary unlink request.",
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "Quarantine Cooldown Timelines",
      body: "If unlinks require a 7-day wait or links require 30 days, the account is held in secure quarantine.",
      icon: <Clock size={18} />,
    },
    {
      title: "Irreversible Handover Clause",
      body: "Seller signs terms for complete credential detachment. Once locked, the account cannot be returned.",
      icon: <Lock size={18} />,
    },
    {
      title: "Immediate Wholesale Payout",
      body: "Funds are instantly released via UPI, Bank Transfer, or liquid Cash (for F2F deals) within 1-2 hours of binding.",
      icon: <CreditCard size={18} />,
    }
  ];

  const currentSteps = activeOption === 0 ? holdAndSellSteps : instantSellSteps;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "90vh",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          {/* Background image */}
          <img
            src="/sell-banner.webp"
            alt="BGMI Soldier in wheat field" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              filter: "brightness(0.65)",
            }}
          />
          {/* Gradient overlays — top + bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.95) 100%)",
          }} />
          {/* Top-right warm vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "820px",
          }}>
            <div className="badge animate-pulse" style={{ marginBottom: "20px" }}>
              <Banknote size={14} /> Premium Selling Portal
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,72px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
              textShadow: "0 2px 25px rgba(0,0,0,0.7)",
            }}>
              Turn Your BGMI Account<br />
              <span className="g">Into Secure Cash</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,19px)",
              maxWidth: "620px", margin: "0 auto 32px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Maximize your return under Hold & Sell, or cash out immediately with Instant Sell. Secure valuation, KYC audits, and verified payments.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button 
                onClick={() => {
                  setActiveOption(0);
                  document.getElementById("selling-options")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "14px 30px", borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--gold), var(--orange))",
                  color: "#000", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", border: "none", cursor: "pointer", letterSpacing: "0.5px",
                  boxShadow: "0 4px 20px rgba(255,215,0,0.3)",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                <Clock size={16} /> Hold & Sell Option
              </button>
              <button 
                onClick={() => {
                  setActiveOption(1);
                  document.getElementById("selling-options")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "14px 30px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", cursor: "pointer", letterSpacing: "0.5px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold)";
                  e.currentTarget.style.background = "rgba(255,215,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}>
                <Zap size={16} /> Instant Sell Option
              </button>
            </div>
          </div>
        </section>

        {/* ── ESSENTIAL SELLER & HANDOVER PROTOCOLS SPOTLIGHT ─ */}
        <section style={{
          padding: "50px 5% 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(255, 215, 0, 0.05) 100%)",
            border: "1px dashed rgba(34, 197, 94, 0.4)",
            borderRadius: "20px",
            padding: "32px 30px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "150px",
              height: "150px",
              background: "radial-gradient(circle, rgba(34, 197, 94, 0.08) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}>
              <ShieldCheck size={24} style={{ color: "#22c55e", filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }} />
              <h3 style={{
                fontFamily: "var(--font-h)",
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: 0,
                color: "#fff"
              }}>
                Essential Seller & Handover Protocols
              </h3>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "28px"
            }}>
              {/* Rule 1 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4ade80", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  01
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    Strict KYC & ID Audits
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    To prevent disputes, we securely collect the owner's valid government ID proof (Aadhaar or PAN Card) before final payment for future reference and keep it 100% secure.
                  </span>
                </div>
              </div>

              {/* Rule 2 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4ade80", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  02
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    Flexible Deal Modes & F2F
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Choose secure online escrow transfer or a Face-to-Face meetup. Cash meetups are strictly reserved for premium account valuations above <strong>₹80,000+</strong> (travel expenses covered by the buyer).
                  </span>
                </div>
              </div>

              {/* Rule 3 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.12)", border: "1px solid rgba(239, 68, 68, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#f87171", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  03
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    Irrevocable Handover Policy
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Once our security team detaches bindings and binds the account to the buyer, <strong>the account cannot be returned under any circumstances</strong> to prevent pull-backs. Payout is 100% locked & guaranteed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID SECTION ────────────────────────── */}
        <section id="selling-options" className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)", padding: "50px 5% 50px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Selling Methods</span>
            <h2 className="stitle">Two Curated Ways to Cash Out <span className="g">Your Account</span></h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Select the best method that fits your timeline and expectations. Click a card to focus its detailed steps and transaction flows.
            </p>
          </div>

          <div className="options-grid-two">
            {/* OPTION 1: HOLD & SELL */}
            <div 
              className={`sell-option-card ${activeOption === 0 ? "active-blue" : ""}`}
              onClick={() => setActiveOption(0)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-blue">
                  <Clock size={11} fill="currentColor" /> Maximum Payout
                </span>
                <h3 className="sell-option-title">Hold & Sell</h3>
              </div>
              <p className="sell-option-desc">
                Get 100% maximum market value for your account. You list the account with us, we record an HD video, write the description, market it across our massive VIP communities, and handle the secure double-login transfer. Average sale time is 3-7 days.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Secure Hold & Sell Steps:</h4>
                <ul className="steps-list-custom">
                  {holdAndSellSteps.slice(0, 8).map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-blue">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container">
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20list%20my%20BGMI%20account%20via%20Hold%20%26%20Sell." target="_blank" rel="noreferrer" className="btn btn-gold" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <MessageCircle size={18} /> Start Hold & Sell →
                </a>
              </div>
            </div>

            {/* OPTION 2: INSTANT SELL */}
            <div 
              className={`sell-option-card ${activeOption === 1 ? "active-green" : ""}`}
              onClick={() => setActiveOption(1)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-green">
                  <Zap size={11} fill="currentColor" /> Instant Payout
                </span>
                <h3 className="sell-option-title">Instant Sell</h3>
              </div>
              <p className="sell-option-desc">
                Need immediate cash? Sell your account directly to us at wholesale rates. We skip listing delays, marketing wait times, and buyer meetups, providing a direct fixed buyout offer and immediate payment within hours.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Instant Sell Steps:</h4>
                <ul className="steps-list-custom">
                  {instantSellSteps.slice(0, 8).map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-green">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container">
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20need%20immediate%20cash%20and%20want%20to%20sell%20my%20BGMI%20account%20instantly." target="_blank" rel="noreferrer" className="btn btn-green" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <Zap size={18} /> Sell Instantly Now →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE TIMELINE FLOW VISUALIZER ────────────────── */}
        <section className="section" style={{ background: "rgba(10, 13, 20, 0.4)", borderTop: "1px solid rgba(255, 255, 255, 0.05)", padding: "70px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Interactive Roadmap</span>
            <h2 className="stitle">Visual Handover & <span className="g">Escrow Timeline</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Track the exact progress pathway of your selected selling mode. Switch options in the grid above to dynamically preview the timeline.
            </p>
          </div>

          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            {/* Mode Switcher inside Timeline section */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "40px"
            }}>
              <button 
                onClick={() => setActiveOption(0)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "30px",
                  background: activeOption === 0 ? "rgba(59, 130, 246, 0.12)" : "transparent",
                  border: activeOption === 0 ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                  color: activeOption === 0 ? "#60a5fa" : "var(--muted)",
                  fontFamily: "var(--font-h)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.25s"
                }}
              >
                <Clock size={14} /> Hold & Sell Pathway
              </button>
              <button 
                onClick={() => setActiveOption(1)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "30px",
                  background: activeOption === 1 ? "rgba(34, 197, 94, 0.12)" : "transparent",
                  border: activeOption === 1 ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.1)",
                  color: activeOption === 1 ? "#4ade80" : "var(--muted)",
                  fontFamily: "var(--font-h)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.25s"
                }}
              >
                <Zap size={14} /> Instant Sell Pathway
              </button>
            </div>

            {/* Timeline Wrapper */}
            <div style={{
              position: "relative",
              paddingLeft: "45px",
              borderLeft: `2px dashed ${activeOption === 0 ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`,
              marginLeft: "15px"
            }}>
              {/* Highlight active trace line */}
              <div style={{
                position: "absolute",
                left: "-2px",
                top: 0,
                bottom: 0,
                width: "2px",
                background: `linear-gradient(to bottom, ${activeOption === 0 ? "#3b82f6, #60a5fa" : "#22c55e, #4ade80"})`,
                boxShadow: `0 0 10px ${activeOption === 0 ? "rgba(59,130,246,0.5)" : "rgba(34,197,94,0.5)"}`,
                transition: "all 0.5s ease"
              }} />

              {/* Steps Generator */}
              {currentSteps.map((step, idx) => (
                <div key={idx} className="timeline-node-card fade-in" style={{
                  position: "relative",
                  marginBottom: "35px",
                  background: "rgba(17, 21, 32, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "14px",
                  padding: "20px 24px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                }}>
                  {/* Glowing Node Icon */}
                  <div style={{
                    position: "absolute",
                    left: "-66px",
                    top: "18px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#080a0f",
                    border: `2px solid ${activeOption === 0 ? "#3b82f6" : "#22c55e"}`,
                    boxShadow: `0 0 12px ${activeOption === 0 ? "rgba(59, 130, 246, 0.4)" : "rgba(34, 197, 94, 0.4)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: activeOption === 0 ? "#60a5fa" : "#4ade80",
                    zIndex: 2,
                    transition: "all 0.3s ease"
                  }}>
                    {step.icon}
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <h3 style={{
                      fontFamily: "var(--font-h)",
                      fontSize: "16px",
                      color: "#fff",
                      margin: 0,
                      fontWeight: 700,
                      letterSpacing: "0.5px"
                    }}>
                      {step.title}
                    </h3>
                    <span style={{
                      fontSize: "11px",
                      fontFamily: "var(--font-h)",
                      fontWeight: 700,
                      background: activeOption === 0 ? "rgba(59,130,246,0.1)" : "rgba(34,197,94,0.1)",
                      border: `1px solid ${activeOption === 0 ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`,
                      color: activeOption === 0 ? "#60a5fa" : "#4ade80",
                      padding: "2px 10px",
                      borderRadius: "100px",
                      textTransform: "uppercase"
                    }}>
                      Step 0{idx + 1}
                    </span>
                  </div>

                  <p style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    margin: 0
                  }}>
                    {step.body}
                  </p>

                  {/* Enhanced conditional labels inside specific steps */}
                  {activeOption === 0 && idx === 4 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode yellow-border"><Clock size={11} /> 3-7 Days Average Sell Time</span>
                      <span className="pill-deal-mode gold-border"><Award size={11} /> Price Adjustment Re-listing Policy</span>
                    </div>
                  )}

                  {activeOption === 0 && idx === 5 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode red-border"><Lock size={11} /> Secure BOTH logins locked for Buyer</span>
                    </div>
                  )}

                  {activeOption === 0 && idx === 6 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode green-border"><Check size={11} /> Government Aadhaar/PAN Proof Secured</span>
                    </div>
                  )}

                  {activeOption === 0 && idx === 7 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode gold-border"><MapPin size={11} /> Payout Released after Buyer delivery confirmation</span>
                      <span className="pill-deal-mode green-border"><CreditCard size={11} /> UPI, Bank, USDT, BTC, or Face-to-Face cash for large accounts</span>
                    </div>
                  )}

                  {activeOption === 1 && idx === 2 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode"><MapPin size={11} /> Online Transfer (Instant & Escrowed)</span>
                      <span className="pill-deal-mode gold-border"><Users size={11} /> Face-to-Face Meetup (Available strictly for ₹80,000+ valuations)</span>
                    </div>
                  )}

                  {activeOption === 1 && idx === 3 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode green-border"><Check size={11} /> PAN Card Validated</span>
                      <span className="pill-deal-mode green-border"><Check size={11} /> Aadhaar Card Verified</span>
                    </div>
                  )}

                  {activeOption === 1 && idx === 6 && (
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="pill-deal-mode red-border"><AlertTriangle size={11} /> Irrevocable: No returns once binds are secured</span>
                      <span className="pill-deal-mode yellow-border"><Clock size={11} /> 7-Day Unlink Cooldown / 30-Day Link Wait</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY TRUST MADDY STORE ───────────────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5%" }}>
          <h2 className="stitle" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", fontSize: "clamp(26px,4vw,38px)", marginBottom: "32px", fontFamily: "var(--font-h)" }}>
            <Award size={28} style={{ color: "var(--gold)" }} /> Why Trust <span className="g">Maddy Store?</span>
          </h2>
          
          <div className="why-us-grid" style={{ marginBottom: "40px" }}>
            {[
              { h: "100% Trusted Deals", p: "Over 5000+ satisfied customers globally." },
              { h: "Safe Handovers", p: "Proprietary security protocols ensuring complete legal and credentials detachment." },
              { h: "24/7 Support", p: "Dedicated specialist team standing by for after-sales and seller queries." },
              { h: "KYC Assured Security", p: "KYC audits preventing fraudulent retrievals or listing disputes." }
            ].map((item, idx) => (
              <div 
                key={item.h} 
                className={`why-us-card why-us-card-green ${activeTrustCard === idx ? 'highlighted' : ''}`}
                onClick={() => setActiveTrustCard(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="why-us-icon-wrap" style={{ color: "#22c55e", background: "rgba(34, 197, 94, 0.04)", borderColor: "rgba(34, 197, 94, 0.15)" }}>
                  <CheckCircle size={20} />
                </div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20questions%20about%20selling%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green" style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <MessageCircle size={15} /> WhatsApp Support
            </a>
          </div>
        </section>

        {/* ── SELLER HANDOVER & UNLINK EDUCATION HUB ──────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">Trust & Security</span>
            <h2 className="stitle">How Account Handover & <span className="g">Unlinks Work</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Selling with Maddy Store is clear, transparent, and secure. Understand how we verify accounts, initiate unlinking, and guarantee safe payout release.
            </p>
          </div>

          <div style={{
            maxWidth: "1000px",
            margin: "0 auto",
            background: "rgba(14, 17, 24, 0.7)",
            border: "1px solid var(--border-gold)",
            borderRadius: "24px",
            padding: "35px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            {/* Seller-friendly Unlink Summary Block */}
            <div style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.01) 100%)",
              border: "1px dashed rgba(34, 197, 94, 0.25)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "30px",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              flexWrap: "wrap"
            }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                color: "#4ade80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Shield size={22} />
              </div>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <h4 style={{
                  fontFamily: "var(--font-h)",
                  fontSize: "16px",
                  color: "#fff",
                  margin: "0 0 8px 0",
                  letterSpacing: "0.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  Pre-Listing Integrity & Payout Assurance Protocol
                </h4>
                <p style={{
                  color: "var(--muted)",
                  fontSize: "13.5px",
                  lineHeight: "1.6",
                  margin: 0
                }}>
                  As a premium seller, you receive full legal protection and guaranteed, direct payments. To ensure complete safety for both sides, we use a structured escrow and handover process. If your account has active dual-social links, we initiate an official <strong>7-day unlink cooldown</strong> for the secondary login. During this waiting period, you must not log into that secondary network. Once security bindings are complete and the primary login is handed over, your payout is instantly released. All transactions are fully audited to ensure compliance with our zero-retrieval guarantees.
                </p>
              </div>
            </div>

            {/* Tabs Header */}
            <div style={{
              display: "flex",
              gap: "10px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "15px",
              marginBottom: "25px",
              flexWrap: "wrap"
            }}>
              {[
                { label: "1. Pre-Listing Checklist", icon: <Info size={16} /> },
                { label: "2. Unlinking Rules for Sellers", icon: <Clock size={16} /> },
                { label: "3. Payout & KYC Guarantee", icon: <Shield size={16} /> }
              ].map((tab, idx) => {
                const isActive = activeUnlinkTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveUnlinkTab(idx)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontFamily: "var(--font-h)",
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      background: isActive ? "rgba(34, 197, 94, 0.08)" : "transparent",
                      border: isActive ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid transparent",
                      color: isActive ? "#4ade80" : "var(--muted)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {activeUnlinkTab === 0 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>
                  5-Step Account Prep Checklist
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Before sending your account details to Maddy Store support, verify that your account complies with these essential clean-up guidelines:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">1. Disconnect Personal Links</strong>
                    <span className="rule-desc">Make sure you remove any personal social networks (e.g. your personal Facebook or Google account) that you do not wish to hand over to the buyer.</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">2. Log Out of All Devices</strong>
                    <span className="rule-desc">Navigate to the BGMI in-game settings page and click **"Log Out of All Devices"** to ensure no active sessions remain on other phones.</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">3. Capture Real-Time Recording</strong>
                    <span className="rule-desc">Record a smooth, continuous inventory walkthrough displaying all upgraded guns, classic skins, Conqueror badges, and supercar keys.</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">4. Region & Cooldown Locks</strong>
                    <span className="rule-desc">Ensure you haven't switched regions in BGMI inside the last 30 days, as a region lock could block the buyer from safely logging in.</span>
                  </div>
                  <div className="unlink-rule-card" style={{ gridColumn: "1 / -1" }}>
                    <strong className="rule-title">5. Immutable Inventory Guarantee</strong>
                    <span className="rule-desc">Do not spend UC, use Rename Cards, or dismantle outfits once you submit your inventory recording. The account must match the listing video 100%.</span>
                  </div>
                </div>
              </div>
            )}

            {activeUnlinkTab === 1 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>
                  Unlinking Regulations for Sellers
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                  BGMI enforces structural constraints to prevent unlinking fraud. As a seller, you must closely follow these security instructions:
                </p>
                <div style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                    <span><strong>Primary Access Link:</strong> Full Ownership Transferred to Maddy Store/Buyer</span>
                    <span style={{ color: "#4ade80" }}><strong>Secondary Access Link:</strong> Submitted for Unlinking</span>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "12px 0" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>UNLINK INITIATION</small>
                      <strong style={{ color: "var(--gold)", fontSize: "16px" }}>Immediate Lock</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>We submit the unlink request in-game using the secondary link.</span>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>7-DAY COOLDOWN PERIOD</small>
                      <strong style={{ color: "#22c55e", fontSize: "16px" }}>No Logging In</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>Seller must strictly not access the account via the unlinking method, or it cancels the request.</span>
                    </div>
                  </div>
                </div>
                <div style={{ borderLeft: "3px solid #22c55e", paddingLeft: "15px", margin: "15px 0" }}>
                  <p style={{ fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    "During the 7-day waiting period, logging into the secondary social network will immediately cancel the unlink. Sellers are legally bound by our terms to not log in, modify passwords, or trigger recovery options during this window."
                  </p>
                </div>
              </div>
            )}

            {activeUnlinkTab === 2 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>
                  Seller KYC Verification & Payout Rules
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                  We prioritize seller trust just as much as buyer security. Review how we protect you and execute secure payouts:
                </p>
                <ul style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Secure KYC Encrypted Storage:</strong> Your government ID (Aadhaar or PAN Card) is saved on fully secure, encrypted servers, and is only accessed in the event of an account dispute.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>100% Guarded Payments:</strong> We hold buyer funds in a secure bank escrow, eliminating any risk of chargebacks or fraudulent reversals once your account is delivered.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Direct Payout Release:</strong> 100% of your payout is transferred directly via UPI, Bank Transfer, USDT, BTC, or Cash within 1-2 hours of credential validation.</li>
                </ul>
                <div style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <AlertTriangle size={20} style={{ color: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#fff" }}>
                    <strong>Crucial Security Notice:</strong> Any attempt to illegally retrieve or pull back the account post-sale is a direct offense. We cooperate fully with cyber crime departments and release all KYC records to pursue legal action.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ SECTION ─────────────────────────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 90px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">FAQ</span>
            <h2 className="stitle">Common Selling Questions</h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Here are responses to help clarify our valuation, evaluation, and instant payout procedures.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "How do I get paid and how long does the payout take?",
                a: "For both options, payouts are made via UPI, Bank Transfer, USDT, BTC, or Cash based on your preference. Under Hold & Sell, payment is released after the buyer confirms successful delivery. Payout can be full or partial depending on security guarantees. Under Instant Sell, the agreed buyout funds are fully released within 1 to 2 hours after our technical security team completes the credential audit and secures ownership."
              },
              {
                q: "What is the difference between Hold & Sell vs. Instant Sell?",
                a: "Hold & Sell allows you to get 100% maximum market value because we list it to direct buyers, though it takes a few days to a week (typically 3-7 days). Instant Sell gives you immediate cash within hours directly from us, but at a wholesale buyout rate (usually 20-30% lower than open market value) to offset the inventory carrying risks."
              },
              {
                q: "Why is there a ₹80,000+ threshold for Face-to-Face deals?",
                a: "Face-to-Face cash meetups require significant travel coordination, local safety setup, and escrow monitoring. To ensure it is mutually viable, F2F dealing is strictly reserved for premium BGMI accounts with valuations exceeding ₹80,000. All accounts below ₹80K are handled securely through our verified Online Escrow systems."
              },
              {
                q: "What are the exact unlinking rules and cooldown timelines?",
                a: "BGMI unlinking requires 7 days to complete for secondary logins (e.g. Google/Twitter/X). If a seller logs into that unlinking account during the 7-day period, the unlink is automatically cancelled by the game. Fresh linking slots require a 30-day incubation lock before an unlink can be requested. Payouts are safely processed while unlinks complete under our Unlink Guarantee."
              },
              {
                q: "Why is the sale completely irreversible once the account is secured?",
                a: "Maddy Store binds recovery emails and recovery phone numbers to the buyer's credentials during security isolation to guarantee account security. Once detaching is done and bindings are locked, the credentials are permanently handed over, making retrieval impossible. Consequently, secured accounts cannot be returned under any circumstances."
              },
              {
                q: "What KYC documents do I need to provide and how is my data secured?",
                a: "We require a valid government-issued ID (such as an Aadhaar Card or PAN Card) to verify ownership and deter recovery fraud. All KYC data is stored on heavily encrypted offline servers and is only used to cooperate with official cybercrime departments in the event of retrieval attempts."
              },
              {
                q: "Can I still log in and play on my account during a Hold & Sell listing?",
                a: "Yes, you can absolutely continue playing classic matches, rank pushes, or custom rooms. However, you must strictly: (1) not bind any new social logins, (2) not change the linking region, (3) not spend inventory assets like UC or Rename Cards, and (4) notify our support team immediately if you unlock high-tier outfits or labs so we can update your listing video."
              }
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  style={{
                    background: "var(--card)",
                    border: isOpen ? "1px solid var(--gold)" : "1px solid var(--border)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    boxShadow: isOpen ? "0 10px 25px rgba(255,215,0,0.03)" : "none"
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#fff",
                      fontSize: "16px",
                      fontWeight: 600,
                      textAlign: "left",
                      fontFamily: "var(--font-h)",
                      letterSpacing: "0.5px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: "var(--gold)" }} /> : <ChevronDown size={18} style={{ color: "var(--muted)" }} />}
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: "0 24px 20px",
                      color: "var(--muted)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      borderTop: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <style>{`
          .options-grid-two {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 30px;
            max-width: 1000px;
            margin: 0 auto;
            align-items: stretch;
          }
          
          .sell-option-card {
            background: rgba(17, 21, 32, 0.45);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 35px 30px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            position: relative;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 15px 35px rgba(0,0,0,0.25);
          }
          
          .sell-option-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255,255,255,0.15);
          }
          
          /* Neon Glow Active States */
          .sell-option-card.active-blue {
            border-color: #3b82f6;
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.25), inset 0 0 15px rgba(59, 130, 246, 0.02);
            background: rgba(17, 21, 32, 0.65);
          }
          
          .sell-option-card.active-green {
            border-color: #22c55e;
            box-shadow: 0 0 25px rgba(34, 197, 94, 0.25), inset 0 0 15px rgba(34, 197, 94, 0.02);
            background: rgba(17, 21, 32, 0.65);
          }
          
          .sell-option-header {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
            align-items: flex-start;
          }
          
          .badge-tag-custom {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: var(--font-h);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            padding: 4px 14px;
            border-radius: 100px;
          }
          
          .tag-blue {
            background: rgba(59, 130, 246, 0.08);
            border: 1px solid rgba(59, 130, 246, 0.25);
            color: #60a5fa;
          }
          
          .tag-green {
            background: rgba(34, 197, 94, 0.08);
            border: 1px solid rgba(34, 197, 94, 0.25);
            color: #4ade80;
          }
          
          .sell-option-title {
            font-family: var(--font-h);
            font-size: clamp(22px, 2.5vw, 26px);
            font-weight: 700;
            color: #fff;
            margin: 0;
            letter-spacing: 0.5px;
          }
          
          .sell-option-desc {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 28px;
          }
          
          .steps-container {
            flex: 1;
            margin-bottom: 30px;
            display: flex;
            flex-direction: column;
          }
          
          .steps-heading {
            font-family: var(--font-h);
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 18px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 8px;
          }
          
          .steps-list-custom {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .step-item-custom {
            display: flex;
            gap: 14px;
            align-items: flex-start;
          }
          
          .step-num {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justifyContent: center;
            font-family: var(--font-h);
            font-size: 11px;
            font-weight: 700;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .step-num-blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; }
          .step-num-green { background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; }
          
          .step-title {
            color: #fff;
            font-size: 13px;
            display: block;
            margin-bottom: 3px;
            font-weight: 600;
          }
          
          .step-body {
            color: var(--muted);
            font-size: 11.5px;
            line-height: 1.5;
            display: block;
          }
          
          .cta-container {
            margin-top: auto;
          }

          .unlink-rule-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 18px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: all 0.25s ease;
          }
          
          .unlink-rule-card:hover {
            border-color: rgba(34, 197, 94, 0.2);
            background: rgba(34, 197, 94, 0.02);
            transform: translateY(-2px);
          }
          
          .rule-title {
            color: #fff;
            font-size: 14px;
            font-family: var(--font-h);
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          
          .rule-desc {
            color: var(--muted);
            font-size: 12px;
            line-height: 1.5;
          }
          
          .fade-in {
            animation: fadeIn 0.4s ease both;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .timeline-node-card {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .timeline-node-card:hover {
            transform: translateX(4px);
            border-color: rgba(255, 255, 255, 0.1) !important;
            background: rgba(17, 21, 32, 0.55) !important;
          }

          .pill-deal-mode {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 11px;
            font-weight: 600;
            padding: 3px 10px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: rgba(255, 255, 255, 0.8);
          }

          .gold-border {
            border-color: rgba(255, 215, 0, 0.25);
            color: var(--gold);
            background: rgba(255, 215, 0, 0.03);
          }

          .green-border {
            border-color: rgba(34, 197, 94, 0.25);
            color: #4ade80;
            background: rgba(34, 197, 94, 0.03);
          }

          .red-border {
            border-color: rgba(239, 68, 68, 0.25);
            color: #f87171;
            background: rgba(239, 68, 68, 0.03);
          }

          .yellow-border {
            border-color: rgba(234, 179, 8, 0.25);
            color: #facc15;
            background: rgba(234, 179, 8, 0.03);
          }

          @media (max-width: 768px) {
            .options-grid-two {
              gap: 24px;
            }
            .sell-option-card {
              padding: 28px 20px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
