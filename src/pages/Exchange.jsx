import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  Banknote, Zap, Lock, Video, FileText, BarChart, ShieldCheck, 
  Megaphone, Clock, Handshake, CheckCircle, MessageCircle, 
  ChevronDown, ChevronUp, AlertTriangle, Shield, Award, Sparkles, Info,
  Smartphone, Key, Users, QrCode, MapPin, CreditCard, HelpCircle, Check,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react";

export default function Exchange() {
  useSEO(
    "Exchange BGMI Accounts — Premium Trade-In",
    "Trade in your BGMI account for a high-tier upgrade or cash out your surplus value with 100% verified security."
  );
  const [activeOption, setActiveOption] = useState(0); // 0 = Exchange Upgrade, 1 = Exchange Downgrade
  const [activeTrustCard, setActiveTrustCard] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState(0); // 0 = Prep Checklist, 1 = Secure Rules, 2 = Guarantee

  // Steps data for Exchange Upgrade (Lower Value Trade-In)
  const exchangeUpgradeSteps = [
    {
      title: "Contact & Share Traded Account",
      body: "Contact us via WhatsApp or Telegram to initiate exchange and share your current account's video walkthrough, description, or logins.",
      icon: <MessageCircle size={18} />,
    },
    {
      title: "True Market Price Quotation",
      body: "Our pricing specialists run a live evaluation of classic skins and upgradable weapons to provide a formal trade-in value quote.",
      icon: <BarChart size={18} />,
    },
    {
      title: "Target Sourcing & Budget Range",
      body: "Define your required target account type, features (Conqueror frames, X-Suits, supercars), and additional budget range.",
      icon: <MapPin size={18} />,
    },
    {
      title: "Advance Sourcing Booking Lock",
      body: "Deposit a 15% booking/advance lock to secure our dedicated sourcing support and hold potential matches.",
      icon: <Lock size={18} />,
    },
    {
      title: "Verification Login Lock",
      body: "Once a matching target account is found, we add our official login or secure one login method of both accounts for ownership validation.",
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "Old Account Custody Lock First",
      body: "We secure and completely bind the logins of your old traded-in account. We always secure the old account first.",
      icon: <Lock size={18} />,
    },
    {
      title: "Government ID & KYC Proof",
      body: "Before finalizing, we collect the owner's valid government ID proof (Aadhaar or PAN Card) for future reference and keep it secure.",
      icon: <FileText size={18} />,
    },
    {
      title: "Balance Payment & Satisfied Handover",
      body: "Pay the remaining balance (adjusted with booking deposit). We deliver the new account, completing once both sides are fully satisfied.",
      icon: <CheckCircle size={18} />,
    }
  ];

  // Steps data for Exchange Downgrade (Higher Value Trade-In)
  const exchangeDowngradeSteps = [
    {
      title: "Contact & Share Premium Account",
      body: "Contact us via WhatsApp or Telegram and securely share your premium account's walkthrough video, description, or logins.",
      icon: <MessageCircle size={18} />,
    },
    {
      title: "True Market Price Quotation",
      body: "Our pricing specialists run a live evaluation of upgraded weapon labs and skins to provide a formal exchange value quote.",
      icon: <BarChart size={18} />,
    },
    {
      title: "Lower-Tier Target Selection",
      body: "Select your target lower-tier account from our active catalog, and we calculate the surplus cash difference due to you.",
      icon: <RefreshCw size={18} />,
    },
    {
      title: "Verification & Login Lock",
      body: "We add our official login or secure one login method of your traded-in higher-tier account to verify inventory ownership.",
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "Old Account Custody Lock First",
      body: "We take complete custody and secure both logins of your old traded-in premium account first before finalizing the exchange.",
      icon: <Lock size={18} />,
    },
    {
      title: "New Target Account Handover",
      body: "We transfer and securely bind the new target lower-tier account to your personal recovery credentials.",
      icon: <Smartphone size={18} />,
    },
    {
      title: "Government ID & KYC Proof",
      body: "Before payout, we collect your valid government ID proof (Aadhaar or PAN Card) for future reference records and keep it secure.",
      icon: <FileText size={18} />,
    },
    {
      title: "Difference Payout & Satisfied Trade",
      body: "We release your surplus cash difference via UPI, Bank Transfer, USDT, BTC, or F2F Cash. Complete once both sides are satisfied.",
      icon: <CreditCard size={18} />,
    }
  ];

  const currentSteps = activeOption === 0 ? exchangeUpgradeSteps : exchangeDowngradeSteps;

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
            alt="BGMI Soldiers in visual exchange" loading="lazy" decoding="async"
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
              <RefreshCw size={14} /> Premium Trade-in Portal
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,72px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
              textShadow: "0 2px 25px rgba(0,0,0,0.7)",
            }}>
              Exchange Your BGMI Account<br />
              <span className="g">With Complete Security</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,19px)",
              maxWidth: "620px", margin: "0 auto 32px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Trade-in your old account to upgrade your specs or cash out surplus value. Verified evaluations, ID security checks, and 100% satisfied trade transitions.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button 
                onClick={() => {
                  setActiveOption(0);
                  document.getElementById("exchange-options")?.scrollIntoView({ behavior: "smooth" });
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
                <ArrowUpRight size={16} /> Upgrade Pathway
              </button>
              <button 
                onClick={() => {
                  setActiveOption(1);
                  document.getElementById("exchange-options")?.scrollIntoView({ behavior: "smooth" });
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
                <ArrowDownRight size={16} /> Downgrade Pathway
              </button>
            </div>
          </div>
        </section>

        {/* ── ESSENTIAL HANDOVER SPOTLIGHT ─ */}
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
                Essential Exchange Handover Protocols
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
                    Old Account Secured First
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    To ensure complete credential integrity, Maddy BGMI Store always takes custody and secures the logins of your traded-in account before finalizing the target account handover.
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
                    Mandatory ID & KYC Security
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Before final balance releases or handovers, we collect valid government-issued ID proofs (Aadhaar or PAN Card) from both parties for future reference records and store them securely.
                  </span>
                </div>
              </div>

              {/* Rule 3 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#4ade80", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  03
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    Dual Satisfaction Guarantee
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Our premium account trade transition is officially complete only once both sides are fully satisfied with the new credentials, links, and payout balances.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID SECTION ────────────────────────── */}
        <section id="exchange-options" className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)", padding: "50px 5% 50px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Trade-in Portals</span>
            <h2 className="stitle">Two Curated Ways to Exchange <span className="g">Your Account</span></h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Choose the exchange model that matches your needs. Click a card to focus its detailed steps and transaction timeline flows.
            </p>
          </div>

          <div className="options-grid-two">
            {/* OPTION 1: EXCHANGE UPGRADE */}
            <div 
              className={`sell-option-card ${activeOption === 0 ? "active-blue" : ""}`}
              onClick={() => setActiveOption(0)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-blue">
                  <ArrowUpRight size={11} fill="currentColor" /> Lower Value Trade-In
                </span>
                <h3 className="sell-option-title">Exchange Upgrade</h3>
              </div>
              <p className="sell-option-desc">
                Trade in your old account and pay the remaining balance to upgrade to a premium high-tier BGMI account. Sourcing matches typically found in a few days. We secure your old account before final new handover.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Upgrade Sourcing Steps:</h4>
                <ul className="steps-list-custom">
                  {exchangeUpgradeSteps.slice(0, 8).map((step, idx) => (
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
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Upgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-gold" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <MessageCircle size={18} /> Request Upgrade →
                </a>
              </div>
            </div>

            {/* OPTION 2: EXCHANGE DOWNGRADE */}
            <div 
              className={`sell-option-card ${activeOption === 1 ? "active-green" : ""}`}
              onClick={() => setActiveOption(1)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-green">
                  <ArrowDownRight size={11} fill="currentColor" /> Higher Value Trade-In
                </span>
                <h3 className="sell-option-title">Exchange Downgrade</h3>
              </div>
              <p className="sell-option-desc">
                Exchange your high-tier premium account for a lower-spec target account and receive the cash surplus payout. We secure the old account first, releasing the target account and surplus cash immediately.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Downgrade Cashout Steps:</h4>
                <ul className="steps-list-custom">
                  {exchangeDowngradeSteps.slice(0, 8).map((step, idx) => (
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
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Downgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <MessageCircle size={18} /> Request Downgrade →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTERACTIVE TIMELINE ROADMAP ──────────────────────── */}
        <section className="section" style={{ background: "rgba(10, 13, 20, 0.4)", borderTop: "1px solid rgba(255, 255, 255, 0.05)", padding: "70px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Interactive Pathway</span>
            <h2 className="stitle">Visual Exchange <span className="g">Timeline</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Track the exact progress pathway of your selected trade model. Switch options in the grid above to dynamically preview the timeline.
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
                <ArrowUpRight size={14} /> Upgrade Pathway
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
                <ArrowDownRight size={14} /> Downgrade Pathway
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

                  {/* Custom conditional timeline badges */}
                  {idx === 3 && activeOption === 0 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode yellow-border"><Lock size={11} /> 15% Booking lock deposit required</span>
                      <span className="pill-deal-mode"><CreditCard size={11} /> Adjusted with final payments</span>
                    </div>
                  )}

                  {idx === 5 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode red-border"><AlertTriangle size={11} /> Pre-Securing: Traded-in account secured first</span>
                    </div>
                  )}

                  {idx === 6 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode green-border"><Check size={11} /> Government Aadhaar/PAN KYC secured</span>
                    </div>
                  )}

                  {idx === 7 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode green-border"><CheckCircle size={11} /> Process complete only once both sides are satisfied</span>
                      <span className="pill-deal-mode gold-border"><CreditCard size={11} /> UPI, Bank, USDT, BTC, or F2F Cash</span>
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
            <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20questions%20about%20exchanging%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green" style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <MessageCircle size={15} /> WhatsApp Support
            </a>
          </div>
        </section>

        {/* ── HANDOVER & UNLINK EDUCATION HUB ──────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">Trust & Security</span>
            <h2 className="stitle">How Account Handover & <span className="g">Unlinks Work</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Exchanging with Maddy Store is clear, transparent, and secure. Understand how we verify accounts, initiate unlinking, and guarantee safe payout release.
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
                  As a premium trader, you receive full legal protection and guaranteed, direct payments. To ensure complete safety for both sides, we use a structured escrow and handover process. If your account has active dual-social links, we initiate an official <strong>7-day unlink cooldown</strong> for the secondary login. During this waiting period, you must not log into that secondary network. Once security bindings are complete and the primary login is handed over, your payout is instantly released. All transactions are fully audited to ensure compliance with our zero-retrieval guarantees.
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
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Direct Payout Release:</strong> 100% of your payout is transferred directly via UPI, Bank Transfer, or Cash within 1-2 hours of credential validation.</li>
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
            <h2 className="stitle">Common Exchange Questions</h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Here are responses to help clarify our trade-in valuation, verification lock, and payment balance procedures.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "How is the trade-in value of my account calculated?",
                a: "Our specialists evaluate classic skins, upgraded weapon labs, supercars, Conqueror frames, and overall account popularity counts against direct open-market demand to provide a transparent exchange quotation."
              },
              {
                q: "Why do you always secure the old account first?",
                a: "To prevent double-spend links or credential retrieval fraud, we secure the traded-in account completely under our secure custody before finalizing target account links or surplus payouts. This guarantees maximum safety for both trade sides."
              },
              {
                q: "Can I adjust payments with advance bookings or direct cash?",
                a: "Absolutely. Trades can be adjusted through 15% booking/advance deposits (to search for custom specs under Upgrades) or direct cash. Final balances or cash differences are fully settled before delivering new account structures."
              },
              {
                q: "What happens if there is a price difference between the two accounts?",
                a: "Under an Exchange Upgrade (your account has lower value), you pay the remaining balance to us once we find the target account. Under an Exchange Downgrade (your account has higher value), we secure your old account, provide the lower-tier account, and pay you the surplus difference cash."
              },
              {
                q: "Why is the collection of valid ID proof mandatory?",
                a: "To prevent recovery fraud (cyber pull-backs), we collect valid government ID proof (Aadhaar or PAN Card) from both exchange participants. All KYC records are stored securely on offline encrypted servers."
              },
              {
                q: "Can we execute an account exchange Face-to-Face?",
                a: "Yes. Face-to-Face cash exchange meetups are strictly reserved for premium trades valued above ₹80,000. All trades below ₹80K are handled securely through our encrypted online escrow system."
              },
              {
                q: "When is the account exchange officially complete?",
                a: "The exchange transition is fully completed only once recovery credentials are fully bound, government KYC records are secured, payout balances are cleared, and both sides are 100% satisfied with the trade."
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
