import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShoppingCart, Lock, Banknote, CheckCircle,
  MessageCircle, Target, Shield, Gamepad2, Flame, Star, Send,
  AlertTriangle, Users, Info, ChevronDown, ChevronUp, HelpCircle, Sparkles, Award, Clock
} from "lucide-react";

export default function Buy() {
  const [activeOption, setActiveOption] = useState(0); // 0 = Ready-to-Play, 1 = Market-Available, 2 = Custom Order
  const [activeTrustCard, setActiveTrustCard] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState(0); // 0 = Rules, 1 = Example, 2 = Responsibility

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
            src="/buy-banner.webp"
            alt="BGMI Battlefield" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.65)",
            }}
          />
          {/* Gradient overlays — top + bottom fade */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.95) 100%)",
          }} />
          {/* Top-left vignette */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          {/* Content */}
          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "820px",
          }}>
            <div className="badge animate-pulse" style={{ marginBottom: "20px" }}>
              <ShoppingCart size={14} /> Premium Buying Portal
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,72px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
              textShadow: "0 2px 25px rgba(0,0,0,0.7)",
            }}>
              Acquire Your Ultimate<br />
              <span className="g">BGMI Account</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,19px)",
              maxWidth: "620px", margin: "0 auto 32px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Choose from secured instant-delivery stocks, explore daily channel lists, or request personalized custom sourcing tailored to your budget and exact skin requirements.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/readystocks" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 30px", borderRadius: "10px",
                background: "linear-gradient(135deg, var(--gold), var(--orange))",
                color: "#000", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
                boxShadow: "0 4px 20px rgba(255,215,0,0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                <Gamepad2 size={16} /> Browse Ready Stocks
              </Link>
              <a href="#buying-options" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 30px", borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
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
                <Info size={16} /> Learn Buying Paths
              </a>
            </div>
          </div>
        </section>

        {/* ── ESSENTIAL TRANSACTION RULES SPOTLIGHT ───────── */}
        <section style={{
          padding: "50px 5% 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)",
            border: "1px dashed rgba(249, 115, 22, 0.4)",
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
              background: "radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}>
              <AlertTriangle size={24} style={{ color: "var(--orange)", filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" }} />
              <h3 style={{
                fontFamily: "var(--font-h)",
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: 0,
                color: "#fff"
              }}>
                Essential Transaction & Booking Rules
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
                  background: "rgba(249, 115, 22, 0.12)", border: "1px solid rgba(249, 115, 22, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--orange)", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  01
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    15% Non-Refundable Booking
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    A **15% booking deposit** applies to all transactions. Booking deposits are strictly **non-refundable** under all circumstances, except for the return of any accidental excess amounts paid.
                  </span>
                </div>
              </div>

              {/* Rule 2 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(249, 115, 22, 0.12)", border: "1px solid rgba(249, 115, 22, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--orange)", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  02
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    Full Payment Transfer
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Accounts are secured and credentials completely handed over to the buyer **only** after the remaining 85% balance payment is cleared in full. No partial payments cover ownership delivery.
                  </span>
                </div>
              </div>

              {/* Rule 3 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "rgba(249, 115, 22, 0.12)", border: "1px solid rgba(249, 115, 22, 0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--orange)", fontWeight: 700, flexShrink: 0,
                  fontSize: "14px", fontFamily: "var(--font-h)"
                }}>
                  03
                </div>
                <div>
                  <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                    F2F Meetup Guidelines
                  </strong>
                  <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block" }}>
                    Face-to-Face (F2F) deals are strictly reserved for high-tier accounts valued at **₹80,000+**. Booking is required in advance, and **all travel/transport costs must be covered entirely by the buyer**.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID SECTION ────────────────────────── */}
        <section id="buying-options" className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)", padding: "50px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Buying Methods</span>
            <h2 className="stitle">Three Ways to Acquire Your <span className="g">BGMI Account</span></h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Select from three curated ways to purchase. Click any card below to focus its details, requirements, and step-by-step transaction flow.
            </p>
          </div>

          <div className="options-grid-three">
            {/* OPTION 1: READY-TO-PLAY ACCOUNTS */}
            <div 
              className={`buy-option-card ${activeOption === 0 ? "active-blue" : ""}`}
              onClick={() => setActiveOption(0)}
            >
              <div className="buy-option-header">
                <span className="badge-tag-custom tag-blue">
                  <Star size={11} fill="currentColor" /> Ready to Play
                </span>
                <h3 className="buy-option-title">Ready-to-Play Stocks</h3>
              </div>
              <p className="buy-option-desc">
                Choose from a pre-listed catalog of fully secured, instant-delivery accounts. Includes complete inventory listings, preview videos, and set transparent pricing.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Secure Ready-to-Play Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    "Browse & Review: View pre-listed accounts complete with inventory videos, specifications, pricing, and unlink guarantees.",
                    "Contact Support: Message us directly on WhatsApp or Telegram with the specific account details you wish to buy.",
                    "Flexible Booking: Pay either a 15% non-refundable deposit to book the account, or complete full payment directly.",
                    "24-Hour Hold & Binding: Bookings hold the account for 24 hours. After full payment, we immediately link your recovery email & phone number.",
                    "Handover & Invoice: We deliver secure credentials along with an official transaction invoice detailing your unlink guarantee period.",
                    "Unlink Protection: Enjoy absolute safety. If any issues occur within the guarantee period, we provide a replacement or a complete refund.",
                    "Lobby Feedback: Once successfully logged in, upload your lobby screenshot and leave your feedback on our official reviews page."
                  ].map((step, idx) => {
                    const [title, body] = step.split(":");
                    return (
                      <li key={idx} className="step-item-custom">
                        <span className="step-num step-num-blue">{idx + 1}</span>
                        <div>
                          <strong className="step-title">{title}</strong>
                          <span className="step-body">{body}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="cta-container">
                <Link to="/readystocks" className="btn btn-gold" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <Gamepad2 size={18} /> View Ready Stocks →
                </Link>
              </div>
            </div>

            {/* OPTION 2: MARKET-AVAILABLE ACCOUNTS */}
            <div 
              className={`buy-option-card ${activeOption === 1 ? "active-purple" : ""}`}
              onClick={() => setActiveOption(1)}
            >
              <div className="buy-option-header">
                <span className="badge-tag-custom tag-purple">
                  <Sparkles size={11} fill="currentColor" /> Daily Listings
                </span>
                <h3 className="buy-option-title">Market-Available Feeds</h3>
              </div>
              <p className="buy-option-desc">
                Join our premium community channels. We post daily verified account listings ranging from ₹5,000 to ₹500,000 direct from individual sellers.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Feed Booking Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    "Join Official Feed: Click the channel buttons below to join our Telegram or WhatsApp feeds.",
                    "Pick Your Account: Review the fresh daily listings posted on our feed with specs and pricing.",
                    "Pay 15% Booking Deposit: Book your choice instantly by paying a 15% non-refundable lock amount.",
                    "Pay remaining 85% Balance: Complete the rest of the payment within 24 hours to secure the deal.",
                    "Secure Account Handover: Our agents verify logins, safe-out sellers, and transfer ownership to you."
                  ].map((step, idx) => {
                    const [title, body] = step.split(":");
                    return (
                      <li key={idx} className="step-item-custom">
                        <span className="step-num step-num-purple">{idx + 1}</span>
                        <div>
                          <strong className="step-title">{title}</strong>
                          <span className="step-body">{body}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20join%20the%20MBS%20WhatsApp%20Account%20Buying%20feed." target="_blank" rel="noreferrer" className="btn btn-green" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <MessageCircle size={15} /> WhatsApp Feed
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <Send size={15} /> Telegram Feed
                </a>
              </div>
            </div>

            {/* OPTION 3: CUSTOM REQUIREMENTS */}
            <div 
              className={`buy-option-card ${activeOption === 2 ? "active-orange" : ""}`}
              onClick={() => setActiveOption(2)}
            >
              <div className="buy-option-header">
                <span className="badge-tag-custom tag-orange">
                  <Target size={11} fill="currentColor" /> Customized Sourcing
                </span>
                <h3 className="buy-option-title">Custom Requirement sourcing</h3>
              </div>
              <p className="buy-option-desc">
                Have specific demands? Give us your budget and skin preferences. We search our extensive nationwide network to find you the best matching deals.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Custom Sourcing Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    "Contact & Share Details: Share your budget, skin wishlist, supercar demands, or gun labs.",
                    "Pay 15% Search Deposit: Pay a 15% booking deposit to initiate the personalized sourcing sweep.",
                    "Personalized Matches: We present the closest matches (Note: exact 100% factory match cannot be guaranteed).",
                    "Approve & Finalize: Review video logs of the sourced account and approve your match.",
                    "Balance & Credentials Handover: Pay the remaining 85% to receive full secured account transfer."
                  ].map((step, idx) => {
                    const [title, body] = step.split(":");
                    return (
                      <li key={idx} className="step-item-custom">
                        <span className="step-num step-num-orange">{idx + 1}</span>
                        <div>
                          <strong className="step-title">{title}</strong>
                          <span className="step-body">{body}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20a%20custom%20BGMI%20account%20requirement%20for%20a%20budget%20of%20" target="_blank" rel="noreferrer" className="btn btn-green" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <MessageCircle size={15} /> WhatsApp Custom
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <Send size={15} /> Telegram Custom
                </a>
              </div>
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
              { h: "Safe Transfers", p: "Proprietary security protocol for handovers." },
              { h: "24/7 Support", p: "Dedicated team for after-sales assistance." },
              { h: "Verified Listings", p: "Every account is manually checked by Maddy." }
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
            <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20questions%20about%20buying%20an%20account." target="_blank" rel="noreferrer" className="btn btn-green" style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
              <MessageCircle size={15} /> Talk directly to Maddy
            </a>
          </div>
        </section>

        {/* ── UNLINK SYSTEM EDUCATION HUB ─────────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">Trust & Transparency</span>
            <h2 className="stitle">How the BGMI <span className="g">Unlink System</span> Works</h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Unlike other platforms, we believe in 100% honesty. Learn how account unlinking works, what your guarantee covers, and your responsibilities as a buyer.
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
                { label: "1. Core Rules & System", icon: <Info size={16} /> },
                { label: "2. Real Timeline Example", icon: <Clock size={16} /> },
                { label: "3. Buyer Responsibility & Support", icon: <Shield size={16} /> }
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
                      background: isActive ? "var(--gold-dim)" : "transparent",
                      border: isActive ? "1px solid var(--gold)" : "1px solid transparent",
                      color: isActive ? "var(--gold)" : "var(--muted)",
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
                  The 5 Core Rules of BGMI Unlinking
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Unlinking in BGMI allows an account owner to safely remove one of the two linked social networks (e.g. removing Facebook but keeping Twitter/X). However, BGMI enforces strict guidelines that must be met:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">1. Min 2 Linked Accounts</strong>
                    <span className="rule-desc">The account must have **two social networks** linked in order for the unlink option to be functional. Otherwise, BGMI blocks the action.</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">2. No Unlinking Current Login</strong>
                    <span className="rule-desc">You cannot unlink the network you are currently logged into. To remove Twitter, you must log in using Facebook first.</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">3. 30+ Days Link Requirement</strong>
                    <span className="rule-desc">The network you remain logged into must have been linked for **at least 30 days**. This is why you will see listings with "15 Days Remaining".</span>
                  </div>
                  <div className="unlink-rule-card">
                    <strong className="rule-title">4. Device & Region Match</strong>
                    <span className="rule-desc">BGMI checks region history. Logging in from multiple regions or using a VPN during unlinking can flag suspicious activity and block the process.</span>
                  </div>
                  <div className="unlink-rule-card" style={{ gridColumn: "1 / -1" }}>
                    <strong className="rule-title">5. 7-Day Waiting Period (Crucial)</strong>
                    <span className="rule-desc">Once submitted, BGMI begins a **7-day waiting period**. If anyone logs in using the unlinking social network during this time, **the request is automatically cancelled**.</span>
                  </div>
                </div>
              </div>
            )}

            {activeUnlinkTab === 1 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>
                  Timeline & Guarantee Example
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                  Here is exactly how a clean account transfer takes place when there is a secondary pending unlink:
                </p>
                <div style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                    <span><strong>Primary Login:</strong> Facebook (Fully Owned by Buyer)</span>
                    <span style={{ color: "var(--orange)" }}><strong>Secondary Login:</strong> Twitter (Pending Unlink)</span>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "12px 0" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>INVOICE UNLINK DATE</small>
                      <strong style={{ color: "var(--gold)", fontSize: "16px" }}>June 30</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>Date when Twitter gets fully detached from the BGMI database.</span>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>GUARANTEE EXPIRY DATE</small>
                      <strong style={{ color: "#22c55e", fontSize: "16px" }}>July 07</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>7 extra days of full support buffer after completion to confirm absolute safety.</span>
                    </div>
                  </div>
                </div>
                <div style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "15px", margin: "15px 0" }}>
                  <p style={{ fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    "Our Unlink Guarantee covers you entirely until the official unlink completion + buffer period. If any unlink fail or retrieval occurs within this frame, a full replacement or refund is guaranteed. Once the guarantee expires, ownership is fully yours and support ends."
                  </p>
                </div>
              </div>
            )}

            {activeUnlinkTab === 2 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>
                  Buyer Responsibilities & Support Note
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                  To ensure a flawless unlink process, the buyer must follow these crucial security rules during the waiting period:
                </p>
                <ul style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Do Not Log In with the Unlinking Method:</strong> Logging into the pending social network will immediately and automatically cancel the unlink request.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Avoid Risky Logins:</strong> Do not log in from multiple devices, use VPNs, or switch in-game regions immediately, as BGMI will flag suspicious activity and cancel the unlink.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Link Recovery Immediately:</strong> Link your own active recovery email and mobile phone number to the primary method immediately upon receiving the account.</li>
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
                    <strong>Crucial Support Note:</strong> If you have *any* doubts regarding the unlink status or process, contact our support team <strong>before</strong> making any settings changes in the account.
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
            <h2 className="stitle">Common Buying Questions</h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Here are responses to help clarify our booking, payment, and delivery processes.
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                q: "Is the 15% booking deposit refundable?",
                a: "No. All 15% booking deposits are strictly non-refundable once an account is locked or custom sourcing commences. This deposit secures the exclusive lock on the account, removing it from active market availability. The only exception is the immediate return of any accidental excess amounts paid over the 15% threshold."
              },
              {
                q: "How do Face-to-Face (F2F) deals work?",
                a: "F2F transactions are exclusively offered for high-tier accounts valued at ₹80,000 or above. You must pay the 15% booking deposit in advance to arrange the deal. In addition, all travel, lodging, and transport costs incurred by Maddy Store agents during the meetup must be covered completely by the buyer."
              },
              {
                q: "How does the secondary social network unlink process work?",
                a: "Unlinking in BGMI allows removing one of two linked social logins (e.g. removing Twitter/X but keeping Facebook). Once submitted, BGMI begins a 7-day waiting period. If anyone logs in using the unlinking social network during this waiting period, the request is automatically cancelled. To prevent issues, avoid logging in with the unlinking social network, logging in from multiple devices, or using a VPN."
              },
              {
                q: "What is the difference between the Unlink Date and the Guarantee Expiry Date?",
                a: "The Unlink Date is the exact date when the unlinking social network is fully detached from the game account. The Guarantee Expiry Date is a support buffer period (usually 7 days after the unlink completes) shown on your invoice. Our support and unlink guarantee are valid until this expiry date, after which ownership is fully secure and support ends."
              },
              {
                q: "Can you guarantee a 100% exact match for custom sourcing?",
                a: "While we tap into an extensive trusted seller network to secure high-quality choices based on your preferences, we cannot guarantee a 100% 'factory-exact' match since accounts are pre-owned. We will source and present the closest premium options matching your budget and core preferences for your final review and approval."
              },
              {
                q: "What is the timeline for account delivery?",
                a: "Ready-to-Play accounts are usually delivered within 1 to 2 hours after full payment. Market-Available and Custom Sourced accounts generally require 6 to 24 hours depending on the account binding methods (e.g. Facebook, Twitter/X, Game Center, Google Play) and standard secure cooldown protocols."
              },
              {
                q: "Is it safe to buy through Maddy Store?",
                a: "Absolutely. Maddy Store is a highly reputed platform with 5000+ completed trades. We verify each seller's identity, perform deep security audits of all login structures, clear linking cooldowns, and hold payments safely until the buyer has complete, verified ownership binding."
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
                      letterSpacing: "0.5px"
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
          .options-grid-three {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
            align-items: stretch;
          }
          
          .buy-option-card {
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
          
          .buy-option-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255,255,255,0.15);
          }
          
          /* Neon Glow Active States */
          .buy-option-card.active-blue {
            border-color: #3b82f6;
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.25), inset 0 0 15px rgba(59, 130, 246, 0.02);
            background: rgba(17, 21, 32, 0.65);
          }
          
          .buy-option-card.active-purple {
            border-color: #a855f7;
            box-shadow: 0 0 25px rgba(168, 85, 247, 0.25), inset 0 0 15px rgba(168, 85, 247, 0.02);
            background: rgba(17, 21, 32, 0.65);
          }
          
          .buy-option-card.active-orange {
            border-color: #f97316;
            box-shadow: 0 0 25px rgba(249, 115, 22, 0.25), inset 0 0 15px rgba(249, 115, 22, 0.02);
            background: rgba(17, 21, 32, 0.65);
          }
          
          .buy-option-header {
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
          
          .tag-purple {
            background: rgba(168, 85, 247, 0.08);
            border: 1px solid rgba(168, 85, 247, 0.25);
            color: #c084fc;
          }
          
          .tag-orange {
            background: rgba(249, 115, 22, 0.08);
            border: 1px solid rgba(249, 115, 22, 0.25);
            color: #fb923c;
          }
          
          .buy-option-title {
            font-family: var(--font-h);
            font-size: clamp(22px, 2.5vw, 26px);
            font-weight: 700;
            color: #fff;
            margin: 0;
            letter-spacing: 0.5px;
          }
          
          .buy-option-desc {
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
            justify-content: center;
            font-family: var(--font-h);
            font-size: 11px;
            font-weight: 700;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .step-num-blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; }
          .step-num-purple { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); color: #c084fc; }
          .step-num-orange { background: rgba(249, 115, 22, 0.15); border: 1px solid rgba(249, 115, 22, 0.3); color: #fb923c; }
          
          .step-title {
            color: #fff;
            font-size: 13px;
            display: block;
            margin-bottom: 3px;
            font-weight: 600;
          }
          
          .step-body {
            color: var(--muted);
            font-size: 11px;
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
            border-color: rgba(255, 215, 0, 0.2);
            background: rgba(255, 215, 0, 0.02);
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
            animation: fadeIn 0.35s ease both;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 768px) {
            .options-grid-three {
              gap: 24px;
            }
            .buy-option-card {
              padding: 28px 24px;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
