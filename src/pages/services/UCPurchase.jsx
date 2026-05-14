import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Zap, Clock, Shield, LogIn, Gamepad2, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "../../utils/supabase";

// ── UC Coin SVG ────────────────────────────────────────────────
const UcIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
    <circle cx="12" cy="12" r="8" fill="#F0C420" stroke="#B8860B" strokeWidth="1"/>
    <path d="M9 8V14C9 15.1046 9.89543 16 11 16H13C14.1046 16 15 15.1046 15 14V8" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 8H9" stroke="#B8860B" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function UCPurchase() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      const { data, error } = await supabase
        .from('uc_prices')
        .select('*')
        .order('offer_price', { ascending: true });
      
      if (!error) setPacks(data);
      setLoading(false);
    };
    fetchPacks();
  }, []);

  const contactText = (uc) => `Hi Maddy! I want to buy the ${uc} pack. Please guide me on the payment.`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        <section style={{ position: "relative", padding: "80px 5%", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}><Zap size={14} /> Instant Delivery</div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 900, marginBottom: "20px" }}>
            Premium <span style={{ color: "var(--gold)" }}>UC Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6, fontSize: "17px" }}>
            The most reliable and fastest UC service for BGMI. Select your pack below and contact us to complete your purchase instantly.
          </p>
        </section>

        <section className="section">
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
              {packs.map((p) => {
                const isSoldOut = p.status === 'sold_out';
                return (
                  <div key={p.id} className="card uc-card" style={{ 
                    padding: "32px", 
                    border: isSoldOut ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,215,0,0.15)", 
                    position: "relative", 
                    overflow: "hidden",
                    opacity: isSoldOut ? 0.6 : 1,
                    transition: "transform 0.3s ease"
                  }}>
                    {isSoldOut && (
                      <div style={{ position: "absolute", top: "20px", left: "-35px", background: "#ef4444", color: "#fff", padding: "8px 40px", transform: "rotate(-45deg)", fontSize: "12px", fontWeight: 900, zIndex: 5 }}>
                        SOLD OUT
                      </div>
                    )}
                    
                    <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                      <UcIcon size={32} />
                    </div>
                    
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ fontSize: "36px", fontWeight: 900, fontFamily: "var(--font-h)", lineHeight: 1 }}>
                        {p.uc_amount}
                      </div>
                      {p.bonus_uc > 0 && (
                        <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: "14px", marginTop: "4px" }}>
                          + {p.bonus_uc} Bonus UC
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "32px" }}>
                      <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--gold)" }}>₹{Number(p.offer_price).toLocaleString("en-IN")}</div>
                      <div style={{ fontSize: "16px", color: "var(--muted)", textDecoration: "line-through" }}>₹{Number(p.market_price).toLocaleString("en-IN")}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <a href={isSoldOut ? "#" : `https://wa.me/+919025391516?text=${encodeURIComponent(contactText(p.uc_amount))}`} 
                         target={isSoldOut ? "" : "_blank"} rel="noreferrer" className="btn btn-gold"
                         onClick={e => isSoldOut && e.preventDefault()}
                         style={{ background: isSoldOut ? "var(--bg2)" : "#25D366", borderColor: isSoldOut ? "var(--border)" : "#25D366", color: isSoldOut ? "var(--muted)" : "#fff", fontSize: "13px", padding: "12px", pointerEvents: isSoldOut ? "none" : "auto" }}>
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                      <a href={isSoldOut ? "#" : `https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(p.uc_amount))}`} 
                         target={isSoldOut ? "" : "_blank"} rel="noreferrer" className="btn btn-gold"
                         onClick={e => isSoldOut && e.preventDefault()}
                         style={{ background: isSoldOut ? "var(--bg2)" : "#0088cc", borderColor: isSoldOut ? "var(--border)" : "#0088cc", color: isSoldOut ? "var(--muted)" : "#fff", fontSize: "13px", padding: "12px", pointerEvents: isSoldOut ? "none" : "auto" }}>
                        <Send size={16} /> Telegram
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── PRICE FLUCTUATION NOTICE ───────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 5% 8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)",
            borderRadius: "12px", padding: "14px 20px",
          }}>
            <AlertTriangle size={18} style={{ color: "#FBBF24", flexShrink: 0 }} />
            <p style={{ fontSize: "13px", color: "rgba(251,191,36,0.9)", margin: 0, lineHeight: 1.6 }}>
              <strong>Price Notice:</strong> UC prices may vary based on market demand and availability. Prices shown are our best current offers and are subject to change. Contact us to confirm the latest pricing before purchasing.
            </p>
          </div>
        </div>

        {/* ── PURCHASE METHODS ───────────────────────────────── */}
        <section className="section">
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className="badge" style={{ marginBottom: "16px" }}><Shield size={13} /> Choose Your Method</div>
              <h2 className="stitle" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900 }}>
                How to <span style={{ color: "var(--gold)" }}>Purchase UC</span>
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: "560px", margin: "12px auto 0", fontSize: "15px", lineHeight: 1.7 }}>
                We offer two secure methods — pick the one that suits you best.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,480px),1fr))", gap: "28px" }}>

              {/* METHOD 1: VIEW LOGIN UC */}
              <div style={{
                background: "var(--card)", borderRadius: "20px",
                border: "1px solid rgba(59,130,246,0.25)",
                overflow: "hidden",
                boxShadow: "0 4px 30px rgba(59,130,246,0.08)"
              }}>
                {/* Header */}
                <div style={{
                  padding: "24px 28px",
                  background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))",
                  borderBottom: "1px solid rgba(59,130,246,0.15)",
                  display: "flex", alignItems: "center", gap: "14px"
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 4px 16px rgba(59,130,246,0.4)"
                  }}>
                    <LogIn size={22} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Method 1</div>
                    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-h)" }}>View Login UC</h3>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: "rgba(59,130,246,0.1)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(59,130,246,0.25)" }}>
                    <Clock size={12} style={{ color: "#3b82f6" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#3b82f6" }}>6–24 Hours</span>
                  </div>
                </div>

                {/* Steps */}
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ display: "grid", gap: "16px" }}>
                    {[
                      ["Contact Us", "Reach out via WhatsApp or Telegram and tell us which UC pack you want."],
                      ["Make Payment", "Pay securely using UPI, Bank Transfer, or any accepted method."],
                      ["Share Credentials", "Provide your Facebook or X (Twitter) login credentials. Your data is 100% safe and deleted after the transaction."],
                      ["We Add the UC", "We log in, purchase the UC, and log out — no changes to your account settings."],
                      ["Confirmation", "We notify you once the UC has been added. Delivery: 6 to 24 hours."],
                    ].map(([title, desc], i) => (
                      <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: "1px"
                        }}>{i + 1}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{title}</div>
                          <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "24px", padding: "14px", background: "rgba(59,130,246,0.06)", borderRadius: "10px", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6366f1", fontWeight: 700 }}>
                      <Shield size={13} /> Accepted Login Methods
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                      {["Facebook", "X (Twitter)"].map(m => (
                        <span key={m} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "20px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd", fontWeight: 600 }}>{m}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                    <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20UC%20via%20View%20Login%20method." target="_blank" rel="noreferrer"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "10px", background: "#25D366", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                    <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "10px", background: "#0088cc", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                      <Send size={15} /> Telegram
                    </a>
                  </div>
                </div>
              </div>

              {/* METHOD 2: CHARACTER ID UC */}
              <div style={{
                background: "var(--card)", borderRadius: "20px",
                border: "1px solid rgba(249,115,22,0.25)",
                overflow: "hidden",
                boxShadow: "0 4px 30px rgba(249,115,22,0.08)"
              }}>
                {/* Header */}
                <div style={{
                  padding: "24px 28px",
                  background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))",
                  borderBottom: "1px solid rgba(249,115,22,0.15)",
                  display: "flex", alignItems: "center", gap: "14px"
                }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "linear-gradient(135deg,#f97316,#ef4444)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, boxShadow: "0 4px 16px rgba(249,115,22,0.4)"
                  }}>
                    <Gamepad2 size={22} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#f97316", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Method 2</div>
                    <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-h)" }}>Character ID UC</h3>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: "rgba(249,115,22,0.1)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(249,115,22,0.25)" }}>
                    <Clock size={12} style={{ color: "#f97316" }} />
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#f97316" }}>6–12 Hours</span>
                  </div>
                </div>

                {/* Steps */}
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ display: "grid", gap: "16px" }}>
                    {[
                      ["Contact Us", "Message us on WhatsApp or Telegram and mention the UC pack you want."],
                      ["Make Payment", "Complete the payment via your preferred method — UPI, Bank Transfer, etc."],
                      ["Share Your Character ID", "Send us your BGMI Character ID. No login credentials needed — your account stays secure."],
                      ["We Verify & Send", "We verify your Character ID and send UC directly in-game. Sometimes faster than 6 hours!"],
                      ["Confirmation", "We confirm once the UC is sent. Delivery: 6 to 12 hours (often much faster)."],
                    ].map(([title, desc], i) => (
                      <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <div style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          background: "linear-gradient(135deg,#f97316,#ef4444)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: "1px"
                        }}>{i + 1}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{title}</div>
                          <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "24px", padding: "14px", background: "rgba(249,115,22,0.06)", borderRadius: "10px", border: "1px solid rgba(249,115,22,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#f97316", fontWeight: 700 }}>
                      <CheckCircle size={13} /> Why Choose This?
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px", lineHeight: 1.7 }}>
                      No credentials required — just your in-game ID. Fastest and simplest option. ⚡
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                    <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20UC%20via%20Character%20ID%20method." target="_blank" rel="noreferrer"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "10px", background: "#25D366", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                    <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                      style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px", borderRadius: "10px", background: "#0088cc", color: "#fff", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                      <Send size={15} /> Telegram
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ────────────────────────────────────── */}
        <section className="section-alt" style={{ textAlign: "center" }}>
           <div className="card" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
              <h3 style={{ marginBottom: "16px" }}>Why choose MBS UC Service?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>100% Safe</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>No risk of ban, official methods.</div>
                 </div>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>Fast Delivery</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>UC added within 6–24 hours.</div>
                 </div>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>Cheapest Price</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>Lower than official in-game store.</div>
                 </div>
              </div>
           </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
