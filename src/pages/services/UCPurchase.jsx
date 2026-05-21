import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useSEO from "../../hooks/useSEO";
import { 
  MessageCircle, Send, Loader2, Clock, Shield, LogIn, 
  Gamepad2, AlertTriangle, CheckCircle, Zap, Banknote, 
  Lock, ArrowUpRight, ArrowRight, Award, HelpCircle
} from "lucide-react";
import { supabase } from "../../utils/supabase";

// ── UC Image Icon ────────────────────────────────────────────
const UcImg = ({ size = 28, style = {} }) => (
  <img
    src="/UC.png"
    alt="UC"
    width={size}
    height={size}
    style={{ objectFit: "contain", display: "inline-block", verticalAlign: "middle", ...style }}
  />
);

// ── Method Procedures ─────────────────────────────────────────
const VIEW_LOGIN_STEPS = [
  {
    title: "Request Sourcing",
    body: "Contact us via WhatsApp or Telegram and specify your desired UC Sourcing Pack.",
    icon: <MessageCircle size={16} />
  },
  {
    title: "Secure Payment",
    body: "Complete your transaction securely via UPI, Bank Transfer, or liquid Cash.",
    icon: <Banknote size={16} />
  },
  {
    title: "Credential Custody",
    body: "Provide Facebook or X (Twitter) credentials. Logins are encrypted and deleted immediately after transfer.",
    icon: <Lock size={16} />
  },
  {
    title: "Official Injection",
    body: "We log in, purchase the UC officially in-game, and immediately log out without touching settings.",
    icon: <Shield size={16} />
  },
  {
    title: "Sourcing Confirmation",
    body: "You receive a confirmation message. Safe delivery timeframe: 6 to 24 hours.",
    icon: <CheckCircle size={16} />
  }
];

const CHAR_ID_STEPS = [
  {
    title: "Request Sourcing",
    body: "Message our specialists on WhatsApp or Telegram with your selected UC Pack.",
    icon: <MessageCircle size={16} />
  },
  {
    title: "Secure Payment",
    body: "Clear the balance via UPI, Bank Transfer, or accepted payment assets.",
    icon: <Banknote size={16} />
  },
  {
    title: "Share Character ID",
    body: "Provide your in-game Character ID. Absolutely no credentials required — 100% secure.",
    icon: <Gamepad2 size={16} />
  },
  {
    title: "Direct Transmission",
    body: "We verify the Character ID and transmit UC directly to your inbox. Delivery is often instant.",
    icon: <Zap size={16} />
  },
  {
    title: "Sourcing Confirmation",
    body: "We send you the receipt. Official delivery timeframe: 6 to 12 hours (often much faster).",
    icon: <CheckCircle size={16} />
  }
];

