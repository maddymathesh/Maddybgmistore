/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";



import Link from "next/link";
import { 
  ShieldCheck, Users, CreditCard, Info, AlertTriangle, 
  ChevronDown, MessageCircle, Send, Gamepad2, 
  Coins, Award, ShieldAlert, Sparkles, UserCheck, Check
} from "lucide-react";

export default function EscrowDeal() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Calculator State
  const [accountValue, setAccountValue] = useState(250000);
  const [escrowTier, setEscrowTier] = useState<"youtuber" | "streamer" | "esports" | "dealer">("youtuber");
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

  const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAccountValue(val === "" ? 0 : Number(val));
  };

  const toggleFAQ = (index: number) => {
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
      
      <div style={{ background: "var(--color-bg)", color: "#fff", paddingTop: "102px", minHeight: "100vh", overflow: "hidden" }}>
        
        {/* HERO SECTION */}
        <section style={{ 
          position: "relative",
          padding: "90px 20px 70px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.07) 0%, transparent 60%)",
          borderBottom: "1px solid var(--color-border-gold)"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="badge mb-4">
              <Sparkles size={13} style={{ color: "var(--color-gold)" }} />
              Neutral Third-Party Escrow
            </div>

            <h1 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(36px, 6vw, 68px)", 
              fontWeight: 900, 
              lineHeight: 1.1, 
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "16px",
              color: "#fff"
            }}>
              Secure Escrow <span className="g">Deal System</span>
            </h1>

            <h2 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(18px, 3vw, 26px)", 
              fontWeight: 700, 
              color: "var(--color-gold)",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              marginBottom: "24px"
            }}>
              Safe High-Value Transactions Through Trusted Third Parties
            </h2>

            <p style={{ 
              fontSize: "clamp(14px, 1.8vw, 17px)", 
              color: "var(--color-muted)", 
              maxWidth: "780px", 
              lineHeight: 1.7, 
              marginBottom: "35px"
            }}>
              Tailored for elite transactions, our escrow module introduces mutually trusted gaming middlemen to protect your funds. The payment is held in neutral custody and released to the seller only when you confirm complete account control and linkage bindings.
            </p>

            {/* Trust Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "40px" }}>
              <div style={trustBadgeStyle}>
                <ShieldCheck size={14} style={{ color: "var(--color-gold)" }} />
                <span>Secure Transaction</span>
              </div>
              <div style={trustBadgeStyle}>
                <Users size={14} style={{ color: "var(--color-gold)" }} />
                <span>Trusted Middleman</span>
              </div>
              <div style={trustBadgeStyle}>
                <UserCheck size={14} style={{ color: "var(--color-gold)" }} />
                <span>Verified Process</span>
              </div>
              <div style={trustBadgeStyle}>
                <CreditCard size={14} style={{ color: "var(--color-gold)" }} />
                <span>Safe Transfer</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "50px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Send size={18} /> Join Telegram
              </a>
              <Link href="/services/xsuit" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Gamepad2 size={18} /> View X-Suit Catalog
              </Link>
            </div>

            {/* Flowchart Illustration */}
            <div style={{
              width: "100%",
              maxWidth: "850px",
              background: "rgba(17, 21, 32, 0.45)",
              border: "1px solid var(--color-border-gold)",
              borderRadius: "24px",
              padding: "30px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="illustration-flex">
                <div style={illuNodeStyle}>
                  <div style={illuIconWrapStyle}>
                    <Users size={28} style={{ color: "var(--color-gold)" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px" }}>Verified Buyer</span>
                  <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Funds Sent to Escrow</span>
                </div>

                <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                  <div style={{ 
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                    background: "rgba(14, 17, 24, 1)", border: "1px solid var(--color-border-gold)", 
                    borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                    color: "var(--color-gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)" 
                  }}>
                    HOLDS FUNDS SECURELY
                  </div>
                </div>

                <div style={{ ...illuNodeStyle, borderColor: "var(--color-orange)" }}>
                  <div style={{ ...illuIconWrapStyle, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", color: "var(--color-orange)" }}>
                    <ShieldCheck size={28} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-orange)" }}>Trusted Escrow</span>
                  <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Releases Upon Verification</span>
                </div>

                <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                  <div style={{ 
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                    background: "rgba(14, 17, 24, 1)", border: "1px solid var(--color-border-gold)", 
                    borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                    color: "var(--color-gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)" 
                  }}>
                    TRANSFERS ACCOUNT LOGIN
                  </div>
                </div>

                <div style={illuNodeStyle}>
                  <div style={illuIconWrapStyle}>
                    <UserCheck size={28} style={{ color: "var(--color-gold)" }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px" }}>Verified Seller</span>
                  <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Receives Funds After Deal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS ESCROW */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="badge mb-2">Definition & Scope</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>What is Escrow?</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--color-gold), var(--color-orange))", margin: "12px auto" }} />
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
                  <ShieldCheck size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Buyer Protection</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>Payment is held safely. If the seller fails coordinates, your funds are returned immediately.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Seller Protection</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>Confirms that the buyer has real, verified funds deposited before you handover the account details.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Prevents Scams</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>Blocks quick password exit reclaims, identity theft, fake bank transfers, and fraud actions.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <ShieldCheck size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>VIP Transactions</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>The golden security standard for premium BGMI accounts and ultra-rare X-suit collection deals.</span>
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
                <Info size={20} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                <span style={{ fontSize: "13.5px", color: "var(--color-gold)", fontWeight: 600 }}>
                  Rule Coordinates: Escrow is only done through mutually trusted and recognized individuals.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <div className="badge mb-2">Deal Flowchart</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>How Escrow Works Step-by-Step</h2>
            </div>

            <div style={{ position: "relative", paddingLeft: "30px" }}>
              <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, var(--color-gold) 0%, var(--color-orange) 100%)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { num: 1, title: "Choose Account", desc: "Buyer reviews specifications and picks their desired premium BGMI stock." },
                  { num: 2, title: "Select Trusted Escrow", desc: "Buyer and seller mutually discuss and finalize a reputable public figure to serve as middleman." },
                  { num: 3, title: "Escrow Chat Created", desc: "A secured three-party chat group is established containing the buyer, seller, and selected middleman." },
                  { num: 4, title: "Buyer Sends Payment", desc: "Buyer transfers the full agreed account price plus escrow fee coordinates directly to the middleman." },
                  { num: 5, title: "Seller Shares Credentials", desc: "Upon receiving payment deposit confirmation, the seller submits all social linking and active passwords." },
                  { num: 6, title: "Buyer Verifies Credentials", desc: "Buyer logs in, reviews level achievements, verifies gun skins, and checks matches against original listings." },
                  { num: 7, title: "Recovery Bindings Updated", desc: "Buyer bind-swaps their recovery mobile number, locks two-factor security codes, and registers their primary recovery email." },
                  { num: 8, title: "Buyer Confirms Deal", desc: "Once the account is fully secured under buyer credentials, the buyer posts deal confirmation in the group." },
                  { num: 9, title: "Escrow Releases Payout", desc: "The middleman releases the held payment directly to the seller's bank coordinates (deducting middleman commissions).", highlight: true },
                  { num: 10, title: "Deal Completed", desc: "Ownership fully transferred. Lifetime links signed off under warranty safeguards." }
                ].map((step) => (
                  <div key={step.num} style={{ display: "flex", gap: "16px", position: "relative", zIndex: 2, ...(step.highlight ? { background: "rgba(255,215,0,0.02)", border: "1px solid var(--color-border-gold)", borderRadius: "12px", padding: "16px 20px" } : {}) }}>
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--color-card)", border: "1px solid var(--color-border-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "var(--color-gold)", flexShrink: 0 }}>
                      {step.num}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: step.highlight ? "var(--color-gold)" : "#fff", margin: "0 0 4px" }}>{step.title}</h4>
                      <p style={{ fontSize: "13px", color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ESCROW CALCULATOR */}
        <section style={{ padding: "80px 20px", background: "var(--color-bg2)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="badge mb-2">Financial Overhead</div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>Escrow Charges & Live Calculator</h2>
            </div>

            <div className="bs-calc-grid">
              
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
                    {[
                      "Escrow coordination involves dedicated logistics. Therefore, middleman service charges apply to secure the trade.",
                      "Escrow charges are borne 100% by the buyer. They are not split, unless discussed and agreed by the seller prior.",
                      "Charges are separate from the account value and calculated as a percentage of the total transaction size.",
                      "Rates vary depending on the chosen partner class (trusted YouTubers typically require 3.0% commission)."
                    ].map((rule, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--color-gold)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{idx + 1}</div>
                        <span style={{ fontSize: "13.5px", color: "var(--color-muted)", lineHeight: 1.5 }}>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ 
                  background: "rgba(255, 215, 0, 0.03)", 
                  border: "1px solid var(--color-border-gold)", 
                  borderRadius: "12px", 
                  padding: "16px 20px", 
                  marginTop: "30px",
                  textAlign: "center"
                }}>
                  <span style={{ fontSize: "13.5px", color: "var(--color-gold)", fontWeight: 700 }}>
                    “All escrow-related costs are strictly the buyer's responsibility.”
                  </span>
                </div>
              </div>

              {/* Calculator Widget */}
              <div style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(255, 107, 53, 0.01) 100%), var(--color-card)",
                border: "1px solid var(--color-border-gold)",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
              }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Coins size={36} style={{ color: "var(--color-gold)", marginBottom: "8px" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Interactive Fee Calculator</h3>
                </div>

                {/* Input Account Value */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>Account Value (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-gold)", fontWeight: 700, fontSize: "15px" }}>₹</span>
                    <input 
                      type="text" 
                      value={accountValue.toLocaleString()} 
                      onChange={handleCalculatorChange}
                      style={{ 
                        width: "100%", 
                        background: "rgba(8,10,15,0.7)", 
                        border: "1px solid var(--color-border-gold)", 
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
                      accentColor: "var(--color-gold)",
                      cursor: "pointer"
                    }} 
                  />
                </div>

                {/* Escrow Partner Tier */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-muted)", display: "block", marginBottom: "6px", fontWeight: 700 }}>Escrow Middleman Tier</label>
                  <select 
                    value={escrowTier}
                    onChange={e => setEscrowTier(e.target.value as any)}
                    style={{
                      width: "100%",
                      background: "rgba(8,10,15,0.7)",
                      border: "1px solid var(--color-border-gold)",
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
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Account Price</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>₹{accountValue.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Escrow Charges ({escrowPercentage}%)</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-gold)" }}>₹{escrowFee.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "13.5px", color: "#fff", fontWeight: 700 }}>Total Paid to Escrow</span>
                    <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--color-gold)" }}>₹{totalPayment.toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

      </div>
      
      

      <style>{`
        .bs-calc-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
          align-items: stretch;
        }
        .illustration-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .bs-calc-grid { grid-template-columns: 1fr !important; }
          .illustration-flex { flex-direction: column !important; gap: 24px !important; }
          .illustration-line { display: none !important; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

const trustBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "6px 14px",
  borderRadius: "20px",
  fontSize: "12.5px",
  fontWeight: 600,
  color: "#eaeaea"
};

const illuNodeStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "10px",
  width: "180px",
  textAlign: "center" as const
};

const illuIconWrapStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "rgba(255,215,0,0.05)",
  border: "1px solid rgba(255,215,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--color-gold)",
  margin: "0 auto"
};

const infoBulletStyle = {
  display: "flex",
  alignItems: "flex-start" as const,
  gap: "12px",
  background: "rgba(0,0,0,0.2)",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.03)"
};

const partnerCardStyle = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  padding: "24px",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  textAlign: "center" as const
};

const partnerTitleStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "16px",
  fontWeight: 700,
  color: "#fff",
  marginBottom: "8px"
};

const partnerDescStyle = {
  fontSize: "12px",
  color: "var(--color-muted)",
  lineHeight: 1.5,
  margin: 0
};

const timelineStepStyle = {
  display: "flex",
  gap: "16px",
  position: "relative" as const,
  zIndex: 2
};

const timelineDotStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "var(--color-card)",
  border: "1px solid var(--color-border-gold)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--color-gold)",
  flexShrink: 0
};

const timelineHeaderStyle = {
  fontSize: "15px",
  fontWeight: 700,
  color: "#fff",
  margin: "0 0 4px"
};

const timelineDescStyle = {
  fontSize: "13px",
  color: "var(--color-muted)",
  margin: 0,
  lineHeight: 1.5
};

const bookingRuleItemStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start" as const
};

const bookingNumberStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 700,
  flexShrink: 0,
  marginTop: "2px"
};

const bookingRuleItemDescStyle = {
  fontSize: "13.5px",
  color: "var(--color-muted)",
  lineHeight: 1.5
};

const secPointStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start" as const
};
