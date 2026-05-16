import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Lock, Link2, MessageCircle, CheckCircle, ShoppingBag, Banknote, ShoppingCart, Loader2, Play, ChevronRight, Send } from "lucide-react";

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

const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
);

function LoginBadge({ type }) {
  const t = (type || "").toLowerCase();
  let icon = "G", color = "#4285F4", bg = "rgba(66,133,244,0.1)";
  if (t.includes("facebook") || t === "fb") { icon = "f"; color = "#4A9FFF"; bg = "rgba(24,119,242,0.1)"; }
  else if (t.includes("twitter") || t === "x") { icon = "𝕏"; color = "#fff"; bg = "rgba(255,255,255,0.05)"; }
  else if (t.includes("apple")) { icon = ""; color = "#fff"; bg = "rgba(255,255,255,0.05)"; }
  else if (t.includes("google") || t.includes("playgames")) { icon = "G"; color = "#4285F4"; bg = "rgba(66,133,244,0.1)"; }
  else if (t.includes("whats app") || t.includes("whatsapp")) { icon = "W"; color = "#25D366"; bg = "rgba(37,211,102,0.1)"; }

  return (
    <span className="login-badge" style={{ color, background: bg, border: `1px solid ${color}33` }}>
      {icon} {type}
    </span>
  );
}

