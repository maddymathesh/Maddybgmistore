/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";



import Link from "next/link";
import {
  ShieldCheck, MapPin, CreditCard, AlertTriangle, Users,
  Coins, MessageCircle, Send, Gamepad2, Award, Eye,
  HelpCircle, ChevronDown, Check, CheckCircle, Navigation, Search, FileText,
  TrendingUp, Hotel, Utensils, Plane, ShieldAlert, Info
} from "lucide-react";

export default function F2FDealGuide() {
  // Midpoint Calculation Cities Database
  const cities = [
    { 
      name: "Vellore", 
      midpoint: "Kanchipuram", 
      distance: "~140 km Total (~70 km each)", 
      travelEach: "70 km",
      safeLocation: "GRT Regency, Gandhi Road / Kanchi Shopping Mall (CCTV Secure)", 
      transitCoords: { customer: { x: 25, y: 75, name: "Vellore" }, midpoint: { x: 50, y: 55, name: "Kanchipuram (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Bangalore", 
      midpoint: "Vellore", 
      distance: "~300 km Total (~150 km each)", 
      travelEach: "150 km",
      safeLocation: "MGB Felicity Mall, NH-48 / SGR Highway Cafe (CCTV Secure)", 
      transitCoords: { customer: { x: 12, y: 85, name: "Bangalore" }, midpoint: { x: 45, y: 65, name: "Vellore (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Coimbatore", 
      midpoint: "Salem", 
      distance: "~500 km Total (~250 km each)", 
      travelEach: "250 km",
      safeLocation: "ARRS Megamall, NH-44 / Sathyas Highway Inn (CCTV Secure)", 
      transitCoords: { customer: { x: 15, y: 92, name: "Coimbatore" }, midpoint: { x: 48, y: 68, name: "Salem (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Madurai", 
      midpoint: "Trichy", 
      distance: "~460 km Total (~230 km each)", 
      travelEach: "230 km",
      safeLocation: "Feminina Shopping Mall, Cantonment / Sangam Restaurant (CCTV Secure)", 
      transitCoords: { customer: { x: 25, y: 95, name: "Madurai" }, midpoint: { x: 52, y: 72, name: "Trichy (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Trichy", 
      midpoint: "Villupuram", 
      distance: "~330 km Total (~165 km each)", 
      travelEach: "165 km",
      safeLocation: "V-Mall, NH-45 / Highway Treat Rest House (CCTV Secure)", 
      transitCoords: { customer: { x: 38, y: 82, name: "Trichy" }, midpoint: { x: 60, y: 60, name: "Villupuram (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Pondicherry", 
      midpoint: "Mahabalipuram", 
      distance: "~160 km Total (~80 km each)", 
      travelEach: "80 km",
      safeLocation: "Grande Cafe ECR / Radisson Blu Shoreline Checkpoint (CCTV Secure)", 
      transitCoords: { customer: { x: 62, y: 72, name: "Pondicherry" }, midpoint: { x: 70, y: 55, name: "Mahabalipuram (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
    { 
      name: "Hyderabad", 
      midpoint: "Nellore", 
      distance: "~630 km Total (~315 km each)", 
      travelEach: "315 km",
      safeLocation: "MVR Mall, NH-16 / Highway Food Plaza Junction (CCTV Secure)", 
      transitCoords: { customer: { x: 45, y: 15, name: "Hyderabad" }, midpoint: { x: 68, y: 48, name: "Nellore (Midpoint)" }, base: { x: 80, y: 35, name: "Maddy Store Depot" } } 
    },
  ];

  // Component States
  const [selectedCity, setSelectedCity] = useState<(typeof cities)[number]>(cities[0]!);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Booking Calculator States
  const [accountValue, setAccountValue] = useState(100000);
  const [bookingAdvance, setBookingAdvance] = useState(10000);
  const [balancePayment, setBalancePayment] = useState(90000);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const val = Number(accountValue) || 0;
    const advance = Math.round(val * 0.10);
    setBookingAdvance(advance);
    setBalancePayment(val - advance);
  }, [accountValue]);

  // Close dropdown on outside click/tap
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleCalculatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAccountValue(val === "" ? 0 : Number(val));
  };

  const faqs = [
    {
      question: "Is face-to-face mandatory for premium accounts?",
      answer: "No, face-to-face is entirely optional. Even for accounts above ₹80,000, you can choose to complete the deal 100% online through our highly secure digital delivery system if you prefer faster processing without travel requirements."
    },
    {
      question: "Why is the 10% booking advance required?",
      answer: "The 10% booking advance serves as a security lock to confirm that you are a serious, verified buyer. Coordinating in-person meetups requires significant logistics, travel planning, and locking the account seller's active listing. The booking fee guarantees commitment from both parties."
    },
    {
      question: "Is the 10% booking fee refundable?",
      answer: "No, the booking fee is strictly non-refundable. If you cancel the deal, fail to attend the meetup, or fail to complete the balance payment, the booking amount is forfeited. This amount secures the seller's lock-in period and covers the immediate administrative overhead."
    },
    {
      question: "Can I choose the meetup city?",
      answer: "Meetup locations are determined mutually. To ensure fairness, we calculate a common midpoint coordinate between the seller's city and your city (for example, if the seller is in Chennai and you are in Bangalore, a safe, public midpoint like Vellore is selected)."
    },
    {
      question: "When exactly do I receive account access credentials?",
      answer: "Account credentials and social linkages are handed over ONLY after 100% of the full payment has been completed and verified. Under no circumstances will partial payments or physical meetups bypass this safety rule. We prioritize complete transaction security."
    },
    {
      question: "Who pays for the meetup travel and food expenses?",
      answer: "The buyer is entirely responsible for covering all meetup-related expenses. This includes your own travel/food/stay costs, as well as the round-trip travel fare, lodging, and food expenses of the seller or Maddy's official transaction agent attending the meetup."
    }
  ];

  return (
    <>
      
      
      {/* Premium Dark Page Wrapper */}
      <div style={{ 
        background: "var(--color-bg)", 
        color: "#fff", 
        paddingTop: "102px", 
        minHeight: "100vh",
        overflow: "hidden"
      }}>

        {/* SECTION 1 — HERO SECTION */}
        <section style={{ 
          position: "relative",
          padding: "90px 5% 70px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 215, 0, 0.08) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.2)"
        }}>
          {/* Subtle background floating decorative elements */}
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%)", top: "-100px", left: "-150px", pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)", bottom: "-100px", right: "-150px", pointerEvents: "none" }} />

          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              
              <Link href="/buy" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
                className="back-btn">
                <ShieldCheck size={14} /> Back to Buy Portal
              </Link>

              <div style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 215, 0, 0.08)", border: "1px solid rgba(255, 215, 0, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                <Award size={13} style={{ color: "var(--color-gold)" }} />
                Premium VIP Handover System
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
                Secure Face-to-Face <span className="g">BGMI Deals</span>
              </h1>
              
              <h2 style={{ 
                fontFamily: "var(--font-h)", 
                fontSize: "clamp(20px, 3vw, 28px)", 
                fontWeight: 700, 
                color: "var(--color-gold)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "24px"
              }}>
                For High-Value Accounts Above ₹80K
              </h2>
              
              <p style={{ 
                fontSize: "clamp(14px, 1.8vw, 17px)", 
                color: "var(--color-muted)", 
                maxWidth: "760px", 
                lineHeight: 1.7, 
                marginBottom: "35px",
                textAlign: "center"
              }}>
                Exclusively tailored for elite buyers desiring absolute transparency, our face-to-face deal module offers secure in-person handovers and verified transitions at public checkpoints. Perfect for collectors who prefer physical verification for ultra-premium BGMI accounts.
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
                  <MapPin size={14} style={{ color: "var(--color-gold)" }} />
                  <span>Public Meetup</span>
                </div>
                <div style={trustBadgeStyle}>
                  <ShieldCheck size={14} style={{ color: "var(--color-gold)" }} />
                  <span>Verified Process</span>
                </div>
                <div style={trustBadgeStyle}>
                  <CreditCard size={14} style={{ color: "var(--color-gold)" }} />
                  <span>Secure Transfer</span>
                </div>
                <div style={trustBadgeStyle}>
                  <Eye size={14} style={{ color: "var(--color-gold)" }} />
                  <span>Transparent Deal</span>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div style={{ 
                display: "flex", 
                gap: "16px", 
                flexWrap: "wrap", 
                justifyContent: "center",
                marginBottom: "50px"
              }}>
                <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                  <MessageCircle size={18} /> Contact on WhatsApp
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                  <Send size={18} /> Join Telegram
                </a>
                <Link href="/readystocks" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                  <Gamepad2 size={18} /> View Accounts
                </Link>
              </div>

              {/* Visual Mockup Illustration Area */}
              <div style={{
                width: "100%",
                maxWidth: "850px",
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 215, 0, 0.2)",
                borderRadius: "24px",
                padding: "30px",
                position: "relative",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(255, 215, 0, 0.02)",
                backdropFilter: "blur(12px)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }} className="illustration-flex">
                  <div style={illuNodeStyle}>
                    <div style={illuIconWrapStyle}>
                      <Users size={28} style={{ color: "var(--color-gold)" }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Verified Buyer</span>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Initiates Booking (10%)</span>
                  </div>

                  <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                    <div style={{ 
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                      background: "rgba(14, 17, 24, 1)", border: "1px solid rgba(255, 215, 0, 0.2)", 
                      borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                      color: "var(--color-gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)", letterSpacing: "1px" 
                    }}>
                      SECURE MUTUAL DEAL
                    </div>
                  </div>

                  <div style={{ ...illuNodeStyle, borderColor: "var(--color-orange)" }}>
                    <div style={{ ...illuIconWrapStyle, background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)", color: "var(--color-orange)" }}>
                      <MapPin size={28} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-orange)" }}>Public Meetup</span>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Mutual Midpoint Location</span>
                  </div>

                  <div style={{ flex: 1, height: "2px", background: "dashed rgba(255, 215, 0, 0.25)", position: "relative", margin: "0 15px" }} className="illustration-line">
                    <div style={{ 
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
                      background: "rgba(14, 17, 24, 1)", border: "1px solid rgba(255, 215, 0, 0.2)", 
                      borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, 
                      color: "var(--color-gold)", whiteSpace: "nowrap", fontFamily: "var(--font-h)", letterSpacing: "1px" 
                    }}>
                      CREDENTIAL HANDOVER
                    </div>
                  </div>

                  <div style={illuNodeStyle}>
                    <div style={illuIconWrapStyle}>
                      <ShieldCheck size={28} style={{ color: "var(--color-gold)" }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "14px", fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1.5px" }}>Verified Seller</span>
                    <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Pre-secured Handover</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2 — WHAT IS A FACE-TO-FACE DEAL? */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Definition & Scope</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>What is a Face-to-Face Deal?</h2>
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
                marginBottom: "24px",
                textAlign: "center",
                fontFamily: "var(--font-h)",
                letterSpacing: "0.5px"
              }}>
                “A face-to-face deal is an in-person transaction method where the buyer and seller meet at a common public location to complete the account transfer securely.”
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }} className="info-grid">
                <div style={infoBulletStyle}>
                  <Check size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Buyer's Preference First</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>This is an optional method chosen explicitly by the buyer for absolute confidence.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <Check size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Not Mandatory</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>Standard online transaction modes are active, heavily secured, and readily available for speed.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <Check size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Online Alternative</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>You can buy any budget or premium account using our instant online agent delivery.</span>
                  </div>
                </div>
                <div style={infoBulletStyle}>
                  <Check size={16} style={{ color: "var(--color-gold)", flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: "block", color: "#fff", fontSize: "14px" }}>Elite Accounts Only</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>F2F deals are restricted exclusively to premium accounts priced above ₹80,000.</span>
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
                  Important: Face-to-face requests are accepted only for selected premium accounts.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — DEAL MODE SELECTION */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Flexibility & Choice</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Choose Your Preferred Deal Mode</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "10px" }}>We offer two fully secure paths. The buyer holds the right to choose the mode they are comfortable with.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }} className="compare-grid">
              
              {/* Card 1: Online Deal */}
              <div style={compareCardStyle}>
                <div style={compareCardHeaderStyle}>
                  <Gamepad2 size={24} style={{ color: "var(--color-gold)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-h)", color: "#fff" }}>Online Deal Mode</h3>
                </div>
                <div style={{ margin: "20px 0", height: "1px", background: "rgba(255, 215, 0, 0.1)" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "#22c55e" }} /> Fast delivery within 30 mins to 3 hours</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "#22c55e" }} /> 100% online social linkage swap</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "#22c55e" }} /> Can pay the full account price directly online</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "#22c55e" }} /> Can use the 10% booking system to hold for 24h</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "#22c55e" }} /> Fully secure digital transfer backed by Maddy admin</li>
                </ul>
              </div>

              {/* Card 2: F2F Deal */}
              <div style={{ ...compareCardStyle, border: "1px solid rgba(255, 215, 0, 0.2)", boxShadow: "0 10px 40px rgba(255, 215, 0, 0.03)" }}>
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, var(--color-gold), var(--color-orange))", color: "#000", fontFamily: "var(--font-h)", fontSize: "10px", fontWeight: 800, padding: "3px 10px", borderRadius: "10px", letterSpacing: "0.5px" }}>RECOMMENDED FOR ₹80K+</div>
                <div style={compareCardHeaderStyle}>
                  <MapPin size={24} style={{ color: "var(--color-gold)" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-h)", color: "var(--color-gold)" }}>Face-to-Face Mode</h3>
                </div>
                <div style={{ margin: "20px 0", height: "1px", background: "rgba(255, 215, 0, 0.1)" }} />
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> In-person interactive login & transfer verification</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Safe, pre-approved public meeting location</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Exclusively for accounts above ₹80,000 threshold</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Requires a mandatory 10% non-refundable booking fee</li>
                  <li style={bulletStyle}><Check size={14} style={{ color: "var(--color-gold)" }} /> Buyer fully covers travel & meetup logistics</li>
                </ul>
              </div>
            </div>

            <div style={{ textAlign: "center", color: "var(--color-muted)", fontSize: "13px", fontWeight: 600 }}>
              💡 Remind Note: <span style={{ color: "#fff" }}>“The buyer chooses the preferred deal mode.”</span> Online speed or physical verification is your choice.
            </div>
          </div>
        </section>

        {/* SECTION 4 — BOOKING SYSTEM */}
        <section style={{ padding: "90px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "#ff4d4d", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Mandatory Protocol</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>10% Non-Refundable Booking System</h2>
              <div style={{ width: "60px", height: "3px", background: "#ff4d4d", margin: "12px auto" }} />
              <p style={{ color: "var(--color-muted)", fontSize: "14px", maxWidth: "600px", margin: "10px auto 0" }}>
                To ensure serious buyers and cover transit logistics, every Face-to-Face transaction mandates an upfront security booking deposit.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", alignItems: "stretch" }} className="booking-grid">
              
              {/* Rules Explanation */}
              <div style={{ 
                background: "rgba(17, 21, 32, 0.45)", 
                border: "1px solid rgba(255,255,255,0.04)", 
                borderRadius: "20px", 
                padding: "35px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={bookingRuleItemStyle}>
                    <div style={bookingNumberStyle}>1</div>
                    <span style={{ fontSize: "14.5px", color: "#fff" }}>
                      Face-to-face deals require a <strong>mandatory 10% booking advance</strong> paid directly before setting up meetups.
                    </span>
                  </div>
                  <div style={bookingRuleItemStyle}>
                    <div style={bookingNumberStyle}>2</div>
                    <span style={{ fontSize: "14.5px", color: "#fff" }}>
                      The deposit confirms <strong>seriousness and filters window shoppers</strong>, ensuring our seller locks listing.
                    </span>
                  </div>
                  <div style={bookingRuleItemStyle}>
                    <div style={bookingNumberStyle}>3</div>
                    <span style={{ fontSize: "14.5px", color: "#fff" }}>
                      <strong>Booking deposit is 100% non-refundable.</strong> If the buyer cancels or fails payment, the amount is forfeited.
                    </span>
                  </div>
                  <div style={bookingRuleItemStyle}>
                    <div style={bookingNumberStyle}>4</div>
                    <span style={{ fontSize: "14.5px", color: "#fff" }}>
                      Payment of booking <strong>temporarily reserves the account</strong> for a strict, limited time window (usually 24 hours).
                    </span>
                  </div>
                </div>

                {/* Important warning box */}
                <div style={{ 
                  background: "rgba(239, 68, 68, 0.08)", 
                  border: "1px solid rgba(239, 68, 68, 0.3)", 
                  borderRadius: "14px", 
                  padding: "16px 20px", 
                  display: "flex", 
                  gap: "12px",
                  marginTop: "30px",
                  alignItems: "center"
                }}>
                  <ShieldAlert size={24} style={{ color: "#ff4d4d", flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#ff8888", fontWeight: 700 }}>
                    “No face-to-face meetup will be arranged without booking confirmation.”
                  </span>
                </div>
              </div>

              {/* Interactive Booking Calculator Card */}
              <div style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(255, 107, 53, 0.01) 100%), rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 215, 0, 0.2)",
                borderRadius: "20px",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)"
              }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Coins size={36} style={{ color: "var(--color-gold)", marginBottom: "8px" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#fff" }}>Booking Deposit Calculator</h3>
                  <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Verify advance coordinates instantly</span>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--color-muted)", display: "block", marginBottom: "8px", fontWeight: 700 }}>Account Price (₹)</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-gold)", fontWeight: 700, fontSize: "15px" }}>₹</span>
                    <input 
                      type="text" 
                      value={accountValue.toLocaleString()} 
                      onChange={handleCalculatorChange}
                      style={{ 
                        width: "100%", 
                        background: "rgba(8,10,15,0.7)", 
                        border: "1px solid rgba(255, 215, 0, 0.2)", 
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

                <div style={{ marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px" }}>
                    <span>Select Range</span>
                    <span>₹80,000 - ₹5,000,000</span>
                  </div>
                  <input 
                    type="range" 
                    min="80000" 
                    max="500000" 
                    step="5000"
                    value={accountValue < 80000 ? 80000 : accountValue > 500000 ? 500000 : accountValue} 
                    onChange={e => setAccountValue(Number(e.target.value))}
                    style={{ 
                      width: "100%", 
                      accentColor: "var(--color-gold)",
                      cursor: "pointer"
                    }} 
                  />
                </div>

                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Booking Fee (10%)</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-gold)" }}>₹{bookingAdvance.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px dashed rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>Balance Payment</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>₹{balancePayment.toLocaleString()}</span>
                  </div>
                </div>
                
                <span style={{ display: "block", textAlign: "center", fontSize: "10px", color: "var(--color-muted)", marginTop: "12px", lineHeight: 1.4 }}>
                  ⚠️ *Booking validity is limited strictly to 24 hours once paid, unless discussed otherwise.*
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 5 — MEETUP LOCATION SYSTEM */}
        <section id="midpoint-portal" style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>South India Equal Transit Protocol</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Balanced Midpoint Meetup Coordinates</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "10px", maxWidth: "700px", margin: "10px auto 0", lineHeight: "1.6" }}>
                All face-to-face deals are conducted in South India (Tamil Nadu, Kerala, Andhra Pradesh, Karnataka). With Maddy Store representatives based in <strong>Chennai</strong>, enter your city below to automatically calculate a balanced midpoint checkpoint ensuring <strong>100% equal travel distances</strong> for both parties. No one travels further!
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }} className="portal-grid">
              
              {/* COLUMN 1: City Search & Safe Checkpoints */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={cardStyle}>
                  <div style={glowStyle} />
                  
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "#fff" }}>
                    <Navigation size={18} style={{ color: "var(--color-gold)" }} /> Midpoint Map Portal
                  </h3>
                  <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6", marginBottom: "22px" }}>
                    Select or search your city to view the pre-calculated safe meetup coordinates. Our Chennai agent's base coordinates are kept secure and classified.
                  </p>

                  {/* Dropdown Input Area */}
                  <div style={{ position: "relative", zIndex: 10 }} ref={dropdownRef}>
                    <label style={{ display: "block", color: "var(--color-muted)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                      Enter Your Customer City
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search city (e.g. Bangalore, Vellore...)"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        style={{
                          width: "100%", padding: "14px 16px 14px 44px",
                          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "10px", color: "#fff", fontSize: "14px",
                          outline: "none", transition: "border-color 0.2s",
                          boxSizing: "border-box"
                        }}
                      />
                      <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                      <ChevronDown size={16} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)", cursor: "pointer" }} onClick={() => setShowDropdown(!showDropdown)} />
                    </div>

                    {showDropdown && (
                      <div style={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                        background: "#111520", border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "10px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
                      }}>
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <div
                              key={city.name}
                              onClick={() => {
                                setSelectedCity(city);
                                setSearchQuery(city.name);
                                setShowDropdown(false);
                              }}
                              style={{
                                padding: "12px 16px", cursor: "pointer",
                                background: selectedCity.name === city.name ? "rgba(255,215,0,0.1)" : "transparent",
                                color: selectedCity.name === city.name ? "var(--color-gold)" : "#fff",
                                fontSize: "13.5px", fontWeight: selectedCity.name === city.name ? 700 : 500,
                                borderBottom: "1px solid rgba(255,255,255,0.03)",
                                display: "flex", justifyContent: "space-between", alignItems: "center"
                              }}
                              onMouseEnter={(e) => {
                                if (selectedCity.name !== city.name) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                              }}
                              onMouseLeave={(e) => {
                                if (selectedCity.name !== city.name) e.currentTarget.style.background = "transparent";
                              }}
                            >
                              <span>{city.name}</span>
                              <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Midpoint: {city.midpoint}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "12px 16px", color: "var(--color-muted)", fontSize: "13px" }}>
                            No vended cities found. Meetup coordinates will be calculated manually upon booking.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected City Metadata Panel */}
                  <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255,215,0,0.04)", border: "1px dashed rgba(255,215,0,0.3)", borderRadius: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                      <div>
                        <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Computed Midpoint</span>
                        <strong style={{ fontSize: "15px", color: "#fff", display: "block", marginTop: "2px" }}>{selectedCity.midpoint}</strong>
                      </div>
                      <div>
                        <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Transit Distance</span>
                        <strong style={{ fontSize: "15px", color: "#fff", display: "block", marginTop: "2px" }}>{selectedCity.distance}</strong>
                      </div>
                    </div>

                    {/* Equal Travel Split Breakdown */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "12px" }}>
                      <div style={{ textAlign: "center" }}>
                        <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Buyer Travel</span>
                        <strong style={{ fontSize: "13px", color: "var(--color-gold)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                      </div>
                      <div style={{ textAlign: "center", borderLeft: "1px dashed rgba(255,255,255,0.1)" }}>
                        <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Seller Travel</span>
                        <strong style={{ fontSize: "13px", color: "var(--color-gold)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>Pre-Vetted CCTV Checkpoint</span>
                      <span style={{ fontSize: "12.5px", color: "var(--color-gold)", fontWeight: 600 }}>{selectedCity.safeLocation}</span>
                    </div>

                    <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", borderTop: "1px dashed rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                      <CheckCircle size={12} /> Balanced Transit: 100% Equal travel distance for both parties!
                    </div>
                  </div>

                </div>

                {/* Safety Protocol Note */}
                <div style={{ 
                  background: "rgba(255, 107, 53, 0.05)", 
                  border: "1px solid rgba(255, 107, 53, 0.2)", 
                  borderRadius: "12px", 
                  padding: "16px 20px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px"
                }}>
                  <AlertTriangle size={20} style={{ color: "var(--color-orange)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                    Safety First Coordinate Protocol: <strong style={{ color: "var(--color-orange)" }}>“Private, dark, or isolated meetup coordinates are strictly avoided.”</strong> Only premium, CCTV-secured open public spots are eligible.
                  </span>
                </div>
              </div>

              {/* COLUMN 2: Live Routing Vector Map & Transit Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Dynamic Animated Route Map */}
                <div style={{ ...cardStyle, padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <span style={{ fontFamily: "var(--font-h)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Navigation size={14} style={{ color: "var(--color-gold)" }} /> Live Routing Vector Map
                    </span>
                    <span style={{ fontSize: "11px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "2px 10px", borderRadius: "100px", fontWeight: 700 }}>
                      Active Route
                    </span>
                  </div>

                  {/* SVG Visual Map */}
                  <div style={{ position: "relative", background: "#0a0c14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", height: "240px" }}>
                    
                    {/* Glowing Radar Scans */}
                    <div className="radar-circle animate-ping" style={{ position: "absolute", left: `${selectedCity.transitCoords.midpoint.x}%`, top: `${selectedCity.transitCoords.midpoint.y}%`, transform: "translate(-50%,-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,215,0,0.15)", pointerEvents: "none" }} />
                    
                    {/* Grid Lines Overlay */}
                    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Animated Line Connection */}
                      {/* Customer City -> Midpoint */}
                      <line 
                        x1={`${selectedCity.transitCoords.customer.x}%`} 
                        y1={`${selectedCity.transitCoords.customer.y}%`}
                        x2={`${selectedCity.transitCoords.midpoint.x}%`} 
                        y2={`${selectedCity.transitCoords.midpoint.y}%`}
                        stroke="var(--color-orange)" 
                        strokeWidth="2.5" 
                        strokeDasharray="6,4"
                        className="animated-transit-path"
                      />

                      {/* Midpoint -> Confidential Agent Depot */}
                      <line 
                        x1={`${selectedCity.transitCoords.midpoint.x}%`} 
                        y1={`${selectedCity.transitCoords.midpoint.y}%`}
                        x2={`${selectedCity.transitCoords.base.x}%`} 
                        y2={`${selectedCity.transitCoords.base.y}%`}
                        stroke="var(--color-gold)" 
                        strokeWidth="2.5" 
                        strokeDasharray="6,4"
                        className="animated-transit-path"
                      />

                      {/* Nodes Connection Drawing */}
                      <circle 
                        cx={`${selectedCity.transitCoords.customer.x}%`} 
                        cy={`${selectedCity.transitCoords.customer.y}%`} 
                        r="7" 
                        fill="#3b82f6" 
                        stroke="#fff" 
                        strokeWidth="1.5"
                      />
                      
                      <circle 
                        cx={`${selectedCity.transitCoords.midpoint.x}%`} 
                        cy={`${selectedCity.transitCoords.midpoint.y}%`} 
                        r="9" 
                        fill="var(--color-orange)" 
                        stroke="#fff" 
                        strokeWidth="2"
                      />

                      <circle 
                        cx={`${selectedCity.transitCoords.base.x}%`} 
                        cy={`${selectedCity.transitCoords.base.y}%`} 
                        r="7" 
                        fill="var(--color-gold)" 
                        stroke="#fff" 
                        strokeWidth="1.5"
                      />
                    </svg>

                    {/* SVG Labels */}
                    <div style={{ position: "absolute", left: `${selectedCity.transitCoords.customer.x}%`, top: `${selectedCity.transitCoords.customer.y - 12}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(17,21,32,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                      👤 Buyer: {selectedCity.transitCoords.customer.name}
                    </div>

                    <div style={{ position: "absolute", left: `${selectedCity.transitCoords.midpoint.x}%`, top: `${selectedCity.transitCoords.midpoint.y - 14}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(255,215,0,0.9)", border: "1px solid #fff", borderRadius: "4px", padding: "3px 8px", fontSize: "10px", fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>
                      📍 Midpoint: {selectedCity.transitCoords.midpoint.name}
                    </div>

                    <div style={{ position: "absolute", left: `${selectedCity.transitCoords.base.x}%`, top: `${selectedCity.transitCoords.base.y - 12}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(17,21,32,0.8)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, color: "var(--color-gold)", whiteSpace: "nowrap" }}>
                      🔒 Maddy Agent Depot
                    </div>
                  </div>

                  <style>{`
                    .animated-transit-path {
                      animation: dashTransit 20s linear infinite;
                      stroke-dashoffset: 100;
                    }
                    @keyframes dashTransit {
                      to {
                        stroke-dashoffset: -1000;
                      }
                    }
                  `}</style>
                </div>

                {/* Pre-Vetted CCTV Checkpoint Details Card */}
                <div style={{ ...cardStyle, border: "1px solid rgba(255, 215, 0, 0.25)", background: "rgba(255, 215, 0, 0.03)" }}>
                  <h4 style={{ fontFamily: "var(--font-h)", fontSize: "15px", fontWeight: 800, color: "var(--color-gold)", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={16} /> Pre-Vetted CCTV Checkpoint Standard
                  </h4>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12.5px", lineHeight: "1.6", margin: "0 0 16px" }}>
                    Our transaction coordinators only meet at pre-vetted checkpoints satisfying strict safety standards:
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    {[
                      "Active CCTV Surveillance: Full high-definition recording coverage of the meetup area.",
                      "High-Footfall Public Spaces: Malls, coffee shops, or star hotels are used exclusively.",
                      "Immediate Transport Connectivity: Located within 15 minutes of major railway hubs or national highways."
                    ].map((exp, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <CheckCircle size={14} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "12px", color: "var(--color-muted)", lineHeight: 1.5 }}>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* SECTION 6 — BUYER EXPENSE RESPONSIBILITY */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Financial Overhead</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Buyer Expense Responsibility</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--color-gold), var(--color-orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.03) 0%, transparent 60%), rgba(17, 21, 32, 0.45)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
              borderRadius: "20px",
              padding: "35px",
              boxShadow: "0 15px 45px rgba(0,0,0,0.3)"
            }}>
              <p style={{ color: "#fff", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "25px", textAlign: "justify" }}>
                Face-to-Face transactions mandate travel logistics and physical deployment of our verification administrators or the original seller. Because this premium service is tailored strictly to buyer request preference, <strong>all associated meetup expenses are borne entirely by the buyer.</strong>
              </p>

              {/* Expense Grid Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "30px" }} className="expense-grid">
                <div style={expenseCardStyle}>
                  <Plane size={20} style={{ color: "var(--color-gold)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Travel & Transit</span>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>Bus, Train, or Petrol charges of the agent/seller.</span>
                  </div>
                </div>

                <div style={expenseCardStyle}>
                  <Utensils size={20} style={{ color: "var(--color-gold)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Food Expenses</span>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>Basic dining expenses incurred during coordinate travel.</span>
                  </div>
                </div>

                <div style={expenseCardStyle}>
                  <Hotel size={20} style={{ color: "var(--color-gold)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Hotel/Stay</span>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>Lodging expenses (only if distant transit forces stay).</span>
                  </div>
                </div>

                <div style={expenseCardStyle}>
                  <Users size={20} style={{ color: "var(--color-gold)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>Agent Transport</span>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "2px" }}>Local coordination transport for dispatching Maddy agent.</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", borderTop: "1px dashed rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
                <span style={{ fontSize: "13px", color: "var(--color-muted)", display: "block", marginBottom: "6px" }}>
                  📌 *These charges are entirely additional and separate from the account value.*
                </span>
                <span style={{ fontSize: "14px", color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-h)" }}>
                  “The buyer must agree to all meetup instructions before proceeding.”
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — ACCOUNT HANDOVER PROCESS */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Operational Blueprint</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Account Handover Roadmap</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "10px" }}>The chronological, safe workflow optimized since 2019 for pristine, zero-conflict handovers.</p>
            </div>

            <div style={{ position: "relative", paddingLeft: "30px" }} className="timeline-wrapper">
              {/* Central vertical timeline line */}
              <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "2px", background: "linear-gradient(180deg, var(--color-gold) 0%, var(--color-orange) 100%)" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>1</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Choose Account</h4>
                    <p style={timelineDescStyle}>Browse ready stocks on our website or verified Telegram/WhatsApp showcase coordinates.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>2</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Select Face-to-Face Deal Mode</h4>
                    <p style={timelineDescStyle}>Inform Maddy's admin coordinators that you prefer the physical in-person meetup module (eligibility threshold ₹80K+).</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>3</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Pay 10% Booking Advance</h4>
                    <p style={timelineDescStyle}>Transmit the 10% security deposit (e.g., ₹10,000 for a ₹100,000 account) to lock the listing and activate travel bookings.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>4</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Meetup Location Finalized</h4>
                    <p style={timelineDescStyle}>Maddy's logistical team maps coordinates to establish an optimized, safe public midpoint mall/cafe coordinates mutually.</p>
                  </div>
                </div>

                <div style={{ ...timelineStepStyle, background: "rgba(255, 215, 0, 0.02)", border: "1px solid rgba(255, 215, 0, 0.2)", borderRadius: "12px", padding: "16px 20px" }}>
                  <div style={{ ...timelineDotStyle, background: "linear-gradient(135deg, var(--color-gold), var(--color-orange))", color: "#000", border: "2px solid var(--color-gold)" }}>5</div>
                  <div>
                    <h4 style={{ ...timelineHeaderStyle, color: "var(--color-gold)" }}>Buyer Completes Full Payment</h4>
                    <p style={timelineDescStyle}>At the meetup, the buyer must fully transfer the balance amount using secure online banking channels or physical cash deposit.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>6</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Account Handover & Logins Handed Over</h4>
                    <p style={timelineDescStyle}>Immediately after payment validation, Maddy's administrator supplies linked social passwords and unlinking tokens.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>7</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Recovery Email & Phone Bound to Buyer</h4>
                    <p style={timelineDescStyle}>Admin physically guides you in bind-swapping your personal mobile number, dual two-factor verification, and primary recovery email.</p>
                  </div>
                </div>

                <div style={timelineStepStyle}>
                  <div style={timelineDotStyle}>8</div>
                  <div>
                    <h4 style={timelineHeaderStyle}>Final Verification Completed</h4>
                    <p style={timelineDescStyle}>Transaction signed off, premium invoice issued, and post-delivery lifetime link warranty coordinates initialized.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Note Box */}
            <div style={{ 
              background: "rgba(239, 68, 68, 0.08)", 
              border: "1px solid rgba(239, 68, 68, 0.3)", 
              borderRadius: "15px", 
              padding: "24px 30px", 
              marginTop: "40px",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.03)"
            }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <ShieldAlert size={28} style={{ color: "#ff4d4d", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ color: "#ff4d4d", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-h)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                    CRITICAL SAFETY PROTOCOL
                  </h4>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, lineHeight: 1.6 }}>
                    “Account credentials, social logins, and in-game coordinates will absolutely NOT be handed over before full payment clearance.”
                  </p>
                  <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "6px", lineHeight: 1.5 }}>
                    Please do not request credentials during early stages of the meetup or physical verification. Partial transfers do not unlock access. Safety guidelines are strictly enforced without exceptions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 8 — SECURITY & VERIFICATION */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "850px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>KYC Compliance</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Identity Safety & Scammer Defense</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--color-gold), var(--color-orange))", margin: "12px auto" }} />
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
                  border: "2px solid var(--color-gold)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  flexShrink: 0
                }} className="kyc-badge-wrap">
                  <ShieldCheck size={36} style={{ color: "var(--color-gold)" }} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px", fontFamily: "var(--font-h)" }}>Verification Integrity</h3>
                  <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: 1.6, textAlign: "justify" }}>
                    To protect both buyers and sellers from cybersecurity frauds, payment chargebacks, or account reclamation scams, Maddy's administration coordinates may occasionally request basic government identity proof (for example, Aadhaar, PAN Card, or Driving License copies).
                  </p>
                </div>
              </div>

              <div style={{ margin: "24px 0", height: "1px", background: "rgba(255, 255, 255, 0.06)" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="info-grid">
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Check size={16} style={{ color: "var(--color-gold)", marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--color-muted)" }}><strong>Strict Privacy:</strong> All ID proofs are held inside secure offline vaults and never broadcasted publicly or shared.</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <Check size={16} style={{ color: "var(--color-gold)", marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--color-muted)" }}><strong>Anti-Fraud Measure:</strong> Essential to filter bank-freeze actors and coordinate bulletproof, legal transaction boundaries.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9 — WHY FACE-TO-FACE? */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Trust Vectors</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Why Choose Face-to-Face Deals?</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "10px" }}>Five core pillars of absolute confidence that make our physical handovers worth every coordinate.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              <div style={trustCardStyle}>
                <Eye size={24} style={{ color: "var(--color-gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Real-time Verification</h4>
                <p style={trustCardDescStyle}>Log in directly on your device while sitting next to the agent, confirming all cosmetic details in real time.</p>
              </div>

              <div style={trustCardStyle}>
                <MapPin size={24} style={{ color: "var(--color-gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Public Meetup Safety</h4>
                <p style={trustCardDescStyle}>Conducted inside premium open malls or active cafes, providing a safe, comfortable, and pressure-free environment.</p>
              </div>

              <div style={trustCardStyle}>
                <MessageCircle size={24} style={{ color: "var(--color-gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Direct Communication</h4>
                <p style={trustCardDescStyle}>Resolve linkage changes and account bind coordinates instantly, backed by face-to-face assistance.</p>
              </div>

              <div style={trustCardStyle}>
                <ShieldCheck size={24} style={{ color: "var(--color-gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Instant Confirmation</h4>
                <p style={trustCardDescStyle}>Walk away with complete recovery unlinks performed and 100% security bound right before you leave the meetup.</p>
              </div>

              <div style={trustCardStyle}>
                <Award size={24} style={{ color: "var(--color-gold)", marginBottom: "12px" }} />
                <h4 style={trustCardTitleStyle}>Buyer Confidence</h4>
                <p style={trustCardDescStyle}>Premium peace of mind tailored for luxury transactions above the ₹80,000 mark.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10 — IMPORTANT RULES */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "#ff4d4d", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Warning Coordinates</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Golden Rules & Meetup Policies</h2>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "10px" }}>Failure to comply with these strictly enforced guidelines leads to immediate transaction cancellation.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              
              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <AlertTriangle size={20} style={{ color: "#ff4d4d", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Non-Refundable Deposit</h4>
                    <p style={ruleCardDescStyle}>The 10% booking advance is strictly non-refundable and forfeited in full if you cancel the meetup or refuse to settle the payment.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <TrendingUp size={20} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Strict Value Threshold</h4>
                    <p style={ruleCardDescStyle}>Face-to-Face operations are restricted purely to elite inventories valued above the ₹80,000 margin.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <Coins size={20} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Buyer Pays Expenses</h4>
                    <p style={ruleCardDescStyle}>All round-trip transit ticket pricing, hotel lodging, and food bills of the agent/seller are paid by the buyer.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CreditCard size={20} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>No Payment, No Handoff</h4>
                    <p style={ruleCardDescStyle}>Social linkage passwords and account coordinates are strictly withheld until 100% full balance payment clears our bank accounts.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <MapPin size={20} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Public Checkpoints Only</h4>
                    <p style={ruleCardDescStyle}>Meetings take place strictly in crowded cafes, restaurants, or malls. Any deviation voids the transaction instantly.</p>
                  </div>
                </div>
              </div>

              <div style={ruleCardStyle}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <FileText size={20} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h4 style={ruleCardTitleStyle}>Meetup Rules Bound</h4>
                    <p style={ruleCardDescStyle}>Buyers must sign off and agree to Maddy's standardized procedural handbook before the agent boards travel transit.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 11 — FAQ SECTION */}
        <section style={{ padding: "80px 20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <span style={{ color: "var(--color-gold)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Help Center</span>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>Common F2F Doubts Resolved</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--color-gold), var(--color-orange))", margin: "12px auto" }} />
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
                        border: "none",
                        background: "none",
                        color: isExpanded ? "var(--color-gold)" : "#fff",
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
                        color: isExpanded ? "var(--color-gold)" : "var(--color-muted)",
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
                        color: "var(--color-muted)",
                        fontSize: "14px",
                        lineHeight: 1.6,
                        margin: 0
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

        {/* SECTION 12 — FINAL CTA SECTION */}
        <section style={{ 
          padding: "100px 20px", 
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 107, 53, 0.06) 0%, transparent 60%)",
          position: "relative"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 215, 0, 0.08)", border: "1px solid rgba(255, 215, 0, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "var(--color-gold)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              Absolute Security Guaranteed
            </div>
            
            <h2 style={{ 
              fontFamily: "var(--font-h)", 
              fontSize: "clamp(32px, 5vw, 52px)", 
              fontWeight: 900, 
              lineHeight: 1.1,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              Ready for a Secure <span className="g">Premium Deal?</span>
            </h2>

            <p style={{ 
              color: "var(--color-muted)", 
              fontSize: "16px", 
              lineHeight: 1.6, 
              maxWidth: "600px", 
              margin: "0 auto 35px" 
            }}>
              Lock in South India's premium handoff coordinates. Get in touch with our operations team today to check slot availability and finalize your booking coordinates.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "35px" }}>
              <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <MessageCircle size={18} /> Contact on WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-tg" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Send size={18} /> Join Telegram
              </a>
              <Link href="/readystocks" className="btn btn-gold" style={{ borderRadius: "30px", padding: "14px 32px", textDecoration: "none" }}>
                <Gamepad2 size={18} /> View Premium Accounts
              </Link>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: "var(--color-gold)", fontWeight: 700, fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "var(--font-h)" }}>
              <ShieldCheck size={18} />
              <span>Trusted by 2000+ Buyers Across India</span>
            </div>
          </div>
        </section>

        {/* STICKY MOBILE CTA BUTTONS */}
        <div style={stickyMobileCTAStyle} className="mobile-cta-sticky">
          <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" style={stickyBtnGreenStyle}>
            <MessageCircle size={18} /> WhatsApp
          </a>
          <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" style={stickyBtnTgStyle}>
            <Send size={18} /> Telegram
          </a>
        </div>

      </div>

      
      

      {/* Embedded CSS rules for layout queries and animations */}
      <style>{`
        .hero-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .back-btn:hover {
          color: #fff !important;
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

// Styling Declarations
const trustBadgeStyle: CSSProperties = {
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

const illuNodeStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  background: "rgba(8,10,15,0.7)",
  border: "1px solid rgba(255, 215, 0, 0.2)",
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
  color: "var(--color-gold)",
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

const compareCardStyle = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "20px",
  padding: "35px",
  position: "relative" as const,
  overflow: "hidden",
  transition: "all 0.3s ease"
};

const compareCardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const bulletStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  fontSize: "13.5px",
  color: "var(--color-muted)"
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
  background: "#ff4d4d",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  fontFamily: "var(--font-h)",
  flexShrink: 0
};

const cardStyle = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  padding: "30px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
  backdropFilter: "blur(12px)",
  position: "relative" as const,
  overflow: "hidden"
};

const glowStyle = {
  position: "absolute" as const,
  width: "150px",
  height: "150px",
  background: "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
  top: "-50px",
  right: "-50px",
  pointerEvents: "none" as const
};

const roadmapStepStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  padding: "10px 14px",
  borderRadius: "12px",
  zIndex: 2
};

const roadmapBulletStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "var(--color-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: 800,
  fontFamily: "var(--font-h)",
  flexShrink: 0
};

const expenseCardStyle = {
  background: "rgba(8, 10, 15, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "14px",
  padding: "20px",
  display: "flex",
  gap: "14px",
  alignItems: "center",
  transition: "border-color 0.2s"
};

const timelineStepStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-start",
  position: "relative" as const,
  zIndex: 2
};

const timelineDotStyle = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "rgba(8, 10, 15, 0.95)",
  border: "2px solid rgba(255, 215, 0, 0.2)",
  color: "var(--color-gold)",
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
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px"
};

const timelineDescStyle = {
  fontSize: "13.5px",
  color: "var(--color-muted)",
  lineHeight: 1.5
};

const trustCardStyle: CSSProperties = {
  background: "rgba(17, 21, 32, 0.45)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "18px",
  padding: "28px 20px",
  textAlign: "center" as const,
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
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  color: "#fff",
  marginBottom: "8px"
};

const trustCardDescStyle = {
  fontSize: "12.5px",
  color: "var(--color-muted)",
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
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px"
};

const ruleCardDescStyle = {
  fontSize: "12.5px",
  color: "var(--color-muted)",
  lineHeight: 1.5
};

const stickyMobileCTAStyle = {
  position: "fixed" as const,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  background: "rgba(8, 10, 15, 0.95)",
  backdropFilter: "blur(12px)",
  borderTop: "1px solid rgba(255, 215, 0, 0.2)",
  padding: "12px 16px",
  display: "none",
  gap: "12px"
};

const stickyBtnGreenStyle = {
  flex: 1,
  background: "#25D366",
  color: "#000",
  fontSize: "14px",
  fontWeight: 700,
  fontFamily: "var(--font-h)",
  letterSpacing: "1px",
  textTransform: "uppercase" as const,
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
  textTransform: "uppercase" as const,
  padding: "12px 0",
  borderRadius: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  textDecoration: "none"
};
