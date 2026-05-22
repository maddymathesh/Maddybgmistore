import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { Link } from "react-router-dom";
import {
  Banknote, Zap, Lock, Video, FileText, BarChart, ShieldCheck,
  Megaphone, Clock, CheckCircle, MessageCircle,
  ChevronDown, ChevronUp, AlertTriangle, Shield, Award, Sparkles, Info,
  Users, MapPin, CreditCard, Check, Send,
  Coins, BookOpen, ExternalLink, Key, RefreshCw, Smartphone
} from "lucide-react";

export default function Sell() {
  useSEO(
    "Sell BGMI Accounts — Instant Cash & Hold & Sell",
    "Instantly cash out your high-tier BGMI account or list it across our Telegram & WhatsApp channels using Hold & Sell."
  );

  const [activeOption, setActiveOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [activeTrustCard, setActiveTrustCard] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState(0);

  // Inline expandable panel states
  const [f2fExpanded, setF2fExpanded] = useState(false);
  const [kycExpanded, setKycExpanded] = useState(false);
  const [payoutExpanded, setPayoutExpanded] = useState(false);

  const f2fRef = useRef(null);
  const kycRef = useRef(null);
  const payoutRef = useRef(null);
  const optionsRef = useRef(null);

  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const chipStyle = (color) => ({
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "30px",
    fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-h)",
    textTransform: "uppercase", letterSpacing: "0.5px",
    cursor: "pointer", border: `1px solid ${color}`,
    color: color, background: `${color}14`,
    transition: "all 0.2s", textDecoration: "none"
  });

  const holdAndSellSteps = [
    { title: "Contact & Share Account", body: "Reach out via WhatsApp or Telegram and securely share your account video, inventory description, or temporary login details for evaluation.", idx_chip: null },
    { title: "Market Price Evaluation", body: "We evaluate the true market price based on your inventory — upgrading labs, classic skins, X-suits, weapon finishes, and rank badges — and inform you of the exact value.", idx_chip: null },
    { title: "Verification & Login Lock", body: "Once we agree on the market price, we add our official login or secure one login method for complete ownership verification and control during listing.", idx_chip: null },
    { title: "Professional Listing & Channel Broadcast", body: "We record a professional preview video, write a comprehensive description, and broadcast your listing across our VIP Telegram and WhatsApp channels.", idx_chip: null },
    { title: "3–7 Days Typical Listing Cycle", body: "Listings typically sell within 3 to 7 days. If the account does not sell in this window, we adjust the price and re-list it for maximum exposure.", idx_chip: null },
    { title: "Double-Login Securing for Buyer", body: "Once a buyer is secured, we take over custody and secure both logins for the buyer to ensure a safe, permanent transfer.", idx_chip: "kyc" },
    { title: "Owner Government ID KYC Proof", body: "Before releasing the final payment, we collect the owner's valid government ID (Aadhaar Card or Driving License) for future legal reference, kept 100% secure.", idx_chip: "kyc" },
    { title: "Payout Release & Delivery Confirmation", body: "We pay the original owner after the buyer confirms successful delivery. Cleared via UPI, Bank Transfer, USDT, BTC, or F2F Cash for large accounts.", idx_chip: "payout" },
  ];

  const instantSellSteps = [
    { title: "Support Connection & Logins", body: "Message us on WhatsApp or Telegram and securely share temporary credentials for audit access. We begin immediately upon receiving your details.", idx_chip: null },
    { title: "Live Inventory Scan", body: "Our analysts perform an immediate valuation and present a solid, direct wholesale cash buyout offer within hours of your submission.", idx_chip: null },
    { title: "Select Mode of Dealing", body: "Choose secure Online Transfer or Face-to-Face meetup (strictly reserved for premium ₹80,000+ accounts).", idx_chip: "f2f" },
    { title: "KYC & Identity Verification", body: "Submit government-issued ID proof with address (Aadhaar Card or Driving License) to verify ownership and authorize the buyout legally.", idx_chip: "kyc" },
    { title: "Single/Dual Login Security", body: "We audit all login bindings. For dual logins, we secure the primary login and submit the secondary unlink request immediately.", idx_chip: null },
    { title: "Quarantine Cooldown Timelines", body: "If unlinks require a 7-day wait or links require 30 days, the account is held in secure quarantine. Your payout is confirmed and held safely.", idx_chip: null },
    { title: "Irreversible Handover Clause", body: "Seller signs terms for complete credential detachment. Once locked, the account cannot be returned under any circumstances.", idx_chip: null },
    { title: "Immediate Wholesale Payout", body: "Funds are instantly released via UPI, Bank Transfer, or liquid Cash (for F2F deals) within 1–2 hours of binding confirmation.", idx_chip: "payout" },
  ];

  const currentSteps = activeOption === 0 ? holdAndSellSteps : instantSellSteps;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", background: "var(--bg)", color: "#fff", minHeight: "100vh" }}>

        {/* ── HERO BANNER ──────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "88vh", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/sell-banner.webp"
            alt="BGMI Sell Account" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              filter: "brightness(0.6)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 30%, transparent 50%, rgba(8,10,15,0.97) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)",
          }} />

          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "860px",
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
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,18px)",
              maxWidth: "640px", margin: "0 auto 32px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Maximize your return with Hold & Sell, or cash out immediately with Instant Sell. Secure valuation, KYC audits, and verified payouts.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => { setActiveOption(0); setTimeout(() => scrollTo(optionsRef), 100); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "14px 30px", borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--gold), var(--orange))",
                  color: "#000", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", border: "none", cursor: "pointer", letterSpacing: "0.5px",
                  boxShadow: "0 4px 20px rgba(255,215,0,0.3)", transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                <Clock size={16} /> Hold & Sell Option
              </button>
              <button
                onClick={() => { setActiveOption(1); setTimeout(() => scrollTo(optionsRef), 100); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "14px 30px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                  fontSize: "14px", cursor: "pointer", letterSpacing: "0.5px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(255,215,0,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                <Zap size={16} /> Instant Sell Option
              </button>
            </div>

            {/* Quick panel nav chips */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "28px" }}>
              <button onClick={() => { setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                style={chipStyle("var(--orange)")}>
                <MapPin size={12} /> F2F Sell Rules
              </button>
              <button onClick={() => { setKycExpanded(true); setTimeout(() => scrollTo(kycRef), 100); }}
                style={chipStyle("#22c55e")}>
                <FileText size={12} /> KYC & ID Proof
              </button>
              <button onClick={() => { setPayoutExpanded(true); setTimeout(() => scrollTo(payoutRef), 100); }}
                style={chipStyle("var(--gold)")}>
                <Coins size={12} /> Payout Methods
              </button>
            </div>
          </div>
        </section>

        {/* ── ESSENTIAL SELLER PROTOCOLS ─────────────────── */}
        <section style={{ padding: "50px 5% 20px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(255,215,0,0.04) 100%)",
            border: "1px dashed rgba(34,197,94,0.4)", borderRadius: "20px",
            padding: "32px 30px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <ShieldCheck size={24} style={{ color: "#22c55e", filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }} />
              <h2 style={{
                fontFamily: "var(--font-h)", fontSize: "clamp(20px,3vw,24px)",
                fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: 0, color: "#fff"
              }}>
                Essential Seller & Handover Protocols
              </h2>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "28px", paddingLeft: "36px" }}>
              Every sell transaction — Hold & Sell or Instant Sell — follows these strict protocols. Click any rule to learn more.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px,1fr))", gap: "20px" }}>
              {[
                {
                  num: "01", title: "Strict KYC & ID Audit", color: "#22c55e",
                  body: "We securely collect the owner's valid government ID with address (Aadhaar Card or Driving License) before final payment for legal reference.",
                  chip: "KYC Details", ref: kycRef, set: setKycExpanded, chipColor: "#22c55e"
                },
                {
                  num: "02", title: "Flexible Deal Modes & F2F", color: "#22c55e",
                  body: "Choose online escrow transfer or Face-to-Face meetup. F2F is strictly for accounts above ₹80,000. The Owner covers Travel, Stay & Food for the deal agent.",
                  chip: "F2F Sell Guide", ref: f2fRef, set: setF2fExpanded, chipColor: "var(--orange)"
                },
                {
                  num: "03", title: "Irrevocable Handover Policy", color: "#ef4444",
                  body: "Once our security team detaches bindings and transfers ownership to the buyer, the account cannot be returned under any circumstances. Payout is 100% locked & guaranteed.",
                  chip: "Payout Methods", ref: payoutRef, set: setPayoutExpanded, chipColor: "var(--gold)"
                },
              ].map((rule) => (
                <div key={rule.num} style={{ display: "flex", gap: "14px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: `${rule.color}1a`, border: `1px solid ${rule.color}4d`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: rule.color, fontWeight: 700, flexShrink: 0, fontSize: "13px", fontFamily: "var(--font-h)"
                  }}>{rule.num}</div>
                  <div>
                    <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>{rule.title}</strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block", marginBottom: "10px" }}>{rule.body}</span>
                    <button
                      onClick={() => { rule.set(true); setTimeout(() => scrollTo(rule.ref), 150); }}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: rule.chipColor, background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-h)", letterSpacing: "0.5px", textTransform: "uppercase", padding: 0 }}>
                      <BookOpen size={12} /> {rule.chip} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SELLING OPTIONS GRID ───────────────────────── */}
        <section id="selling-options" ref={optionsRef} className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)", padding: "50px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Selling Methods</span>
            <h2 className="stitle">Two Ways to Cash Out <span className="g">Your Account</span></h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Select the best method for your timeline. Each card explains the full step-by-step flow — with inline F2F, KYC, and payout guides.
            </p>
          </div>

          <div className="options-grid-two">

            {/* INSTANT SELL — first */}
            <div
              className={`sell-option-card ${activeOption === 1 || hoveredOption === 1 ? "active-green" : ""}`}
              onClick={() => setActiveOption(1)}
              onMouseEnter={() => setHoveredOption(1)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-green">
                  <Zap size={11} fill="currentColor" /> Instant Payout
                </span>
                <h3 className="sell-option-title">Instant Sell</h3>
              </div>
              <p className="sell-option-desc">
                Need immediate cash? Sell directly to us at wholesale rates. We skip listing delays and buyer wait times — providing a direct buyout offer and payment within hours.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Instant Sell Steps:</h4>
                <ul className="steps-list-custom">
                  {instantSellSteps.map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-green">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                        {step.idx_chip === "f2f" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                              style={{ ...chipStyle("var(--orange)"), fontSize: "10px", padding: "4px 10px" }}>
                              <MapPin size={10} /> F2F Sell Rules
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "kyc" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setKycExpanded(true); setTimeout(() => scrollTo(kycRef), 100); }}
                              style={{ ...chipStyle("#22c55e"), fontSize: "10px", padding: "4px 10px" }}>
                              <FileText size={10} /> KYC Details
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "payout" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setPayoutExpanded(true); setTimeout(() => scrollTo(payoutRef), 100); }}
                              style={{ ...chipStyle("var(--gold)"), fontSize: "10px", padding: "4px 10px" }}>
                              <Coins size={10} /> Payout Methods
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container">
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20need%20immediate%20cash%20and%20want%20to%20sell%20my%20BGMI%20account%20instantly."
                  target="_blank" rel="noreferrer" className="btn btn-green"
                  style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}
                  onClick={(e) => e.stopPropagation()}>
                  <Zap size={18} /> Sell Instantly Now →
                </a>
              </div>
            </div>

            {/* HOLD & SELL — second */}
            <div
              className={`sell-option-card ${activeOption === 0 || hoveredOption === 0 ? "active-blue" : ""}`}
              onClick={() => setActiveOption(0)}
              onMouseEnter={() => setHoveredOption(0)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div className="sell-option-header">
                <span className="badge-tag-custom tag-blue">
                  <Clock size={11} fill="currentColor" /> Maximum Payout
                </span>
                <h3 className="sell-option-title">Hold & Sell</h3>
              </div>
              <p className="sell-option-desc">
                Get 100% maximum market value for your account. We list it, record an HD video, write the description, market it across our VIP communities, and handle secure double-login transfer. Average sale time: 3–7 days.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Secure Hold & Sell Steps:</h4>
                <ul className="steps-list-custom">
                  {holdAndSellSteps.map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-blue">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                        {step.idx_chip === "kyc" && idx === 5 && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setKycExpanded(true); setTimeout(() => scrollTo(kycRef), 100); }}
                              style={{ ...chipStyle("#22c55e"), fontSize: "10px", padding: "4px 10px" }}>
                              <FileText size={10} /> KYC Details
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "payout" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setPayoutExpanded(true); setTimeout(() => scrollTo(payoutRef), 100); }}
                              style={{ ...chipStyle("var(--gold)"), fontSize: "10px", padding: "4px 10px" }}>
                              <Coins size={10} /> Payout Methods
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container">
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20list%20my%20BGMI%20account%20via%20Hold%20%26%20Sell."
                  target="_blank" rel="noreferrer" className="btn btn-gold"
                  style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}
                  onClick={(e) => e.stopPropagation()}>
                  <MessageCircle size={18} /> Start Hold & Sell →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEEP-DIVE EXPANDABLE SECTIONS ─────────────── */}
        <section style={{ padding: "0 5% 70px", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* F2F SELL PANEL */}
          <div ref={f2fRef} style={{ borderRadius: "20px", overflow: "hidden", border: f2fExpanded ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,107,53,0.15)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setF2fExpanded(!f2fExpanded)}
              style={{ width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: f2fExpanded ? "rgba(255,107,53,0.06)" : "rgba(17,21,32,0.6)", border: "none", cursor: "pointer", transition: "background 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={20} style={{ color: "var(--orange)" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    Face-to-Face Selling Rules
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>For accounts above ₹80K — tap to expand full F2F seller rules</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/f2f-deal" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "var(--orange)", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "0.5px", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.25)", padding: "6px 12px", borderRadius: "20px", textDecoration: "none" }}>
                  <ExternalLink size={11} /> Full Page
                </Link>
                {f2fExpanded ? <ChevronUp size={22} style={{ color: "var(--orange)" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {f2fExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(255,107,53,0.15)" }} className="fade-in">
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "24px", maxWidth: "800px" }}>
                  Face-to-Face (F2F) selling is available for <strong style={{ color: "var(--orange)" }}>accounts valued above ₹80,000</strong>. The seller and Maddy's agent meet at a safe, public midpoint location for an in-person handover.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "14px", marginBottom: "24px" }}>
                  {[
                    { icon: <MapPin size={16} style={{ color: "var(--orange)" }} />, title: "Mutually Agreed Midpoint", desc: "A safe public location equidistant between seller city and our agent's base (e.g., Vellore for Chennai–Bangalore)." },
                    { icon: <Users size={16} style={{ color: "var(--orange)" }} />, title: "Seller Covers Agent Expenses", desc: "Seller pays all travel, food, and stay costs for the Maddy Store deal agent attending the meetup." },
                    { icon: <Check size={16} style={{ color: "#22c55e" }} />, title: "Public Locations Only", desc: "Premium malls, cafés, and restaurants with CCTV. No private, dark, or isolated locations." },
                    { icon: <Lock size={16} style={{ color: "var(--gold)" }} />, title: "Cash Payout at Meetup", desc: "For ₹80K+ accounts, cash payout can be arranged at the meetup location after credential verification." },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,107,53,0.03)", border: "1px solid rgba(255,107,53,0.12)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
                      <div>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{item.title}</strong>
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <AlertTriangle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#ff8888", fontWeight: 600 }}>
                    "All F2F expenses for the agent (travel, stay, food) are borne entirely by the seller. Account credentials are only handed over after full payment is verified."
                  </span>
                </div>

                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/f2f-deal" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "linear-gradient(135deg,var(--orange),#ef4444)", borderRadius: "10px", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "none" }}>
                    <ExternalLink size={14} /> Full F2F Deal System →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* KYC PANEL */}
          <div ref={kycRef} style={{ borderRadius: "20px", overflow: "hidden", border: kycExpanded ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(34,197,94,0.15)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setKycExpanded(!kycExpanded)}
              style={{ width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: kycExpanded ? "rgba(34,197,94,0.06)" : "rgba(17,21,32,0.6)", border: "none", cursor: "pointer", transition: "background 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={20} style={{ color: "#22c55e" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    KYC Identity Verification System
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Government ID required before payout — tap to expand</span>
                </div>
              </div>
              {kycExpanded ? <ChevronUp size={22} style={{ color: "#22c55e" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
            </button>

            {kycExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(34,197,94,0.15)" }} className="fade-in">
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "24px", maxWidth: "800px" }}>
                  To prevent disputes and protect both parties, we securely collect the seller's government-issued ID before releasing the final payment. All documents are kept 100% confidential.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "14px", marginBottom: "24px" }}>
                  {[
                    { label: "✅ Aadhaar Card", sub: "Must contain name and address." },
                    { label: "✅ Driving License", sub: "Must contain name and address." },
                    { label: "❌ PAN Card alone", sub: "Not accepted as it lacks address." },
                    { label: "❌ Voter ID (Digital)", sub: "Only physical ID accepted." },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "12px", padding: "14px 16px" }}>
                      <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{item.label}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>{item.sub}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    "KYC is required from all sellers — no exceptions, regardless of account value.",
                    "All ID documents are stored on fully encrypted, offline servers.",
                    "ID data is only accessed in the event of a legal dispute or account retrieval attempt.",
                    "We cooperate fully with cybercrime departments using KYC records to pursue legal action against fraudulent sellers.",
                  ].map((rule, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(34,197,94,0.03)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "10px" }}>
                      <Check size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                      <span style={{ fontSize: "13.5px", color: "#e2e2e2" }}>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PAYOUT METHODS PANEL */}
          <div ref={payoutRef} style={{ borderRadius: "20px", overflow: "hidden", border: payoutExpanded ? "1px solid var(--border-gold)" : "1px solid rgba(255,215,0,0.1)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setPayoutExpanded(!payoutExpanded)}
              style={{ width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: payoutExpanded ? "rgba(255,215,0,0.05)" : "rgba(17,21,32,0.6)", border: "none", cursor: "pointer", transition: "background 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Coins size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    Seller Payout Methods
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>UPI, Bank, USDT, BTC, Cash — tap to expand all details</span>
                </div>
              </div>
              {payoutExpanded ? <ChevronUp size={22} style={{ color: "var(--gold)" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
            </button>

            {payoutExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(255,215,0,0.1)" }} className="fade-in">
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "24px", maxWidth: "800px" }}>
                  We support multiple payout channels to suit every seller. Payouts are released <strong style={{ color: "#fff" }}>within 1–2 hours</strong> of buyer confirmation for Instant Sell, or upon buyer delivery confirmation for Hold & Sell.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "14px", marginBottom: "24px" }}>
                  {[
                    { icon: "🏦", label: "UPI Transfer", sub: "Instant to any UPI ID (GPay, PhonePe, Paytm)." },
                    { icon: "🏛️", label: "Bank Transfer", sub: "NEFT / IMPS directly to your account." },
                    { icon: "₿", label: "USDT / BTC", sub: "Crypto payout for international sellers." },
                    { icon: "💵", label: "Cash (F2F Only)", sub: "Physical cash at meetup location. ₹80K+ accounts only." },
                  ].map((item) => (
                    <div key={item.label} style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.12)", borderRadius: "12px", padding: "16px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "4px" }}>{item.label}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>{item.sub}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "14px 18px", background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <Info size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "var(--gold)", fontWeight: 600 }}>
                    "All payouts are 100% guaranteed. We hold buyer funds safely and only release them after ownership transfer is verified."
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── INTERACTIVE TIMELINE ─────────────────────────── */}
        <section className="section" style={{ background: "rgba(10,13,20,0.4)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Interactive Roadmap</span>
            <h2 className="stitle">Visual Handover & <span className="g">Escrow Timeline</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Track the exact progress pathway of your selected selling mode.
            </p>
          </div>

          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
              <button
                onClick={() => setActiveOption(0)}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", borderRadius: "30px", background: activeOption === 0 ? "rgba(59,130,246,0.12)" : "transparent", border: activeOption === 0 ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)", color: activeOption === 0 ? "#60a5fa" : "var(--muted)", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.25s" }}>
                <Clock size={14} /> Hold & Sell Pathway
              </button>
              <button
                onClick={() => setActiveOption(1)}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", borderRadius: "30px", background: activeOption === 1 ? "rgba(34,197,94,0.12)" : "transparent", border: activeOption === 1 ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.1)", color: activeOption === 1 ? "#4ade80" : "var(--muted)", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.25s" }}>
                <Zap size={14} /> Instant Sell Pathway
              </button>
            </div>

            <div style={{ position: "relative", paddingLeft: "45px", borderLeft: `2px dashed ${activeOption === 0 ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`, marginLeft: "15px" }}>
              <div style={{ position: "absolute", left: "-2px", top: 0, bottom: 0, width: "2px", background: `linear-gradient(to bottom, ${activeOption === 0 ? "#3b82f6, #60a5fa" : "#22c55e, #4ade80"})`, boxShadow: `0 0 10px ${activeOption === 0 ? "rgba(59,130,246,0.5)" : "rgba(34,197,94,0.5)"}`, transition: "all 0.5s ease" }} />

              {currentSteps.map((step, idx) => (
                <div key={idx} className="timeline-node-card fade-in" style={{ position: "relative", marginBottom: "35px", background: "rgba(17,21,32,0.35)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "14px", padding: "20px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
                  <div style={{ position: "absolute", left: "-66px", top: "18px", width: "40px", height: "40px", borderRadius: "50%", background: "#080a0f", border: `2px solid ${activeOption === 0 ? "#3b82f6" : "#22c55e"}`, boxShadow: `0 0 12px ${activeOption === 0 ? "rgba(59,130,246,0.4)" : "rgba(34,197,94,0.4)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: activeOption === 0 ? "#60a5fa" : "#4ade80", zIndex: 2, transition: "all 0.3s ease" }}>
                    {step.title === "Contact & Share Account" || step.title === "Support Connection & Logins" ? <MessageCircle size={18} /> :
                      step.title === "Market Price Evaluation" || step.title === "Live Inventory Scan" ? <BarChart size={18} /> :
                      step.title === "Verification & Login Lock" ? <ShieldCheck size={18} /> :
                      step.title === "Professional Listing & Channel Broadcast" ? <Megaphone size={18} /> :
                      step.title === "3–7 Days Typical Listing Cycle" ? <Clock size={18} /> :
                      step.title === "Select Mode of Dealing" ? <MapPin size={18} /> :
                      step.title === "KYC & Identity Verification" || step.title === "Owner Government ID KYC Proof" ? <FileText size={18} /> :
                      step.title === "Double-Login Securing for Buyer" || step.title === "Single/Dual Login Security" ? <ShieldCheck size={18} /> :
                      step.title === "Quarantine Cooldown Timelines" ? <Clock size={18} /> :
                      step.title === "Irreversible Handover Clause" ? <Lock size={18} /> :
                      <CreditCard size={18} />}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", color: "#fff", margin: 0, fontWeight: 700, letterSpacing: "0.5px" }}>{step.title}</h3>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-h)", fontWeight: 700, background: activeOption === 0 ? "rgba(59,130,246,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${activeOption === 0 ? "rgba(59,130,246,0.3)" : "rgba(34,197,94,0.3)"}`, color: activeOption === 0 ? "#60a5fa" : "#4ade80", padding: "2px 10px", borderRadius: "100px", textTransform: "uppercase" }}>
                      Step 0{idx + 1}
                    </span>
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", margin: 0 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY TRUST MADDY STORE ────────────────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5%" }}>
          <h2 className="stitle" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", fontSize: "clamp(26px,4vw,38px)", marginBottom: "32px", fontFamily: "var(--font-h)" }}>
            <Award size={28} style={{ color: "var(--gold)" }} /> Why Trust <span className="g">Maddy Store?</span>
          </h2>

          <div className="why-us-grid" style={{ marginBottom: "40px" }}>
            {[
              { h: "100% Trusted Deals", p: "Over 5000+ satisfied customers globally." },
              { h: "Safe Handovers", p: "Proprietary security protocols ensuring complete credential detachment." },
              { h: "24/7 Support", p: "Dedicated specialist team for seller queries and after-sale support." },
              { h: "KYC Assured Security", p: "KYC audits preventing fraudulent retrievals or listing disputes." }
            ].map((item, idx) => (
              <div
                key={item.h}
                className={`why-us-card why-us-card-green ${activeTrustCard === idx ? 'highlighted' : ''}`}
                onClick={() => setActiveTrustCard(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="why-us-icon-wrap" style={{ color: "#22c55e", background: "rgba(34,197,94,0.04)", borderColor: "rgba(34,197,94,0.15)" }}>
                  <CheckCircle size={20} />
                </div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20questions%20about%20selling%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn btn-green" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <MessageCircle size={15} /> WhatsApp Support
            </a>
          </div>
        </section>

        {/* ── SELLER HANDOVER & UNLINK HUB ───────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">Trust & Security</span>
            <h2 className="stitle">How Account Handover & <span className="g">Unlinks Work</span></h2>
            <p className="ssub" style={{ margin: "0 auto", maxWidth: "600px" }}>
              Selling with Maddy Store is clear, transparent, and secure. Understand verification, unlinking, and payout guarantees.
            </p>
          </div>

          <div style={{ maxWidth: "1000px", margin: "0 auto", background: "rgba(14,17,24,0.7)", border: "1px solid var(--border-gold)", borderRadius: "24px", padding: "35px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(34,197,94,0.01) 100%)", border: "1px dashed rgba(34,197,94,0.25)", borderRadius: "16px", padding: "24px", marginBottom: "30px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={22} />
              </div>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <h4 style={{ fontFamily: "var(--font-h)", fontSize: "16px", color: "#fff", margin: "0 0 8px 0", letterSpacing: "0.5px" }}>
                  Pre-Listing Integrity & Payout Assurance Protocol
                </h4>
                <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: "1.6", margin: 0 }}>
                  As a premium seller, you receive full legal protection and guaranteed direct payments. If your account has active dual-social links, we initiate an official <strong>7-day unlink cooldown</strong> for the secondary login. During this period, you must not log into that secondary network. Once security bindings are complete and the primary login is handed over, your payout is instantly released.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
              {[
                { label: "1. Pre-Listing Checklist", icon: <Info size={16} /> },
                { label: "2. Unlinking Rules", icon: <Clock size={16} /> },
                { label: "3. Payout & KYC Guarantee", icon: <Shield size={16} /> }
              ].map((tab, idx) => {
                const isActive = activeUnlinkTab === idx;
                return (
                  <button key={idx} onClick={() => setActiveUnlinkTab(idx)} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", fontFamily: "var(--font-h)", fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px", background: isActive ? "rgba(34,197,94,0.08)" : "transparent", border: isActive ? "1px solid rgba(34,197,94,0.4)" : "1px solid transparent", color: isActive ? "#4ade80" : "var(--muted)", cursor: "pointer", transition: "all 0.2s" }}>
                    {tab.icon} {tab.label}
                  </button>
                );
              })}
            </div>

            {activeUnlinkTab === 0 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>5-Step Account Prep Checklist</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>Before sending your account details, verify that your account complies with these guidelines:</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "20px" }}>
                  {[
                    ["1. Disconnect Personal Links", "Remove any personal social networks (e.g. your personal Facebook or Google account) that you do not wish to hand over."],
                    ["2. Log Out of All Devices", "Navigate to BGMI in-game settings and click \"Log Out of All Devices\" to ensure no active sessions remain."],
                    ["3. Capture Real-Time Recording", "Record a smooth, continuous inventory walkthrough displaying all upgraded guns, classic skins, Conqueror badges, and supercar keys."],
                    ["4. Region & Cooldown Locks", "Ensure you haven't switched regions in BGMI inside the last 30 days, as a region lock could block the buyer."],
                    ["5. Immutable Inventory Guarantee", "Do not spend UC, use Rename Cards, or dismantle outfits once you submit your inventory recording. Account must match the listing video 100%."],
                  ].map(([title, desc]) => (
                    <div key={title} className="unlink-rule-card"><strong className="rule-title">{title}</strong><span className="rule-desc">{desc}</span></div>
                  ))}
                </div>
              </div>
            )}

            {activeUnlinkTab === 1 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>Unlinking Regulations for Sellers</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>BGMI enforces structural constraints to prevent unlinking fraud. As a seller, closely follow these:</p>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                    <span><strong>Primary Access Link:</strong> Full Ownership Transferred to Maddy Store/Buyer</span>
                    <span style={{ color: "#4ade80" }}><strong>Secondary Access Link:</strong> Submitted for Unlinking</span>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", margin: "12px 0" }} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "15px" }}>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>UNLINK INITIATION</small>
                      <strong style={{ color: "var(--gold)", fontSize: "16px" }}>Immediate Lock</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>We submit the unlink request in-game using the secondary link.</span>
                    </div>
                    <div>
                      <small style={{ color: "var(--muted)", display: "block" }}>7-DAY COOLDOWN PERIOD</small>
                      <strong style={{ color: "#22c55e", fontSize: "16px" }}>No Logging In</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>Seller must not access the account via the unlinking method or it cancels the request.</span>
                    </div>
                  </div>
                </div>
                <div style={{ borderLeft: "3px solid #22c55e", paddingLeft: "15px" }}>
                  <p style={{ fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    "During the 7-day waiting period, logging into the secondary social network will immediately cancel the unlink. Sellers are legally bound by our terms to not log in, modify passwords, or trigger recovery options during this window."
                  </p>
                </div>
              </div>
            )}

            {activeUnlinkTab === 2 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>Seller KYC Verification & Payout Rules</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>We prioritize seller trust just as much as buyer security. Review how we protect you and execute secure payouts:</p>
                <ul style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Secure KYC Encrypted Storage:</strong> Your government ID is saved on fully secure, encrypted servers and only accessed in the event of an account dispute.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>100% Guarded Payments:</strong> We hold buyer funds in secure escrow, eliminating any risk of chargebacks or fraudulent reversals once your account is delivered.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Direct Payout Release:</strong> 100% of your payout is transferred directly via UPI, Bank Transfer, USDT, BTC, or Cash within 1–2 hours of credential validation.</li>
                </ul>
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <AlertTriangle size={20} style={{ color: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#fff" }}>
                    <strong>Crucial Security Notice:</strong> Any attempt to illegally retrieve or pull back the account post-sale is a direct offense. We cooperate fully with cybercrime departments and release all KYC records to pursue legal action.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "70px 5% 90px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="slabel">FAQ</span>
            <h2 className="stitle">Common Selling Questions</h2>
            <p className="ssub" style={{ margin: "0 auto" }}>Clarifying our valuation, evaluation, and instant payout procedures.</p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { q: "How do I get paid and how long does the payout take?", a: "For both options, payouts are made via UPI, Bank Transfer, USDT, BTC, or Cash. Under Hold & Sell, payment is released after the buyer confirms successful delivery. Under Instant Sell, funds are released within 1–2 hours after our security team completes the credential audit." },
              { q: "What is the difference between Hold & Sell vs. Instant Sell?", a: "Hold & Sell lets you get 100% maximum market value as we list it to direct buyers, taking 3–7 days. Instant Sell gives you immediate cash within hours directly from us, at a wholesale buyout rate (usually 20–30% lower than open market value) to offset inventory carrying risks." },
              { q: "Why is there a ₹80,000+ threshold for Face-to-Face deals?", a: "F2F cash meetups require significant travel coordination, local safety setup, and escrow monitoring. To ensure it is mutually viable, F2F dealing is strictly reserved for accounts above ₹80,000. The owner must cover all travel, stay, and food charges for the Maddy Store deal agent." },
              { q: "What are the exact unlinking rules and cooldown timelines?", a: "BGMI unlinking requires 7 days to complete for secondary logins. If a seller logs into the unlinking account during this 7-day period, the unlink is automatically cancelled. Fresh linking slots require a 30-day incubation lock before an unlink can be requested." },
              { q: "Why is the sale completely irreversible once the account is secured?", a: "Maddy Store binds recovery emails and recovery phone numbers to the buyer's credentials during security isolation. Once detaching is done and bindings are locked, the credentials are permanently handed over, making retrieval impossible." },
              { q: "What KYC documents do I need and how is my data secured?", a: "We require a valid government-issued ID with address (specifically Aadhaar Card or Driving License). All KYC data is stored on heavily encrypted offline servers and is only used to cooperate with official cybercrime departments in the event of retrieval attempts." },
              { q: "Can I still play on my account during a Hold & Sell listing?", a: "Yes, you can continue playing. However, you must strictly: (1) not bind any new social logins, (2) not change the linking region, (3) not spend inventory assets like UC or Rename Cards, and (4) notify our team immediately if you unlock high-tier outfits or labs so we can update your listing." },
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{ background: "var(--card)", border: isOpen ? "1px solid var(--gold)" : "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", transition: "all 0.3s ease", boxShadow: isOpen ? "0 10px 25px rgba(255,215,0,0.03)" : "none" }}>
                  <button onClick={() => setActiveFaq(isOpen ? null : idx)} style={{ width: "100%", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", fontSize: "16px", fontWeight: 600, textAlign: "left", fontFamily: "var(--font-h)", letterSpacing: "0.5px", background: "transparent", border: "none", cursor: "pointer" }}>
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: "var(--gold)" }} /> : <ChevronDown size={18} style={{ color: "var(--muted)" }} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 24px 20px", color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
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

          .sell-option-card.active-blue {
            border-color: #3b82f6;
            box-shadow: 0 0 25px rgba(59,130,246,0.25), inset 0 0 15px rgba(59,130,246,0.02);
            background: rgba(17, 21, 32, 0.65);
          }

          .sell-option-card.active-green {
            border-color: #22c55e;
            box-shadow: 0 0 25px rgba(34,197,94,0.25), inset 0 0 15px rgba(34,197,94,0.02);
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

          .tag-blue { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.25); color: #60a5fa; }
          .tag-green { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #4ade80; }

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

          .steps-container { flex: 1; margin-bottom: 30px; display: flex; flex-direction: column; }

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

          .steps-list-custom { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
          .step-item-custom { display: flex; gap: 14px; align-items: flex-start; }

          .step-num {
            width: 22px; height: 22px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--font-h); font-size: 11px; font-weight: 700;
            flex-shrink: 0; margin-top: 2px;
          }

          .step-num-blue { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
          .step-num-green { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }

          .step-title { color: #fff; font-size: 13px; display: block; margin-bottom: 3px; font-weight: 600; }
          .step-body { color: var(--muted); font-size: 11.5px; line-height: 1.5; display: block; }

          .cta-container { margin-top: auto; }

          .unlink-rule-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 18px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: all 0.25s ease;
          }

          .unlink-rule-card:hover { border-color: rgba(34,197,94,0.2); background: rgba(34,197,94,0.02); transform: translateY(-2px); }
          .rule-title { color: #fff; font-size: 14px; font-family: var(--font-h); letter-spacing: 0.5px; font-weight: 600; }
          .rule-desc { color: var(--muted); font-size: 12px; line-height: 1.5; }

          .fade-in { animation: fadeIn 0.35s ease both; }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .timeline-node-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
          .timeline-node-card:hover { transform: translateX(4px); border-color: rgba(255,255,255,0.1) !important; background: rgba(17,21,32,0.55) !important; }

          @media (max-width: 768px) {
            .options-grid-two { gap: 24px; }
            .sell-option-card { padding: 28px 20px; }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
