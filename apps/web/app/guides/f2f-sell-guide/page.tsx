/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";



import Link from "next/link";
import {
  ShieldCheck, MapPin, CreditCard, AlertTriangle, Users,
  Coins, MessageCircle, Send,
  ShieldAlert, Navigation, Search, ChevronDown, CheckCircle
} from "lucide-react";

export default function F2FSellGuide() {
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
  
  // Booking Calculator States
  const [accountValue, setAccountValue] = useState(120000);
  const bookingAdvance = Math.round(accountValue * 0.10);
  const payoutRemaining = accountValue - bookingAdvance;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      
      <div style={{ background: "var(--color-bg)", color: "#fff", paddingTop: "102px", minHeight: "100vh" }}>
        
        {/* HERO BANNER */}
        <section style={{
          position: "relative",
          padding: "80px 5% 60px",
          textAlign: "center",
          background: "radial-gradient(circle at center, rgba(255, 107, 53, 0.08) 0%, transparent 60%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Link href="/sell" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--color-muted)", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", transition: "color 0.2s" }}
              className="back-btn">
              <ShieldCheck size={14} /> Back to Sell Portal
            </Link>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 107, 53, 0.1)", border: "1px solid rgba(255, 107, 53, 0.3)", padding: "6px 16px", borderRadius: "30px", fontSize: "12px", fontWeight: 700, color: "var(--color-orange)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>
              <Navigation size={13} /> Official F2F Seller Protocol
            </div>
            
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(36px, 5.5vw, 68px)",
              fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase",
              letterSpacing: "1px", marginBottom: "18px", color: "#fff"
            }}>
              Face-to-Face <br/>
              <span className="g">Sell & Handover Guide</span>
            </h1>
            
            <p style={{
              color: "var(--color-muted)", fontSize: "clamp(14px, 1.8vw, 17px)",
              maxWidth: "700px", margin: "0 auto 35px", lineHeight: 1.7
            }}>
              Ready to sell your premium account in-person in South India? Learn how our safe physical meetup protocol works with Chennai as our base, calculate booking advances, and trace dynamic transit midpoints with equal travel distance guarantees instantly.
            </p>

            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#midpoint-portal" className="btn btn-gold" style={{ borderRadius: "10px", padding: "14px 28px", textDecoration: "none" }}>
                <Navigation size={16} /> Midpoint Portal
              </a>
              <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20an%20account%20above%20%E2%82%B980,000%20and%20want%20to%20sell%20it%20via%20Face-to-Face%20meetup."
                target="_blank" rel="noreferrer" className="btn btn-outline"
                style={{ borderRadius: "10px", padding: "14px 28px", textDecoration: "none" }}>
                <MessageCircle size={16} /> Book Meetup Slot
              </a>
            </div>
          </div>
        </section>

        {/* CHRONOLOGICAL STEPS TIMELINE */}
        <section style={{ padding: "60px 5% 40px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span style={{ color: "var(--color-orange)", fontWeight: 700, textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>Secure Flow</span>
            <h2 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, margin: "6px 0 12px", color: "#fff" }}>
              Timeline of a <span className="g">Face-to-Face Sell Deal</span>
            </h2>
            <p style={{ color: "var(--color-muted)", maxWidth: "550px", margin: "0 auto", fontSize: "14px" }}>
              From initial WhatsApp/Telegram appraisal to in-person meeting and cash release. Follow each stage.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              {
                step: "01",
                title: "Contact & Valuation",
                desc: "Send your full account details and recording via WhatsApp/Telegram. Our analysts will audit your bindings and provide a wholesale buyout price evaluation.",
                icon: <MessageCircle size={22} style={{ color: "var(--color-orange)" }} />
              },
              {
                step: "02",
                title: "10% Secure Booking",
                desc: "Once the price is approved, pay the mandatory 10% booking advance. This locks the deal, ensures mutual commitment, and schedules our agent's travel slots.",
                icon: <Coins size={22} style={{ color: "var(--color-gold)" }} />
              },
              {
                step: "03",
                title: "Midpoint Coordination",
                desc: "Enter your city below to compute a public, CCTV-secured midpoint in South India. Our system guarantees 100% equal travel distance from Chennai and your location.",
                icon: <MapPin size={22} style={{ color: "#22c55e" }} />
              },
              {
                step: "04",
                title: "Physical Meetup",
                desc: "Meet Maddy's agent at the pre-vetted location (e.g. coffee shop or shopping mall). The agent will perform a live verification of credentials on the spot.",
                icon: <Users size={22} style={{ color: "#3b82f6" }} />
              },
              {
                step: "05",
                title: "Instant Payout Lock",
                desc: "Upon successful verification, detaching bindings, and signing final terms, the remaining 90% is released instantly to you in cash or direct UPI/Bank transfer.",
                icon: <ShieldCheck size={22} style={{ color: "#a855f7" }} />
              }
            ].map((stepObj) => (
              <div 
                key={stepObj.step} 
                style={{
                  background: "rgba(17, 21, 32, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)"
                }}
                className="step-card"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {stepObj.icon}
                  </div>
                  <span style={{ fontSize: "28px", fontWeight: 900, fontFamily: "var(--font-h)", color: "rgba(255,255,255,0.07)" }}>{stepObj.step}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{stepObj.title}</h3>
                <p style={{ color: "var(--color-muted)", fontSize: "12.5px", lineHeight: "1.6", margin: 0, flexGrow: 1 }}>{stepObj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MIDPOINT MAP PORTAL & CALCULATOR GRID */}
        <section id="midpoint-portal" style={{ padding: "40px 5% 60px", maxWidth: "1200px", margin: "0 auto" }}>
          
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1.2fr", 
              gap: "30px" 
            }} 
            className="portal-grid"
          >
            
            {/* COLUMN 1: City Search & Safe Meetups */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div 
                style={{
                  background: "rgba(17, 21, 32, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)"
                }}
                className="f2f-panel"
              >
                <h2 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "#fff" }}>
                  <Navigation size={18} style={{ color: "var(--color-orange)" }} /> Midpoint Map Portal
                </h2>
                <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6", marginBottom: "22px" }}>
                  All face-to-face deals are conducted strictly in South India. Anchored with our Buyer Agent base in **Chennai**, enter your location below to compute a balanced midpoint checkpoint ensuring **100% equal travel distance** for both parties. No one travels further!
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
                              background: selectedCity.name === city.name ? "rgba(255,107,53,0.1)" : "transparent",
                              color: selectedCity.name === city.name ? "var(--color-orange)" : "#fff",
                              fontSize: "13.5px", fontWeight: selectedCity.name === city.name ? 700 : 500,
                              borderBottom: "1px solid rgba(255,255,255,0.03)",
                              display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}
                            className="city-select-item"
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
                <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255,107,53,0.04)", border: "1px dashed rgba(255,107,53,0.3)", borderRadius: "12px" }}>
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
                      <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Seller Travel</span>
                      <strong style={{ fontSize: "13px", color: "var(--color-orange)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px dashed rgba(255,255,255,0.1)" }}>
                      <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Buyer Agent Travel</span>
                      <strong style={{ fontSize: "13px", color: "var(--color-orange)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                    </div>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>Pre-Vetted CCTV Checkpoint</span>
                    <span style={{ fontSize: "12.5px", color: "var(--color-orange)", fontWeight: 600 }}>{selectedCity.safeLocation}</span>
                  </div>

                  <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", borderTop: "1px dashed rgba(255,107,53,0.15)", paddingTop: "8px" }}>
                    <CheckCircle size={12} /> Balanced Transit Guarantee: 100% Equal travel distance for both parties!
                  </div>
                </div>

              </div>

              {/* Expense Checklist Card */}
              <div 
                style={{
                  background: "rgba(17, 21, 32, 0.45)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)",
                  backgroundColor: "rgba(239, 68, 68, 0.03)"
                }}
              >
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 800, color: "#ff6b6b", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={16} /> F2F Expense Mandates
                </h3>
                <p style={{ color: "#ffb3b3", fontSize: "12.5px", lineHeight: "1.6", margin: "0 0 16px" }}>
                  To process physical meetups, the customer is fully responsible for covering Maddy Store agent expenses:
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {[
                    "Round-Trip Transit Fare: Fare covers trains, flights, or cabs to the midpoint hub.",
                    "Safe Overnight Lodging: Required only if credential unlink cycles lock for 12+ hours.",
                    "Agent Food & Allowance: Base travel food allowances must be paid in advance.",
                  ].map((exp, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <CheckCircle size={14} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "12px", color: "#ffd6d6", lineHeight: 1.5 }}>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: SVG Transit Map & 10% Booking Calculator */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* Dynamic Animated Route Map */}
              <div 
                style={{
                  background: "rgba(17, 21, 32, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ fontFamily: "var(--font-h)", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Navigation size={14} style={{ color: "var(--color-orange)" }} /> Live Routing Vector Map
                  </span>
                  <span style={{ fontSize: "11px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "2px 10px", borderRadius: "100px", fontWeight: 700 }}>
                    Active Route
                  </span>
                </div>

                {/* SVG Visual Map */}
                <div style={{ position: "relative", background: "#0a0c14", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", height: "240px" }}>
                  
                  {/* Glowing Radar Scans */}
                  <div className="radar-circle animate-ping" style={{ position: "absolute", left: `${selectedCity.transitCoords.midpoint.x}%`, top: `${selectedCity.transitCoords.midpoint.y}%`, transform: "translate(-50%,-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(255,107,53,0.15)", pointerEvents: "none" }} />
                  
                  {/* Grid Lines Overlay */}
                  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                    <rect width="100%" height="100%" fill="none" />
                    
                    {/* Animated Line Connection */}
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
                    <circle cx={`${selectedCity.transitCoords.customer.x}%`} cy={`${selectedCity.transitCoords.customer.y}%`} r="7" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                    <circle cx={`${selectedCity.transitCoords.midpoint.x}%`} cy={`${selectedCity.transitCoords.midpoint.y}%`} r="9" fill="var(--color-orange)" stroke="#fff" strokeWidth="2" />
                    <circle cx={`${selectedCity.transitCoords.base.x}%`} cy={`${selectedCity.transitCoords.base.y}%`} r="7" fill="var(--color-gold)" stroke="#fff" strokeWidth="1.5" />
                  </svg>

                  {/* SVG Labels */}
                  <div style={{ position: "absolute", left: `${selectedCity.transitCoords.customer.x}%`, top: `${selectedCity.transitCoords.customer.y - 12}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(17,21,32,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                    👤 {selectedCity.transitCoords.customer.name}
                  </div>

                  <div style={{ position: "absolute", left: `${selectedCity.transitCoords.midpoint.x}%`, top: `${selectedCity.transitCoords.midpoint.y - 14}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(255,107,53,0.9)", border: "1px solid #fff", borderRadius: "4px", padding: "3px 8px", fontSize: "10px", fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>
                    📍 {selectedCity.transitCoords.midpoint.name}
                  </div>

                  <div style={{ position: "absolute", left: `${selectedCity.transitCoords.base.x}%`, top: `${selectedCity.transitCoords.base.y - 12}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(17,21,32,0.8)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, color: "var(--color-gold)", whiteSpace: "nowrap" }}>
                    🔒 {selectedCity.transitCoords.base.name} (Confidential Depot)
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

              {/* 10% Booking Calculator */}
              <div 
                style={{
                  background: "rgba(17, 21, 32, 0.45)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <h3 style={{ fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 800, color: "var(--color-gold)", margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Coins size={16} /> 10% F2F Booking Calculator
                </h3>
                <p style={{ color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.6", margin: "0 0 20px" }}>
                  Move the slider to estimate the 10% booking advance required to secure in-person travel and locked valuations.
                </p>

                {/* Slider Input */}
                <div style={{ marginBottom: "22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>Account Valuation</span>
                    <strong style={{ fontSize: "16px", color: "#fff", fontFamily: "var(--font-h)" }}>₹ {accountValue.toLocaleString()}</strong>
                  </div>
                  <input
                    type="range"
                    min="80000"
                    max="500000"
                    step="5000"
                    value={accountValue}
                    onChange={(e) => setAccountValue(Number(e.target.value))}
                    style={{
                      width: "100%", height: "6px", background: "rgba(255,255,255,0.08)",
                      borderRadius: "5px", outline: "none", cursor: "pointer",
                      accentColor: "var(--color-orange)"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--color-muted)", marginTop: "6px" }}>
                    <span>₹ 80K (Min F2F Value)</span>
                    <span>₹ 5.0L (VIP Cap)</span>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: "rgba(255,107,53,0.04)", border: "1px solid rgba(255,107,53,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Booking Lock (10%)</span>
                    <strong style={{ fontSize: "16px", color: "var(--color-orange)", fontFamily: "var(--font-h)" }}>₹ {bookingAdvance.toLocaleString()}</strong>
                  </div>
                  <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                    <span style={{ fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Meetup Payout (90%)</span>
                    <strong style={{ fontSize: "16px", color: "#22c55e", fontFamily: "var(--font-h)" }}>₹ {payoutRemaining.toLocaleString()}</strong>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* SECURITY AUDIT & MANDATES CARD */}
        <section style={{ padding: "20px 5% 80px", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.03) 0%, rgba(255,107,53,0.02) 100%)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "20px",
            padding: "36px 30px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
            position: "relative",
            overflow: "hidden"
          }}>
            
            <div style={{ display: "flex", gap: "24px" }} className="mandate-flex">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "800px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <AlertTriangle size={24} style={{ color: "var(--color-gold)" }} />
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Critical Escrow Security Regulations
                  </h3>
                </div>
                <p style={{ color: "var(--color-muted)", fontSize: "13.5px", lineHeight: "1.7", margin: "0 0 10px" }}>
                  To maintain South India's safest BGMI exchange environment, our agents strictly enforce these three rules during physical meetups:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14px", display: "block", marginBottom: "2px" }}>1. Mandatory Government ID Proof (KYC)</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "12.5px", lineHeight: "1.5" }}>Before any payout is disbursed, we collect physical verification of government-issued IDs (Aadhaar Card or Driving License) with your live location. PAN cards alone are not accepted.</span>
                  </div>
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14px", display: "block", marginBottom: "2px" }}>2. Irreversible Handover & Finality</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "12.5px", lineHeight: "1.5" }}>Once our agent detaches bindings and ownership has been handed over to the buyer, the deal is 100% absolute. Accounts cannot be returned under any circumstances.</span>
                  </div>
                  <div>
                    <strong style={{ color: "#fff", fontSize: "14px", display: "block", marginBottom: "2px" }}>3. 100% Locked Payout Guarantee</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "12.5px", lineHeight: "1.5" }}>Your Wholesale Payout amount is secured and locked instantly during verification. Payments are processed in legal cash or instant Bank Transfer/UPI before we exit the meetup.</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexShrink: 0, minWidth: "220px", borderLeft: "1px dashed rgba(255,255,255,0.1)", paddingLeft: "24px" }} className="mandate-cta-col">
                <span style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "8px", textTransform: "uppercase", fontWeight: 700 }}>Slot Booking Available</span>
                <strong style={{ fontSize: "16px", color: "var(--color-orange)", display: "block", marginBottom: "16px", textAlign: "center", fontFamily: "var(--font-h)" }}>Book a Verified Agent Slot</strong>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20have%20reviewed%20the%20F2F%20Sell%20Guide%20and%20want%20to%20schedule%20a%20meetup."
                  target="_blank" rel="noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px", borderRadius: "8px",
                    background: "linear-gradient(135deg, var(--color-orange), var(--color-gold))",
                    color: "#000", fontFamily: "var(--font-h)", fontWeight: 700,
                    fontSize: "13px", border: "none", cursor: "pointer", letterSpacing: "0.5px",
                    textDecoration: "none", transition: "transform 0.2s"
                  }}
                  className="whatsapp-cta-btn">
                  <MessageCircle size={15} /> Book via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      

      <style>{`
        .back-btn:hover {
          color: #fff !important;
        }
        .step-card:hover {
          border-color: var(--color-orange) !important;
        }
        .city-select-item:hover {
          background: rgba(255,255,255,0.03);
        }
        @media (max-width: 991px) {
          .portal-grid {
            grid-template-columns: 1fr !important;
          }
          .mandate-flex {
            flex-direction: column !important;
          }
          .mandate-cta-col {
            border-left: none !important;
            border-top: 1px dashed rgba(255,255,255,0.1) !important;
            padding-left: 0 !important;
            padding-top: 24px !important;
            min-width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}
