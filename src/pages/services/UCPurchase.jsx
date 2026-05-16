import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Clock, Shield, LogIn, Gamepad2, AlertTriangle, CheckCircle } from "lucide-react";
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
  ["Contact Us", "Message us on WhatsApp or Telegram and tell us which UC pack you want."],
  ["Make Payment", "Pay securely using UPI, Bank Transfer, or any accepted method."],
  ["Share Credentials", "Provide your Facebook or X (Twitter) login credentials. Your data is 100% safe and deleted immediately after."],
  ["We Add the UC", "We log in, purchase the UC, and log out — no changes to your account settings ever."],
  ["Confirmation", "We message you once UC is added. Delivery: 6 to 24 hours."],
];

const CHAR_ID_STEPS = [
  ["Contact Us", "Message us on WhatsApp or Telegram and mention the UC pack you want."],
  ["Make Payment", "Complete payment via UPI, Bank Transfer, or any accepted method."],
  ["Share Your Character ID", "Send us your BGMI in-game Character ID. No login credentials required — your account stays 100% secure."],
  ["We Verify & Send", "We verify your Character ID and send UC directly in-game. Sometimes faster than 6 hours!"],
  ["Confirmation", "We notify you once UC is sent. Delivery: 6 to 12 hours (often much faster)."],
];