// ── Pack Card Component ──────────────────────────────────────
function UcPackCard({ pack, accentColor, glowClass, contactPrefix }) {
  const isSoldOut = pack.status === "sold_out";
  const waText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} UC pack via ${contactPrefix}. Please guide me.`);
  const tgText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} UC pack via ${contactPrefix}. Please guide me.`);
  const savePercent = pack.market_price > 0 ? Math.round((1 - pack.offer_price / pack.market_price) * 100) : 0;

  return (
    <div 
      className={`uc-pack-card ${isSoldOut ? "sold-out" : glowClass}`}
      style={{
        background: "rgba(17, 21, 32, 0.45)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        padding: "26px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)"
      }}
    >
      {/* Sold Out Ribbon */}
      {isSoldOut && (
        <div style={{
          position: "absolute", top: "18px", left: "-36px",
          background: "var(--red)", color: "#fff",
          padding: "6px 44px", transform: "rotate(-45deg)",
          fontSize: "11px", fontWeight: 900, zIndex: 5,
          letterSpacing: "1px", fontFamily: "var(--font-h)"
        }}>
          SOLD OUT
        </div>
      )}

      {/* Offer Tag Badge */}
      {!isSoldOut && savePercent > 0 && (
        <div style={{
          position: "absolute",
          top: "16px",
          left: "20px",
          background: "rgba(74, 222, 128, 0.12)",
          border: "1px solid rgba(74, 222, 128, 0.3)",
          color: "#4ade80",
          fontSize: "10px",
          fontWeight: 800,
          fontFamily: "var(--font-h)",
          padding: "3px 10px",
          borderRadius: "6px",
          letterSpacing: "0.5px"
        }}>
          SAVE {savePercent}% OFFER
        </div>
      )}

      {/* UC Icon */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 10px rgba(255, 215, 0, 0.04)"
        }}>
          <UcImg size={32} />
        </div>
      </div>

      {/* UC Volume */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "36px",
          fontWeight: 900,
          fontFamily: "var(--font-h)",
          lineHeight: 1.1,
          color: "#fff",
          display: "flex",
          alignItems: "baseline",
          gap: "6px"
        }}>
          {pack.uc_amount}
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px" }}>UC</span>
        </div>
        {pack.bonus_uc > 0 && (
          <div style={{
            color: "var(--gold)",
            fontWeight: 700,
            fontSize: "13px",
            marginTop: "6px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(255, 215, 0, 0.06)",
            border: "1px solid rgba(255, 215, 0, 0.15)",
            padding: "2px 10px",
            borderRadius: "6px"
          }}>
            <UcImg size={12} /> + {pack.bonus_uc} Bonus UC Included
          </div>
        )}
      </div>

      {/* Pricing Row */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        marginBottom: "28px",
        marginTop: "auto"
      }}>
        <span style={{
          fontSize: "30px",
          fontWeight: 900,
          color: "var(--gold)",
          textShadow: "0 2px 15px rgba(255,215,0,0.15)",
          fontFamily: "var(--font-h)"
        }}>
          ₹{Number(pack.offer_price).toLocaleString("en-IN")}
        </span>
        <span style={{
          fontSize: "15px",
          color: "var(--muted)",
          textDecoration: "line-through",
          fontFamily: "var(--font-h)"
        }}>
          ₹{Number(pack.market_price).toLocaleString("en-IN")}
        </span>
      </div>

      {/* CTA Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <a
          href={isSoldOut ? undefined : `https://wa.me/+919025391516?text=${waText}`}
          target={isSoldOut ? undefined : "_blank"}
          rel="noreferrer"
          className="wa-btn-custom"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            padding: "12px",
            borderRadius: "10px",
            background: isSoldOut ? "rgba(255,255,255,0.03)" : "#25D366",
            color: isSoldOut ? "var(--muted)" : "#fff",
            fontWeight: 700,
            fontSize: "12.5px",
            fontFamily: "var(--font-h)",
            letterSpacing: "0.5px",
            textDecoration: "none",
            pointerEvents: isSoldOut ? "none" : "auto",
            transition: "transform 0.2s"
          }}
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <a
          href={isSoldOut ? undefined : `https://t.me/MBSxMADDY17?text=${tgText}`}
          target={isSoldOut ? undefined : "_blank"}
          rel="noreferrer"
          className="tg-btn-custom"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            padding: "12px",
            borderRadius: "10px",
            background: isSoldOut ? "rgba(255,255,255,0.03)" : "#0088cc",
            color: isSoldOut ? "var(--muted)" : "#fff",
            fontWeight: 700,
            fontSize: "12.5px",
            fontFamily: "var(--font-h)",
            letterSpacing: "0.5px",
            textDecoration: "none",
            pointerEvents: isSoldOut ? "none" : "auto",
            transition: "transform 0.2s"
          }}
        >
          <Send size={14} /> Telegram
        </a>
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────
export default function UCPurchase() {
  useSEO(
    "Buy BGMI UC — Instant Sourcing & Cheap Packs",
    "Cheap Unknown Cash (UC) recharges credited directly to your Character ID or secure login. 100% safe & official in-game purchase."
  );
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState("view_login");

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data } = await supabase
          .from("uc_prices")
          .select("*")
          .order("offer_price", { ascending: true });
        setPacks(data || []);
      } catch (err) {
        console.error("Error fetching UC packs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const viewLoginPacks = packs.filter(p => !p.method || p.method === "view_login");
  const charIdPacks = packs.filter(p => p.method === "character_id");

  const isViewLogin = activeMethod === "view_login";
  const activePacks = isViewLogin ? viewLoginPacks : charIdPacks;
  
  // Custom design tokens based on active method selection
  const accentColor = isViewLogin ? "#3b82f6" : "#f97316";
  const glowClass = isViewLogin ? "glow-blue" : "glow-orange";
  const activeHeaderName = isViewLogin ? "View Login UC Sourcing" : "Character ID Direct UC";
  const deliveryRange = isViewLogin ? "6–24 Hours Guaranteed" : "6–12 Hours Direct Delivery";
  const currentSteps = isViewLogin ? VIEW_LOGIN_STEPS : CHAR_ID_STEPS;
  const contactPrefix = isViewLogin ? "View Login Sourcing" : "Character ID Direct";

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative",
          width: "100%",
          padding: "70px 5% 50px",
          textAlign: "center",
          overflow: "hidden"
        }}>
          {/* Radial visual glows */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.035) 0%, transparent 65%)",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", width: "400px", height: "400px",
            background: `radial-gradient(circle, ${isViewLogin ? "rgba(59,130,246,0.06)" : "rgba(249,115,22,0.06)"} 0%, transparent 70%)`,
            top: "-150px", left: "calc(50% - 200px)", pointerEvents: "none"
          }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="badge animate-pulse" style={{ marginBottom: "18px" }}>
              <UcImg size={14} style={{ marginRight: "6px" }} /> Instant BGMI UC Sourcing
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,5.5vw,68px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "16px"
            }}>
              Premium UC Sourcing <br />
              <span className="g">Cheaper & Faster</span>
            </h1>
            <p style={{
              color: "var(--muted)", fontSize: "clamp(14px,1.8vw,17px)",
              maxWidth: "640px", margin: "0 auto 35px", lineHeight: 1.6
            }}>
              South India's most trusted premium BGMI UC outlet. Choose your preferred safe transaction method below to see live sourcing stock packs.
            </p>

            {/* METHOD SELECTION CARDS (GRID) */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              maxWidth: "800px",
              margin: "0 auto 10px",
              alignItems: "stretch"
            }}>
              {/* Option 1: View Login */}
              <div 
                onClick={() => setActiveMethod("view_login")}
                className={`method-switch-card ${isViewLogin ? "active-blue" : ""}`}
                style={{
                  background: "rgba(17, 21, 32, 0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#60a5fa"
                  }}>
                    <LogIn size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-h)", color: "#fff" }}>
                      View Login UC
                    </h3>
                    <span style={{ fontSize: "11px", color: "#60a5fa", fontWeight: 600 }}>Social Credentials Sourcing</span>
                  </div>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
                  We log in via Facebook or X to add the UC pack directly. 100% official in-game store billing with absolute data privacy.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "14px", fontSize: "11px", color: "var(--muted)" }}>
                  <Clock size={12} /> Delivery timeframe: 6-24 Hours
                </div>
              </div>

              {/* Option 2: Character ID */}
              <div 
                onClick={() => setActiveMethod("character_id")}
                className={`method-switch-card ${!isViewLogin ? "active-orange" : ""}`}
                style={{
                  background: "rgba(17, 21, 32, 0.4)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "20px",
                  padding: "24px",
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#f97316"
                  }}>
                    <Gamepad2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-h)", color: "#fff" }}>
                      Character ID UC
                    </h3>
                    <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600 }}>100% ID-Only Direct Transmission</span>
                  </div>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: "1.5", margin: 0 }}>
                  Simply share your in-game Character ID. No account logins or passwords required. Completely risk-free.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "14px", fontSize: "11px", color: "var(--muted)" }}>
                  <Clock size={12} /> Delivery timeframe: 6-12 Hours
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARKET FLUCTUATION NOTICE ────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto 35px", padding: "0 5%" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(251, 191, 36, 0.04) 0%, rgba(251, 191, 36, 0.01) 100%)",
            border: "1px dashed rgba(251, 191, 36, 0.3)",
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "rgba(251, 191, 36, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}>
              <AlertTriangle size={18} style={{ color: "#fbbf24" }} />
            </div>
            <div>
              <strong style={{ color: "#fff", display: "block", fontSize: "13.5px", fontFamily: "var(--font-h)", letterSpacing: "0.5px", marginBottom: "3px" }}>
                Real-Time Sourcing Pricing Notice
              </strong>
              <span style={{ color: "var(--muted)", fontSize: "12.5px", lineHeight: "1.5", display: "block" }}>
                UC prices are subject to frequent shifts due to global BGMI stock fluctuations. Sourcing quotes shown reflect current live bargains. Contact our support specialists directly on chat to verify the latest catalog prices.
              </span>
            </div>
          </div>
        </div>

        {/* ── METHOD DELIVERY TIMELINE ──────────────────────── */}
        <section style={{ padding: "0 5% 50px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              background: "rgba(14, 17, 24, 0.6)",
              border: `1px solid ${accentColor}33`,
              borderRadius: "24px",
              boxShadow: `0 15px 45px ${accentColor}08`,
              overflow: "hidden",
              transition: "border-color 0.4s ease"
            }}>
              {/* Header block */}
              <div style={{
                padding: "24px 30px",
                background: `linear-gradient(135deg, ${accentColor}0f, transparent)`,
                borderBottom: `1px solid ${accentColor}1a`,
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap"
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                  boxShadow: `0 4px 15px ${accentColor}35`,
                  flexShrink: 0
                }}>
                  {isViewLogin ? <LogIn size={20} /> : <Gamepad2 size={20} />}
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: accentColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    Verified Operational Steps
                  </span>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, fontFamily: "var(--font-h)", color: "#fff" }}>
                    {activeHeaderName} Handbook
                  </h2>
                </div>
                <div style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}25`,
                  padding: "6px 14px",
                  borderRadius: "20px"
                }}>
                  <Clock size={13} style={{ color: accentColor }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor, fontFamily: "var(--font-h)" }}>
                    {deliveryRange}
                  </span>
                </div>
              </div>

              {/* Sourcing Timeline Grid */}
              <div style={{
                padding: "30px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "25px"
              }}>
                {currentSteps.map((step, idx) => (
                  <div key={idx} style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    {/* Glowing circular node indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        background: `${accentColor}15`,
                        border: `1.5px solid ${accentColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 900, color: "#fff",
                        fontFamily: "var(--font-h)",
                        boxShadow: `0 0 10px ${accentColor}30`,
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{
                        width: "100%",
                        height: "1px",
                        background: `linear-gradient(to right, ${accentColor}33, transparent)`,
                        display: idx === currentSteps.length - 1 ? "none" : "block"
                      }} />
                    </div>
                    {/* Step copy content */}
                    <div>
                      <strong style={{
                        color: "#fff", display: "block", fontSize: "14px",
                        marginBottom: "4px", fontFamily: "var(--font-h)",
                        letterSpacing: "0.5px"
                      }}>
                        {step.title}
                      </strong>
                      <span style={{ color: "var(--muted)", fontSize: "12px", lineHeight: "1.6", display: "block" }}>
                        {step.body}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra specifications cards */}
              <div style={{
                padding: "0 30px 30px"
              }}>
                {isViewLogin ? (
                  <div style={{
                    background: "rgba(59, 130, 246, 0.03)",
                    border: "1px solid rgba(59, 130, 246, 0.15)",
                    borderRadius: "14px",
                    padding: "16px 20px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#60a5fa", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-h)" }}>
                      <Shield size={14} /> Accepted Sourcing Links
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["Facebook Networks", "X Accounts (Twitter)"].map(m => (
                        <span key={m} style={{
                          fontSize: "11px", padding: "4px 12px", borderRadius: "20px",
                          background: "rgba(59, 130, 246, 0.08)",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          color: "#93c5fd", fontWeight: 600, fontFamily: "var(--font-h)"
                        }}>{m}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: "rgba(249, 115, 22, 0.03)",
                    border: "1px solid rgba(249, 115, 22, 0.15)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#fdba74",
                    fontSize: "12.5px"
                  }}>
                    <CheckCircle size={15} style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Absolute Privacy:</strong> Zero credential sharing required. The fastest and safest transmission channel available.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── UC PACKS SHOWCASE GRID ──────────────────────── */}
        <section className="section" style={{
          padding: "20px 5% 80px",
          background: "radial-gradient(circle at center, rgba(255,215,0,0.01) 0%, transparent 70%)"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 800,
                fontFamily: "var(--font-h)",
                color: "#fff",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <Zap size={20} style={{ color: "var(--gold)" }} />
                Active Sourcing catalog
              </h3>
              <span style={{
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: "var(--font-h)",
                color: accentColor,
                background: `${accentColor}12`,
                border: `1px solid ${accentColor}25`,
                padding: "4px 14px",
                borderRadius: "100px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {activePacks.filter(p => p.status !== 'sold_out').length} Stocks Loaded
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "100px 0" }}>
                <Loader2 className="animate-spin mx-auto" size={42} style={{ color: "var(--gold)" }} />
                <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "16px" }}>Fetching live stock files...</p>
              </div>
            ) : activePacks.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "80px 40px",
                background: "rgba(17, 21, 32, 0.45)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                  <UcImg size={56} />
                </div>
                <h4 style={{ color: "#fff", fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                  No UC Packs Sourced Currently
                </h4>
                <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "440px", margin: "0 auto 28px", lineHeight: "1.6" }}>
                  Active stock files for this method are temporarily allocated. Contact our specialized team directly on chat channels to reserve incoming bundles immediately.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "12px 28px", borderRadius: "10px",
                      background: "#25D366", color: "#fff",
                      fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                      textDecoration: "none", boxShadow: "0 4px 15px rgba(37, 211, 102, 0.2)"
                    }}>
                    <MessageCircle size={15} /> WhatsApp Desk
                  </a>
                  <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "12px 28px", borderRadius: "10px",
                      background: "#0088cc", color: "#fff",
                      fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                      textDecoration: "none", boxShadow: "0 4px 15px rgba(0, 136, 204, 0.2)"
                    }}>
                    <Send size={15} /> Telegram Desk
                  </a>
                </div>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                gap: "24px"
              }}>
                {activePacks.map(pack => (
                  <UcPackCard 
                    key={pack.id} 
                    pack={pack} 
                    accentColor={accentColor} 
                    glowClass={glowClass}
                    contactPrefix={contactPrefix} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── TRUST & DATA PRIVACY ACCREDITATION ────────── */}
        <section className="section" style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(10, 13, 20, 0.3)",
          padding: "70px 5% 80px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "45px" }}>
            <span className="slabel">Secure Escrow Guarantee</span>
            <h2 className="stitle" style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center", fontSize: "clamp(24px,4vw,34px)", fontFamily: "var(--font-h)" }}>
              <Award size={26} style={{ color: "var(--gold)" }} />
              Why Choose MBS Sourcing?
            </h2>
            <p className="ssub" style={{ margin: "0 auto" }}>
              Our proprietary delivery corridors ensure rapid processing, legal escrow guarantees, and complete data safety.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            maxWidth: "1000px",
            margin: "0 auto"
          }}>
            {[
              { icon: <Shield size={22} />, title: "100% Safe Methods", desc: "Sourced through official authorized in-game merchant bills. Zero risk of account restriction or developer bans." },
              { icon: <Zap size={22} />, title: "Guaranteed Speeds", desc: "Our specialized processors execute orders instantly, maintaining standard transfer delivery windows below 24 hours." },
              { icon: <Banknote size={22} />, title: "Competitive Rates", desc: "Direct stock merchant pricing offers significant discounts compared to high retail price rates inside the BGMI store." },
              { icon: <Lock size={22} />, title: "Zero Logging Logs", desc: "For View Login, your details are fully purged from all local system caches instantly upon completion of the transaction." }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: "rgba(17, 21, 32, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "all 0.25s ease"
                }}
                className="why-us-card-glow"
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(255, 215, 0, 0.04)",
                  border: "1px solid var(--border-gold)",
                  color: "var(--gold)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  {item.icon}
                </div>
                <h4 style={{
                  fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700,
                  color: "#fff", marginBottom: "8px", letterSpacing: "0.5px"
                }}>
                  {item.title}
                </h4>
                <p style={{
                  color: "var(--muted)", fontSize: "12px", lineHeight: "1.6", margin: 0
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Embedded Premium Styling ─────────────────────── */}
        <style>{`
          /* Method SWITCH cards */
          .method-switch-card:hover {
            transform: translateY(-3px);
            border-color: rgba(255, 255, 255, 0.1) !important;
            background: rgba(17, 21, 32, 0.55) !important;
          }
          
          .method-switch-card.active-blue {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.22), inset 0 0 15px rgba(59, 130, 246, 0.02);
            background: rgba(17, 21, 32, 0.6) !important;
          }
          
          .method-switch-card.active-orange {
            border-color: #f97316 !important;
            box-shadow: 0 0 25px rgba(249, 115, 22, 0.22), inset 0 0 15px rgba(249, 115, 22, 0.02);
            background: rgba(17, 21, 32, 0.6) !important;
          }

          /* UC Packs visual cards */
          .uc-pack-card {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          .uc-pack-card:hover {
            transform: translateY(-5px);
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          
          .uc-pack-card.glow-blue:hover {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.2), inset 0 0 10px rgba(59, 130, 246, 0.02);
          }
          
          .uc-pack-card.glow-orange:hover {
            border-color: #f97316 !important;
            box-shadow: 0 0 25px rgba(249, 115, 22, 0.2), inset 0 0 10px rgba(249, 115, 22, 0.02);
          }
          
          .uc-pack-card.sold-out {
            border-color: rgba(255,255,255,0.03) !important;
            box-shadow: none !important;
            pointer-events: none;
          }

          .wa-btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.35);
          }
          
          .tg-btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 136, 204, 0.35);
          }

          .why-us-card-glow:hover {
            transform: translateY(-3px);
            border-color: rgba(255, 215, 0, 0.15) !important;
            background: rgba(17, 21, 32, 0.5) !important;
            box-shadow: 0 10px 25px rgba(255, 215, 0, 0.02);
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}