function StockCard({ stock }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const embed = getEmbed(stock.youtube_url || stock.video_url);
  const primaryLogin = stock.primary_login || stock.login_type?.split(",")[0]?.trim();
  const secondaryLogin = stock.secondary_login;
  const guarantee = stock.unlink_guarantee || "Safe & Secured";
  const wa = `https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20this%20account%20listed%20for%20₹${stock.price}.%20${encodeURIComponent(stock.title)}`;

  return (
    <div className="premium-card">
      <div className="card-video-wrap">
        {embed ? (
          <iframe src={embed} title="Preview" allow="autoplay; encrypted-media" allowFullScreen className="card-iframe" />
        ) : (
          <div className="no-video"><Play size={40} /></div>
        )}
        <div className="card-tier-badge">{stock.category || "Premium"}</div>
        {stock.status && stock.status !== 'available' && (
          <div className={`card-status-badge ${stock.status}`}>{stock.status}</div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{stock.title}</h3>
        
        <div className="card-badges-row">
          {primaryLogin && <LoginBadge type={primaryLogin} />}
          {secondaryLogin && <LoginBadge type={secondaryLogin} />}
          <span className="guarantee-badge">
            <CheckCircle size={12} /> {guarantee}
          </span>
        </div>

        <p className="card-desc">{stock.description}</p>

        <div className="card-footer">
          {user ? (
            <>
              <div className="card-price-wrap">
                <span className="price-label">LISTING PRICE</span>
                <span className="price-val">₹{Number(stock.price).toLocaleString("en-IN")}</span>
              </div>
              <div className="card-actions">
                <a href={wa} target="_blank" rel="noreferrer" className="action-btn wa"><WaIcon /> <span>WhatsApp</span></a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="action-btn tg"><Send size={16} /> <span>Telegram</span></a>
              </div>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="login-to-view">
              <Lock size={14} /> Login to see price & contact
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReadyStocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setStocks(data); setLoading(false); });
  }, []);

  const filtered = stocks.filter(s => {
    const mSearch = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    const mCat = category === "all" || s.category?.toLowerCase() === category.toLowerCase();
    const mStat = status === "all" || s.status === status;
    return mSearch && mCat && mStat;
  });

  return (
    <>
      <Navbar />
      <div className="rs-page">
        <section className="rs-hero">
          <img src="/ready-stocks-banner.png" alt="" className="hero-bg" />
          <div className="hero-content">
            <h1 className="stitle">Ready To Play <br/><span className="g">Accounts</span></h1>
            <p className="ssub">Premium BGMI IDs handpicked for elite gamers.</p>
          </div>
        </section>

        <div className="rs-container">
          <div className="filter-bar sticky">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="select-group">
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="all">All Tiers</option>
                <option value="Budget">Budget</option>
                <option value="Mid Range">Mid Range</option>
                <option value="Premium">Premium</option>
                <option value="Ultra Premium">Ultra Premium</option>
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="stocks-grid">
            {loading ? (
              <div className="loading-state"><Loader2 className="animate-spin" size={40} /></div>
            ) : filtered.length > 0 ? (
              filtered.map(stock => <StockCard key={stock.id} stock={stock} />)
            ) : (
              <div className="no-results">No accounts found matching your criteria.</div>
            )}
          </div>
        </div>

        <style>{`
          .rs-page { background: var(--bg); color: #fff; min-height: 100vh; padding-top: 84px; }
          .rs-hero { position: relative; height: 50vh; display: flex; alignItems: center; justifyContent: center; overflow: hidden; }
          .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; objectFit: cover; filter: brightness(0.3); transform: scale(1.1); }
          .hero-content { position: relative; zIndex: 2; textAlign: center; }
          
          .rs-container { maxWidth: 1100px; margin: 0 auto; padding: 40px 20px; }
          
          .filter-bar { 
            background: rgba(17, 21, 32, 0.8); backdrop-filter: blur(15px);
            padding: 15px; border-radius: 16px; border: 1px solid var(--border-gold);
            display: flex; gap: 15px; margin-bottom: 40px; flex-wrap: wrap;
            z-index: 10;
          }
          .filter-bar.sticky { position: sticky; top: 100px; }
          .search-box { flex: 1; min-width: 200px; background: rgba(255,255,255,0.05); border-radius: 10px; display: flex; alignItems: center; padding: 0 15px; color: var(--gold); }
          .search-box input { background: none; border: none; padding: 12px; color: #fff; width: 100%; outline: none; }
          .select-group { display: flex; gap: 10px; }
          .filter-bar select { background: rgba(255,255,255,0.05); color: #fff; border: none; padding: 12px 20px; border-radius: 10px; outline: none; cursor: pointer; }

          .stocks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; }
          
          .premium-card { 
            background: var(--card); border: 1px solid var(--border-gold); 
            border-radius: 20px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
          }
          .premium-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); border-color: var(--gold); }
          
          .card-video-wrap { position: relative; padding-top: 56.25%; background: #000; border-bottom: 1px solid var(--border); }
          .card-iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
          .card-tier-badge { position: absolute; top: 15px; left: 15px; background: var(--gold); color: #000; font-weight: 800; font-size: 10px; padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px; }
          .card-status-badge { position: absolute; top: 15px; right: 15px; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
          .card-status-badge.sold { background: #ef4444; color: #fff; }
          .card-status-badge.available { background: #22c55e; color: #fff; }

          .card-body { padding: 25px; flex: 1; display: flex; flex-direction: column; }
          .card-title { font-size: 16px; font-family: var(--font-h); font-weight: 700; margin-bottom: 15px; color: #fff; line-height: 1.4; height: 45px; overflow: hidden; }
          .card-badges-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
          .login-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: flex; alignItems: center; gap: 6px; }
          .guarantee-badge { border: 1px solid rgba(255,215,0,0.2); background: rgba(255,215,0,0.05); color: var(--gold); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: flex; alignItems: center; gap: 6px; }
          
          .card-desc { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 25px; height: 80px; overflow-y: auto; scrollbar-width: none; }
          
          .card-footer { border-top: 1px solid var(--border); padding-top: 20px; margin-top: auto; }
          .card-price-wrap { display: flex; flex-direction: column; margin-bottom: 15px; }
          .price-label { font-size: 10px; color: var(--muted); letter-spacing: 1px; }
          .price-val { font-size: 28px; font-family: var(--font-h); font-weight: 900; color: var(--gold); }
          
          .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .action-btn { display: flex; alignItems: center; justifyContent: center; gap: 8px; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; text-decoration: none; color: #fff; transition: transform 0.2s; }
          .action-btn:hover { transform: scale(1.05); }
          .action-btn.wa { background: #25D366; }
          .action-btn.tg { background: #229ED9; }
          
          .login-to-view { width: 100%; padding: 15px; background: var(--gold-dim); border: 1px solid var(--border-gold); color: var(--gold); border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; alignItems: center; justifyContent: center; gap: 10px; }
          
          .loading-state { grid-column: 1/-1; text-align: center; padding: 100px; color: var(--gold); }
          .no-results { grid-column: 1/-1; text-align: center; padding: 50px; color: var(--muted); font-size: 18px; }

          @media (max-width: 768px) {
            .filter-bar { position: static; }
            .select-group { width: 100%; }
            .select-group select { flex: 1; }
            .rs-hero { height: 40vh; }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
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
// ── Login badge ───────────────────────────────────────────────
function LoginBadge({ type }) {
  const t = (type || "").toLowerCase();
  
  // Define icons/colors for each platform
  let icon = "G";
  let color = "#4285F4";
  let bg = "rgba(66,133,244,0.15)";
  let border = "rgba(66,133,244,0.4)";

  if (t.includes("facebook") || t === "fb") {
    icon = "f";
    color = "#4A9FFF";
    bg = "rgba(24,119,242,0.15)";
    border = "rgba(24,119,242,0.4)";
  } else if (t.includes("twitter") || t === "x") {
    icon = "𝕏";
    color = "#fff";
    bg = "rgba(0,0,0,0.5)";
    border = "rgba(255,255,255,0.2)";
  } else if (t.includes("apple")) {
    icon = "";
    color = "#fff";
    bg = "rgba(255,255,255,0.1)";
    border = "rgba(255,255,255,0.3)";
  } else if (t.includes("game center")) {
    icon = "🎮";
    color = "#FF4B2B";
    bg = "rgba(255,75,43,0.15)";
    border = "rgba(255,75,43,0.4)";
  } else if (t.includes("google") || t.includes("playgames")) {
    icon = "G";
    color = "#4285F4";
    bg = "rgba(66,133,244,0.15)";
    border = "rgba(66,133,244,0.4)";
  } else if (t.includes("whats app") || t.includes("whatsapp")) {
    icon = "W";
    color = "#25D366";
    bg = "rgba(37,211,102,0.15)";
    border = "rgba(37,211,102,0.4)";
  }

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
      background: bg, border: `1px solid ${border}`, color: color,
    }}>
      <span style={{ fontSize: "14px" }}>{icon}</span> {type}
    </span>
  );
}

// ── Account Card ──────────────────────────────────────────────
function StockCard({ stock }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const embed = getEmbed(stock.youtube_url || stock.video_url);
  
  // New login fields
  const primaryLogin = stock.primary_login || stock.login_type?.split(",")[0]?.trim();
  const secondaryLogin = stock.secondary_login;
  const guarantee = stock.unlink_guarantee || (stock.login_type?.includes(",") ? "Unlink Guarantee" : "Safe & Secured");
  
  const wa = `https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20this%20account%20listed%20for%20₹${stock.price}.%20${encodeURIComponent(stock.title)}`;

  return (
    <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>

      {/* Video at top */}
      {embed && (
        <div style={{ borderRadius: "16px 16px 0 0", overflow: "hidden", background: "#000", borderBottom: "1px solid rgba(255,215,0,0.15)" }}>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe src={embed} title="Account Preview"
              allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>
      )}

      {/* Tier badge + Status */}
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <span style={{ background: "linear-gradient(135deg,#f97316,#ef4444)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", letterSpacing: "1px", fontFamily: "var(--font-h)", textTransform: "uppercase" }}>
          🔥 {stock.category || "Premium"} Account
        </span>
        {stock.status && stock.status !== 'available' && (
          <span style={{ 
            background: stock.status === 'sold' ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.15)", 
            color: stock.status === 'sold' ? "#ef4444" : "#FBBF24",
            border: stock.status === 'sold' ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(251,191,36,0.3)",
            fontSize: "10px", fontWeight: 800, padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase" 
          }}>
            {stock.status.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Title + badges */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", lineHeight: 1.6, marginBottom: "12px" }}>
          🇮🇳 {stock.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {primaryLogin && <LoginBadge type={primaryLogin} />}
          {secondaryLogin && <LoginBadge type={secondaryLogin} />}
          
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "5px", 
            padding: "4px 12px", 
            borderRadius: "20px", 
            fontSize: "12px", 
            fontWeight: 600, 
            background: guarantee.toLowerCase().includes("single") ? "rgba(34,197,94,0.12)" : "rgba(251,191,36,0.12)", 
            border: `1px solid ${guarantee.toLowerCase().includes("single") ? "rgba(34,197,94,0.35)" : "rgba(251,191,36,0.35)"}`, 
            color: guarantee.toLowerCase().includes("single") ? "#22C55E" : "#FBBF24" 
          }}>
            {guarantee.toLowerCase().includes("single") ? <Lock size={11} /> : <Link2 size={11} />}
            {guarantee}
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: "14px 20px", maxHeight: "200px", overflowY: "auto", fontSize: "13px", color: "var(--muted)", lineHeight: 2, whiteSpace: "pre-line", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "thin", scrollbarColor: "rgba(255,215,0,0.15) transparent" }}>
        {stock.description}
      </div>

      {/* Price + Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 flex-wrap">
        {user ? (
          <>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px", letterSpacing: "1px" }}>Price</div>
              <div style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 900, color: "var(--gold)" }}>
                ₹{Number(stock.price).toLocaleString("en-IN")}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flex: 1, width: "100%", flexWrap: "wrap" }}>
              <a href={wa} target="_blank" rel="noreferrer"
                className="btn-wa"
                style={{ flex: 1, minWidth: "140px", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "12px", background: "#22C55E", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", transition: "all .2s" }}>
                <WaIcon /> WhatsApp
              </a>
              <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer"
                className="btn-tg"
                style={{ flex: 1, minWidth: "140px", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "12px", background: "#229ED9", color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", textDecoration: "none", transition: "all .2s" }}>
                <TgIcon /> Telegram
              </a>
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/login", { state: { from: "/readystocks" } })}
            className="w-full"
            style={{ display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "10px", padding: "14px 24px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(255,215,0,0.12),rgba(255,215,0,0.06))", border: "1px solid rgba(255,215,0,0.35)", color: "var(--gold)", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "14px", letterSpacing: "0.5px", cursor: "pointer", transition: "all .3s" }}
          >
            <Lock size={16} /> Login to See Price & Contact
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
  const [status, setStatus] = useState("all");

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
    const matchStatus = status === "all" || s.status === status;
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
              <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ width: "160px" }}>
                <option value="all">All Tiers</option>
                <option value="Budget">Budget</option>
                <option value="Mid Range">Mid Range</option>
                <option value="Premium">Premium</option>
                <option value="Ultra Premium">Ultra Premium</option>
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input" style={{ width: "160px" }}>
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="sold">Sold</option>
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