// ── Pack Card ────────────────────────────────────────────────
function UcPackCard({ pack, accentColor, contactPrefix }) {
  const isSoldOut = pack.status === "sold_out";
  const waText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} pack via ${contactPrefix}. Please guide me.`);
  const tgText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} pack via ${contactPrefix}. Please guide me.`);

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "18px",
      border: isSoldOut ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${accentColor}33`,
      padding: "28px",
      position: "relative",
      overflow: "hidden",
      opacity: isSoldOut ? 0.65 : 1,
      transition: "transform 0.25s, box-shadow 0.25s",
      boxShadow: isSoldOut ? "none" : `0 4px 28px ${accentColor}18`,
    }}>
      {/* Sold Out Ribbon */}
      {isSoldOut && (
        <div style={{ position: "absolute", top: "18px", left: "-36px", background: "#ef4444", color: "#fff", padding: "6px 44px", transform: "rotate(-45deg)", fontSize: "11px", fontWeight: 900, zIndex: 5 }}>
          SOLD OUT
        </div>
      )}

      {/* UC Image top-right */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <UcImg size={38} />
      </div>

      {/* UC Amount */}
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "38px", fontWeight: 900, fontFamily: "var(--font-h)", lineHeight: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          {pack.uc_amount}
        </div>
        {pack.bonus_uc > 0 && (
          <div style={{ color: "#FFD700", fontWeight: 700, fontSize: "13px", marginTop: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <UcImg size={14} /> + {pack.bonus_uc} Bonus UC
          </div>
        )}
      </div>

      {/* Pricing */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "30px", fontWeight: 900, color: "#FFD700" }}>₹{Number(pack.offer_price).toLocaleString("en-IN")}</span>
        <span style={{ fontSize: "15px", color: "var(--muted)", textDecoration: "line-through" }}>₹{Number(pack.market_price).toLocaleString("en-IN")}</span>
        {pack.market_price > 0 && !isSoldOut && (
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#4ade80", background: "rgba(74,222,128,0.12)", padding: "2px 8px", borderRadius: "10px" }}>
            SAVE {Math.round((1 - pack.offer_price / pack.market_price) * 100)}%
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <a
          href={isSoldOut ? undefined : `https://wa.me/+919025391516?text=${waText}`}
          target={isSoldOut ? undefined : "_blank"} rel="noreferrer"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "12px", borderRadius: "10px", background: isSoldOut ? "var(--bg2)" : "#25D366", color: isSoldOut ? "var(--muted)" : "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none", pointerEvents: isSoldOut ? "none" : "auto" }}>
          <MessageCircle size={15} /> WhatsApp
        </a>
        <a
          href={isSoldOut ? undefined : `https://t.me/MBSxMADDY17?text=${tgText}`}
          target={isSoldOut ? undefined : "_blank"} rel="noreferrer"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "12px", borderRadius: "10px", background: isSoldOut ? "var(--bg2)" : "#0088cc", color: isSoldOut ? "var(--muted)" : "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none", pointerEvents: isSoldOut ? "none" : "auto" }}>
          <Send size={15} /> Telegram
        </a>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function UCPurchase() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState("view_login");

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data } = await supabase
          .from('uc_prices')
          .select('*')
          .order('offer_price', { ascending: true });
        setPacks(data || []);
      } catch (err) {
        console.error('Error fetching UC packs:', err);
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
  const accentColor = isViewLogin ? "#3b82f6" : "#f97316";
  const contactPrefix = isViewLogin ? "View Login method" : "Character ID method";

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section style={{ padding: "80px 5% 48px", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}>
            <UcImg size={16} style={{ marginRight: "4px" }} /> Instant Delivery
          </div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 900, marginBottom: "20px" }}>
            Premium <span style={{ color: "var(--gold)" }}>UC Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "680px", margin: "0 auto 40px", lineHeight: 1.7, fontSize: "16px" }}>
            The most reliable and fastest UC service for BGMI. Choose your preferred purchase method below.
          </p>

          {/* Method Toggle */}
          <div style={{ display: "inline-flex", background: "var(--card)", borderRadius: "16px", padding: "6px", gap: "4px", border: "1px solid rgba(255,215,0,0.1)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            {[
              { key: "view_login", label: "View Login UC", icon: <LogIn size={16} />, color: "#3b82f6" },
              { key: "character_id", label: "Character ID UC", icon: <Gamepad2 size={16} />, color: "#f97316" },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setActiveMethod(m.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "13px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px",
                  fontFamily: "var(--font-h)", border: "none", cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: activeMethod === m.key ? `linear-gradient(135deg, ${m.color}, ${m.color}cc)` : "transparent",
                  color: activeMethod === m.key ? "#fff" : "var(--muted)",
                  boxShadow: activeMethod === m.key ? `0 4px 16px ${m.color}55` : "none",
                }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── PRICE NOTICE ──────────────────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto 8px", padding: "0 5%" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.28)", borderRadius: "12px", padding: "14px 18px" }}>
            <AlertTriangle size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "13px", color: "rgba(251,191,36,0.9)", margin: 0, lineHeight: 1.6 }}>
              <strong>Price Notice:</strong> UC prices fluctuate based on market demand and availability. Prices shown are our current best offers and may change. Contact us to confirm latest pricing.
            </p>
          </div>
        </div>

        {/* ── PROCEDURE ─────────────────────────────────────── */}
        <section style={{ padding: "32px 5% 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              background: "var(--card)", borderRadius: "20px",
              border: `1px solid ${accentColor}33`,
              overflow: "hidden",
              boxShadow: `0 4px 30px ${accentColor}12`,
              transition: "border-color 0.3s",
            }}>
              {/* Procedure Header */}
              <div style={{
                padding: "22px 28px",
                background: `linear-gradient(135deg, ${accentColor}14, transparent)`,
                borderBottom: `1px solid ${accentColor}22`,
                display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px ${accentColor}44`, flexShrink: 0,
                }}>
                  {isViewLogin ? <LogIn size={20} color="#fff" /> : <Gamepad2 size={20} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: accentColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    How it works
                  </div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-h)" }}>
                    {isViewLogin ? "View Login UC Procedure" : "Character ID UC Procedure"}
                  </h2>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: `${accentColor}18`, padding: "7px 14px", borderRadius: "20px", border: `1px solid ${accentColor}33` }}>
                  <Clock size={13} style={{ color: accentColor }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor }}>
                    {isViewLogin ? "6–24 Hours Delivery" : "6–12 Hours Delivery"}
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap: "14px" }}>
                {(isViewLogin ? VIEW_LOGIN_STEPS : CHAR_ID_STEPS).map(([title, desc], i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: "1px",
                      boxShadow: `0 2px 10px ${accentColor}44`,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "3px" }}>{title}</div>
                      <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accepted methods note */}
              {isViewLogin && (
                <div style={{ margin: "0 28px 24px", padding: "12px 16px", background: `${accentColor}0d`, borderRadius: "10px", border: `1px solid ${accentColor}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: accentColor, fontWeight: 700, marginBottom: "8px" }}>
                    <Shield size={13} /> Accepted Login Methods
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["Facebook", "X (Twitter)"].map(m => (
                      <span key={m} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "20px", background: `${accentColor}18`, border: `1px solid ${accentColor}33`, color: "#93c5fd", fontWeight: 600 }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {!isViewLogin && (
                <div style={{ margin: "0 28px 24px", padding: "12px 16px", background: `${accentColor}0d`, borderRadius: "10px", border: `1px solid ${accentColor}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: accentColor, fontWeight: 700 }}>
                    <CheckCircle size={13} /> No credentials needed — just your in-game Character ID. Fastest & safest option! ⚡
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── UC PACKS ──────────────────────────────────────── */}
        <section style={{ padding: "32px 5% 60px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-h)" }}>
                {isViewLogin ? "🔑 View Login UC Packs" : "🎮 Character ID UC Packs"}
              </h3>
              <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--card)", padding: "3px 10px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                {activePacks.filter(p => p.status !== 'sold_out').length} Available
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
              </div>
            ) : activePacks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}>
                <UcImg size={52} />
                <p style={{ color: "var(--muted)", marginTop: "16px", fontSize: "15px" }}>
                  No UC packs available for this method right now.<br />
                  <strong style={{ color: "var(--text)" }}>Contact us directly to check availability!</strong>
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                  <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", background: "#25D366", color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", background: "#0088cc", color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                    <Send size={15} /> Telegram
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,300px), 1fr))", gap: "20px" }}>
                {activePacks.map(pack => (
                  <UcPackCard key={pack.id} pack={pack} accentColor={accentColor} contactPrefix={contactPrefix} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── WHY CHOOSE US ─────────────────────────────────── */}
        <section className="section-alt" style={{ textAlign: "center" }}>
          <div className="card" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px" }}>
            <h3 style={{ marginBottom: "28px", fontFamily: "var(--font-h)", fontSize: "22px" }}>Why choose MBS UC Service?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px" }}>
              {[
                ["🛡️", "100% Safe", "No risk of ban. Official methods only."],
                ["⚡", "Fast Delivery", "UC added within 6–24 hours."],
                ["💰", "Cheapest Price", "Lower than the official in-game store."],
                ["🔒", "Data Privacy", "Credentials deleted immediately after use."],
              ].map(([emoji, title, desc]) => (
                <div key={title}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{emoji}</div>
                  <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Clock, Shield, LogIn, Gamepad2, AlertTriangle, CheckCircle } from "lucide-react";
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
  ["Contact Us", "Message us on WhatsApp or Telegram and tell us which UC pack you want."],
  ["Make Payment", "Pay securely using UPI, Bank Transfer, or any accepted method."],
  ["Share Credentials", "Provide your Facebook or X (Twitter) login credentials. Your data is 100% safe and deleted immediately after."],
  ["We Add the UC", "We log in, purchase the UC, and log out — no changes to your account settings ever."],
  ["Confirmation", "We message you once UC is added. Delivery: 6 to 24 hours."],
];

const CHAR_ID_STEPS = [
  ["Contact Us", "Message us on WhatsApp or Telegram and mention the UC pack you want."],
  ["Make Payment", "Complete payment via UPI, Bank Transfer, or any accepted method."],
  ["Share Your Character ID", "Send us your BGMI in-game Character ID. No login credentials required — your account stays 100% secure."],
  ["We Verify & Send", "We verify your Character ID and send UC directly in-game. Sometimes faster than 6 hours!"],
  ["Confirmation", "We notify you once UC is sent. Delivery: 6 to 12 hours (often much faster)."],
];

// ── Pack Card ────────────────────────────────────────────────
function UcPackCard({ pack, accentColor, contactPrefix }) {
  const isSoldOut = pack.status === "sold_out";
  const waText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} pack via ${contactPrefix}. Please guide me.`);
  const tgText = encodeURIComponent(`Hi Maddy! I want to buy the ${pack.uc_amount} pack via ${contactPrefix}. Please guide me.`);

  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "18px",
      border: isSoldOut ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${accentColor}33`,
      padding: "28px",
      position: "relative",
      overflow: "hidden",
      opacity: isSoldOut ? 0.65 : 1,
      transition: "transform 0.25s, box-shadow 0.25s",
      boxShadow: isSoldOut ? "none" : `0 4px 28px ${accentColor}18`,
    }}>
      {/* Sold Out Ribbon */}
      {isSoldOut && (
        <div style={{ position: "absolute", top: "18px", left: "-36px", background: "#ef4444", color: "#fff", padding: "6px 44px", transform: "rotate(-45deg)", fontSize: "11px", fontWeight: 900, zIndex: 5 }}>
          SOLD OUT
        </div>
      )}

      {/* UC Image top-right */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <UcImg size={38} />
      </div>

      {/* UC Amount */}
      <div style={{ marginBottom: "18px" }}>
        <div style={{ fontSize: "38px", fontWeight: 900, fontFamily: "var(--font-h)", lineHeight: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          {pack.uc_amount}
        </div>
        {pack.bonus_uc > 0 && (
          <div style={{ color: "#FFD700", fontWeight: 700, fontSize: "13px", marginTop: "5px", display: "flex", alignItems: "center", gap: "5px" }}>
            <UcImg size={14} /> + {pack.bonus_uc} Bonus UC
          </div>
        )}
      </div>

      {/* Pricing */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "30px", fontWeight: 900, color: "#FFD700" }}>₹{Number(pack.offer_price).toLocaleString("en-IN")}</span>
        <span style={{ fontSize: "15px", color: "var(--muted)", textDecoration: "line-through" }}>₹{Number(pack.market_price).toLocaleString("en-IN")}</span>
        {pack.market_price > 0 && !isSoldOut && (
          <span style={{ fontSize: "11px", fontWeight: 800, color: "#4ade80", background: "rgba(74,222,128,0.12)", padding: "2px 8px", borderRadius: "10px" }}>
            SAVE {Math.round((1 - pack.offer_price / pack.market_price) * 100)}%
          </span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <a
          href={isSoldOut ? undefined : `https://wa.me/+919025391516?text=${waText}`}
          target={isSoldOut ? undefined : "_blank"} rel="noreferrer"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "12px", borderRadius: "10px", background: isSoldOut ? "var(--bg2)" : "#25D366", color: isSoldOut ? "var(--muted)" : "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none", pointerEvents: isSoldOut ? "none" : "auto" }}>
          <MessageCircle size={15} /> WhatsApp
        </a>
        <a
          href={isSoldOut ? undefined : `https://t.me/MBSxMADDY17?text=${tgText}`}
          target={isSoldOut ? undefined : "_blank"} rel="noreferrer"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "12px", borderRadius: "10px", background: isSoldOut ? "var(--bg2)" : "#0088cc", color: isSoldOut ? "var(--muted)" : "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none", pointerEvents: isSoldOut ? "none" : "auto" }}>
          <Send size={15} /> Telegram
        </a>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function UCPurchase() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState("view_login");

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data } = await supabase
          .from('uc_prices')
          .select('*')
          .order('offer_price', { ascending: true });
        setPacks(data || []);
      } catch (err) {
        console.error('Error fetching UC packs:', err);
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
  const accentColor = isViewLogin ? "#3b82f6" : "#f97316";
  const contactPrefix = isViewLogin ? "View Login method" : "Character ID method";

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>

        {/* ── HERO ───────────────────────────────────────────── */}
        <section style={{ padding: "80px 5% 48px", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}>
            <UcImg size={16} style={{ marginRight: "4px" }} /> Instant Delivery
          </div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 900, marginBottom: "20px" }}>
            Premium <span style={{ color: "var(--gold)" }}>UC Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "680px", margin: "0 auto 40px", lineHeight: 1.7, fontSize: "16px" }}>
            The most reliable and fastest UC service for BGMI. Choose your preferred purchase method below.
          </p>

          {/* Method Toggle */}
          <div style={{ display: "inline-flex", background: "var(--card)", borderRadius: "16px", padding: "6px", gap: "4px", border: "1px solid rgba(255,215,0,0.1)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            {[
              { key: "view_login", label: "View Login UC", icon: <LogIn size={16} />, color: "#3b82f6" },
              { key: "character_id", label: "Character ID UC", icon: <Gamepad2 size={16} />, color: "#f97316" },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setActiveMethod(m.key)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "13px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "14px",
                  fontFamily: "var(--font-h)", border: "none", cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: activeMethod === m.key ? `linear-gradient(135deg, ${m.color}, ${m.color}cc)` : "transparent",
                  color: activeMethod === m.key ? "#fff" : "var(--muted)",
                  boxShadow: activeMethod === m.key ? `0 4px 16px ${m.color}55` : "none",
                }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── PRICE NOTICE ──────────────────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto 8px", padding: "0 5%" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.28)", borderRadius: "12px", padding: "14px 18px" }}>
            <AlertTriangle size={16} style={{ color: "#FBBF24", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "13px", color: "rgba(251,191,36,0.9)", margin: 0, lineHeight: 1.6 }}>
              <strong>Price Notice:</strong> UC prices fluctuate based on market demand and availability. Prices shown are our current best offers and may change. Contact us to confirm latest pricing.
            </p>
          </div>
        </div>

        {/* ── PROCEDURE ─────────────────────────────────────── */}
        <section style={{ padding: "32px 5% 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{
              background: "var(--card)", borderRadius: "20px",
              border: `1px solid ${accentColor}33`,
              overflow: "hidden",
              boxShadow: `0 4px 30px ${accentColor}12`,
              transition: "border-color 0.3s",
            }}>
              {/* Procedure Header */}
              <div style={{
                padding: "22px 28px",
                background: `linear-gradient(135deg, ${accentColor}14, transparent)`,
                borderBottom: `1px solid ${accentColor}22`,
                display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px ${accentColor}44`, flexShrink: 0,
                }}>
                  {isViewLogin ? <LogIn size={20} color="#fff" /> : <Gamepad2 size={20} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: accentColor, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    How it works
                  </div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 900, fontFamily: "var(--font-h)" }}>
                    {isViewLogin ? "View Login UC Procedure" : "Character ID UC Procedure"}
                  </h2>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", background: `${accentColor}18`, padding: "7px 14px", borderRadius: "20px", border: `1px solid ${accentColor}33` }}>
                  <Clock size={13} style={{ color: accentColor }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: accentColor }}>
                    {isViewLogin ? "6–24 Hours Delivery" : "6–12 Hours Delivery"}
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap: "14px" }}>
                {(isViewLogin ? VIEW_LOGIN_STEPS : CHAR_ID_STEPS).map(([title, desc], i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "12px", fontWeight: 900, color: "#fff", flexShrink: 0, marginTop: "1px",
                      boxShadow: `0 2px 10px ${accentColor}44`,
                    }}>{i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "3px" }}>{title}</div>
                      <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accepted methods note */}
              {isViewLogin && (
                <div style={{ margin: "0 28px 24px", padding: "12px 16px", background: `${accentColor}0d`, borderRadius: "10px", border: `1px solid ${accentColor}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: accentColor, fontWeight: 700, marginBottom: "8px" }}>
                    <Shield size={13} /> Accepted Login Methods
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["Facebook", "X (Twitter)"].map(m => (
                      <span key={m} style={{ fontSize: "12px", padding: "4px 12px", borderRadius: "20px", background: `${accentColor}18`, border: `1px solid ${accentColor}33`, color: "#93c5fd", fontWeight: 600 }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {!isViewLogin && (
                <div style={{ margin: "0 28px 24px", padding: "12px 16px", background: `${accentColor}0d`, borderRadius: "10px", border: `1px solid ${accentColor}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: accentColor, fontWeight: 700 }}>
                    <CheckCircle size={13} /> No credentials needed — just your in-game Character ID. Fastest & safest option! ⚡
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── UC PACKS ──────────────────────────────────────── */}
        <section style={{ padding: "32px 5% 60px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-h)" }}>
                {isViewLogin ? "🔑 View Login UC Packs" : "🎮 Character ID UC Packs"}
              </h3>
              <span style={{ fontSize: "12px", color: "var(--muted)", background: "var(--card)", padding: "3px 10px", borderRadius: "20px", border: "1px solid var(--border)" }}>
                {activePacks.filter(p => p.status !== 'sold_out').length} Available
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
              </div>
            ) : activePacks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)" }}>
                <UcImg size={52} />
                <p style={{ color: "var(--muted)", marginTop: "16px", fontSize: "15px" }}>
                  No UC packs available for this method right now.<br />
                  <strong style={{ color: "var(--text)" }}>Contact us directly to check availability!</strong>
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                  <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", background: "#25D366", color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "10px", background: "#0088cc", color: "#fff", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                    <Send size={15} /> Telegram
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,300px), 1fr))", gap: "20px" }}>
                {activePacks.map(pack => (
                  <UcPackCard key={pack.id} pack={pack} accentColor={accentColor} contactPrefix={contactPrefix} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── WHY CHOOSE US ─────────────────────────────────── */}
        <section className="section-alt" style={{ textAlign: "center" }}>
          <div className="card" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px" }}>
            <h3 style={{ marginBottom: "28px", fontFamily: "var(--font-h)", fontSize: "22px" }}>Why choose MBS UC Service?</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "28px" }}>
              {[
                ["🛡️", "100% Safe", "No risk of ban. Official methods only."],
                ["⚡", "Fast Delivery", "UC added within 6–24 hours."],
                ["💰", "Cheapest Price", "Lower than the official in-game store."],
                ["🔒", "Data Privacy", "Credentials deleted immediately after use."],
              ].map(([emoji, title, desc]) => (
                <div key={title}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>{emoji}</div>
                  <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "16px", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
