import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  ShieldCheck, MapPin, CreditCard, Info, AlertTriangle, 
  HelpCircle, ChevronDown, MessageCircle, Send, Gamepad2, 
  Coins, Clock, FileText, Check, Award, 
  Lock, Users, ShieldAlert, ArrowRight, Wallet, CheckCircle2,
  ThumbsUp, RefreshCw
} from "lucide-react";

export default function BookingSystem() {
  useSEO(
    "10% Non-Refundable Booking System — Maddy BGMI Store",
    "Secure reservation system for high-value BGMI accounts, X-suits, and supercars. Understand how the 10% non-refundable booking fee works."
  );

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [accountValue, setAccountValue] = useState(100000);
  const [bookingAdvance, setBookingAdvance] = useState(10000);
  const [balancePayment, setBalancePayment] = useState(90000);

  useEffect(() => {
    const val = Number(accountValue) || 0;
    const advance = Math.round(val * 0.10);
    setBookingAdvance(advance);
    setBalancePayment(val - advance);
  }, [accountValue]);

  const handleCalculatorChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAccountValue(val === "" ? 0 : Number(val));
  };

  const trustBadgeStyle = {
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)",
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
    color: "var(--gold)", fontFamily: "var(--font-h)", letterSpacing: "0.5px", textTransform: "uppercase"
  };

  const infoBulletStyle = {
    display: "flex", alignItems: "flex-start", gap: "12px",
    background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.03)"
  };

  const bulletStyle = { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text)" };

  const faqs = [
    { question: "Why is booking required?", answer: "Booking is required to reserve the account/item and confirm that you are a serious buyer. It prevents other buyers from purchasing the item during your reservation period." },
    { question: "Is the 10% booking refundable?", answer: "No. The booking amount is strictly non-refundable. If you cancel the deal, fail to pay the balance in the agreed time, or become unresponsive, the booking amount is forfeited." },
    { question: "Can I directly pay the full amount?", answer: "Yes, for online deals you may proceed directly with the full payment without using the booking system. However, face-to-face deals mandatorily require the 10% booking advance." },
    { question: "When do I receive account access?", answer: "Account access and login credentials are provided ONLY after 100% of the full payment has been successfully completed and verified." },
    { question: "What happens if I cancel?", answer: "If you decide to cancel the transaction after paying the booking amount, the reservation will be voided and the booking amount will not be refunded." },
    { question: "Is booking needed for face-to-face deals?", answer: "Yes. The 10% booking advance is mandatory for all face-to-face requests to ensure seriousness before travel and meeting logistics are arranged." }
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--bg)", color: "#fff", paddingTop: "102px", minHeight: "100vh", overflow: "hidden" }}>
        <style>{`
          .bs-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .bs-calc-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; align-items: stretch; }
          .bcard { background: rgba(17,21,32,0.45); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 30px; transition: transform 0.3s ease, border-color 0.3s ease; }
          .bcard:hover { transform: translateY(-5px); border-color: rgba(255,215,0,0.2); }
          @media (max-width: 768px) {
            .bs-info-grid { grid-template-columns: 1fr; }
            .bs-calc-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* HERO */}
        <section style={{ position: "relative", padding: "90px 20px 70px", textAlign: "center", background: "radial-gradient(circle at center, rgba(255,215,0,0.06) 0%, transparent 65%)", borderBottom: "1px solid var(--border-gold)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="badge" style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Lock size={13} style={{ color: "var(--gold)" }} /> Premium Reservation Protocol
            </div>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
              10% Non-Refundable <span className="g">Booking System</span>
            </h1>
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px" }}>
              Secure Reservation System For Serious Buyers
            </h2>
            <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "var(--muted)", maxWidth: "720px", lineHeight: 1.7, marginBottom: "35px", margin: "0 auto 35px" }}>
              Designed to reserve premium accounts and items, prevent fake buyers, avoid time-wasting, and secure serious transactions. Applies to all premium accounts, X-suits, supercars, and high-value deals.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={trustBadgeStyle}><ShieldCheck size={14} /><span>Secure Reservation</span></div>
              <div style={trustBadgeStyle}><Users size={14} /><span>Serious Buyers Only</span></div>
              <div style={trustBadgeStyle}><Award size={14} /><span>Premium Transactions</span></div>
              <div style={trustBadgeStyle}><CheckCircle2 size={14} /><span>Verified Process</span></div>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "50px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <Send size={18} /> Join Telegram
              </a>
              <Link to="/buy" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px" }}>
                <Gamepad2 size={18} /> View Available Accounts
              </Link>
            </div>

            {/* Illustration */}
            <div style={{ maxWidth: "750px", margin: "0 auto", background: "rgba(17,21,32,0.45)", border: "1px solid var(--border-gold)", borderRadius: "24px", padding: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                {[
                  { icon: <Users size={28} style={{ color: "var(--gold)" }} />, label: "Serious Buyer", sub: "Initiates Booking", color: "var(--gold)", bg: "rgba(255,215,0,0.1)", border: "1px solid var(--gold)" },
                  { arrow: true, icon: <ArrowRight size={20} style={{ color: "var(--muted)" }} /> },
                  { icon: <Wallet size={28} style={{ color: "var(--orange)" }} />, label: "10% Booking Payment", sub: "Secures Reservation", color: "var(--orange)", bg: "rgba(255,107,53,0.1)", border: "1px solid var(--orange)" },
                  { arrow: true, icon: <ArrowRight size={20} style={{ color: "var(--muted)" }} /> },
                  { icon: <Lock size={28} style={{ color: "#10b981" }} />, label: "Account Reserved", sub: "Locked For You", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "1px solid #10b981" },
                ].map((item, i) => item.arrow ? (
                  <div key={i}>{item.icon}</div>
                ) : (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ background: item.bg, borderRadius: "50%", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: item.border }}>
                      {item.icon}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "13px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px", color: item.color, display: "block" }}>{item.label}</span>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS BOOKING */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Definition & Scope</div>
              <h2 className="stitle">What is the Booking System?</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg,var(--gold),var(--orange))", margin: "12px auto" }} />
            </div>
            <div className="bcard" style={{ padding: "40px 30px" }}>
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#fff", lineHeight: 1.6, marginBottom: "24px", textAlign: "center", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                "The booking system allows buyers to temporarily reserve an account or item by paying a 10% advance booking amount."
              </p>
              <div className="bs-info-grid" style={{ marginBottom: "30px" }}>
                {[
                  { icon: <ThumbsUp size={18} style={{ color: "var(--gold)" }} />, title: "Confirms Buyer Interest", desc: "Demonstrates you are a committed buyer, separating you from window shoppers." },
                  { icon: <Lock size={18} style={{ color: "var(--gold)" }} />, title: "Temporarily Locks the Item", desc: "Secures the account specifically for you so the seller stops entertaining other offers." },
                  { icon: <ShieldCheck size={18} style={{ color: "var(--gold)" }} />, title: "Prevents Overlapping Sales", desc: "Ensures no other buyers can purchase during your active reservation period." },
                  { icon: <FileText size={18} style={{ color: "var(--gold)" }} />, title: "Organizes Serious Transactions", desc: "Maintains high operational quality and streamlines the preparation process." },
                ].map((item, i) => (
                  <div key={i} style={infoBulletStyle}>
                    <div style={{ flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>{item.title}</strong>
                      <span style={{ color: "var(--muted)", fontSize: "13px" }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                <ShieldAlert size={24} style={{ color: "var(--orange)", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", color: "#fff", fontWeight: 700 }}>
                  Important: <span style={{ color: "var(--orange)" }}>Booking is mandatory for reserved transactions and premium face-to-face deals.</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - TIMELINE */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Simple Process</div>
              <h2 className="stitle">How The 10% Booking Works</h2>
            </div>
            <div style={{ position: "relative", paddingLeft: "20px" }}>
              <div style={{ position: "absolute", left: "11px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, var(--gold) 0%, rgba(255,215,0,0.1) 100%)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {[
                  ["Buyer Selects Account / X-Suit / Supercar", "Browse our verified inventory and confirm the specific premium item you wish to purchase."],
                  ["Buyer Pays 10% Booking Amount", "Transfer exactly 10% of the total agreed value directly to Maddy's official payment channels."],
                  ["Item Gets Temporarily Reserved", "The item is officially marked as 'Reserved' and the seller is instructed to halt all other negotiations."],
                  ["Buyer Completes Remaining Balance", "Before the reservation window expires (usually 24 hours), pay the remaining 90% balance.", true],
                  ["Full Transfer Process Begins", "Upon successful validation of total payment, Maddy initiates the handover of login credentials."],
                  ["Final Delivery Completed", "Account is fully secured to buyer's recovery credentials. Transaction officially marked complete."],
                ].map(([title, desc, highlight], i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", position: "relative", zIndex: 2, ...(highlight ? { background: "rgba(255,215,0,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,215,0,0.15)" } : {}) }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: highlight ? "linear-gradient(135deg,var(--gold),var(--orange))" : "var(--card)", border: highlight ? "2px solid var(--gold)" : "1px solid rgba(255,215,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: highlight ? "#000" : "var(--gold)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <strong style={{ display: "block", color: highlight ? "var(--gold)" : "#fff", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)" }}>{title}</strong>
                      <span style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXAMPLES + CALCULATOR */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Math Simplified</div>
              <h2 className="stitle">Booking Examples & Calculator</h2>
              <p style={{ color: "var(--gold)", fontSize: "15px", marginTop: "12px", fontWeight: 700 }}>
                "The booking amount is exactly calculated as 10% of the total transaction value."
              </p>
            </div>
            <div className="bs-calc-grid">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[["₹100,000 Account", "₹10,000"], ["₹50,000 X-Suit", "₹5,000"], ["₹200,000 Premium Account", "₹20,000"]].map(([item, fee]) => (
                  <div key={item} className="bcard" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Example:</span>
                      <strong style={{ fontSize: "15px", color: "#fff" }}>{item}</strong>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "var(--muted)", display: "block", marginBottom: "4px" }}>Booking Required:</span>
                      <strong style={{ fontSize: "18px", color: "var(--gold)" }}>{fee}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,107,53,0.02) 100%), var(--card)", border: "1px solid var(--border-gold)", borderRadius: "20px", padding: "30px", boxShadow: "0 15px 40px rgba(0,0,0,0.4)" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Coins size={36} style={{ color: "var(--gold)", marginBottom: "8px" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Dynamic Calculator</h3>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--muted)", display: "block", marginBottom: "8px", fontWeight: 700 }}>Total Value (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)", fontWeight: 700, fontSize: "15px" }}>₹</span>
                    <input type="text" value={accountValue.toLocaleString()} onChange={handleCalculatorChange} style={{ width: "100%", background: "rgba(8,10,15,0.7)", border: "1px solid var(--border-gold)", borderRadius: "10px", padding: "12px 16px 12px 35px", color: "#fff", fontSize: "16px", fontWeight: 700, outline: "none" }} />
                  </div>
                </div>
                <input type="range" min="10000" max="500000" step="5000" value={accountValue} onChange={(e) => setAccountValue(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--gold)", cursor: "pointer", marginBottom: "20px" }} />
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>Booking Fee (10%)</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold)" }}>₹{bookingAdvance.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>Balance Remaining</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>₹{balancePayment.toLocaleString()}</span>
                  </div>
                </div>
                <span style={{ display: "block", textAlign: "center", fontSize: "10px", color: "var(--muted)", marginTop: "12px" }}>⚠️ Booking valid for 24 hours unless otherwise discussed.</span>
              </div>
            </div>
          </div>
        </section>

        {/* NON-REFUNDABLE RULE */}
        <section style={{ padding: "90px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel" style={{ color: "var(--red, #ef4444)", borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)" }}>CRITICAL WARNING</div>
              <h2 className="stitle">Important Non-Refundable Rule</h2>
              <div style={{ width: "60px", height: "3px", background: "#ef4444", margin: "12px auto" }} />
            </div>
            <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "20px", padding: "40px 30px" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px", marginBottom: "35px" }}>
                {[
                  { text: "Booking amount is strictly non-refundable. There are absolutely no exceptions.", warn: true },
                  { text: "If the buyer cancels the deal halfway, the booking amount is completely forfeited.", warn: true },
                  { text: "If the buyer fails to complete the balance payment within the agreed timeframe, booking is forfeited.", warn: true },
                  { text: "If the buyer becomes inactive, unresponsive, or vanishes, the booking is forfeited.", warn: true },
                  { text: "Booking definitively confirms absolute commitment from the buyer to proceed with the transaction.", warn: false },
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    {item.warn
                      ? <AlertTriangle size={20} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
                      : <Check size={20} style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }} />
                    }
                    <span style={{ fontSize: "15px", color: "#fff", lineHeight: 1.5 }}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: "center", background: "rgba(0,0,0,0.4)", padding: "20px", borderRadius: "12px", border: "1px dashed #ef4444" }}>
                <p style={{ color: "#ff8888", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>"Please confirm your decision carefully before booking."</p>
                <p style={{ color: "#fff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 800 }}>No refund will be issued after successful booking confirmation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING VALIDITY */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <Clock size={40} style={{ color: "var(--gold)", margin: "0 auto 16px" }} />
            <h2 className="stitle" style={{ marginBottom: "24px" }}>Booking Validity</h2>
            <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: 1.7, marginBottom: "30px" }}>
              Booking temporarily reserves the account/item for a specific time window. Typically, a standard <strong>24-hour payment completion window</strong> is assigned unless otherwise explicitly discussed.
            </p>
            <div className="bcard" style={{ display: "inline-block", textAlign: "left", padding: "25px 35px", border: "1px solid rgba(255,215,0,0.3)" }}>
              <span style={{ display: "block", fontSize: "13px", color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>If balance is not completed in time:</span>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The booking automatically expires.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The account/item becomes available on the market again.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The booking amount remains strictly non-refundable.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ONLINE VS F2F BOOKING */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Deal Modes</div>
              <h2 className="stitle">How Booking Applies</h2>
            </div>
            <div className="bs-info-grid">
              <div className="bcard" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <Gamepad2 size={24} style={{ color: "var(--gold)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase" }}>Online Deal Booking</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px", flex: 1 }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--gold)" }} /> Buyer may directly pay the <strong>full 100% amount</strong> instantly.</li>
                  <li style={{ ...bulletStyle, fontWeight: 700, color: "var(--muted)", fontSize: "12px", padding: "4px 0" }}>OR</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--gold)" }} /> Buyer pays <strong>10% booking amount</strong>, and remaining 90% is completed later.</li>
                </ul>
                <div style={{ background: "rgba(255,215,0,0.05)", padding: "12px", borderRadius: "10px", border: "1px dashed var(--gold)", fontSize: "12.5px", color: "var(--gold)", fontWeight: 600, textAlign: "center" }}>
                  "No account access shared before full payment is cleared."
                </div>
              </div>
              <div className="bcard" style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border-gold)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <MapPin size={24} style={{ color: "var(--orange)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase", color: "var(--orange)" }}>Face-to-Face Deal Booking</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px", flex: 1 }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--orange)" }} /> Available <strong>only for accounts above ₹80K</strong>.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--orange)" }} /> Requires <strong>mandatory 10% booking confirmation</strong> upfront.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--orange)" }} /> Meetup arrangements start <strong>only after</strong> booking payment.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--orange)" }} /> Buyer must additionally cover all travel, stay, and food expenses.</li>
                </ul>
                <div style={{ background: "rgba(255,107,53,0.05)", padding: "12px", borderRadius: "10px", border: "1px dashed var(--orange)", fontSize: "12.5px", color: "var(--orange)", fontWeight: 600, textAlign: "center" }}>
                  "All meetup logistics and expenses are paid separately by the buyer."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY IT EXISTS */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Trust & Security</div>
              <h2 className="stitle">Why The Booking System Exists</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "16px" }}>
              {[
                [<ShieldAlert size={28} style={{ color: "var(--gold)" }} />, "Prevents Fake Bookings"],
                [<Clock size={28} style={{ color: "var(--gold)" }} />, "Protects Seller Time"],
                [<FileText size={28} style={{ color: "var(--gold)" }} />, "Organizes Premium Deals"],
                [<RefreshCw size={28} style={{ color: "var(--gold)" }} />, "Avoids Last-Minute Cancellations"],
                [<Lock size={28} style={{ color: "var(--gold)" }} />, "Secures High-Value Transactions"],
                [<Users size={28} style={{ color: "var(--gold)" }} />, "Prioritizes Serious Buyers"],
              ].map(([icon, text]) => (
                <div key={text} className="bcard" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px" }}>
                  {icon}
                  <span style={{ fontSize: "15px", fontWeight: 700 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAYMENT & HANDOVER */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Finalization Rules</div>
              <h2 className="stitle">Payment & Account Handover</h2>
            </div>
            <div className="bcard" style={{ marginBottom: "24px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ fontSize: "18px", color: "var(--gold)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Wallet size={20} /> Pre-Handover Rules
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> Full payment is absolutely mandatory before handover.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> Partial payment does NOT unlock partial access.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> Login credentials are NEVER shared before 100% completion.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> Account is fully transferred only after entire balance is cleared.</li>
              </ul>
            </div>
            <div className="bcard">
              <h3 style={{ fontSize: "18px", color: "#10b981", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={20} /> Post-Payment Actions
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li style={bulletStyle}><Check size={16} style={{ color: "#10b981" }} /> Recovery email updated to buyer's email.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#10b981" }} /> Recovery phone number securely bound to the buyer.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#10b981" }} /> Advanced security verification and unlinking completed.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#10b981" }} /> Final ownership officially transferred.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* IMPORTANT RULES */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="slabel">Final Checklist</div>
              <h2 className="stitle">Important Rules</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { text: "Booking is 100% non-refundable under all circumstances.", icon: <AlertTriangle size={18} style={{ color: "#ef4444" }} /> },
                { text: "Full payment is required before any handover or credentials are provided.", icon: <Lock size={18} style={{ color: "var(--gold)" }} /> },
                { text: "Only serious buyers willing to adhere to the timeframes are accepted.", icon: <Users size={18} style={{ color: "var(--gold)" }} /> },
                { text: "Face-to-face meetups apply only for premium accounts exceeding ₹80,000.", icon: <MapPin size={18} style={{ color: "var(--orange)" }} /> },
                { text: "The buyer is responsible for paying all meetup and travel expenses.", icon: <CreditCard size={18} style={{ color: "var(--gold)" }} /> },
                { text: "Booking validity periods (e.g., 24 hours) must be strictly respected.", icon: <Clock size={18} style={{ color: "var(--gold)" }} /> },
                { text: "All instructions from admins must be followed carefully.", icon: <CheckCircle2 size={18} style={{ color: "var(--gold)" }} /> },
              ].map((rule, idx) => (
                <div key={idx} className="bcard" style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "16px", background: "rgba(17,21,32,0.7)" }}>
                  {rule.icon}
                  <span style={{ fontSize: "15px", color: "#fff", fontWeight: 500 }}>{rule.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "80px 20px", background: "var(--bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="slabel">Questions & Answers</div>
              <h2 className="stitle">Frequently Asked Questions</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {faqs.map((faq, index) => (
                <div key={index} className="bcard" style={{ padding: "20px 24px", cursor: "pointer", border: expandedIndex === index ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.05)" }} onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: expandedIndex === index ? "var(--gold)" : "#fff", margin: 0, paddingRight: "20px" }}>{faq.question}</h3>
                    <ChevronDown size={20} style={{ color: expandedIndex === index ? "var(--gold)" : "var(--muted)", transform: expandedIndex === index ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
                  </div>
                  {expandedIndex === index && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                      <p style={{ color: "var(--muted)", fontSize: "14.5px", lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{ padding: "100px 20px", textAlign: "center", background: "radial-gradient(circle at center, rgba(255,215,0,0.05) 0%, var(--bg) 70%)" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "24px" }}>
              Ready To Reserve Your <span style={{ color: "var(--gold)" }}>Premium Account?</span>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "40px" }}>
              Browse our inventory, select your dream account, and lock it down securely with our trusted 10% booking system.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "30px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "16px 36px", fontSize: "16px", fontWeight: 700 }}>
                <MessageCircle size={20} /> Contact on WhatsApp
              </a>
              <Link to="/buy" className="btn btn-gold" style={{ borderRadius: "30px", padding: "16px 36px", fontSize: "16px", fontWeight: 700 }}>
                <Gamepad2 size={20} /> View Premium Listings
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <ShieldCheck size={16} style={{ color: "var(--gold)" }} />
              <span style={{ fontSize: "14px", color: "var(--muted)", fontWeight: 600, letterSpacing: "0.5px" }}>
                Trusted by 2000+ Buyers Across India
              </span>
            </div>
          </div>
        </section>

        {/* Sticky Mobile CTA */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,10,15,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid var(--border-gold)", padding: "12px 16px", display: "flex", gap: "10px", zIndex: 100 }} className="d-md-none">
          <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ flex: 1, padding: "12px", borderRadius: "12px", fontSize: "13px" }}>
            <MessageCircle size={16} /> WhatsApp
          </a>
          <Link to="/buy" className="btn btn-gold" style={{ flex: 1, padding: "12px", borderRadius: "12px", fontSize: "13px" }}>
            <Gamepad2 size={16} /> View Accounts
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
