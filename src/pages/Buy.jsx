import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import {
  ShoppingCart, Lock, Banknote, CheckCircle,
  MessageCircle, Target, Shield, Gamepad2, Flame, Star, Send,
  AlertTriangle, Users, Info, ChevronDown, ChevronUp, HelpCircle,
  Sparkles, Award, Clock, MapPin, CreditCard, Coins, ArrowRight,
  ExternalLink, BookOpen, ShieldCheck, Check, FileText, Wallet,
  RefreshCw, ChevronRight, Eye, Zap
} from "lucide-react";

export default function Buy() {
  useSEO(
    "Buy BGMI Accounts — 100% Secure & Verified Listings",
    "Browse verified high-tier BGMI accounts. Safe single-login details, custom requirement sourcing, and professional handovers."
  );

  const [activeOption, setActiveOption] = useState(0);
  const [activeTrustCard, setActiveTrustCard] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState(0);

  // Inline expandable panel states
  const [bookingExpanded, setBookingExpanded] = useState(false);
  const [f2fExpanded, setF2fExpanded] = useState(false);
  const [escrowExpanded, setEscrowExpanded] = useState(false);

  // Deal Mode deep-dive accordion on Buy Option cards
  const [optionDeepDive, setOptionDeepDive] = useState(null); // 'booking' | 'f2f' | 'escrow' | null

  const bookingRef = useRef(null);
  const f2fRef = useRef(null);
  const escrowRef = useRef(null);
  const optionsRef = useRef(null);

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Booking calculator state
  const [calcValue, setCalcValue] = useState(100000);
  const bookingFee = Math.round(calcValue * 0.1);
  const balance = calcValue - bookingFee;

  const ruleChipStyle = (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "var(--font-h)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
    border: `1px solid ${color}`,
    color: color,
    background: `${color}14`,
    transition: "all 0.2s",
    textDecoration: "none"
  });

  const inlinePanelStyle = {
    background: "rgba(8,10,15,0.7)",
    backdropFilter: "blur(16px)",
    border: "1px solid var(--border-gold)",
    borderRadius: "18px",
    overflow: "hidden",
    marginTop: "16px",
    transition: "all 0.3s ease"
  };

  const timelineDot = (n, highlight) => ({
    width: "34px", height: "34px", borderRadius: "50%",
    background: highlight ? "linear-gradient(135deg,var(--gold),var(--orange))" : "rgba(17,21,32,0.8)",
    border: highlight ? "2px solid var(--gold)" : "1px solid rgba(255,215,0,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: 700, color: highlight ? "#000" : "var(--gold)",
    flexShrink: 0
  });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", background: "var(--bg)", color: "#fff", minHeight: "100vh" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "88vh", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/buy-banner.jpg"
            alt="BGMI Battlefield" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.6)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 30%, transparent 50%, rgba(8,10,15,0.97) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "860px",
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
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,18px)",
              maxWidth: "640px", margin: "0 auto 32px", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Choose from secured instant-delivery stocks, explore daily channel listings, or request personalized custom sourcing tailored to your budget and exact skin requirements.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/readystocks" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 30px", borderRadius: "10px",
                background: "linear-gradient(135deg, var(--gold), var(--orange))",
                color: "#000", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "14px", textDecoration: "none", letterSpacing: "0.5px",
                boxShadow: "0 4px 20px rgba(255,215,0,0.3)", transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}>
                <Gamepad2 size={16} /> Browse Ready Stocks
              </Link>
              <button onClick={() => scrollTo(optionsRef)} style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 30px", borderRadius: "10px",
                background: "rgba(255,255,255,0.05)", cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700,
                fontSize: "14px", letterSpacing: "0.5px", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(255,215,0,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                <Info size={16} /> Learn Buying Paths
              </button>
            </div>

            {/* Quick Deal Mode Navigation */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "28px" }}>
              <button onClick={() => { setBookingExpanded(true); setTimeout(() => scrollTo(bookingRef), 100); }}
                style={ruleChipStyle("var(--gold)")}>
                <Coins size={12} /> Booking System
              </button>
              <button onClick={() => { setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                style={ruleChipStyle("var(--orange)")}>
                <MapPin size={12} /> F2F Deal Rules
              </button>
              <button onClick={() => { setEscrowExpanded(true); setTimeout(() => scrollTo(escrowRef), 100); }}
                style={ruleChipStyle("#a855f7")}>
                <ShieldCheck size={12} /> Escrow System
              </button>
            </div>
          </div>
        </section>

        {/* ── ESSENTIAL TRANSACTION RULES ───────────── */}
        <section style={{ padding: "50px 5% 20px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(249,115,22,0.05) 100%)",
            border: "1px dashed rgba(249,115,22,0.4)", borderRadius: "20px",
            padding: "32px 30px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <AlertTriangle size={24} style={{ color: "var(--orange)", filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" }} />
              <h2 style={{
                fontFamily: "var(--font-h)", fontSize: "clamp(20px,3vw,24px)",
                fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: 0, color: "#fff"
              }}>
                Essential Transaction & Booking Rules
              </h2>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "28px", paddingLeft: "36px" }}>
              Every deal — account, X-suit, or supercar — follows these strict rules. Click any rule to expand full details.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "20px" }}>

              {/* Rule 1: Booking */}
              {[
                {
                  num: "01", title: "10% Non-Refundable Booking Fee",
                  short: "A 10% non-refundable booking fee applies to all deals (accounts, X-suits, supercars). For a ₹100K account, that's ₹10K upfront. Failure to pay the balance cancels the booking with no refund.",
                  linkLabel: "Full Booking System Details",
                  linkRef: bookingRef,
                  setExp: setBookingExpanded,
                  color: "var(--gold)"
                },
                {
                  num: "02", title: "Full Payment Before Handover",
                  short: "100% payment clearance is strictly mandatory before any account credentials, social bindings, or login methods are handed over. No partial payment guarantees immediate delivery.",
                  linkLabel: null, color: "var(--gold)"
                },
                {
                  num: "03", title: "F2F Meetup Guidelines",
                  short: "Face-to-Face deals are for accounts above ₹80,000 only. 10% booking fee is mandatory. Meetup is at a common midpoint public location. Buyer covers all travel, stay, and food costs for the seller/agent.",
                  linkLabel: "Full F2F Deal System Details",
                  linkRef: f2fRef,
                  setExp: setF2fExpanded,
                  color: "var(--orange)"
                },
                {
                  num: "04", title: "ID Verification (Rare Cases)",
                  short: "In rare scenarios, a government ID (Aadhaar, PAN, or DL) may be requested for security verification. All documents are handled securely and kept strictly confidential.",
                  linkLabel: null, color: "var(--gold)"
                },
                {
                  num: "05", title: "Escrow via Trusted Middlemen",
                  short: "Escrow is only permitted through trusted YouTubers, streamers, or dealers mutually recognized by both parties. Buyer is responsible for the escrow fee.",
                  linkLabel: "Full Escrow System Details",
                  linkRef: escrowRef,
                  setExp: setEscrowExpanded,
                  color: "#a855f7"
                },
              ].map((rule) => (
                <div key={rule.num} style={{ display: "flex", gap: "14px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--orange)", fontWeight: 700, flexShrink: 0,
                    fontSize: "13px", fontFamily: "var(--font-h)"
                  }}>{rule.num}</div>
                  <div>
                    <strong style={{ color: "#fff", display: "block", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                      {rule.title}
                    </strong>
                    <span style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.6", display: "block", marginBottom: "10px" }}>
                      {rule.short}
                    </span>
                    {rule.linkLabel && (
                      <button
                        onClick={() => {
                          rule.setExp(true);
                          setTimeout(() => scrollTo(rule.linkRef), 150);
                        }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          fontSize: "12px", fontWeight: 700, color: rule.color,
                          background: "transparent", border: "none", cursor: "pointer",
                          fontFamily: "var(--font-h)", letterSpacing: "0.5px",
                          textTransform: "uppercase", padding: 0
                        }}>
                        <BookOpen size={12} /> {rule.linkLabel} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OPTIONS GRID SECTION ────────────────────────── */}
        <section id="buying-options" ref={optionsRef} className="section" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)", padding: "50px 5% 80px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="slabel">Buying Methods</span>
            <h2 className="stitle">Three Ways to Acquire Your <span className="g">BGMI Account</span></h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Select from three curated buying modes. Each card explains the full flow — including Booking, F2F, and Escrow details — with expandable inline guides.
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
                <h3 className="buy-option-title">Ready To Play Accounts</h3>
              </div>
              <p className="buy-option-desc">
                Pre-secured, verified accounts listed directly on our website or channels. Fully safe with unlinking completed — inspect inventory, specs, pricing, and login structures before purchasing.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Secure Ready-to-Play Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    ["Browse & Review", "Ready-to-Play accounts are pre-secured and listed on our website or channels, fully safe with unlinking done. Review inventory, specs, pricing, and login info before choosing."],
                    ["Contact Support", "After reviewing, contact us via the website or directly on WhatsApp/Telegram to confirm the availability of your chosen account."],
                    ["Choose Deal Mode", "Select your transaction method: secure online transfer or Face-to-Face (F2F) meetup. F2F is reserved strictly for accounts above ₹80K."],
                    ["Upfront Booking", "Pay a 10% non-refundable booking fee to hold the account. For online deals, pay in full at once or pay booking and settle balance within 24 hours. For F2F, 10% booking is mandatory."],
                    ["Full Payment Processing", "Only after full payment is completely cleared (online or F2F) will the account ownership transition be officially processed."],
                    ["Rare ID Verification", "In rare cases (e.g., to address bank freezes), a government-issued ID (Aadhaar) may be securely requested for legal tracking purposes."],
                    ["Secure Binding", "Account is bound to buyer's recovery email and phone, secured, and delivered. An official invoice with clear timelines and guarantees is provided."],
                    ["Feedback & Screenshot", "Log in, share a lobby screenshot and deal feedback with our team, and submit a website review of your experience."],
                  ].map(([title, body], idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-blue">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{title}</strong>
                        <span className="step-body">{body}</span>
                        {/* Inline chips for key steps */}
                        {idx === 2 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                              style={{ ...ruleChipStyle("var(--orange)"), fontSize: "10px", padding: "4px 10px" }}>
                              <MapPin size={10} /> F2F Rules
                            </button>
                          </div>
                        )}
                        {idx === 3 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setBookingExpanded(true); setTimeout(() => scrollTo(bookingRef), 100); }}
                              style={{ ...ruleChipStyle("var(--gold)"), fontSize: "10px", padding: "4px 10px" }}>
                              <Coins size={10} /> Booking Details
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container">
                <Link to="/readystocks" className="btn btn-gold" style={{ width: "100%", height: "52px", justifyContent: "center", gap: "8px" }}>
                  <Gamepad2 size={18} /> View Ready-to-Play Accounts →
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
                <h3 className="buy-option-title">Available Accounts in Market</h3>
              </div>
              <p className="buy-option-desc">
                Access a massive, fast-moving daily catalog of verified accounts by joining our premium communities. Listings range from budget-friendly options to premium high-end accounts.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Feed Booking Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    ["Join Channels", "Join our official WhatsApp or Telegram channels via the buttons below to access our daily verified listing feed."],
                    ["Browse Daily Listings", "We post verified accounts daily — from ₹5K to several lakhs. Review listings and choose the account that matches your preferences perfectly."],
                    ["Choose Deal Mode", "Select your transaction mode: secure online transfer or Face-to-Face (F2F) meetup. F2F is only allowed for accounts above ₹80K and requires upfront booking."],
                    ["Upfront Booking Deposit", "The 10% non-refundable booking deposit locks your chosen account regardless of mode. Alternatively, full payment online is also accepted without booking."],
                    ["Payment Security Check", "In rare cases (bank freeze prevention), a government-issued ID (Aadhaar) may be requested for legal verification — this is not standard."],
                    ["Ownership Secure Binding", "Account credentials are only handed over after full payment clearance. The account is then bound to the buyer's recovery email and phone."],
                    ["Transaction Invoice", "Official invoice provided with exact unlink dates, guarantee timelines, and account specs."],
                    ["Lobby Verification & Feedback", "Send a verification lobby screenshot and feedback to our team via WhatsApp or Telegram after logging in."],
                    ["Submit Website Review", "Share your overall buying experience on our website with your in-game lobby screenshot."],
                  ].map(([title, body], idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-purple">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{title}</strong>
                        <span className="step-body">{body}</span>
                        {idx === 2 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                              style={{ ...ruleChipStyle("var(--orange)"), fontSize: "10px", padding: "4px 10px" }}>
                              <MapPin size={10} /> F2F Rules
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setEscrowExpanded(true); setTimeout(() => scrollTo(escrowRef), 100); }}
                              style={{ ...ruleChipStyle("#a855f7"), fontSize: "10px", padding: "4px 10px" }}>
                              <ShieldCheck size={10} /> Escrow Option
                            </button>
                          </div>
                        )}
                        {idx === 3 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setBookingExpanded(true); setTimeout(() => scrollTo(bookingRef), 100); }}
                              style={{ ...ruleChipStyle("var(--gold)"), fontSize: "10px", padding: "4px 10px" }}>
                              <Coins size={10} /> Booking Details
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20join%20the%20MBS%20WhatsApp%20Account%20Buying%20feed." target="_blank" rel="noreferrer" className="btn btn-green" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <MessageCircle size={15} /> WhatsApp Channel
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <Send size={15} /> Telegram Channel
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
                <h3 className="buy-option-title">Customized Requirement Account</h3>
              </div>
              <p className="buy-option-desc">
                Have highly specific demands? We search our extensive nationwide seller network to find you the best matching accounts within your custom budget.
              </p>

              <div className="steps-container">
                <h4 className="steps-heading">Custom Sourcing Steps:</h4>
                <ul className="steps-list-custom">
                  {[
                    ["Contact & Requirements", "Reach out via WhatsApp or Telegram, specifying your exact requirements (gun skins, X-suits, outfits) and your maximum budget."],
                    ["Feasibility Discussion", "We discuss feasibility with our seller network, adjusting requirements or budget if needed based on current market availability."],
                    ["10% Security Deposit", "After requirements and budget are finalized, pay a 10% security deposit to begin sourcing (e.g., ₹10K for a ₹100K account target)."],
                    ["Sourcing Search (24–48 hrs)", "We search our nationwide seller network immediately. If no match is found within 24–48 hours, the full deposit is refunded immediately."],
                    ["Deposit Converts to Booking", "If accounts are found, the security deposit becomes a non-refundable booking amount. Review options and finalize your preferred deal mode."],
                    ["F2F Deal Conditions", "Face-to-face meetups apply only for accounts above ₹80K and require the 10% booking deposit. Once decided, the booking secures the account hold."],
                    ["Secure Binding After Full Payment", "Only after full payment (online or F2F) is the account bound to buyer's phone and recovery email. Rare ID verification may apply."],
                    ["Transaction Invoice", "Detailed invoice provided with guarantee period, secondary unlink dates, and all transaction specifics."],
                    ["Feedback & Website Review", "Share an in-game lobby screenshot and feedback via support chat, and submit a website review of your sourcing experience."],
                  ].map(([title, body], idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-orange">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{title}</strong>
                        <span className="step-body">{body}</span>
                        {idx === 2 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setBookingExpanded(true); setTimeout(() => scrollTo(bookingRef), 100); }}
                              style={{ ...ruleChipStyle("var(--gold)"), fontSize: "10px", padding: "4px 10px" }}>
                              <Coins size={10} /> How Booking Works
                            </button>
                          </div>
                        )}
                        {idx === 5 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); setF2fExpanded(true); setTimeout(() => scrollTo(f2fRef), 100); }}
                              style={{ ...ruleChipStyle("var(--orange)"), fontSize: "10px", padding: "4px 10px" }}>
                              <MapPin size={10} /> F2F Full Guide
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20a%20custom%20BGMI%20account%20requirement%20for%20a%20budget%20of%20" target="_blank" rel="noreferrer" className="btn btn-green" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <MessageCircle size={15} /> WhatsApp
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ flex: 1, height: "52px", justifyContent: "center", fontSize: "11px", padding: "10px", gap: "6px" }}>
                  <Send size={15} /> Telegram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEAL MODE DEEP-DIVE EXPANDABLE SECTIONS ────── */}
        <section style={{ padding: "0 5% 70px", maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* ── BOOKING SYSTEM PANEL ── */}
          <div ref={bookingRef} style={{ borderRadius: "20px", overflow: "hidden", border: bookingExpanded ? "1px solid var(--border-gold)" : "1px solid rgba(255,215,0,0.1)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setBookingExpanded(!bookingExpanded)}
              style={{
                width: "100%", padding: "22px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: bookingExpanded ? "rgba(255,215,0,0.05)" : "rgba(17,21,32,0.6)",
                border: "none", cursor: "pointer", transition: "background 0.3s"
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Coins size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    10% Non-Refundable Booking System
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Tap to expand full booking rules, calculator & examples</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/booking-system" onClick={(e) => e.stopPropagation()} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "11px", fontWeight: 700, color: "var(--gold)",
                  fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "0.5px",
                  background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)",
                  padding: "6px 12px", borderRadius: "20px", textDecoration: "none"
                }}>
                  <ExternalLink size={11} /> Full Page
                </Link>
                {bookingExpanded ? <ChevronUp size={22} style={{ color: "var(--gold)" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {bookingExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(255,215,0,0.1)" }} className="fade-in">

                {/* What is booking */}
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "800px" }}>
                  The booking system allows buyers to temporarily reserve an account or item by paying a <strong style={{ color: "var(--gold)" }}>10% advance booking amount</strong>. This fee is <strong style={{ color: "var(--red, #ef4444)" }}>strictly non-refundable</strong> and applies to all deals — accounts, X-suits, and supercars.
                </p>

                {/* Rules grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "14px", marginBottom: "28px" }}>
                  {[
                    { label: "Confirms buyer commitment", icon: <Check size={14} style={{ color: "var(--gold)" }} /> },
                    { label: "Temporarily locks the account for you", icon: <Lock size={14} style={{ color: "var(--gold)" }} /> },
                    { label: "Prevents other buyers purchasing it", icon: <Shield size={14} style={{ color: "var(--gold)" }} /> },
                    { label: "Non-refundable upon cancellation", icon: <AlertTriangle size={14} style={{ color: "#ef4444" }} /> },
                    { label: "24-hour balance payment window", icon: <Clock size={14} style={{ color: "var(--gold)" }} /> },
                    { label: "Mandatory for all F2F deals", icon: <MapPin size={14} style={{ color: "var(--orange)" }} /> },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px 14px", borderRadius: "10px" }}>
                      {item.icon}
                      <span style={{ fontSize: "13px", color: "#e2e2e2" }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Calculator */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "center", background: "rgba(17,21,32,0.8)", border: "1px solid var(--border-gold)", borderRadius: "16px", padding: "24px" }} className="booking-calc-grid">
                  <div>
                    <h4 style={{ fontFamily: "var(--font-h)", fontSize: "16px", color: "#fff", marginBottom: "16px" }}>Booking Examples</h4>
                    {[["₹100,000 Account", "₹10,000"], ["₹50,000 X-Suit", "₹5,000"], ["₹200,000 Account", "₹20,000"]].map(([item, fee]) => (
                      <div key={item} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>{item}</span>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold)" }}>{fee} booking</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "10px" }}>
                      Live Calculator (₹)
                    </label>
                    <div style={{ position: "relative", marginBottom: "12px" }}>
                      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)", fontWeight: 700 }}>₹</span>
                      <input
                        type="text"
                        value={calcValue.toLocaleString()}
                        onChange={(e) => { const v = Number(e.target.value.replace(/[^0-9]/g, "")); setCalcValue(v || 0); }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", background: "rgba(8,10,15,0.8)", border: "1px solid var(--border-gold)", borderRadius: "10px", padding: "12px 12px 12px 30px", color: "#fff", fontSize: "16px", fontWeight: 700, outline: "none" }}
                      />
                    </div>
                    <input type="range" min="10000" max="500000" step="5000" value={calcValue}
                      onChange={(e) => setCalcValue(Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer", marginBottom: "16px" }} />
                    <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: "10px", padding: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>Booking Fee (10%)</span>
                        <span style={{ fontWeight: 700, color: "var(--gold)" }}>₹{bookingFee.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px dashed rgba(255,255,255,0.07)" }}>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}>Remaining Balance</span>
                        <span style={{ fontWeight: 700, color: "#fff" }}>₹{balance.toLocaleString()}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--muted)", display: "block", marginTop: "8px" }}>⚠️ Booking valid for 24 hours unless otherwise discussed.</span>
                  </div>
                </div>

                <div style={{ marginTop: "20px", padding: "16px 20px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <AlertTriangle size={20} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#ff8888", fontWeight: 700 }}>
                    "No refund will be issued after successful booking confirmation. Please confirm your decision carefully."
                  </span>
                </div>

                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/booking-system" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                    background: "linear-gradient(135deg,var(--gold),var(--orange))", borderRadius: "10px",
                    color: "#000", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                    textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "none"
                  }}>
                    <ExternalLink size={14} /> Full Booking System Page →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── FACE-TO-FACE PANEL ── */}
          <div ref={f2fRef} style={{ borderRadius: "20px", overflow: "hidden", border: f2fExpanded ? "1px solid rgba(255,107,53,0.5)" : "1px solid rgba(255,107,53,0.15)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setF2fExpanded(!f2fExpanded)}
              style={{
                width: "100%", padding: "22px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: f2fExpanded ? "rgba(255,107,53,0.06)" : "rgba(17,21,32,0.6)",
                border: "none", cursor: "pointer", transition: "background 0.3s"
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={20} style={{ color: "var(--orange)" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    Face-to-Face Deal System
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>For accounts above ₹80K — tap to expand all F2F rules and process</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/f2f-deal" onClick={(e) => e.stopPropagation()} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "11px", fontWeight: 700, color: "var(--orange)",
                  fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "0.5px",
                  background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.25)",
                  padding: "6px 12px", borderRadius: "20px", textDecoration: "none"
                }}>
                  <ExternalLink size={11} /> Full Page
                </Link>
                {f2fExpanded ? <ChevronUp size={22} style={{ color: "var(--orange)" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {f2fExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(255,107,53,0.15)" }} className="fade-in">
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "800px" }}>
                  Face-to-Face (F2F) deals are an <strong style={{ color: "#fff" }}>optional, in-person transaction method</strong> where the buyer and seller meet at a safe, common public location to complete the transfer. This is exclusively available for <strong style={{ color: "var(--orange)" }}>accounts above ₹80,000</strong>.
                </p>

                {/* F2F Steps Timeline */}
                <div style={{ position: "relative", paddingLeft: "24px", marginBottom: "28px" }}>
                  <div style={{ position: "absolute", left: "11px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg,var(--orange) 0%,rgba(255,107,53,0.1) 100%)" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {[
                      ["Choose Account Above ₹80K", "Browse our listings or channels and select a premium account meeting the minimum F2F eligibility threshold."],
                      ["Select F2F as Deal Mode", "Inform Maddy's admin via WhatsApp or Telegram that you prefer the in-person meetup option."],
                      ["Pay 10% Booking Advance", "Pay the mandatory 10% non-refundable booking deposit. No meetup logistics will be arranged without this confirmation."],
                      ["Meetup Location Finalized", "A common midpoint public location is selected between your city and the seller's city (e.g., Vellore for Chennai–Bangalore)."],
                      ["Buyer Pays All Meetup Costs", "You cover the seller/agent's travel (bus/train/petrol), food, and hotel expenses — in addition to your own costs."],
                      ["Complete Full Payment at Meetup", "At the meetup location, pay the remaining balance. Account credentials are provided only after 100% payment."],
                      ["Account Secured & Handed Over", "Recovery email and phone are bound to you on the spot. Invoice and guarantee provided immediately."],
                    ].map(([title, desc], i) => (
                      <div key={i} style={{ display: "flex", gap: "16px", position: "relative", zIndex: 2 }}>
                        <div style={timelineDot(i + 1, i === 5)}>
                          {i + 1}
                        </div>
                        <div>
                          <strong style={{ display: "block", color: i === 5 ? "var(--orange)" : "#fff", fontSize: "14px", marginBottom: "4px" }}>{title}</strong>
                          <span style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>{desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Chips */}
                <div style={{ background: "rgba(255,107,53,0.05)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
                  <h4 style={{ fontFamily: "var(--font-h)", color: "var(--orange)", fontSize: "14px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Buyer-Covered Meetup Expenses
                  </h4>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {["🚌 Travel (Bus/Train/Petrol)", "🍽️ Food & Dining", "🏨 Hotel/Stay (if required)", "🚖 Agent Transport"].map((e) => (
                      <span key={e} style={{ fontSize: "12px", color: "#fff", background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", padding: "6px 14px", borderRadius: "20px" }}>{e}</span>
                    ))}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
                    📌 These charges are entirely additional and separate from the account price.
                  </p>
                </div>

                <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                  <AlertTriangle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#ff8888", fontWeight: 600 }}>
                    "Private, dark, or isolated meetup locations are strictly avoided. Only premium, CCTV-secured public spots are eligible."
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/f2f-deal" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                    background: "linear-gradient(135deg,var(--orange),#ef4444)", borderRadius: "10px",
                    color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                    textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "none"
                  }}>
                    <ExternalLink size={14} /> Full F2F Deal System Page →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── ESCROW PANEL ── */}
          <div ref={escrowRef} style={{ borderRadius: "20px", overflow: "hidden", border: escrowExpanded ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(168,85,247,0.15)", transition: "border-color 0.3s" }}>
            <button
              onClick={() => setEscrowExpanded(!escrowExpanded)}
              style={{
                width: "100%", padding: "22px 28px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: escrowExpanded ? "rgba(168,85,247,0.06)" : "rgba(17,21,32,0.6)",
                border: "none", cursor: "pointer", transition: "background 0.3s"
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={20} style={{ color: "#a855f7" }} />
                </div>
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "0.5px", display: "block" }}>
                    Escrow Deal System
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Via trusted YouTubers, streamers & verified dealers — tap to expand</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Link to="/escrow-deal" onClick={(e) => e.stopPropagation()} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "11px", fontWeight: 700, color: "#a855f7",
                  fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "0.5px",
                  background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)",
                  padding: "6px 12px", borderRadius: "20px", textDecoration: "none"
                }}>
                  <ExternalLink size={11} /> Full Page
                </Link>
                {escrowExpanded ? <ChevronUp size={22} style={{ color: "#a855f7" }} /> : <ChevronDown size={22} style={{ color: "var(--muted)" }} />}
              </div>
            </button>

            {escrowExpanded && (
              <div style={{ padding: "30px 28px", background: "rgba(8,10,15,0.6)", borderTop: "1px solid rgba(168,85,247,0.15)" }} className="fade-in">
                <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "800px" }}>
                  The Escrow method adds an <strong style={{ color: "#fff" }}>additional security layer</strong> for high-value transactions. A <strong style={{ color: "#a855f7" }}>trusted, mutually recognized third party</strong> (YouTuber, streamer, or esports player) holds the deal in neutral ground until both parties fulfill their obligations.
                </p>

                {/* Who can be escrow */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "12px", marginBottom: "28px" }}>
                  {[
                    ["🎥 Trusted YouTubers", "Recognized BGMI/gaming content creators mutually known to both parties."],
                    ["📡 Verified Streamers", "Active BGMI streamers with established credibility agreed upon by both buyer and seller."],
                    ["🎮 Esports Players", "Known competitive players vouched as neutral mediators."],
                    ["✅ Vetted Dealers", "Established third-party dealers with verifiable track record."],
                  ].map(([title, desc]) => (
                    <div key={title} style={{ background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "16px" }}>
                      <strong style={{ display: "block", color: "#fff", fontSize: "13px", marginBottom: "6px" }}>{title}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>{desc}</span>
                    </div>
                  ))}
                </div>

                {/* Key Rules */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {[
                    ["Unknown middlemen are strictly forbidden.", "#ef4444"],
                    ["Buyer is fully responsible for the escrow service fee.", "#a855f7"],
                    ["Account credentials handed over only after 100% payment confirmed by the escrow.", "var(--gold)"],
                    ["Escrow method applies to high-value accounts only, mutually agreed upon.", "#a855f7"],
                  ].map(([rule, color]) => (
                    <div key={rule} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(168,85,247,0.03)", border: "1px solid rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: "10px" }}>
                      <Check size={14} style={{ color, flexShrink: 0 }} />
                      <span style={{ fontSize: "13.5px", color: "#e2e2e2" }}>{rule}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Link to="/escrow-deal" style={{
                    display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px",
                    background: "linear-gradient(135deg,#a855f7,#7c3aed)", borderRadius: "10px",
                    color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                    textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "none"
                  }}>
                    <ExternalLink size={14} /> Full Escrow System Page →
                  </Link>
                </div>
              </div>
            )}
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
                <div className="why-us-icon-wrap" style={{ color: "#22c55e", background: "rgba(34,197,94,0.04)", borderColor: "rgba(34,197,94,0.15)" }}>
                  <CheckCircle size={20} />
                </div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </div>
            ))}
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
            maxWidth: "1000px", margin: "0 auto",
            background: "rgba(14,17,24,0.7)", border: "1px solid var(--border-gold)",
            borderRadius: "24px", padding: "35px", boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.01) 100%)",
              border: "1px dashed rgba(255,215,0,0.25)", borderRadius: "16px",
              padding: "24px", marginBottom: "30px",
              display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
                color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Shield size={22} />
              </div>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <h4 style={{ fontFamily: "var(--font-h)", fontSize: "16px", color: "#fff", margin: "0 0 8px 0", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "8px" }}>
                  Understanding Your Unlink Process & Guarantee Timeline
                </h4>
                <p style={{ color: "var(--muted)", fontSize: "13.5px", lineHeight: "1.6", margin: 0 }}>
                  Unlinking in BGMI is the official system for safely removing one of the two linked logins. When you purchase an account, you receive full ownership of the <strong>primary secure login</strong>, and the <strong>secondary login</strong> is set to unlink. Enforced by BGMI, this secondary unlink has a strict <strong>7-day waiting period</strong>. Our premium <strong>Unlink Guarantee</strong> fully covers you throughout this entire 7-day window — if any issues or recovery attempts occur, we issue a full refund or replacement. Once this 7-day guarantee period expires, the transaction is officially finalized, full ownership is permanently yours, and support/guarantees end.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
              {[
                { label: "1. Core Rules & System", icon: <Info size={16} /> },
                { label: "2. Real Timeline Example", icon: <Clock size={16} /> },
                { label: "3. Buyer Responsibility & Support", icon: <Shield size={16} /> }
              ].map((tab, idx) => {
                const isActive = activeUnlinkTab === idx;
                return (
                  <button key={idx} onClick={() => setActiveUnlinkTab(idx)} style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "10px 20px", borderRadius: "8px", fontFamily: "var(--font-h)",
                    fontSize: "14px", fontWeight: 700, letterSpacing: "0.5px",
                    background: isActive ? "var(--gold-dim)" : "transparent",
                    border: isActive ? "1px solid var(--gold)" : "1px solid transparent",
                    color: isActive ? "var(--gold)" : "var(--muted)", transition: "all 0.2s", cursor: "pointer"
                  }}>
                    {tab.icon} {tab.label}
                  </button>
                );
              })}
            </div>

            {activeUnlinkTab === 0 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>The 5 Core Rules of BGMI Unlinking</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Unlinking in BGMI allows an account owner to safely remove one of the two linked social networks. BGMI enforces strict guidelines that must be met:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  <div className="unlink-rule-card"><strong className="rule-title">1. Min 2 Linked Accounts</strong><span className="rule-desc">The account must have two social networks linked for the unlink option to be functional. Otherwise, BGMI blocks the action.</span></div>
                  <div className="unlink-rule-card"><strong className="rule-title">2. No Unlinking Current Login</strong><span className="rule-desc">You cannot unlink the network you are currently logged into. To remove Twitter, you must log in using Facebook first.</span></div>
                  <div className="unlink-rule-card"><strong className="rule-title">3. 30+ Days Link Requirement</strong><span className="rule-desc">The network you remain logged into must have been linked for at least 30 days. This is why you see "15 Days Remaining" in listings.</span></div>
                  <div className="unlink-rule-card"><strong className="rule-title">4. Device & Region Match</strong><span className="rule-desc">BGMI checks region history. Logging in from multiple regions or using a VPN during unlinking can flag suspicious activity.</span></div>
                  <div className="unlink-rule-card" style={{ gridColumn: "1 / -1" }}><strong className="rule-title">5. 7-Day Waiting Period (Crucial)</strong><span className="rule-desc">Once submitted, BGMI begins a 7-day waiting period. If anyone logs in using the unlinking social network during this time, the request is automatically cancelled.</span></div>
                </div>
              </div>
            )}

            {activeUnlinkTab === 1 && (
              <div className="fade-in">
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>Timeline & Guarantee Example</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>Here is exactly how a clean account transfer takes place when there is a secondary pending unlink:</p>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}>
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
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", color: "#fff", marginBottom: "12px" }}>Buyer Responsibilities & Support Note</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>To ensure a flawless unlink process, the buyer must follow these crucial security rules:</p>
                <ul style={{ color: "var(--muted)", fontSize: "13px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Do Not Log In with the Unlinking Method:</strong> Logging into the pending social network will immediately and automatically cancel the unlink request.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Avoid Risky Logins:</strong> Do not log in from multiple devices, use VPNs, or switch in-game regions immediately, as BGMI will flag suspicious activity.</li>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Link Recovery Immediately:</strong> Link your own active recovery email and mobile phone number to the primary method immediately upon receiving the account.</li>
                </ul>
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <AlertTriangle size={20} style={{ color: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#fff" }}>
                    <strong>Crucial Support Note:</strong> If you have any doubts regarding the unlink status or process, contact our support team <strong>before</strong> making any settings changes in the account.
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
            <p className="ssub" style={{ margin: "0 auto" }}>Here are responses to help clarify our booking, payment, and delivery processes.</p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { q: "Is the 10% booking deposit refundable?", a: "No. All 10% booking deposits are strictly non-refundable once booked. This deposit secures the exclusive lock on the account, removing it from active market availability. The only exception is the immediate return of any accidental excess amounts paid over the 10% threshold." },
              { q: "Can my purchased BGMI account be retrieved or pulled back by the seller later?", a: "At Maddy Store, this is strictly prevented. Every account goes through our severe verification protocol, including ID checks of the seller, complete secondary login unlink, and setting your recovery email and phone. Our Invoice includes a specific Unlink Guarantee; in the extremely rare event of a pull-back during this period, you get a full refund or an equivalent premium replacement. Once the guarantee expires, your account is fully bulletproof." },
              { q: "What is the difference between 'Single Login' and 'Dual Login' accounts, and which is safer?", a: "A 'Single Login' account has only one login method active (e.g. only Twitter/X is linked). A 'Dual Login' account has two social logins bound (e.g. both Facebook and Twitter/X). Single login accounts are generally safer and easier to secure because there is no secondary entry point. For Dual Login accounts, we always submit an unlink request for the secondary social account to make it a secure Single Login for you." },
              { q: "What is a '30 Days Unlink' and why does it take so long?", a: "BGMI's security engine forces a strict restriction: you cannot unlink a social network unless the other linked social network has been active on that account for at least 30 consecutive days. If a seller recently bound a recovery login, this cooldown must lapse. Once it does, the 7-day unlink countdown can be submitted safely." },
              { q: "Will my in-game rank, popularity, friends list, or inventory be affected during the handover?", a: "Absolutely not. Handing over the account only changes the login credentials. Everything inside your BGMI dashboard — including your level, tier rank, classic skins, weapon finishes, supercars, achievement titles, and popularities — will remain 100% intact and untouched." },
              { q: "How should I secure the credentials immediately upon receiving the login?", a: "To ensure complete safety, you must immediately: (1) change the password of the primary social login, (2) enable 2-Factor Authentication (2FA) and update recovery details on that social account, (3) log into BGMI and link your own active email and phone number inside the in-game settings, and (4) do not attempt to log in using the unlinking social network as it will cancel the unlink process." },
              { q: "How do Face-to-Face (F2F) deals work?", a: "F2F transactions are exclusively offered for high-tier accounts valued at ₹80,000 or above. You must pay the 10% booking deposit in advance to arrange the deal (which is strictly non-refundable). The buyer should also pay the extra charges for Travel, Stay, and Food for the seller/Maddy Store agents. For verification, we accept only government IDs with address (Aadhaar Card / Driving License)." },
              { q: "How does Escrow work for high-value deals?", a: "Escrow allows a trusted, neutral third party (a recognized YouTuber, streamer, or verified dealer mutually agreed upon) to mediate the transaction. They confirm that both buyer and seller fulfill their obligations before finalizing the deal. The buyer is responsible for the escrow service fee. Only verified, pre-approved middlemen are accepted — random or unknown middlemen are strictly forbidden." },
              { q: "Is it safe to buy through Maddy Store?", a: "Absolutely. Maddy Store is a highly reputed platform with 5000+ completed trades. We verify each seller's identity, perform deep security audits of all login structures, clear linking cooldowns, and hold payments safely until the buyer has complete, verified ownership binding." },
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{
                  background: "var(--card)", border: isOpen ? "1px solid var(--gold)" : "1px solid var(--border)",
                  borderRadius: "12px", overflow: "hidden", transition: "all 0.3s ease",
                  boxShadow: isOpen ? "0 10px 25px rgba(255,215,0,0.03)" : "none"
                }}>
                  <button onClick={() => setActiveFaq(isOpen ? null : idx)} style={{
                    width: "100%", padding: "20px 24px", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    color: "#fff", fontSize: "16px", fontWeight: 600,
                    textAlign: "left", fontFamily: "var(--font-h)", letterSpacing: "0.5px", cursor: "pointer", background: "transparent", border: "none"
                  }}>
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
          
          .tag-blue { background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.25); color: #60a5fa; }
          .tag-purple { background: rgba(168,85,247,0.08); border: 1px solid rgba(168,85,247,0.25); color: #c084fc; }
          .tag-orange { background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.25); color: #fb923c; }
          
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
          
          .step-num-blue { background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; }
          .step-num-purple { background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); color: #c084fc; }
          .step-num-orange { background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); color: #fb923c; }
          
          .step-title { color: #fff; font-size: 13px; display: block; margin-bottom: 3px; font-weight: 600; }
          .step-body { color: var(--muted); font-size: 11px; line-height: 1.5; display: block; }
          
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
          
          .unlink-rule-card:hover { border-color: rgba(255,215,0,0.2); background: rgba(255,215,0,0.02); transform: translateY(-2px); }
          .rule-title { color: #fff; font-size: 14px; font-family: var(--font-h); letter-spacing: 0.5px; font-weight: 600; }
          .rule-desc { color: var(--muted); font-size: 12px; line-height: 1.5; }
          
          .fade-in { animation: fadeIn 0.35s ease both; }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .booking-calc-grid {
            grid-template-columns: 1fr 1fr;
          }

          @media (max-width: 768px) {
            .options-grid-three { gap: 24px; }
            .buy-option-card { padding: 28px 24px; }
            .booking-calc-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
