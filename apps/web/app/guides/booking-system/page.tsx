/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";



import Link from "next/link";
import { 
  ShieldCheck, MapPin, CreditCard, AlertTriangle, 
  ChevronDown, MessageCircle, Send, Gamepad2, 
  Coins, Clock, FileText, Check, Award, 
  Lock, Users, ShieldAlert, ArrowRight, Wallet, CheckCircle2,
  ThumbsUp, RefreshCw
} from "lucide-react";

export default function BookingSystem() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [accountValue, setAccountValue] = useState(100000);
  const [bookingAdvance, setBookingAdvance] = useState(10000);
  const [balancePayment, setBalancePayment] = useState(90000);

  useEffect(() => {
    const val = Number(accountValue) || 0;
    const advance = Math.round(val * 0.10);
    setBookingAdvance(advance);
    setBalancePayment(val - advance);
  }, [accountValue]);

  const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAccountValue(val === "" ? 0 : Number(val));
  };

  const trustBadgeStyle = {
    display: "flex", alignItems: "center", gap: "6px",
    background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.2)",
    padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
    color: "var(--color-gold)", fontFamily: "var(--font-h)", letterSpacing: "0.5px", textTransform: "uppercase" as const
  };

  const infoBulletStyle = {
    display: "flex", alignItems: "flex-start", gap: "12px",
    background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.03)"
  };

  const bulletStyle = { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#fff" };

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
      
      <div style={{ background: "var(--color-bg)", color: "#fff", paddingTop: "102px", minHeight: "100vh", overflow: "hidden" }}>
        
        {/* HERO */}
        <section style={{ position: "relative", padding: "90px 20px 70px", textAlign: "center", background: "radial-gradient(circle at center, rgba(255,215,0,0.06) 0%, transparent 65%)", borderBottom: "1px solid var(--color-border-gold)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="badge mb-4">
              <Lock size={13} style={{ color: "var(--color-gold)" }} /> Premium Reservation Protocol
            </div>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(36px,6vw,68px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
              10% Non-Refundable <span className="g">Booking System</span>
            </h1>
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(18px,3vw,26px)", fontWeight: 700, color: "var(--color-gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "24px" }}>
              Secure Reservation System For Serious Buyers
            </h2>
            <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "var(--color-muted)", maxWidth: "720px", lineHeight: 1.7, marginBottom: "35px", margin: "0 auto 35px" }}>
              Designed to reserve premium accounts and items, prevent fake buyers, avoid time-wasting, and secure serious transactions. Applies to all premium accounts, X-suits, supercars, and high-value deals.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={trustBadgeStyle}><ShieldCheck size={14} /><span>Secure Reservation</span></div>
              <div style={trustBadgeStyle}><Users size={14} /><span>Serious Buyers Only</span></div>
              <div style={trustBadgeStyle}><Award size={14} /><span>Premium Transactions</span></div>
              <div style={trustBadgeStyle}><CheckCircle2 size={14} /><span>Verified Process</span></div>
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "50px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Send size={18} /> Join Telegram
              </a>
              <Link href="/services/uc" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Gamepad2 size={18} /> Buy UC Packs
              </Link>
            </div>

            {/* Illustration */}
            <div style={{ maxWidth: "750px", margin: "0 auto", background: "rgba(17,21,32,0.45)", border: "1px solid var(--color-border-gold)", borderRadius: "24px", padding: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                {[
                  { icon: <Users size={28} style={{ color: "var(--color-gold)" }} />, label: "Serious Buyer", sub: "Initiates Booking", color: "var(--color-gold)", bg: "rgba(255,215,0,0.1)", border: "1px solid var(--color-gold)" },
                  { arrow: true, icon: <ArrowRight size={20} style={{ color: "var(--color-muted)" }} /> },
                  { icon: <Wallet size={28} style={{ color: "var(--color-orange)" }} />, label: "10% Booking Payment", sub: "Secures Reservation", color: "var(--color-orange)", bg: "rgba(255,107,53,0.1)", border: "1px solid var(--color-orange)" },
                  { arrow: true, icon: <ArrowRight size={20} style={{ color: "var(--color-muted)" }} /> },
                  { icon: <Lock size={28} style={{ color: "#10b981" }} />, label: "Account Reserved", sub: "Locked For You", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "1px solid #10b981" },
                ].map((item: any, i) => item.arrow ? (
                  <div key={i}>{item.icon}</div>
                ) : (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ background: item.bg, borderRadius: "50%", width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", border: item.border }}>
                      {item.icon}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "13px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px", color: item.color, display: "block" }}>{item.label}</span>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>{item.sub}</span>
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
              <div className="badge mb-2">Definition & Scope</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>What is the Booking System?</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg,var(--color-gold),var(--color-orange))", margin: "12px auto" }} />
            </div>
            <div 
              style={{
                background: "rgba(17,21,32,0.45)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "40px 30px"
              }}
              className="booking-card"
            >
              <p style={{ fontSize: "18px", fontWeight: 600, color: "#fff", lineHeight: 1.6, marginBottom: "24px", textAlign: "center", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>
                "The booking system allows buyers to temporarily reserve an account or item by paying a 10% advance booking amount."
              </p>
              
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "20px",
                  marginBottom: "30px"
                }}
                className="bs-info-grid"
              >
                {[
                  { icon: <ThumbsUp size={18} style={{ color: "var(--color-gold)" }} />, title: "Confirms Buyer Interest", desc: "Demonstrates you are a committed buyer, separating you from window shoppers." },
                  { icon: <Lock size={18} style={{ color: "var(--color-gold)" }} />, title: "Temporarily Locks the Item", desc: "Secures the account specifically for you so the seller stops entertaining other offers." },
                  { icon: <ShieldCheck size={18} style={{ color: "var(--color-gold)" }} />, title: "Prevents Overlapping Sales", desc: "Ensures no other buyers can purchase during your active reservation period." },
                  { icon: <FileText size={18} style={{ color: "var(--color-gold)" }} />, title: "Organizes Serious Transactions", desc: "Maintains high operational quality and streamlines the preparation process." },
                ].map((item, i) => (
                  <div key={i} style={infoBulletStyle}>
                    <div style={{ flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <strong style={{ display: "block", color: "#fff", fontSize: "14px", marginBottom: "4px" }}>{item.title}</strong>
                      <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "12px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
                <ShieldAlert size={24} style={{ color: "var(--color-orange)", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", color: "#fff", fontWeight: 700 }}>
                  Important: <span style={{ color: "var(--color-orange)" }}>Booking is mandatory for reserved transactions and premium face-to-face deals.</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - TIMELINE */}
        <section style={{ padding: "80px 20px", background: "var(--color-bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="badge mb-2">Simple Process</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>How The 10% Booking Works</h2>
            </div>
            <div style={{ position: "relative", paddingLeft: "20px" }}>
              <div style={{ position: "absolute", left: "11px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, var(--color-gold) 0%, rgba(255,215,0,0.1) 100%)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {[
                  { title: "Buyer Selects Account / X-Suit / Supercar", desc: "Browse our verified inventory and confirm the specific premium item you wish to purchase." },
                  { title: "Buyer Pays 10% Booking Amount", desc: "Transfer exactly 10% of the total agreed value directly to Maddy's official payment channels." },
                  { title: "Item Gets Temporarily Reserved", desc: "The item is officially marked as 'Reserved' and the seller is instructed to halt all other negotiations." },
                  { title: "Buyer Completes Remaining Balance", desc: "Before the reservation window expires (usually 24 hours), pay the remaining 90% balance.", highlight: true },
                  { title: "Full Transfer Process Begins", desc: "Upon successful validation of total payment, Maddy initiates the handover of login credentials." },
                  { title: "Final Delivery Completed", desc: "Account is fully secured to buyer's recovery credentials. Transaction officially marked complete." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", position: "relative", zIndex: 2, ...(item.highlight ? { background: "rgba(255,215,0,0.03)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,215,0,0.15)" } : {}) }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: item.highlight ? "linear-gradient(135deg,var(--color-gold),var(--color-orange))" : "var(--color-card)", border: item.highlight ? "2px solid var(--color-gold)" : "1px solid rgba(255,215,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: item.highlight ? "#000" : "var(--color-gold)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <strong style={{ display: "block", color: item.highlight ? "var(--color-gold)" : "#fff", fontSize: "15px", marginBottom: "6px", fontFamily: "var(--font-h)" }}>{item.title}</strong>
                      <span style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.6 }}>{item.desc}</span>
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
              <div className="badge mb-2">Math Simplified</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Booking Examples & Calculator</h2>
              <p style={{ color: "var(--color-gold)", fontSize: "15px", marginTop: "12px", fontWeight: 700 }}>
                "The booking amount is exactly calculated as 10% of the total transaction value."
              </p>
            </div>
            
            <div 
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: "30px",
                alignItems: "stretch"
              }}
              className="bs-calc-grid"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {[["₹100,000 Account", "₹10,000"], ["₹50,000 X-Suit", "₹5,000"], ["₹200,000 Premium Account", "₹20,000"]].map(([item, fee]) => (
                  <div 
                    key={item} 
                    style={{
                      background: "rgba(17,21,32,0.45)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "20px",
                      padding: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="booking-card"
                  >
                    <div>
                      <span style={{ fontSize: "12px", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>Example:</span>
                      <strong style={{ fontSize: "15px", color: "#fff" }}>{item}</strong>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "var(--color-muted)", display: "block", marginBottom: "4px" }}>Booking Required:</span>
                      <strong style={{ fontSize: "18px", color: "var(--color-gold)" }}>{fee}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,107,53,0.02) 100%), var(--color-card)", border: "1px solid var(--color-border-gold)", borderRadius: "20px", padding: "30px", boxShadow: "0 15px 40px rgba(0,0,0,0.4)" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Coins size={36} style={{ color: "var(--color-gold)", marginBottom: "8px" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Dynamic Calculator</h3>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-muted)", display: "block", marginBottom: "8px", fontWeight: 700 }}>Total Value (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-gold)", fontWeight: 700, fontSize: "15px" }}>₹</span>
                    <input type="text" value={accountValue.toLocaleString()} onChange={handleCalculatorChange} style={{ width: "100%", background: "rgba(8,10,15,0.7)", border: "1px solid var(--color-border-gold)", borderRadius: "10px", padding: "12px 16px 12px 35px", color: "#fff", fontSize: "16px", fontWeight: 700, outline: "none" }} />
                  </div>
                </div>
                <input type="range" min="10000" max="500000" step="5000" value={accountValue} onChange={(e) => setAccountValue(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--color-gold)", cursor: "pointer", marginBottom: "20px" }} />
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Booking Fee (10%)</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-gold)" }}>₹{bookingAdvance.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Balance Remaining</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>₹{balancePayment.toLocaleString()}</span>
                  </div>
                </div>
                <span style={{ display: "block", textAlign: "center", fontSize: "10px", color: "var(--color-muted)", marginTop: "12px" }}>⚠️ Booking valid for 24 hours unless otherwise discussed.</span>
              </div>
            </div>
          </div>
        </section>

        {/* NON-REFUNDABLE RULE */}
        <section style={{ padding: "90px 20px", background: "var(--color-bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="badge mb-2" style={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)" }}>CRITICAL WARNING</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Important Non-Refundable Rule</h2>
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
                      : <Check size={20} style={{ color: "#22c55e", flexShrink: 0, marginTop: "2px" }} />
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
            <Clock size={40} style={{ color: "var(--color-gold)", margin: "0 auto 16px" }} />
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase", marginBottom: "24px" }}>Booking Validity</h2>
            <p style={{ color: "#fff", fontSize: "15px", lineHeight: 1.7, marginBottom: "30px" }}>
              Booking temporarily reserves the account/item for a specific time window. Typically, a standard <strong>24-hour payment completion window</strong> is assigned unless otherwise explicitly discussed.
            </p>
            <div 
              style={{ 
                display: "inline-block", 
                textAlign: "left", 
                padding: "25px 35px", 
                border: "1px solid rgba(255,215,0,0.3)",
                background: "rgba(17,21,32,0.45)",
                borderRadius: "20px"
              }}
            >
              <span style={{ display: "block", fontSize: "13px", color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>If balance is not completed in time:</span>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The booking automatically expires.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The account/item becomes available on the market again.</li>
                <li style={bulletStyle}><Check size={16} style={{ color: "#ef4444" }} /> The booking amount remains strictly non-refundable.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ONLINE VS F2F BOOKING */}
        <section style={{ padding: "80px 20px", background: "var(--color-bg2)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="badge mb-2">Deal Modes</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>How Booking Applies</h2>
            </div>
            <div className="bs-info-grid">
              <div 
                style={{
                  background: "rgba(17,21,32,0.45)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column"
                }}
                className="booking-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <Gamepad2 size={24} style={{ color: "var(--color-gold)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase" }}>Online Deal Booking</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px", flex: 1 }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Buyer may directly pay the <strong>full 100% amount</strong> instantly.</li>
                  <li style={{ ...bulletStyle, fontWeight: 700, color: "var(--color-muted)", fontSize: "12px", padding: "4px 0" }}>OR</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Buyer pays <strong>10% booking amount</strong>, and remaining 90% is completed later.</li>
                </ul>
                <div style={{ background: "rgba(255,215,0,0.05)", padding: "12px", borderRadius: "10px", border: "1px dashed var(--color-gold)", fontSize: "12.5px", color: "var(--color-gold)", fontWeight: 600, textAlign: "center" }}>
                  "No account access shared before full payment is cleared."
                </div>
              </div>
              
              <div 
                style={{
                  background: "rgba(17,21,32,0.45)",
                  border: "1px solid var(--color-border-gold)",
                  borderRadius: "20px",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column"
                }}
                className="booking-card"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <MapPin size={24} style={{ color: "var(--color-orange)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase", color: "var(--color-orange)" }}>Face-to-Face Deal Booking</h3>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px", flex: 1 }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-orange)" }} /> Available <strong>only for accounts above ₹80K</strong>.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-orange)" }} /> Requires <strong>mandatory 10% booking confirmation</strong> upfront.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-orange)" }} /> Meetup arrangements start <strong>only after</strong> booking payment.</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-orange)" }} /> Buyer must additionally cover all travel, stay, and food expenses.</li>
                </ul>
                <div style={{ background: "rgba(255,107,53,0.05)", padding: "12px", borderRadius: "10px", border: "1px dashed var(--color-orange)", fontSize: "12.5px", color: "var(--color-orange)", fontWeight: 600, textAlign: "center" }}>
                  "All meetup logistics and expenses are paid separately by the buyer."
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      

      <style>{`
        .bs-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .bs-calc-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
          align-items: stretch;
        }
        .booking-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,215,0,0.2) !important;
        }
        @media (max-width: 768px) {
          .bs-info-grid { grid-template-columns: 1fr !important; }
          .bs-calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
