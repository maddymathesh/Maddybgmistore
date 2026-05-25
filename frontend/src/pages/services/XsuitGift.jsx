import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useSEO from "../../hooks/useSEO";
import { 
  MessageCircle, Send, Loader2, Info, CheckCircle, 
  ShieldCheck, Clock, Zap, Star, Trophy, Users, Smartphone
} from "lucide-react";
import { supabase } from "../../utils/supabase";

export default function XsuitGift() {
  useSEO(
    "BGMI X-Suit Gifting — Legendary Mythic Outfits",
    "Source premium upgradable mythic X-Suits delivered officially in-game to your account via secure lobby gifting."
  );
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuits = async () => {
      try {
        const { data } = await supabase
          .from("xsuit_gifts")
          .select("*")
          .order("created_at", { ascending: false });
        setSuits(data || []);
      } catch (err) {
        console.error("Error fetching suits:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuits();
  }, []);

  const contactText = (name) => `Hi Maddy! I am interested in buying the ${name} X-Suit via your premium Gifting service. Please guide me.`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative",
          width: "100%",
          minHeight: "88vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden"
        }}>
          {/* Background hero image */}
          <img
            src="/xsuit-banner-1.jpg"
            alt="BGMI X-Suit Gifting" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 30%",
              filter: "brightness(0.55)",
            }}
          />
          {/* Gradient overlays */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 30%, transparent 50%, rgba(8,10,15,0.97) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: "860px" }}>
            <div className="badge animate-pulse" style={{ marginBottom: "20px" }}>
              <ShieldCheck size={14} style={{ marginRight: "6px" }} /> Authorized Gifting Corridors
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,68px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
              textShadow: "0 2px 25px rgba(0,0,0,0.7)",
            }}>
              Legendary X-Suit <br />
              <span className="g">Gifting Service</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,17px)",
              maxWidth: "680px", margin: "0 auto", lineHeight: 1.6,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Direct X-Suit delivery to your BGMI account. Transmitted safely via official in-game gifting corridors using verified merchant accounts.
            </p>
          </div>
        </section>

        {/* ── SECONDARY VISUAL BANNER ─────────────────────── */}
        <div style={{ position: "relative", width: "100%", height: "260px", overflow: "hidden" }}>
          <img
            src="/xsuit-banner-2.jpg"
            alt="BGMI Squad" loading="lazy" decoding="async"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.38)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(8,10,15,0.9) 0%, transparent 40%, transparent 60%, rgba(8,10,15,0.9) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
            gap: "10px", textAlign: "center", padding: "0 5%"
          }}>
            <span style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(12px,1.4vw,14px)",
              fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase",
              color: "var(--gold)", opacity: 0.9
            }}>Certified Gifting Squad</span>
            <h2 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(22px,4vw,42px)",
              fontWeight: 900, color: "#fff", margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)"
            }}>Premium Mythic Armory</h2>
            <p style={{ color: "rgba(234,234,234,0.7)", fontSize: "clamp(13px,1.4vw,16px)", margin: 0 }}>
              Sourced. Secured. Delivered.
            </p>
          </div>
        </div>


        {/* ── INTERACTIVE TIMELINE & REQUIREMENTS DASHBOARD ── */}
        <section style={{ padding: "0 5% 50px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{
              background: "rgba(14, 17, 24, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--border-gold)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 15px 45px rgba(0,0,0,0.3)"
            }}>
              {/* Spotlight Title */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "28px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "16px"
              }}>
                <Info size={22} style={{ color: "var(--gold)", filter: "drop-shadow(0 0 8px rgba(255,215,0,0.3))" }} />
                <h2 style={{
                  fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 800,
                  color: "#fff", margin: 0, letterSpacing: "0.5px"
                }}>
                  Gifting Protocols & Conditions
                </h2>
              </div>

              {/* 2-Column Split */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "35px"
              }}>
                {/* Column 1: Step-by-Step Delivery timeline */}
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700,
                    color: "var(--gold)", marginBottom: "20px", letterSpacing: "1px",
                    textTransform: "uppercase"
                  }}>
                    Sourcing Sequence
                  </h3>
                  <div style={{
                    position: "relative", paddingLeft: "30px",
                    borderLeft: "1.5px dashed rgba(255, 215, 0, 0.2)"
                  }}>
                    {[
                      { t: "Select & Purchase", d: "Choose your favorite X-Suit and secure payment via chat support." },
                      { t: "Share Game Details", d: "Provide your numerical In-Game Character ID. No login needed." },
                      { t: "Accept Friendship Lock", d: "Accept friend requests from our designated delivery account." },
                      { t: "72 Hours Buffer Wait", d: "Wait the official cooldown period required for in-game gifting." }
                    ].map((step, idx) => (
                      <div key={idx} style={{
                        position: "relative", marginBottom: idx === 3 ? 0 : "22px"
                      }}>
                        <div style={{
                          position: "absolute", left: "-41px", top: "2px",
                          width: "20px", height: "20px", borderRadius: "50%",
                          background: "#080a0f", border: "1.5px solid var(--gold)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--gold)", fontSize: "10px", fontWeight: 900
                        }}>{idx + 1}</div>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13.5px", marginBottom: "3px" }}>
                          {step.t}
                        </strong>
                        <span style={{ display: "block", color: "var(--muted)", fontSize: "12px", lineHeight: "1.5" }}>
                          {step.d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Hard requirements info card */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  padding: "24px"
                }}>
                  <h3 style={{
                    fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700,
                    color: "var(--gold)", marginBottom: "20px", letterSpacing: "1px",
                    textTransform: "uppercase"
                  }}>
                    BGMI Official Gifting Limits
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { icon: <Clock size={16} />, label: "72 Hours Cooldown", desc: "Accounts must remain friends in-game for at least 72 hours before a gift can be processed." },
                      { icon: <Users size={16} />, label: "50+ Synergy points", desc: "Requires at least 50 synergy. Easily generated by sending basic synergy gifts or playing matches." },
                      { icon: <Smartphone size={16} />, label: "Level 10+ Requirement", desc: "Receiver BGMI account must be level 10 or above to accept legendary inventory items." }
                    ].map((req, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{
                          color: "var(--gold)", background: "rgba(255, 215, 0, 0.05)",
                          width: "32px", height: "32px", borderRadius: "8px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {req.icon}
                        </div>
                        <div>
                          <strong style={{ color: "#fff", display: "block", fontSize: "13px", marginBottom: "2px" }}>
                            {req.label}
                          </strong>
                          <span style={{ color: "var(--muted)", fontSize: "11.5px", lineHeight: "1.4", display: "block" }}>
                            {req.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    marginTop: "20px", paddingTop: "14px",
                    color: "var(--muted)", fontSize: "11px", fontStyle: "italic",
                    display: "flex", gap: "6px", alignItems: "center"
                  }}>
                    <Zap size={11} style={{ color: "var(--gold)" }} />
                    * These limits are strictly enforced by BGMI game mechanics.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LEGENDARY X-SUITS CATALOG GRID ──────────────── */}
        <section style={{ padding: "10px 5% 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={42} style={{ color: "var(--gold)" }} />
              <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "16px" }}>Unlocking armory stock...</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
              gap: "30px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {suits.map((s) => {
                // Determine decorative tag based on pricing or name
                const isMythic = s.price > 45000;
                const activeTag = isMythic ? "Mythic Armory" : "Legendary Suit";
                
                return (
                  <div 
                    key={s.id} 
                    className="suit-catalog-card"
                    style={{
                      background: "rgba(17, 21, 32, 0.45)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    {/* Widescreen image with tags */}
                    <div style={{
                      aspectRatio: "1/1.2",
                      background: "rgba(8,10,15,0.7)",
                      overflow: "hidden",
                      position: "relative",
                      borderBottom: "1px solid rgba(255,255,255,0.03)"
                    }}>
                      <img 
                        src={s.image_url} 
                        alt={s.name} 
                        loading="lazy"
                        className="hover-zoom"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)"
                        }} 
                      />
                      {/* Premium Top tags */}
                      <div style={{
                        position: "absolute", top: "16px", left: "16px",
                        background: isMythic ? "linear-gradient(135deg, #a855f7, #6366f1)" : "linear-gradient(135deg, var(--gold), var(--orange))",
                        color: isMythic ? "#fff" : "#000",
                        fontSize: "10px", fontWeight: 900,
                        fontFamily: "var(--font-h)",
                        padding: "4px 12px", borderRadius: "6px",
                        letterSpacing: "1px", textTransform: "uppercase"
                      }}>
                        {activeTag}
                      </div>

                      {/* Hot Listing Badge */}
                      <div style={{
                        position: "absolute", top: "16px", right: "16px",
                        background: "rgba(8,10,15,0.7)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        width: "28px", height: "28px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <Star size={13} style={{ color: "var(--gold)" }} />
                      </div>
                    </div>

                    {/* Bottom Info Blocks */}
                    <div style={{
                      padding: "24px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        fontFamily: "var(--font-h)",
                        color: "#fff",
                        marginBottom: "6px",
                        letterSpacing: "0.5px"
                      }}>
                        {s.name}
                      </h3>
                      
                      <div style={{
                        fontSize: "26px",
                        fontWeight: 900,
                        color: "var(--gold)",
                        fontFamily: "var(--font-h)",
                        marginBottom: "24px",
                        textShadow: "0 2px 10px rgba(255,215,0,0.15)"
                      }}>
                        ₹{Number(s.price).toLocaleString("en-IN")}
                      </div>
                      
                      <div style={{
                        display: "grid", gap: "10px", marginTop: "auto"
                      }}>
                        <a 
                          href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(s.name))}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="social-btn-wa"
                          style={{
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                            padding: "12px", borderRadius: "10px",
                            background: "#25D366", color: "#fff",
                            fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                            textDecoration: "none", transition: "all 0.25s ease"
                          }}
                        >
                          <MessageCircle size={16} /> WhatsApp Deal
                        </a>
                        <a 
                          href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(s.name))}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="social-btn-tg"
                          style={{
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                            padding: "12px", borderRadius: "10px",
                            background: "#0088cc", color: "#fff",
                            fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                            textDecoration: "none", transition: "all 0.25s ease"
                          }}
                        >
                          <Send size={16} /> Telegram Deal
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* CSS Hover Styling Block */}
        <style>{`
          .suit-catalog-card:hover {
            transform: translateY(-5px);
            border-color: var(--border-gold) !important;
            box-shadow: 0 15px 35px rgba(255, 215, 0, 0.03), 0 0 20px rgba(0,0,0,0.3) !important;
          }

          .suit-catalog-card:hover .hover-zoom {
            transform: scale(1.06);
          }

          .social-btn-wa:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          }
          
          .social-btn-tg:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}
