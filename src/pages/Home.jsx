import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Gamepad2, ShoppingCart, Banknote, CheckCircle, Zap, Shield, Star, Trophy, Lock, Smartphone, CircleDollarSign, Car, Coins, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import CountUp from "../components/CountUp";
import LightRays from "../components/LightRays";

const connectChannels = [
  {
    name: "WhatsApp",
    desc: "Official WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029VbAuBtrIXnlpr3jvnN13",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    desc: "Official Telegram Channel",
    href: "https://t.me/maddy_bgmistore",
    color: "#229ED9",
    bg: "rgba(34,158,217,0.12)",
    border: "rgba(34,158,217,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    desc: "Official Instagram",
    href: "https://www.instagram.com/maddy_bgmistore/",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.12)",
    border: "rgba(225,48,108,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    desc: "Official Youtube Channel",
    href: "https://www.youtube.com/channel/UCvQJ9PCTM4-hNpKH8R8lJTw",
    color: "#FF0000",
    bg: "rgba(255,0,0,0.12)",
    border: "rgba(255,0,0,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [avgRating, setAvgRating] = useState(4.8);
  const [buyerReviews, setBuyerReviews] = useState([]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('stars')
          .eq('status', 'approved');
        
        if (!error && data && data.length > 0) {
          const totalStars = data.reduce((sum, r) => sum + (r.stars || 5), 0);
          const avg = (totalStars / data.length).toFixed(1);
          setAvgRating(parseFloat(avg));
        }
      } catch (err) {
        console.warn("Could not fetch ratings, using default 4.8", err);
      }
    };
    const fetchLatestReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (!error && data) {
          setBuyerReviews(data);
        }
      } catch (err) {
        console.warn("Could not fetch buyer reviews for homepage", err);
      }
    };
    fetchAverageRating();
    fetchLatestReviews();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        {/* HERO */}
        <section style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 5% 60px", position: "relative", overflow: "hidden" }}>
        {/* Brand Banner Background */}
        <img
          src="/hero-banner.webp"
          alt="BGMI battlefield hero banner"
          fetchpriority="high"
          decoding="async"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", zIndex:0 }}
        />
        {/* Dark gradient overlay so text is readable */}
        <div style={{ position:"absolute", inset:0, zIndex:1, background:"linear-gradient(to bottom, rgba(8,10,15,0.55) 0%, rgba(8,10,15,0.72) 60%, rgba(8,10,15,0.97) 100%)" }} />

        {/* Light Rays Effect */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#FFD700"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={false}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>

        <div style={{ position:"relative", zIndex:2, maxWidth:"820px", margin:"0 auto" }} className="fade-up">
          <div className="badge">South India's #1 Trusted BGMI Account Marketplace</div>
          <h1 style={{ fontFamily:"var(--font-h)", fontSize:"clamp(42px,8vw,92px)", fontWeight:700, lineHeight:1, letterSpacing:"2px", marginBottom:"22px" }}>
            Your Dream<br /><span className="g">BGMI Account</span><br />Awaits
          </h1>
          <p style={{ color:"var(--muted)", fontSize:"clamp(14px,2vw,17px)", maxWidth:"560px", margin:"0 auto 40px" }}>
            Buy and sell verified BGMI accounts safely — budget to premium. Trusted by 2000+ players since 2019.
          </p>
          <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/buy" className="btn btn-outline-gold" style={{ display:"inline-flex", alignItems:"center", gap:"7px" }}><ShoppingCart size={15} /> Buy An Account</Link>
            <Link to="/sell" className="btn btn-green" style={{ display:"inline-flex", alignItems:"center", gap:"7px" }}><Banknote size={15} /> Sell Your Account</Link>
          </div>
          <div style={{ display:"flex", gap:"24px", justifyContent:"center", marginTop:"40px", flexWrap:"wrap" }}>
            {[
              [<CheckCircle size={13} />, "Verified Accounts"],
              [<Zap size={13} />, "Fast Delivery"],
              [<Shield size={13} />, "Safe Single Logins"],
              [<Star size={13} />, "Since 2019"],
              [<Trophy size={13} />, "2000+ Buyers"],
            ].map(([icon, text], i) => (
              <span key={i} style={{ fontSize:"13px", color:"var(--muted)", fontWeight:600, display:"inline-flex", alignItems:"center", gap:"5px" }}>
                <span style={{ color:"var(--gold)" }}>{icon}</span>{text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-n">
            <CountUp from={0} to={2000} duration={2} separator="," />+
          </div>
          <div className="stat-l">Happy Buyers</div>
        </div>
        <div className="stat">
          <div className="stat-n" style={{ whiteSpace: "nowrap" }}>
            ₹<CountUp from={0} to={60} duration={2} /> Lakhs+
          </div>
          <div className="stat-l">Worth of Accounts Sold to Date</div>
        </div>
        <div className="stat">
          <div className="stat-n">
            <CountUp from={0} to={7} duration={2} /> Yrs
          </div>
          <div className="stat-l">Trusted Since 2019</div>
        </div>
        <div className="stat">
          <div className="stat-n">
            <CountUp from={0} to={avgRating} duration={2} /> ★
          </div>
          <div className="stat-l">Star Rated</div>
        </div>
      </div>

      {/* WHAT WE OFFER */}
      <section className="section">
        <div className="slabel">What We Offer</div>
        <h2 className="stitle">Your All-in-One BGMI Marketplace</h2>
        <p className="ssub" style={{ marginBottom: "40px" }}>Your complete gaming catalog. Simple, highly secure, and verified marketplace.</p>
        
        {/* Tier 1: Core Offerings (Buying, Selling, Exchanging) */}
        <div className="core-grid">
          {/* Buy Card */}
          <div className="home-card-offer card-buy-core">
            <div style={{ position: "absolute", top: "24px", right: "24px", opacity: 0.15, color: "var(--gold)" }}><ShoppingCart size={68} /></div>
            <div>
              <span style={{ fontSize: "10px", background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--gold-border)", padding: "4px 10px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Secure Purchase</span>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 800, marginTop: "12px", marginBottom: "8px", color: "#fff" }}>Explore Verified Accounts</h3>
              <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                Choose between instant-delivery Ready-to-Play listings, market-available channel deals, or request custom-sourced profiles tailored to your exact budget and skin requirements within 24-48 hours.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "grid", gap: "8px" }}>
                {[
                  "🎮 Ready-to-Play: Hand-secured verified listings",
                  "📢 Market Available: Channel deals posted daily",
                  "⚡ Custom Sourcing: Sourced to budget in 48 hours"
                ].map(item => (
                  <li key={item} style={{ fontSize: "12px", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/buy" className="btn btn-outline-gold" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px", fontSize: "13px", textDecoration: "none" }}>
              <ShoppingCart size={14} /> Click here to buy an account <ArrowRight size={13} />
            </Link>
          </div>

          {/* Sell Card */}
          <div className="home-card-offer card-sell-core">
            <div style={{ position: "absolute", top: "24px", right: "24px", opacity: 0.15, color: "#10b981" }}><CircleDollarSign size={68} /></div>
            <div>
              <span style={{ fontSize: "10px", background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)", padding: "4px 10px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Transparent Deal</span>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 800, marginTop: "12px", marginBottom: "8px", color: "#fff" }}>Sell & Get Instant Cash</h3>
              <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                Sell your BGMI account securely with direct, transparent evaluation rates and immediate cash-out via UPI, Bank Transfer, or Cash deals.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "grid", gap: "8px" }}>
                {[
                  "💰 Top Market Valuation: Immediate fair rates",
                  "⚡ Instant Cashouts: Dispatched via UPI & Cash",
                  "🛡️ 100% Safe Escrow: Fully secured transparency"
                ].map(item => (
                  <li key={item} style={{ fontSize: "12px", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/sell" className="btn btn-green" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px", fontSize: "13px", textDecoration: "none" }}>
              <CircleDollarSign size={14} /> Click here to sell your account <ArrowRight size={13} />
            </Link>
          </div>

          {/* Exchange Card */}
          <div className="home-card-offer card-exchange-core">
            <div style={{ position: "absolute", top: "24px", right: "24px", opacity: 0.15, color: "#a855f7" }}><RefreshCw size={68} /></div>
            <div>
              <span style={{ fontSize: "10px", background: "rgba(168,85,247,0.1)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)", padding: "4px 10px", borderRadius: "100px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>Secure Trade</span>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 800, marginTop: "12px", marginBottom: "8px", color: "#fff" }}>Trade Up to Your Dream Account</h3>
              <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>
                Swap your existing BGMI account for any higher or lower tier listing on our platform, supported by secure appraisal valuations and escrow protection.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "grid", gap: "8px" }}>
                {[
                  "🔄 Tier Upgrades: Swap for premium inventory",
                  "🛡️ Escrow Trade Protection: Dual handover security",
                  "🤝 Fair Valuation: Instant adjustment appraisals"
                ].map(item => (
                  <li key={item} style={{ fontSize: "12px", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/exchange" className="btn btn-purple" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 22px", fontSize: "13px", textDecoration: "none" }}>
              <RefreshCw size={14} /> Click here to exchange your account <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Tier 2: Expanded Catalog (UC, X-Suit, Supercar) */}
        <div style={{ textAlign: "center", marginTop: "48px", marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--gold)", letterSpacing: "2px", textTransform: "uppercase" }}>
            ⚡ ADDITIONAL CATALOG & ELITE SERVICES
          </div>
        </div>

        <div className="catalog-grid">
          {/* UC Purchase */}
          <div className="sub-tile tile-uc">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}><Coins size={20} /></div>
              <span style={{ fontSize: "9px", background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "2px 6px", borderRadius: "4px", fontWeight: 900 }}>FAST</span>
            </div>
            <h4 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, margin: "0 0 6px", color: "#fff" }}>UC Packs Store</h4>
            <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: 1.5, margin: "0 0 20px" }}>Instant UC Top-ups using your Character ID or secure View Login methods.</p>
            <Link to="/services/uc" className="btn btn-blue w-full" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", fontSize: "12px", textDecoration: "none" }}>
              Buy UC Packs →
            </Link>
          </div>

          {/* X-Suits Gifting */}
          <div className="sub-tile tile-xsuit">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", border: "1px solid rgba(168,85,247,0.2)" }}><Sparkles size={20} /></div>
              <span style={{ fontSize: "9px", background: "rgba(168,85,247,0.15)", color: "#c084fc", padding: "2px 6px", borderRadius: "4px", fontWeight: 900 }}>EXCLUSIVE</span>
            </div>
            <h4 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, margin: "0 0 6px", color: "#fff" }}>X-Suit Gifting Deals</h4>
            <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: 1.5, margin: "0 0 20px" }}>Acquire legendary X-Suit packages safely at a fraction of standard draw prices.</p>
            <Link to="/services/xsuit" className="btn btn-purple w-full" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", fontSize: "12px", textDecoration: "none" }}>
              Explore X-Suits →
            </Link>
          </div>

          {/* Supercars Gifting */}
          <div className="sub-tile tile-supercar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fb923c", border: "1px solid rgba(249,115,22,0.2)" }}><Car size={20} /></div>
              <span style={{ fontSize: "9px", background: "rgba(249,115,22,0.15)", color: "#fb923c", padding: "2px 6px", borderRadius: "4px", fontWeight: 900 }}>EXOTIC</span>
            </div>
            <h4 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, margin: "0 0 6px", color: "#fff" }}>Supercar Gifting Events</h4>
            <p style={{ color: "var(--muted)", fontSize: "12px", lineHeight: 1.5, margin: "0 0 20px" }}>Drive home your dream 1-Card, 2-Card, or 3-Card sports vehicle variants.</p>
            <Link to="/services/supercar" className="btn btn-orange w-full" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", fontSize: "12px", textDecoration: "none" }}>
              Explore Cars →
            </Link>
          </div>
        </div>
      </section>

      {/* CONNECT WITH US */}
      <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ textAlign: "center", paddingBottom: "40px" }}>
          <div style={{ fontFamily: "var(--font-h)", fontSize: "12px", fontWeight: 700, color: "var(--gold)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>
            CONNECT WITH US
          </div>
          <h2 className="stitle" style={{ fontSize: "clamp(32px,4vw,56px)", marginBottom: "12px" }}>
            Find Us <span style={{ color: "var(--gold)" }}>Everywhere</span>
          </h2>
          <p className="ssub" style={{ margin: "0 auto", maxWidth: "500px" }}>
            Join our official communities for latest listings, updates and deals.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          {connectChannels.map((ch) => (
            <a
              key={ch.name}
              href={ch.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "var(--card)",
                border: `1px solid ${ch.border}`,
                borderRadius: "14px",
                padding: "18px 20px",
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${ch.bg}`;
                e.currentTarget.style.background = ch.bg;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "var(--card)";
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: ch.bg,
                border: `1px solid ${ch.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: ch.color,
                flexShrink: 0,
              }}>
                {ch.icon}
              </div>
              {/* Text */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "15px", color: "#fff", marginBottom: "3px" }}>
                  {ch.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {ch.desc}
                </div>
              </div>
              {/* Arrow */}
              <div style={{ marginLeft: "auto", color: ch.color, fontSize: "18px", flexShrink: 0 }}>→</div>
            </a>
          ))}
        </div>
      </section>

      {/* ABOUT */}
         <section className="section-alt">
        <div className="slabel">Our Story</div>
        <h2 className="stitle">About Maddy BGMI Store</h2>
        <div style={{ background:"var(--card)", border:"1px solid var(--border-gold)", borderRadius:"var(--radius)", padding:"clamp(24px, 5vw, 40px)", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap:"40px", alignItems:"start" }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-h)", fontSize:"24px", fontWeight:700, marginBottom:"16px" }}>From Maddy Recovery Hub to South India’s Most Trusted BGMI Marketplace</h3>
            <p style={{ color:"var(--muted)", fontSize:"14px", lineHeight:1.8, marginBottom:"12px" }}>Our journey began in 2019 with a singular mission: bringing absolute security and technical credibility to the gaming community. By resolving complex login issues and recovering high-value assets, we established a gold standard of safety that became the core DNA of the <strong>Maddy BGMI Store</strong>.</p>
            <p style={{ color:"var(--muted)", fontSize:"14px", lineHeight:1.8 }}>Through years of organic growth, expanding communities, and evolving gaming demands, we transitioned into the region's premier hub for verified accounts, elite skins, and instant in-game services. Today, every single handover is secure, every purchase is certified, and our legacy of trust since 2019 stands stronger than ever.</p>
          </div>
          <ul style={{ listStyle:"none", position:"relative", paddingLeft:"24px" }}>
            <div style={{ position:"absolute", left:"7px", top:"8px", bottom:"8px", width:"2px", background:"linear-gradient(to bottom, var(--gold), var(--orange))" }} />
            {[
              ["2019", "Launched Maddy Recovery Hub, helping recover over 1,000 hacked or locked BGMI accounts worth ₹30L+ and establishing ultimate technical trust."],
              ["2020", "Formed the Maddy BGMI Store as an exclusive WhatsApp trading group starting with 238 passionate members."],
              ["2021", "Expanded our presence to official channels across Telegram, Instagram, and YouTube to reach gaming communities nationwide."],
              ["2022", "Reached 800+ happy buyers and ₹20L in trading volume, introducing high-value, secure face-to-face deals across South India."],
              ["2023", "Crossed 1,000+ successful account handovers and ₹60L in lifetime sales volume, adding premium X-Suits and Supercars to our portfolio."],
              ["2024", "Refined our buyer guarantees and expanded our services to character ID top-ups and safe UC/X-Suit gifting catalog streams."],
              ["2025", "Built an automated secure customer database, providing secure exchanges and professional invoices for high-end players."],
              ["2026", "Fully launched our premium high-speed website, offering instant transfer, fair market pricing, and multiple secure payment modes. 🎉"]
            ].map(([yr,desc]) => (
              <li key={yr} style={{ position:"relative", marginBottom:"22px" }}>
                <div style={{ position:"absolute", left:"-20px", top:"7px", width:"10px", height:"10px", borderRadius:"50%", background:"var(--gold)", border:"2px solid var(--bg)" }} />
                <strong style={{ fontFamily:"var(--font-h)", fontSize:"16px", color:"var(--gold)" }}>{yr}</strong>
                <p style={{ color:"var(--muted)", fontSize:"13px", marginTop:"2px" }}>{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="slabel">Why Us</div>
        <h2 className="stitle">Built on Trust</h2>
        <p className="ssub">Seven years, 2000+ happy buyers, and zero compromise on safety.</p>
        <div className="cards">
          {[
            [<Lock size={22} />, "Verified Accounts Only", "Every account goes through manual verification before listing. No fakes, no scams, ever."],
            [<Zap size={22} />, "Instant Delivery", "Once payment is confirmed, account credentials are transferred immediately and securely."],
            [<Banknote size={22} />, "Market-Fair Pricing", "Accounts priced at current market value — fair for both buyers and sellers, always transparent."],
            [<Smartphone size={22} />, "Multiple Payment Modes", "UPI, Bank Transfer, USDT, and Liquid Cash — whatever works best for you."],
          ].map(([icon,h,p]) => (
            <div key={h} className="card">
              <div className="c-icon" style={{ width:52,height:52,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,background:"var(--gold-dim)",border:"1px solid var(--gold-border)",color:"var(--gold)" }}>{icon}</div>
              <h3 style={{ fontFamily:"var(--font-h)",fontSize:"20px",fontWeight:700,marginBottom:8 }}>{h}</h3>
              <p style={{ color:"var(--muted)",fontSize:"13px" }}>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE BUYER REVIEWS & FEEDBACK */}
      <section className="section-alt" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="slabel">Proofs & Feedback</div>
        <h2 className="stitle">What Our Buyers Say</h2>
        <p className="ssub" style={{ marginBottom: "40px" }}>Real feedback and transaction proofs from our verified buyers.</p>
        
        {buyerReviews.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            maxWidth: "1200px",
            margin: "0 auto 40px"
          }}>
            {buyerReviews.map(r => (
              <div key={r.id} className="card" style={{ padding: "24px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--gold)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "16px" }}>
                      {(r.name || "?")[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff" }}>{r.name}</div>
                      {r.tracking_id && <div style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 600 }}>ID: {r.tracking_id}</div>}
                      <div style={{ fontSize: "12px", color: "var(--muted)" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < (r.stars || 5) ? "var(--gold)" : "transparent"} color="var(--gold)" />
                    ))}
                  </div>
                  <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--text)", margin: 0 }}>{r.text}</p>
                </div>
                {r.image_url && (
                  <div style={{ marginTop: "16px", overflow: "hidden", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <img src={r.image_url} alt="Proof" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            Loading live feedback proofs...
          </div>
        )}
        
        <div style={{ textAlign: "center" }}>
          <Link to="/reviews" className="btn btn-outline-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", textDecoration: "none" }}>
            <Star size={15} /> View All Reviews & Proofs →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign:"center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="stitle">Why Are You Waiting For?</h2>
        <p style={{ color:"var(--muted)", marginBottom:"32px" }}>Join 2000+ players who found their dream BGMI account.</p>
        <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
          <Link to="/buy" className="btn btn-outline-gold" style={{ display:"inline-flex", alignItems:"center", gap:"7px" }}><ShoppingCart size={15} /> Buy An Account</Link>
          <Link to="/sell" className="btn btn-green"><CircleDollarSign size={15} /> Sell Your Account</Link>
        </div>
      </section>

      </div>
      <Footer />
      
      <style>{`
        .core-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }
        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .home-card-offer {
          border-radius: 20px;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .home-card-offer:hover {
          transform: translateY(-6px);
        }
        .card-buy-core {
          border: 1px solid rgba(255, 215, 0, 0.15);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(8, 10, 15, 0.98) 100%);
        }
        .card-buy-core:hover {
          border-color: rgba(255, 215, 0, 0.45);
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.15);
        }
        .card-sell-core {
          border: 1px solid rgba(16, 185, 129, 0.15);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(8, 10, 15, 0.98) 100%);
        }
        .card-sell-core:hover {
          border-color: rgba(16, 185, 129, 0.45);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.15);
        }
        .card-exchange-core {
          border: 1px solid rgba(168, 85, 247, 0.15);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(8, 10, 15, 0.98) 100%);
        }
        .card-exchange-core:hover {
          border-color: rgba(168, 85, 247, 0.45);
          box-shadow: 0 15px 40px rgba(168, 85, 247, 0.15);
        }

        .sub-tile {
          border-radius: 16px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: all 0.25s ease;
          background: var(--card);
        }
        .sub-tile:hover {
          transform: translateY(-4px);
        }
        .tile-uc {
          border: 1px solid rgba(59, 130, 246, 0.12);
        }
        .tile-uc:hover {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.08);
        }
        .tile-xsuit {
          border: 1px solid rgba(168, 85, 247, 0.12);
        }
        .tile-xsuit:hover {
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 10px 25px rgba(168, 85, 247, 0.08);
        }
        .tile-supercar {
          border: 1px solid rgba(249, 115, 22, 0.12);
        }
        .tile-supercar:hover {
          border-color: rgba(249, 115, 22, 0.4);
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.08);
        }
        .tile-custom {
          border: 1px solid rgba(255, 215, 0, 0.12);
        }
        .tile-custom:hover {
          border-color: rgba(255, 215, 0, 0.4);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.08);
        }

        .btn-blue {
          background: rgba(59, 130, 246, 0.08);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.25);
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-blue:hover {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
        .btn-purple {
          background: rgba(168, 85, 247, 0.08);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.25);
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-purple:hover {
          background: #a855f7;
          color: #fff;
          border-color: #a855f7;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
        }
        .btn-orange {
          background: rgba(249, 115, 22, 0.08);
          color: #fb923c;
          border: 1px solid rgba(249, 115, 22, 0.25);
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-orange:hover {
          background: #f97316;
          color: #fff;
          border-color: #f97316;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }
        .btn-green {
          background: rgba(16, 185, 129, 0.08);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-green:hover {
          background: #10b981;
          color: #fff;
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }
        .btn-outline-gold {
          background: rgba(255, 215, 0, 0.03);
          color: var(--gold);
          border: 1px solid rgba(255, 215, 0, 0.25);
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-outline-gold:hover {
          background: var(--gold);
          color: #000;
          border-color: var(--gold);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.35);
        }
      `}</style>
    </>
  );
}
