/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, Navigation, Search, 
  BookOpen, Coins, ChevronDown, ChevronUp, AlertTriangle, Shield, Award, 
  MessageCircle, FileText, Check, Lock, CheckCircle, CreditCard, Clock, Info
} from "lucide-react";

interface CityCoords {
  x: number;
  y: number;
  name: string;
}

interface TransitCoords {
  customer: CityCoords;
  midpoint: CityCoords;
  base: CityCoords;
}

interface City {
  name: string;
  midpoint: string;
  distance: string;
  travelEach: string;
  safeLocation: string;
  transitCoords: TransitCoords;
}

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.46h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="currentColor"
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.38-.49 1.04-.74 4.07-1.77 6.79-2.93 8.16-3.5 3.89-1.61 4.7-1.89 5.23-1.9.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.16-.03.25z" />
  </svg>
);

export default function Exchange() {
  const [activeOption, setActiveOption] = useState<number>(0); // 0 = Exchange Upgrade, 1 = Exchange Downgrade
  const [activeTrustCard, setActiveTrustCard] = useState<number | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeUnlinkTab, setActiveUnlinkTab] = useState<number>(0); // 0 = Prep Checklist, 1 = Secure Rules, 2 = Guarantee

  // Midpoint Calculation Cities Database
  const cities: City[] = [
    { 
      name: "Vellore", 
      midpoint: "Kanchipuram", 
      distance: "~140 km Total (~70 km each)", 
      travelEach: "70 km",
      safeLocation: "GRT Regency, Gandhi Road / Kanchi Shopping Mall (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 25, y: 75, name: "Vellore" }, 
        midpoint: { x: 50, y: 55, name: "Kanchipuram" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Bangalore", 
      midpoint: "Vellore", 
      distance: "~300 km Total (~150 km each)", 
      travelEach: "150 km",
      safeLocation: "MGB Felicity Mall, NH-48 / SGR Highway Cafe (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 12, y: 85, name: "Bangalore" }, 
        midpoint: { x: 45, y: 65, name: "Vellore" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Coimbatore", 
      midpoint: "Salem", 
      distance: "~500 km Total (~250 km each)", 
      travelEach: "250 km",
      safeLocation: "ARRS Megamall, NH-44 / Sathyas Highway Inn (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 15, y: 92, name: "Coimbatore" }, 
        midpoint: { x: 48, y: 68, name: "Salem" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Madurai", 
      midpoint: "Trichy", 
      distance: "~460 km Total (~230 km each)", 
      travelEach: "230 km",
      safeLocation: "Feminina Shopping Mall, Cantonment / Sangam Restaurant (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 25, y: 95, name: "Madurai" }, 
        midpoint: { x: 52, y: 72, name: "Trichy" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Trichy", 
      midpoint: "Villupuram", 
      distance: "~330 km Total (~165 km each)", 
      travelEach: "165 km",
      safeLocation: "V-Mall, NH-45 / Highway Treat Rest House (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 38, y: 82, name: "Trichy" }, 
        midpoint: { x: 60, y: 60, name: "Villupuram" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Pondicherry", 
      midpoint: "Mahabalipuram", 
      distance: "~160 km Total (~80 km each)", 
      travelEach: "80 km",
      safeLocation: "Grande Cafe ECR / Radisson Blu Shoreline Checkpoint (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 62, y: 72, name: "Pondicherry" }, 
        midpoint: { x: 70, y: 55, name: "Mahabalipuram" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
    { 
      name: "Hyderabad", 
      midpoint: "Nellore", 
      distance: "~630 km Total (~315 km each)", 
      travelEach: "315 km",
      safeLocation: "MVR Mall, NH-16 / Highway Food Plaza Junction (CCTV Secure)", 
      transitCoords: { 
        customer: { x: 45, y: 15, name: "Hyderabad" }, 
        midpoint: { x: 68, y: 48, name: "Nellore" }, 
        base: { x: 80, y: 35, name: "Maddy Store Depot" } 
      } 
    },
  ];

  // Midpoint Map States
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]!);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const cardStyle = {
    background: "rgba(17, 21, 32, 0.45)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
    position: "relative" as const,
    overflow: "hidden" as const
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

  const chipStyle = (color: string) => ({
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "6px 14px", borderRadius: "30px",
    fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-h)",
    textTransform: "uppercase" as const, letterSpacing: "0.5px",
    cursor: "pointer", border: `1px solid ${color}`,
    color: color, background: `${color}14`,
    transition: "all 0.2s", textDecoration: "none"
  });

  // Steps data for Exchange Upgrade (Lower Value Trade-In)
  const exchangeUpgradeSteps = [
    {
      title: "Phase 1: Sourcing, Valuation & Deal Options",
      body: "Submit your current account walkthrough video and description for a formal evaluation. Our pricing specialists provide a transparent trade-in value quote. We then align on your deal mode preference: secure Online Transfer (immediate credentials handover and instant balance adjustment once logins are secured) or premium Face-to-Face Meetup (strictly reserved for trades valued above ₹80,000, requiring a 10% security deposit with all travel, stay, and food expenses borne by the customer).",
      idx_chip: "f2f"
    },
    {
      title: "Phase 2: KYC & Pre-Securing Custody",
      body: "Upon deal agreement, we collect valid government-issued ID proof (Aadhaar Card or Driving License) for our encrypted offline tracing database to guarantee zero cyber pullback or recovery issues. To ensure transaction integrity, Maddy Store always takes custody and secures the credentials of your old traded-in account first before target handover. Single active logins receive immediate handover, while dual/multiple logins require a 7-15 days unlinking cooldown window.",
      idx_chip: "kyc"
    },
    {
      title: "Phase 3: Finality & Balance Adjustment",
      body: "Once both accounts are fully bound and verified under new recovery options, the exchange is 100% final, irreversible, and non-refundable. Accounts cannot be returned or repurchased at a later price. The remaining balance (adjusted with your 10% booking deposit) is paid to complete the trade. Handovers are finalized strictly after all login verification cooldowns clear, ensuring both sides are fully satisfied.",
      idx_chip: "payout"
    }
  ];

  // Steps data for Exchange Downgrade (Higher Value Trade-In)
  const exchangeDowngradeSteps = [
    {
      title: "Phase 1: Valuation, Catalog & Deal Options",
      body: "Share your high-tier premium account details and a screen-recorded video walkthrough for a premium valuation. Select your lower-tier target account from our active catalog, and we calculate the exact surplus cash difference due to you. Choose online processing (immediate credential audit and surplus release once secured) or face-to-face meetups (strictly reserved for premium trades above ₹80,000, requiring a 10% security deposit with travel and stay expenses borne by the customer).",
      idx_chip: "f2f"
    },
    {
      title: "Phase 2: KYC & Old Custody Binding First",
      body: "We collect government-issued ID proof with address (Aadhaar Card or Driving License) along with live location for secure verification. Maddy BGMI Store always takes complete control and binds the credentials of your high-tier premium traded-in account first to guarantee absolute security. Single active login methods trigger immediate target account binding, while multiple active logins require a 7-15 days unlinking cooldown quarantine.",
      idx_chip: "kyc"
    },
    {
      title: "Phase 3: Target Handover & Surplus Cash Payout",
      body: "Once logins are fully secured, the target lower-spec account is securely bound to your personal recovery credentials, and the trade is 100% final, non-returnable, and permanent. We instantly release your surplus cash difference via instant UPI, Bank Transfer, or liquid Cash (for F2F deals) strictly after secure binding confirmation, completing the exchange only when both sides are 100% satisfied.",
      idx_chip: "payout"
    }
  ];

  const currentSteps = activeOption === 0 ? exchangeUpgradeSteps : exchangeDowngradeSteps;

  return (
    <>
      <div style={{ background: "var(--color-bg)", color: "#fff", minHeight: "100vh" }}>
        {/* HERO BANNER */}
        <section style={{
          position: "relative", width: "100%",
          minHeight: "80vh",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/exchange-banner.jpg"
            alt="BGMI Soldiers in visual exchange"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              filter: "brightness(0.55)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.95) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          <div style={{
            position: "relative", zIndex: 2, textAlign: "center",
            padding: "0 5%", maxWidth: "820px",
          }}>
            <div className="badge mb-5 animate-pulse">
              <RefreshCw size={14} /> Premium Trade-in Portal
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,72px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
            }} className="uppercase drop-shadow-2xl">
              Exchange Your BGMI Account<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">With Complete Security</span>
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
                className="btn btn-gold">
                <ArrowUpRight size={16} /> Exchange & Upgrade
              </button>
              <button 
                onClick={() => {
                  setActiveOption(1);
                  document.getElementById("exchange-options")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-outline"
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
                <ArrowDownRight size={16} /> Exchange & Downgrade
              </button>
            </div>
          </div>
        </section>

        {/* ESSENTIAL HANDOVER SPOTLIGHT */}
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
              marginBottom: "8px",
            }}>
              <ShieldCheck size={24} style={{ color: "#22c55e", filter: "drop-shadow(0 0 8px rgba(34,197,94,0.4))" }} />
              <h2 style={{
                fontFamily: "var(--font-h)",
                fontSize: "clamp(20px, 3vw, 24px)",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                margin: 0,
                color: "#fff"
              }}>
                Essential Exchange Handover Protocols
              </h2>
            </div>
            <p style={{ color: "var(--color-muted)", fontSize: "13px", marginBottom: "28px", paddingLeft: "36px" }}>
              Every exchange transaction — Upgrade Sourcing or Downgrade Cashout — follows these strict safety protocols. Click any rule to learn more.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "28px"
            }}>
              {[
                {
                  num: "01", title: "Old Account Pre-Securing", color: "var(--color-orange)",
                  body: "Maddy BGMI Store always takes custody and secures the logins of your traded-in account first before finalizing the target account handover to guarantee absolute credential integrity.",
                  chip: "F2F Sell Guide", path: "/guides/f2f-sell-guide", chipColor: "var(--color-orange)"
                },
                {
                  num: "02", title: "Mutual Escrow Middleman", color: "#60a5fa",
                  body: "The exchange occurs through a verified Maddy Store middleman, streamer, or YouTuber who physically holds and audits both accounts before the synchronized release. No party swaps blind.",
                  chip: "Escrow Guide", path: "/escrow-deal", chipColor: "#60a5fa"
                },
                {
                  num: "03", title: "Mandatory ID & KYC", color: "#4ade80",
                  body: "Before final balance releases or handovers, we collect valid government-issued ID proofs with address (Aadhaar Card or DL) and live location. Stored in secure offline databases.",
                  chip: "KYC Guide", path: "/guides/kyc", chipColor: "#4ade80"
                },
                {
                  num: "04", title: "Dual Satisfaction", color: "var(--color-gold)",
                  body: "Our premium account trade transition is officially complete only once both sides are fully satisfied with the new credentials, recovery links, and adjusted payout balances.",
                  chip: "Payout Guide", path: "/guides/payout", chipColor: "var(--color-gold)"
                },
                {
                  num: "05", title: "No Returns After Handover", color: "#ef4444",
                  body: "Once credentials have been successfully transferred and payment or target account is delivered, the deal is 100% final. Accounts cannot be returned or resold back to us.",
                  chip: "Finality Policy", path: "/no-returns-policy", chipColor: "#ef4444"
                },
                {
                  num: "06", title: "Personal Logins", color: "#e2e2e2",
                  body: "Primary game logins go to Maddy Store, while personal connections (Facebook, personal Gmail) remain yours. A strict 7-to-15 day unlinking cooldown guarantees safe detachment.",
                  chip: "Unlinking Guide", path: "/unlinking-guide", chipColor: "#e2e2e2"
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
                    <span style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6", display: "block", marginBottom: "10px" }}>{rule.body}</span>
                    <Link
                      href={rule.path}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: rule.chipColor, background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-h)", letterSpacing: "0.5px", textTransform: "uppercase", padding: 0, textDecoration: "none" }}>
                      <BookOpen size={12} /> {rule.chip} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPTIONS GRID SECTION */}
        <section id="exchange-options" className="py-20 px-[5%]" style={{ background: "radial-gradient(circle at bottom, rgba(255,215,0,0.015), transparent)" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="badge mb-3">Trade-in Portals</span>
            <h2 className="text-3xl sm:text-5xl font-black font-h uppercase tracking-wide text-white">Two Curated Ways to Exchange <span className="g">Your Account</span></h2>
            <p className="text-muted max-w-[600px] mx-auto mt-4 text-sm sm:text-base">
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
                  {exchangeUpgradeSteps.map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-blue">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                        {step.idx_chip === "f2f" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); document.getElementById("midpoint-map-portal")?.scrollIntoView({ behavior: "smooth" }); }}
                              style={chipStyle("var(--color-orange)")}>
                              <Navigation size={10} /> Midpoint Map Portal
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "kyc" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); document.getElementById("education-hub")?.scrollIntoView({ behavior: "smooth" }); }}
                              style={chipStyle("#22c55e")}>
                              <FileText size={10} /> KYC & Unlink Hub
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "payout" && (
                          <div style={{ marginTop: "8px" }}>
                            <Link href="/guides/payout" onClick={(e) => e.stopPropagation()}
                              style={chipStyle("var(--color-gold)")}>
                              <Coins size={10} /> Payout Guide
                            </Link>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Upgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn" style={{ width: "100%", height: "48px", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#000", border: "none", fontWeight: 800 }} onClick={(e) => e.stopPropagation()}>
                  <WhatsAppIcon size={16} /> Request Upgrade on WhatsApp
                </a>
                <a href="https://t.me/MBSxMADDY17?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Upgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn" style={{ width: "100%", height: "48px", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #229ED9, #0088cc)", color: "#000", border: "none", fontWeight: 800 }} onClick={(e) => e.stopPropagation()}>
                  <TelegramIcon size={16} /> Request Upgrade on Telegram
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
                  {exchangeDowngradeSteps.map((step, idx) => (
                    <li key={idx} className="step-item-custom">
                      <span className="step-num step-num-green">{idx + 1}</span>
                      <div>
                        <strong className="step-title">{step.title}</strong>
                        <span className="step-body">{step.body}</span>
                        {step.idx_chip === "f2f" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); document.getElementById("midpoint-map-portal")?.scrollIntoView({ behavior: "smooth" }); }}
                              style={chipStyle("var(--color-orange)")}>
                              <Navigation size={10} /> Midpoint Map Portal
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "kyc" && (
                          <div style={{ marginTop: "8px" }}>
                            <button onClick={(e) => { e.stopPropagation(); document.getElementById("education-hub")?.scrollIntoView({ behavior: "smooth" }); }}
                              style={chipStyle("#22c55e")}>
                              <FileText size={10} /> KYC & Unlink Hub
                            </button>
                          </div>
                        )}
                        {step.idx_chip === "payout" && (
                          <div style={{ marginTop: "8px" }}>
                            <Link href="/guides/payout" onClick={(e) => e.stopPropagation()}
                              style={chipStyle("var(--color-gold)")}>
                              <Coins size={10} /> Payout Guide
                            </Link>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cta-container" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Downgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn" style={{ width: "100%", height: "48px", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#000", border: "none", fontWeight: 800 }} onClick={(e) => e.stopPropagation()}>
                  <WhatsAppIcon size={16} /> Request Downgrade on WhatsApp
                </a>
                <a href="https://t.me/MBSxMADDY17?text=Hi%20Maddy!%20I%20want%20to%20do%20an%20Exchange%20Downgrade%20of%20my%20BGMI%20account." target="_blank" rel="noreferrer" className="btn" style={{ width: "100%", height: "48px", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #229ED9, #0088cc)", color: "#000", border: "none", fontWeight: 800 }} onClick={(e) => e.stopPropagation()}>
                  <TelegramIcon size={16} /> Request Downgrade on Telegram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE TIMELINE ROADMAP */}
        <section className="py-20 px-[5%]" style={{ background: "rgba(10, 13, 20, 0.4)", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="badge mb-3">Interactive Pathway</span>
            <h2 className="text-3xl sm:text-5xl font-black font-h uppercase tracking-wide text-white">Visual Exchange <span className="g">Timeline</span></h2>
            <p className="text-muted max-w-[600px] mx-auto mt-4 text-sm sm:text-base">
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
                  color: activeOption === 0 ? "#60a5fa" : "var(--color-muted)",
                  fontFamily: "var(--font-h)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.25s"
                }}
              >
                <ArrowUpRight size={14} /> Exchange & Upgrade
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
                  color: activeOption === 1 ? "#4ade80" : "var(--color-muted)",
                  fontFamily: "var(--font-h)",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.25s"
                }}
              >
                <ArrowDownRight size={14} /> Exchange & Downgrade
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
                    {idx === 0 ? <MessageCircle size={18} /> : idx === 1 ? <FileText size={18} /> : <ShieldCheck size={18} />}
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
                    color: "var(--color-muted)",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    margin: 0
                  }}>
                    {step.body}
                  </p>

                  {/* Custom conditional timeline badges */}
                  {idx === 0 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode yellow-border"><Lock size={11} /> 10% Booking deposit (Upgrades)</span>
                      <span className="pill-deal-mode"><Navigation size={11} /> Face-to-Face or Online options</span>
                    </div>
                  )}

                  {idx === 1 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode red-border"><AlertTriangle size={11} /> Pre-Securing: Old account secured first</span>
                      <span className="pill-deal-mode green-border"><Check size={11} /> Aadhaar or Driving License KYC</span>
                    </div>
                  )}

                  {idx === 2 && (
                    <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                      <span className="pill-deal-mode green-border"><CheckCircle size={11} /> 100% Satisfied Trade Guarantee</span>
                      <span className="pill-deal-mode gold-border"><CreditCard size={11} /> UPI, Bank, or Cash Payouts</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MIDPOINT MAP PORTAL */}
        <section id="midpoint-map-portal" className="py-20 px-[5%]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="badge mb-3">Face-to-Face Portal</span>
            <h2 className="text-3xl sm:text-5xl font-black font-h uppercase tracking-wide text-white">F2F Coordinate <span className="g">Midpoint Map</span></h2>
            <p className="text-muted max-w-[600px] mx-auto mt-4 text-sm sm:text-base">
              Calculate the perfect equal-distance midpoint for your in-person trade. Meet securely at pre-vetted, CCTV-monitored public mall hubs in South India.
            </p>
          </div>

          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "30px",
              alignItems: "start"
            }}>
              
              {/* COLUMN 1: City Search & Safe Checkpoints */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={cardStyle}>
                  <div style={glowStyle} />
                  
                  <h3 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", color: "#fff" }}>
                    <Navigation size={18} style={{ color: "var(--color-gold)" }} /> Midpoint Map Portal
                  </h3>
                  <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6", marginBottom: "22px" }}>
                    All face-to-face exchanges are conducted strictly in South India (Tamil Nadu, Kerala, Andhra Pradesh, Karnataka). The seller/depot location is always Chennai. Enter your location below to compute the equal-travel midpoint.
                  </p>

                  {/* Dropdown Input Area */}
                  <div style={{ position: "relative", zIndex: 10 }} ref={dropdownRef}>
                    <label style={{ display: "block", color: "var(--color-muted)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                      Enter Your City Location
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
                        borderRadius: "10px", overflowY: "auto", maxHeight: "220px", boxShadow: "0 10px 30px rgba(0,0,0,0.6)"
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
                            >
                              <span>{city.name}</span>
                              <span style={{ fontSize: "11px", color: "var(--color-muted)" }}>Midpoint: {city.midpoint}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: "12px 16px", color: "var(--color-muted)", fontSize: "13px" }}>
                            No vended cities found. Midpoint coordinates calculated manually upon custom booking.
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
                        <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Client Travel</span>
                        <strong style={{ fontSize: "13px", color: "var(--color-gold)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                      </div>
                      <div style={{ textAlign: "center", borderLeft: "1px dashed rgba(255,255,255,0.1)" }}>
                        <span style={{ display: "block", fontSize: "9px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700 }}>Maddy Agent Travel</span>
                        <strong style={{ fontSize: "13px", color: "var(--color-gold)", display: "block", marginTop: "2px" }}>~{selectedCity.travelEach}</strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <span style={{ display: "block", fontSize: "10px", color: "var(--color-muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>Pre-Vetted CCTV Checkpoint</span>
                      <span style={{ fontSize: "12.5px", color: "var(--color-gold)", fontWeight: 600 }}>{selectedCity.safeLocation}</span>
                    </div>

                    <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", borderTop: "1px dashed rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                      <CheckCircle size={12} /> Balanced Transit Guarantee: 100% Equal travel distance for both parties!
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
                    Safety First Coordinate Protocol: <strong style={{ color: "var(--color-orange)" }}>“Private, dark, or isolated coordinates are strictly avoided.”</strong> Only premium, highly public CCTV-secured spots are eligible.
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
                      {/* Client Node -> Midpoint */}
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
                      {/* Client Node */}
                      <circle 
                        cx={`${selectedCity.transitCoords.customer.x}%`} 
                        cy={`${selectedCity.transitCoords.customer.y}%`} 
                        r="7" 
                        fill="#3b82f6" 
                        stroke="#fff" 
                        strokeWidth="1.5"
                      />
                      
                      {/* Midpoint Node */}
                      <circle 
                        cx={`${selectedCity.transitCoords.midpoint.x}%`} 
                        cy={`${selectedCity.transitCoords.midpoint.y}%`} 
                        r="9" 
                        fill="var(--color-orange)" 
                        stroke="#fff" 
                        strokeWidth="2"
                      />

                      {/* Base Node */}
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
                      👤 Client: {selectedCity.name}
                    </div>

                    <div style={{ position: "absolute", left: `${selectedCity.transitCoords.midpoint.x}%`, top: `${selectedCity.transitCoords.midpoint.y - 14}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(255,215,0,0.9)", border: "1px solid #fff", borderRadius: "4px", padding: "3px 8px", fontSize: "10px", fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>
                      📍 Midpoint: {selectedCity.midpoint}
                    </div>

                    <div style={{ position: "absolute", left: `${selectedCity.transitCoords.base.x}%`, top: `${selectedCity.transitCoords.base.y - 12}%`, transform: "translateX(-50%)", zIndex: 2, background: "rgba(17,21,32,0.8)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: "4px", padding: "2px 6px", fontSize: "10px", fontWeight: 700, color: "var(--color-gold)", whiteSpace: "nowrap" }}>
                      🔒 Chennai Depot
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
                      "High-Footfall Public Spaces: Premium shopping malls, airport cafes, or star hotels are used exclusively.",
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

        {/* EXPENSE RESPONSIBILITY & VALUATION RULES */}
        <section style={{ padding: "60px 5% 80px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="badge mb-3">Financial Overhead</span>
              <h2 className="text-2xl sm:text-4xl font-black font-h uppercase text-white">Travel Expenses & F2F Rules</h2>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg, var(--color-gold), var(--color-orange))", margin: "12px auto" }} />
            </div>

            <div style={{ 
              background: "radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.03) 0%, transparent 60%), #131722",
              border: "1px solid var(--color-border-gold)",
              borderRadius: "20px",
              padding: "35px",
              boxShadow: "0 15px 45px rgba(0,0,0,0.3)"
            }}>
              <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "14.5px", lineHeight: 1.7, marginBottom: "20px" }}>
                Face-to-Face transactions mandate travel logistics and physical deployment of our verification coordinators. Because this premium service is tailored strictly to buyer/seller preference, **all associated meetup expenses (travel, stay, and food) are borne entirely by the customer.**
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckCircle size={16} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.5 }}>
                    <strong>₹80,000 Minimum Value Limit:</strong> In-person meetings are strictly reserved for premium high-value account trades exceeding ₹80,000. All trades below this value are processed securely through our verified digital escrow system.
                  </span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <CheckCircle size={16} style={{ color: "var(--color-gold)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.5 }}>
                    <strong>10% Security Deposit:</strong> A mandatory booking deposit (10% of the account value) is required before deploying agents to the calculated midpoint to prevent no-shows or last-minute cancellations.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY TRUST MADDY STORE */}
        <section className="py-20 px-[5%]">
          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", fontSize: "clamp(26px,4vw,38px)", marginBottom: "32px", fontFamily: "var(--font-h)" }} className="uppercase font-black text-white">
            <Award size={28} style={{ color: "var(--color-gold)" }} /> Why Trust <span className="g">Maddy Store?</span>
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

        </section>

        {/* HANDOVER & UNLINK EDUCATION HUB */}
        <section id="education-hub" className="py-20 px-[5%]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge mb-3">Trust & Security</span>
            <h2 className="text-3xl sm:text-5xl font-black font-h uppercase text-white">How Account Handover & <span className="g">Unlinks Work</span></h2>
            <p className="text-muted max-w-[600px] mx-auto mt-4 text-sm sm:text-base">
              Exchanging with Maddy Store is clear, transparent, and secure. Understand how we verify accounts, initiate unlinking, and guarantee safe payout release.
            </p>
          </div>

          <div style={{
            maxWidth: "1000px",
            margin: "0 auto",
            background: "rgba(14, 17, 24, 0.7)",
            border: "1px solid var(--color-border-gold)",
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
                  color: "var(--color-muted)",
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
                      color: isActive ? "#4ade80" : "var(--color-muted)",
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
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
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
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
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
                      <small style={{ color: "var(--color-muted)", display: "block" }}>UNLINK INITIATION</small>
                      <strong style={{ color: "var(--color-gold)", fontSize: "16px" }}>Immediate Lock</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--color-muted)", marginTop: "4px" }}>We submit the unlink request in-game using the secondary link.</span>
                    </div>
                    <div>
                      <small style={{ color: "var(--color-muted)", display: "block" }}>7-DAY COOLDOWN PERIOD</small>
                      <strong style={{ color: "#22c55e", fontSize: "16px" }}>No Logging In</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "var(--color-muted)", marginTop: "4px" }}>Seller must strictly not access the account via the unlinking method, or it cancels the request.</span>
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
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                  We prioritize seller trust just as much as buyer security. Review how we protect you and execute secure payouts:
                </p>
                <ul style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.8", paddingLeft: "20px", marginBottom: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong style={{ color: "#fff" }}>Secure KYC Encrypted Storage:</strong> Your government ID with address mentioned on it (specifically Aadhaar Card or Driving License) is saved on fully secure, encrypted servers, and is only accessed in the event of an account dispute.</li>
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
                  <AlertTriangle size={20} style={{ color: "var(--color-red)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "#fff" }}>
                    <strong>Crucial Security Notice:</strong> Any attempt to illegally retrieve or pull back the account post-sale is a direct offense. We cooperate fully with cyber crime departments and release all KYC records to pursue legal action.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20 px-[5%]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge mb-3">FAQ</span>
            <h2 className="text-3xl sm:text-5xl font-black font-h uppercase text-white">Common Exchange Questions</h2>
            <p className="text-muted max-w-[600px] mx-auto mt-4 text-sm sm:text-base">
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
                a: "Absolutely. Trades can be adjusted through 10% booking/advance deposits (which are strictly non-refundable once booked, to search for custom specs under Upgrades) or direct cash. Final balances or cash differences are fully settled before delivering new account structures."
              },
              {
                q: "What happens if there is a price difference between the two accounts?",
                a: "Under an Exchange Upgrade (your account has lower value), you pay the remaining balance to us once we find the target account. Under an Exchange Downgrade (your account has higher value), we secure your old account, provide the lower-tier account, and pay you the surplus difference cash."
              },
              {
                q: "Why is the collection of valid ID proof mandatory?",
                a: "To prevent recovery fraud (cyber pull-backs), we collect valid government ID proof with address mentioned on it (specifically Aadhaar Card or Driving License) from both exchange participants. All KYC records are stored securely on offline encrypted servers."
              },
              {
                q: "Can we execute an account exchange Face-to-Face?",
                a: "Yes. Face-to-Face cash exchange meetups are strictly reserved for premium trades valued above ₹80,000. For Face-to-Face exchanges, the Owner / Buyer should pay the extra charges for Travel, Stay, and Food for the Maddy Store deal agent. All trades below ₹80K are handled securely through our encrypted online escrow system."
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
                  className={`rounded-xl border overflow-hidden transition-all duration-300 ${isOpen ? "border-yellow-500/30 bg-[#080a0e]" : "border-white/5 bg-[#111520] hover:border-white/10"}`}
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 bg-transparent border-none text-left cursor-pointer"
                  >
                    <strong className={`text-sm font-bold tracking-wide ${isOpen ? "text-yellow-400" : "text-white"}`}>{faq.q}</strong>
                    {isOpen ? <ChevronUp size={16} className="text-yellow-500 shrink-0 ml-4" /> : <ChevronDown size={16} className="text-muted shrink-0 ml-4" />}
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="p-5 pt-0 text-muted text-xs leading-relaxed border-t border-white/5 mx-5 mt-2">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

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
          color: var(--color-muted);
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
        .step-num-green { background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80; }
        
        .step-title {
          color: #fff;
          font-size: 13px;
          display: block;
          margin-bottom: 3px;
          font-weight: 600;
        }
        
        .step-body {
          color: var(--color-muted);
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
          color: var(--color-muted);
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
          font-size: 10px;
          font-weight: 700;
          color: var(--color-muted);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 10px;
          border-radius: 4px;
          font-family: var(--font-h);
          text-transform: uppercase;
        }
        
        .pill-deal-mode.yellow-border {
          border-color: rgba(255, 215, 0, 0.3);
          color: var(--color-gold);
          background: rgba(255, 215, 0, 0.02);
        }
        
        .pill-deal-mode.red-border {
          border-color: rgba(239, 68, 68, 0.3);
          color: var(--color-red);
          background: rgba(239, 68, 68, 0.02);
        }
        
        .pill-deal-mode.green-border {
          border-color: rgba(34, 197, 94, 0.3);
          color: var(--color-green);
          background: rgba(34, 197, 94, 0.02);
        }

        .pill-deal-mode.gold-border {
          border-color: rgba(255, 215, 0, 0.3);
          color: var(--color-gold);
          background: rgba(255, 215, 0, 0.02);
        }
      `}</style>
    </>
  );
}
