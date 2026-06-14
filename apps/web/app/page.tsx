/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart, Banknote, Shield, Lock, Zap, CircleDollarSign,
  Smartphone, CheckCircle, Star, ArrowRight, ChevronDown, Sliders, Users,
  TrendingUp, ShieldCheck, RefreshCw, ShieldAlert, Scale
} from "lucide-react";
import CountUp from "../components/CountUp";
import LightRays from "../components/LightRays";
import InitialPageLoader from "../components/InitialPageLoader";
import EliteServices from "../components/EliteServices";
import { getOrIncrementViews } from "./actions";

// ── Social channels data ───────────────────────────────────────────────────────
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
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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

// ── Stat items ────────────────────────────────────────────────────────────────
const stats = [
  { value: 2000, suffix: "+", label: "HAPPY BUYERS" },
  { prefix: "₹", value: 60, suffix: "L+", label: "ACCOUNTS SOLD" },
  { value: 7, suffix: " Yrs", label: "TRUSTED SINCE 2019" },
  { value: 4.7, suffix: " ★", label: "STAR RATED", decimals: 1 },
];

// ── Service cards ─────────────────────────────────────────────────────────────
const serviceCards = [
  {
    badge: "SECURE PURCHASE",
    badgeColor: "#f5c518",
    badgeBg: "rgba(245,197,24,0.08)",
    badgeBorder: "rgba(245,197,24,0.3)",
    cardGrad: "linear-gradient(180deg, rgba(22,17,10,0.75) 0%, rgba(8,10,15,0.98) 100%)",
    cardBorder: "rgba(245,197,24,0.15)",
    glowColor: "rgba(245,197,24,0.04)",
    title: "Buy Safe & Secure Accounts",
    desc: "Choose from Instant-delivery Ready-to-Play accounts, market-listed accounts from our official channels, or request custom accounts tailored to your budget and skin requirements within 24-48 hours.",
    bgIcon: (
      <svg className="absolute -right-4 -top-4 text-yellow-500/[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-500" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
    bullets: [
      {
        bold: "Ready-to-Play Accounts",
        text: "Verified and secure accounts available with instant delivery.",
        icon: <CheckCircle size={14} className="text-[#f5c518]" />
      },
      {
        bold: "Market Available Accounts",
        text: "Daily account listings ranging from ₹5K to ₹500K shared through our official channels.",
        icon: <ShoppingCart size={14} className="text-[#f5c518]" />
      },
      {
        bold: "Custom Requirement Accounts",
        text: "Personalized account sourcing based on your exact budget, skins, and preferences within 24-48 hours.",
        icon: <Sliders size={14} className="text-[#f5c518]" />
      },
      {
        bold: "Online & Face-to-Face Deal Modes",
        text: "Secure online transactions and face-to-face deals available for high-value trades (₹100K+).",
        icon: <Users size={14} className="text-[#f5c518]" />
      }
    ],
    href: "/buy",
    btnLabel: "CLICK HERE TO BUY AN ACCOUNT",
    btnBg: "rgba(245,197,24,0.03)",
    btnBorder: "rgba(245,197,24,0.25)",
    btnHoverBg: "#f5c518",
    btnColor: "#f5c518",
    btnIcon: <ShoppingCart size={14} />
  },
  {
    badge: "TRANSPARENT DEAL",
    badgeColor: "#10B981",
    badgeBg: "rgba(16,185,129,0.08)",
    badgeBorder: "rgba(16,185,129,0.3)",
    cardGrad: "linear-gradient(180deg, rgba(10,22,17,0.75) 0%, rgba(8,10,15,0.98) 100%)",
    cardBorder: "rgba(16,185,129,0.15)",
    glowColor: "rgba(16,185,129,0.04)",
    title: "Sell & Convert Your Account into Cash",
    desc: "Sell your BGMI account securely at a fair market price through two flexible selling options: instant sale for immediate cash after login verification, or hold-and-sell mode to maximize your account's resale value.",
    bgIcon: (
      <svg className="absolute -right-4 -top-4 text-emerald-500/[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-500" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    bullets: [
      {
        bold: "Top Market Valuation",
        text: "Fair and transparent pricing based on current market demand.",
        icon: <TrendingUp size={14} className="text-[#10B981]" />
      },
      {
        bold: "Instant Cashouts",
        text: "Payments processed quickly via UPI, bank transfer, or other supported methods.",
        icon: <Zap size={14} className="text-[#10B981]" />
      },
      {
        bold: "100% Secure Escrow Protection",
        text: "Fully secured transactions with transparent handling.",
        icon: <ShieldCheck size={14} className="text-[#10B981]" />
      },
      {
        bold: "Online & Face-to-Face Deal Modes",
        text: "Safe online transactions and in-person deals available for high-value accounts (₹100K+).",
        icon: <Users size={14} className="text-[#10B981]" />
      }
    ],
    href: "/sell",
    btnLabel: "CLICK HERE TO SELL YOUR ACCOUNT",
    btnBg: "rgba(16,185,129,0.03)",
    btnBorder: "rgba(16,185,129,0.25)",
    btnHoverBg: "#10B981",
    btnColor: "#10B981",
    btnIcon: <Banknote size={14} />
  },
  {
    badge: "SECURE TRADE",
    badgeColor: "#a855f7",
    badgeBg: "rgba(168,85,247,0.08)",
    badgeBorder: "rgba(168,85,247,0.3)",
    cardGrad: "linear-gradient(180deg, rgba(20,10,22,0.75) 0%, rgba(8,10,15,0.98) 100%)",
    cardBorder: "rgba(168,85,247,0.15)",
    glowColor: "rgba(168,85,247,0.04)",
    title: "Exchange Your Old Account & Get Your Dream Account",
    desc: "Trade your existing BGMI account for a higher-tier or lower-tier account from our marketplace with secure valuation, protected exchanges, and smooth transfer support.",
    bgIcon: (
      <svg className="absolute -right-4 -top-4 text-purple-500/[0.04] pointer-events-none group-hover:scale-110 transition-transform duration-500" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
    bullets: [
      {
        bold: "Tier Upgrade & Downgrade Options",
        text: "Swap your account for premium or budget-friendly inventory.",
        icon: <RefreshCw size={14} className="text-[#a855f7]" />
      },
      {
        bold: "Escrow Trade Protection",
        text: "Secure dual-handover process for safer exchanges.",
        icon: <ShieldAlert size={14} className="text-[#a855f7]" />
      },
      {
        bold: "Fair Valuation System",
        text: "Instant appraisal and transparent adjustment pricing.",
        icon: <Scale size={14} className="text-[#a855f7]" />
      },
      {
        bold: "Online & Face-to-Face Deal Modes",
        text: "Trusted online and offline exchange options available for premium-value trades (₹100K+).",
        icon: <Users size={14} className="text-[#a855f7]" />
      }
    ],
    href: "/exchange",
    btnLabel: "CLICK HERE TO EXCHANGE YOUR ACCOUNT",
    btnBg: "rgba(168,85,247,0.03)",
    btnBorder: "rgba(168,85,247,0.25)",
    btnHoverBg: "#a855f7",
    btnColor: "#a855f7",
    btnIcon: <RefreshCw size={14} />
  }
];

// ── Why trust feature cards ───────────────────────────────────────────────────
const trustFeatures = [
  {
    icon: <Lock size={22} />,
    title: "Verified Accounts Only",
    desc: "Every account goes through manual verification before listing. No fakes, no scams, ever.",
  },
  {
    icon: <Zap size={22} />,
    title: "Instant Delivery",
    desc: "Once payment is confirmed, account credentials are transferred immediately and securely.",
  },
  {
    icon: <CircleDollarSign size={22} />,
    title: "Market-Fair Pricing",
    desc: "Accounts priced at current market value — fair for both buyers and sellers, always transparent.",
  },
  {
    icon: <Smartphone size={22} />,
    title: "Multiple Payment Modes",
    desc: "UPI, Bank Transfer, USDT, and Liquid Cash — whatever works best for you.",
  },
];

// ── Story timeline ────────────────────────────────────────────────────────────
const timeline = [
  { year: "2019", event: "Founded Maddy Recovery Hub. Recovered 2000+ accounts worth ₹30L." },
  { year: "2020", event: "Founded Maddy BGMI Store as a WhatsApp group with 238 members." },
  { year: "2021", event: "Expanded to Telegram, Instagram & YouTube." },
  { year: "2022", event: "800+ buyers & ₹20L worth sold. Face-to-Face deal for ₹2L." },
  { year: "2023-2024", event: "1000+ accounts & ₹60L worth sold. Launched website." },
  { year: "2025-2026", event: "2000+ buyers. Premium listings & new website. 🎉" },
];

// ── confetti helper ───────────────────────────────────────────────────────────
function launchGoldenConfetti() {
  if (typeof window === "undefined") return;
  import("canvas-confetti").then((confetti) => {
    const fire = confetti.default;
    fire({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ffd700", "#ffec6e", "#fff"], startVelocity: 40, gravity: 0.8 });
    fire({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ffd700", "#ffec6e", "#fff"], startVelocity: 40, gravity: 0.8 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);
  const [celebrationUser, setCelebrationUser] = useState<number | null>(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("mbs_intro_complete");
    if (!alreadySeen) setShowIntro(true);
  }, []);

  const handleViewsFlow = async () => {
    try {
      const dbCounted = !!localStorage.getItem("mbs_db_counted");
      const count = await getOrIncrementViews(!dbCounted).then((r) => r.count);
      localStorage.setItem("mbs_db_counted", "1");
      localStorage.setItem("mbs_live_views", String(count));
      window.dispatchEvent(new CustomEvent("mbs_views_updated", { detail: count }));
      if (!dbCounted && count % 10 === 0) {
        setCelebrationUser(count);
        setTimeout(launchGoldenConfetti, 400);
      }
    } catch (e) {
      console.warn("View tracking failed:", e);
    }
  };

  const onIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("mbs_intro_complete", "true");
    handleViewsFlow();
  };

  return (
    <>
      {showIntro && <InitialPageLoader onComplete={onIntroComplete} />}

      {/* ════════════════════ 1. HERO ════════════════════ */}
      <section className="hero-section">
        {/* Background banner */}
        <img
          src="/hero-banner.webp"
          alt="BGMI battlefield"
          className="hero-bg"
        />
        {/* Dark gradient overlay */}
        <div className="hero-overlay" />

        {/* Light rays */}
        <div className="hero-rays">
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

        {/* Hero Content */}
        <div className="hero-content fade-up">
          <div className="hero-badge">
            South India&apos;s #1 Trusted BGMI Account Marketplace
          </div>

          <h1 className="hero-title">
            Your Dream <br className="hidden sm:inline" />
            <span className="g" style={{ filter: "drop-shadow(0 0 15px rgba(255,215,0,0.3))" }}>
              BGMI Account
            </span>{" "}
            <br className="hidden sm:inline" />
            Awaits
          </h1>

          <p className="hero-desc">
            Buy and sell verified BGMI accounts safely — budget to premium.{" "}
            <br className="hidden sm:inline" />
            Trusted by 2000+ players since 2019.
          </p>

          <div className="hero-btns">
            <Link href="/buy" id="cta-buy" className="btn-hero-gold">
              <ShoppingCart size={17} />
              <span>BUY ACCOUNT</span>
            </Link>
            <Link href="/sell" id="cta-sell" className="btn-hero-outline">
              <Banknote size={17} />
              <span>SELL ACCOUNT</span>
            </Link>
          </div>

          <div className="hero-trust-row">
            {[
              { icon: <CheckCircle size={14} />, label: "Verified Accounts" },
              { icon: <Zap size={14} />, label: "Fast Delivery" },
              { icon: <Shield size={14} />, label: "Single Logins" },
              { icon: <Star size={14} />, label: "Since 2019" },
              { icon: <CheckCircle size={14} />, label: "2000+ Buyers" },
            ].map((t) => (
              <span key={t.label} className="trust-pill">
                <span className="trust-icon">{t.icon}</span>
                <span>{t.label}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero-scroll-hint">
          <ChevronDown size={24} className="bounce-y" />
        </div>
      </section>

      {/* ════════════════════ 2. STATS BAR ════════════════════ */}
      <section className="stats-bar">
        {stats.map((s) => (
          <div key={s.label} className="stat-cell">
            <div className="stat-value">
              {s.prefix || ""}
              <CountUp to={s.value} />
              {s.suffix}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ════════════════════ 3. WHAT WE OFFER ════════════════════ */}
      <section className="section-padded">
        <div className="section-label">WHAT WE OFFER</div>
        <h2 className="section-title">Your All-in-One BGMI Marketplace</h2>
        <p className="section-desc">Your complete gaming catalog. Simple, highly secure, and verified marketplace.</p>

        <div className="service-cards-grid">
          {serviceCards.map((card) => (
            <div
              key={card.title}
              className="service-card group"
              style={{
                background: card.cardGrad,
                borderColor: card.cardBorder,
                boxShadow: `0 8px 30px ${card.glowColor}`,
              }}
            >
              {card.bgIcon}
              
              <div
                className="service-card-badge"
                style={{
                  color: card.badgeColor,
                  background: card.badgeBg,
                  borderColor: card.badgeBorder,
                }}
              >
                {card.badge}
              </div>

              <h3 className="service-card-title mt-4">{card.title}</h3>
              <p className="service-card-desc">{card.desc}</p>
              
              <div className="flex flex-col gap-3 mb-8">
                {card.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-left">
                    <span className="mt-0.5 flex-shrink-0">{b.icon}</span>
                    <span className="text-muted leading-relaxed">
                      <strong className="text-white font-semibold">{b.bold}</strong> — {b.text}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={card.href}
                className="service-card-btn-full"
                style={{
                  color: card.btnColor,
                  borderColor: card.btnBorder,
                  background: card.btnBg,
                }}
              >
                {card.btnIcon}
                {card.btnLabel} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ 3.5. ELITE SERVICES ════════════════════ */}
      <EliteServices />

      {/* ════════════════════ 4. CONNECT WITH US ════════════════════ */}
      <section className="section-padded section-alt">
        <div className="text-center mb-12">
          <div className="section-label">CONNECT WITH US</div>
          <h2 className="section-title">
            Find Us <span className="g">Everywhere</span>
          </h2>
          <p className="section-desc">Join our official communities for latest listings, updates and deals.</p>
        </div>

        <div className="connect-grid">
          {connectChannels.map((ch) => (
            <a
              key={ch.name}
              href={ch.href}
              target="_blank"
              rel="noreferrer"
              className="connect-card"
              style={{ borderColor: ch.border, background: ch.bg }}
            >
              <div className="connect-card-icon" style={{ color: ch.color }}>
                {ch.icon}
              </div>
              <div className="connect-card-text">
                <div className="connect-card-name">{ch.name}</div>
                <div className="connect-card-desc">{ch.desc}</div>
              </div>
              <ArrowRight size={18} className="connect-card-arrow" style={{ color: ch.color }} />
            </a>
          ))}
        </div>
      </section>

      {/* ════════════════════ 5. OUR STORY ════════════════════ */}
      <section className="section-padded">
        <div className="section-label">OUR STORY</div>
        <h2 className="section-title">About Maddy BGMI Store</h2>

        <div className="story-card">
          <div className="story-left">
            <h3 className="story-heading">
              From a Passion to South India&apos;s Most Trusted BGMI Marketplace
            </h3>
            <p className="story-text">
              Maddy BGMI Store&apos;s journey started in 2019 with the founding of Maddy Recovery Hub,
              recovering BGMI accounts and building a reputation of trust across South India.
            </p>
            <p className="story-text">
              What started as a small WhatsApp trading group has grown into a full-fledged platform
              serving thousands of players. Every transaction is handled personally, every account
              is verified, and every buyer walks away satisfied.
            </p>
          </div>
          <div className="story-timeline">
            {timeline.map((t, i) => (
              <div key={t.year} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <div className="timeline-year">{t.year}</div>
                  <div className="timeline-event">{t.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 6. WHY US ════════════════════ */}
      <section className="section-padded section-alt">
        <div className="section-label">WHY US</div>
        <h2 className="section-title">Built on Trust</h2>
        <p className="section-desc">Seven years, 2000+ happy buyers, and zero compromise on safety.</p>

        <div className="trust-grid">
          {trustFeatures.map((f) => (
            <div key={f.title} className="trust-card">
              <div className="trust-card-icon">{f.icon}</div>
              <h4 className="trust-card-title">{f.title}</h4>
              <p className="trust-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ 7. FINAL CTA ════════════════════ */}
      <section className="cta-section">
        <h2 className="cta-title">Why Are You Waiting For?</h2>
        <p className="cta-desc">Join 2000+ players who found their dream BGMI account.</p>
        <div className="cta-btns">
          <Link href="/buy" className="btn-hero-gold">
            <ShoppingCart size={17} />
            BUY AN ACCOUNT
          </Link>
          <Link href="/sell" className="btn-cta-green">
            <CircleDollarSign size={17} />
            SELL YOUR ACCOUNT
          </Link>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .hero-section {
          position: relative;
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          padding: 40px 20px;
        }
        @media (max-width: 768px) {
          .hero-section {
            min-height: calc(100svh - 64px);
            padding: clamp(16px, 4svh, 40px) 16px;
          }
        }
        .hero-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          z-index: 0;
        }
        @media (max-width: 768px) {
          .hero-bg {
            object-position: 70% center;
            opacity: 0.5;
          }
        }
        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to bottom,
            rgba(8,10,15,0.40) 0%,
            rgba(8,10,15,0.65) 45%,
            rgba(8,10,15,0.97) 100%);
        }
        @media (max-width: 768px) {
          .hero-overlay {
            background: linear-gradient(to bottom,
              rgba(8,10,15,0.60) 0%,
              rgba(8,10,15,0.85) 60%,
              rgba(8,10,15,0.99) 100%);
          }
        }
        .hero-rays {
          position: absolute; inset: 0; z-index: 1;
        }
        .hero-content {
          position: relative; z-index: 2;
          max-width: 800px; margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-block;
          border: 1px solid rgba(255,215,0,0.35);
          color: var(--color-gold);
          font-size: clamp(9px, 2.5vw, 11px);
          font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: clamp(4px, 1.2vw, 6px) clamp(12px, 3vw, 18px);
          border-radius: 20px;
          background: rgba(255,215,0,0.06);
          margin-bottom: clamp(14px, 4svh, 24px);
        }
        .hero-title {
          font-family: var(--font-h);
          font-size: clamp(2rem, 7.5vw, 5.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0.5px;
          color: #fff;
          margin: 0 0 clamp(12px, 3svh, 20px);
          text-transform: uppercase;
          drop-shadow: 0 4px 15px rgba(0,0,0,0.85);
        }
        .hero-desc {
          color: var(--color-muted);
          font-size: clamp(0.85rem, 2.2vw, 1.05rem);
          max-width: 520px; margin: 0 auto clamp(18px, 4svh, 32px);
          line-height: 1.6;
        }
        .hero-btns {
          display: flex;
          gap: clamp(10px, 3vw, 16px);
          justify-content: center;
          width: 100%;
          max-width: 480px;
          margin: 0 auto clamp(20px, 5svh, 36px);
        }
        .btn-hero-gold {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #f5c518, #ffd700);
          color: #000; font-size: clamp(11px, 2.2vw, 13px); font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          padding: clamp(10px, 3vw, 14px) clamp(14px, 4vw, 28px); border-radius: 10px;
          text-decoration: none; transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(245,197,24,0.35);
          min-height: 44px;
        }
        .btn-hero-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245,197,24,0.5); }
        .btn-hero-outline {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: transparent;
          color: #fff; font-size: clamp(11px, 2.2vw, 13px); font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          padding: clamp(10px, 3vw, 14px) clamp(14px, 4vw, 28px); border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.4);
          text-decoration: none; transition: transform .2s, border-color .2s;
          min-height: 44px;
        }
        .btn-hero-outline:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.8); }
        .hero-trust-row {
          display: flex; flex-wrap: wrap; gap: clamp(8px, 2vw, 12px);
          justify-content: center;
        }
        .trust-pill {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.65);
          font-size: clamp(10px, 2vw, 12px);
          font-weight: 600;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 20px;
        }
        .trust-icon { color: var(--color-gold); display: flex; }
        .hero-scroll-hint {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%); z-index: 2;
          color: var(--color-gold); opacity: 0.6;
        }
        @media (max-width: 768px) {
          .hero-scroll-hint {
            display: none;
          }
        }
        @keyframes bounceY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .bounce-y { animation: bounceY 1.8s ease-in-out infinite; }

        /* ── Stats Bar ── */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #0d1117;
          border-top: 1px solid rgba(255,215,0,0.15);
          border-bottom: 1px solid rgba(255,215,0,0.15);
        }
        .stat-cell {
          padding: 32px 20px; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .stat-cell:last-child { border-right: none; }
        .stat-value {
          font-family: var(--font-h);
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 900; color: var(--color-gold);
          letter-spacing: -1px; margin-bottom: 6px;
        }
        .stat-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--color-muted);
        }
        @media (max-width: 640px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .stat-cell { border-bottom: 1px solid rgba(255,255,255,0.06); }
        }

        /* ── Sections ── */
        .section-padded {
          padding: 80px 5%;
          max-width: 1320px; margin: 0 auto;
          width: 100%;
        }
        .section-alt {
          background: #0d1117;
          max-width: 100%; padding: 80px 5%;
        }
        .section-alt > * { max-width: 1320px; margin-left: auto; margin-right: auto; }
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--color-gold);
          margin-bottom: 10px;
        }
        .section-title {
          font-family: var(--font-h);
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 900; color: #fff;
          margin: 0 0 14px; line-height: 1.15;
        }
        .section-desc {
          color: var(--color-muted); font-size: 15px;
          line-height: 1.7; max-width: 560px; margin-bottom: 52px;
        }
        .text-center { text-align: center; }
        .mb-12 { margin-bottom: 48px; }

        /* ── Service Cards ── */
        .service-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) { .service-cards-grid { grid-template-columns: 1fr; } }
        .service-card {
          border: 1px solid; border-radius: 18px;
          padding: 36px 32px;
          transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .3s, border-color .3s;
          position: relative; overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .service-card:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          border-color: rgba(255,255,255,0.2) !important;
        }
        .service-card-badge {
          align-self: flex-start;
          border: 1px solid;
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 5px 12px; border-radius: 12px;
        }
        .service-card-title {
          font-family: var(--font-h); font-size: 22px; font-weight: 800;
          color: #fff; margin: 16px 0 12px; line-height: 1.25;
        }
        .service-card-desc {
          color: var(--color-muted); font-size: 13.5px; line-height: 1.7;
          margin-bottom: 24px;
        }
        .service-card-btn-full {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 11px; font-weight: 800; letter-spacing: 1.2px;
          text-transform: uppercase; text-decoration: none;
          padding: 14px 20px; border-radius: 10px; border: 1px solid;
          transition: all .25s ease;
          width: 100%;
          margin-top: auto;
        }
        .service-card-btn-full:hover { 
          background: #fff !important; 
          color: #000 !important; 
          border-color: #fff !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,255,255,0.15);
        }

        /* ── Connect Grid ── */
        .connect-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1320px; margin: 0 auto;
        }
        @media (max-width: 900px) { .connect-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .connect-grid { grid-template-columns: 1fr; } }
        .connect-card {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 22px; border-radius: 14px;
          border: 1px solid; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
        }
        .connect-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
        .connect-card-icon { flex-shrink: 0; }
        .connect-card-text { flex: 1; }
        .connect-card-name { font-weight: 700; color: #fff; font-size: 15px; margin-bottom: 2px; }
        .connect-card-desc { color: var(--color-muted); font-size: 12px; }
        .connect-card-arrow { flex-shrink: 0; opacity: 0.6; }

        /* ── Story ── */
        .story-card {
          background: #0d1117;
          border: 1px solid rgba(255,215,0,0.1);
          border-radius: 20px; padding: 48px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        @media (max-width: 768px) { .story-card { grid-template-columns: 1fr; gap: 40px; padding: 28px; } }
        .story-heading {
          font-family: var(--font-h); font-size: 22px; font-weight: 800;
          color: #fff; margin: 0 0 20px; line-height: 1.3;
        }
        .story-text {
          color: var(--color-muted); font-size: 14px; line-height: 1.8;
          margin-bottom: 14px;
        }
        .story-timeline { display: flex; flex-direction: column; gap: 24px; position: relative; }
        .story-timeline::before {
          content: ""; position: absolute;
          left: 6px; top: 8px; bottom: 8px; width: 1px;
          background: rgba(255,215,0,0.25);
        }
        .timeline-item { display: flex; gap: 18px; position: relative; }
        .timeline-dot {
          width: 13px; height: 13px; border-radius: 50%;
          background: var(--color-gold); flex-shrink: 0;
          margin-top: 4px; box-shadow: 0 0 8px rgba(255,215,0,0.5);
        }
        .timeline-year {
          font-family: var(--font-h); font-size: 15px; font-weight: 800;
          color: var(--color-gold); margin-bottom: 4px;
        }
        .timeline-event { color: var(--color-muted); font-size: 13px; line-height: 1.6; }

        /* ── Trust grid ── */
        .trust-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 20px; max-width: 1320px; margin: 0 auto;
        }
        @media (max-width: 900px) { .trust-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .trust-grid { grid-template-columns: 1fr; } }
        .trust-card {
          background: #111826; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 28px 24px;
          transition: border-color .2s, transform .2s;
        }
        .trust-card:hover { border-color: rgba(255,215,0,0.3); transform: translateY(-4px); }
        .trust-card-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(255,215,0,0.12); color: var(--color-gold);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .trust-card-title {
          font-family: var(--font-h); font-size: 16px; font-weight: 800;
          color: #fff; margin: 0 0 10px;
        }
        .trust-card-desc { color: var(--color-muted); font-size: 13px; line-height: 1.7; }

        /* ── CTA Banner ── */
        .cta-section {
          text-align: center; padding: 100px 5%;
          background: linear-gradient(to bottom, #080a0f 0%, #0d1117 100%);
          border-top: 1px solid rgba(255,215,0,0.1);
        }
        .cta-title {
          font-family: var(--font-h);
          font-size: clamp(30px, 5vw, 52px);
          font-weight: 900; color: #fff; margin: 0 0 14px;
        }
        .cta-desc { color: var(--color-muted); font-size: 16px; margin-bottom: 36px; }
        .cta-btns {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
        }
        .btn-cta-green {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff; font-size: 13px; font-weight: 800;
          letter-spacing: 1.2px; text-transform: uppercase;
          padding: 14px 28px; border-radius: 10px;
          text-decoration: none; transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(34,197,94,0.3);
        }
        .btn-cta-green:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(34,197,94,0.45); }

        /* ── Fade up animation ── */
        .fade-up {
          animation: fadeUp 0.8s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
