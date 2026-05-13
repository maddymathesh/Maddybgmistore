import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Lock, Link2, MessageCircle, CheckCircle, ShoppingBag, Banknote, ShoppingCart, Loader2 } from "lucide-react";

// ── YouTube embed helper ──────────────────────────────────────
function getEmbed(url) {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const s = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (s) return `https://www.youtube-nocookie.com/embed/${s[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${s[1]}`;
  const w = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (w) return `https://www.youtube-nocookie.com/embed/${w[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${w[1]}`;
  return null;
}

// ── SVG icons ─────────────────────────────────────────────────
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TgIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" style={{ flexShrink: 0 }}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// ── Login badge ───────────────────────────────────────────────
function LoginBadge({ type }) {
  const t = (type || "").toLowerCase();
  const isX = t.includes("twitter") || t === "x";
  const isFb = t.includes("facebook") || t.includes("fb");
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
      background: isX ? "rgba(0,0,0,0.5)" : isFb ? "rgba(24,119,242,0.15)" : "rgba(66,133,244,0.15)",
      border: isX ? "1px solid rgba(255,255,255,0.2)" : isFb ? "1px solid rgba(24,119,242,0.4)" : "1px solid rgba(66,133,244,0.4)",
      color: isX ? "#fff" : isFb ? "#4A9FFF" : "#4285F4",
    }}>
      {isX ? "𝕏" : isFb ? "f" : "G"} {type}
    </span>
  );
}

// ── Account Card ──────────────────────────────────────────────
function StockCard({ stock }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const embed = getEmbed(stock.youtube_url || stock.video_url);
  const loginBadges = (stock.login_type || "").split(",").map(l => l.trim()).filter(Boolean);
  const loginCount = loginBadges.length;
  const wa = `https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20this%20account%20listed%20for%20₹${stock.price}.%20${encodeURIComponent(stock.title)}`;

  return (
    <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>

      {/* Tier badge */}
      <div style={{ padding: "14px 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", letterSpacing: "1px", fontFamily: "var(--font-h)", textTransform: "uppercase" }}>
          🔥 {stock.category || "Premium"} Account
        </span>
      </div>

      {/* Video */}
      {embed && (
        <div style={{ margin: "12px 20px 0", borderRadius: "10px", overflow: "hidden", background: "#000" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe src={embed} title="Account Preview"
              allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>
      )}

      {/* Title + badges */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", lineHeight: 1.6, marginBottom: "12px" }}>
          🇮🇳 {stock.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {loginBadges.map((b, i) => <LoginBadge key={i} type={b} />)}
          {loginCount >= 2 ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", color: "#FBBF24" }}>
              <Link2 size={11} /> Unlink Guarantee
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", color: "#22C55E" }}>
              <Lock size={11} /> Safe &amp; Secured
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "14px 20px", maxHeight: "200px", overflowY: "auto", fontSize: "13px", color: "var(--muted)", lineHeight: 2, whiteSpace: "pre-line", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "thin", scrollbarColor: "rgba(255,215,0,0.15) transparent" }}>
        {stock.description}
      </div>

      {/* Price + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 flex-wrap">
        {user ? (
          <>
            <div style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 800, color: "var(--gold)", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: "10px", padding: "8px 18px", alignSelf: "flex-start" }}>
              ₹{Number(stock.price).toLocaleString("en-IN")} INR
            </div>
            <a href={wa} target="_blank" rel="noreferrer"
              className="w-full sm:w-auto"
              style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "10px 22px", borderRadius: "8px", background: "#22C55E", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.5px" }}>
              <WaIcon /> BUY NOW
            </a>
            <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
              className="w-full sm:w-auto"
              style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "7px", padding: "10px 22px", borderRadius: "8px", background: "#229ED9", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.5px" }}>
              <TgIcon /> BUY NOW
            </a>
          </>
        ) : (
          <button
            onClick={() => navigate("/login", { state: { from: "/readystocks" } })}
            className="w-full sm:w-auto"
            style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "10px", padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.06))", border: "1px solid rgba(255,215,0,0.35)", color: "var(--gold)", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", letterSpacing: "0.5px", cursor: "pointer", transition: "all .2s" }}
          >
            <Lock size={15} /> Login to See Price
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function ReadyStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("available");

  useEffect(() => {
    const fetchStocks = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setStocks(data);
      setLoading(false);
    };
    fetchStocks();
  }, []);

  const filtered = stocks.filter(s => {
    const matchSearch = !search ||
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || s.category?.toLowerCase() === category.toLowerCase();
    const matchStatus = status === "all" || (status === "available" ? s.status === "available" : s.status !== "available");
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>
        
        <section style={{ position: "relative", width: "100%", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/ready-stocks-banner.png" alt="Banner" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4)" }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
             <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(34px, 6vw, 72px)", fontWeight: 900 }}>Ready To Play <br/><span className="g">Accounts</span></h1>
          </div>
        </section>

        <section className="section-alt">
          <div style={{ maxWidth: "960px", margin: "0 auto" }}>
            <div style={{ background: "var(--card)", padding: "16px", borderRadius: "14px", display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ flex: 1 }} />
              <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ width: "180px" }}>
                <option value="all">All Categories</option>
                <option value="budget">Budget</option>
                <option value="midrange">Mid Range</option>
                <option value="premium">Premium</option>
                <option value="ultrapremium">Ultra Premium</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "100px" }}><Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} /></div>
            ) : (
              filtered.map(stock => <StockCard key={stock.id} stock={stock} />)
            )}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
