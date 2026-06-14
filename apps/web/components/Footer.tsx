/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, Banknote, KeyRound, Star, Heart, Eye, 
  Scale, Shield, RotateCcw, HelpCircle, MapPin 
} from "lucide-react";
import { getOrIncrementViews } from "../app/actions";

// Social icon buttons
const socials = [
  {
    href: "https://www.instagram.com/maddy_bgmistore/",
    color: "#E1306C", bg: "rgba(225,48,108,0.15)", border: "rgba(225,48,108,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="url(#ig-grad)" width="16" height="16">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/MBSxMADDY17",
    color: "#229ED9", bg: "rgba(34,158,217,0.15)", border: "rgba(34,158,217,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    href: "https://whatsapp.com/channel/0029VbAuBtrIXnlpr3jvnN13",
    color: "#22C55E", bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/channel/UCvQJ9PCTM4-hNpKH8R8lJTw",
    color: "#FF0000", bg: "rgba(255,0,0,0.15)", border: "rgba(255,0,0,0.35)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// Contact items
const contacts = [
  {
    href: "https://wa.me/+919025391516",
    label: "Contact Us on WhatsApp",
    color: "#22C55E",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/MBSxMADDY17",
    label: "Contact Us on Telegram",
    color: "#229ED9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/maddy_bgmistore/",
    label: "Contact Us on Instagram",
    color: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="url(#ig-grad2)" width="15" height="15">
        <defs>
          <linearGradient id="ig-grad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "mailto:contact@maddybgmistore.in",
    label: "Contact Us Via Email",
    color: "#EA4335",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Check local storage first
    const cached = localStorage.getItem("mbs_live_views");
    if (cached) {
      setViews(Number(cached));
    }

    // Load initial views count from database
    getOrIncrementViews(false).then((res) => {
      setViews(res.count);
      localStorage.setItem("mbs_live_views", String(res.count));
    });

    const handleUpdate = (e: any) => {
      if (e.detail !== undefined && e.detail !== null) {
        setViews(e.detail);
      }
    };
    window.addEventListener("mbs_views_updated", handleUpdate);

    return () => window.removeEventListener("mbs_views_updated", handleUpdate);
  }, []);

  return (
    <footer style={{ background: "var(--color-bg2)", borderTop: "1px solid rgba(255,215,0,0.18)", padding: "60px 5% 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "40px", marginBottom: "40px" }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 700, color: "var(--color-gold)", letterSpacing: "2px", marginBottom: "12px" }}>
            <span style={{ color: "#fff" }}>MADDY</span> BGMI STORE
          </div>
          <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
            South India&apos;s most trusted BGMI account marketplace. Safe, verified, and serving players since 2019.
          </p>
          {/* Social Icon Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {socials.map((s, i) => (
              <a 
                key={i} 
                href={s.href} 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  width: "36px", 
                  height: "36px", 
                  borderRadius: "9px", 
                  background: s.bg, 
                  border: `1px solid ${s.border}`, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  color: s.color, 
                  textDecoration: "none", 
                  transition: "transform .2s, opacity .2s" 
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = ".8"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div style={{ fontFamily: "var(--font-h)", fontSize: "12px", fontWeight: 700, color: "var(--color-gold)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Quick Links</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { to: "/buy", label: "Buy Accounts", icon: <ShoppingCart size={13} /> },
              { to: "/sell", label: "Sell Accounts", icon: <Banknote size={13} /> },
              { to: "/exchange", label: "Exchange Accounts", icon: <RotateCcw size={13} /> },
              { to: "/reviews", label: "Reviews", icon: <Star size={13} /> },
              { to: "/terms", label: "Terms & Conditions", icon: <Scale size={13} /> },
              { to: "/privacy", label: "Privacy Policy", icon: <Shield size={13} /> },
              { to: "/faq", label: "FAQs", icon: <HelpCircle size={13} /> },
            ].map(l => (
              <Link 
                key={l.to} 
                href={l.to} 
                style={{ color: "var(--color-muted)", fontSize: "13px", textDecoration: "none", transition: "color .2s", display: "flex", alignItems: "center", gap: "7px" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}
              >
                <span style={{ color: "var(--color-gold)", display: "flex", alignItems: "center" }}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company & Trust */}
        <div>
          <div style={{ fontFamily: "var(--font-h)", fontSize: "12px", fontWeight: 700, color: "var(--color-gold)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Company &amp; Trust</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { to: "/about", label: "About Us", icon: <ShoppingCart size={13} /> }, // placeholder icon or same, wait, let's use Shield or Star
              { to: "/why-trust-us", label: "Why Trust Us", icon: <Shield size={13} /> },
              { to: "/success-stories", label: "Success Stories", icon: <Star size={13} /> },
              { to: "/locations", label: "Our Locations", icon: <MapPin size={13} /> },
              { to: "/guides/valuation", label: "Account Valuation", icon: <HelpCircle size={13} /> },
            ].map(l => (
              <Link 
                key={l.to} 
                href={l.to} 
                style={{ color: "var(--color-muted)", fontSize: "13px", textDecoration: "none", transition: "color .2s", display: "flex", alignItems: "center", gap: "7px" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}
              >
                <span style={{ color: "var(--color-gold)", display: "flex", alignItems: "center" }}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontFamily: "var(--font-h)", fontSize: "12px", fontWeight: 700, color: "var(--color-gold)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Contact Support</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
            {contacts.map((c, i) => (
              <a 
                key={i} 
                href={c.href} 
                target="_blank" 
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "9px", color: "var(--color-muted)", fontSize: "13px", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--foreground)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}
              >
                <span style={{ color: c.color, display: "flex", alignItems: "center", flexShrink: 0 }}>{c.icon}</span>
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px", textAlign: "center", fontSize: "12px", color: "var(--color-muted)" }}>
        {/* Sleek View Counter Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 215, 0, 0.04)",
              border: "1px solid rgba(255, 215, 0, 0.15)",
              borderRadius: "20px",
              padding: "6px 16px",
              fontSize: "12px",
              color: "var(--color-gold)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.02)",
              backdropFilter: "blur(4px)",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              cursor: "default"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.15)";
            }}
          >
            <Eye size={13} style={{ filter: "drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))", color: "var(--color-gold)" }} />
            <span>TOTAL VIEWS:</span>
            <span style={{ color: "#fff", fontFamily: "var(--font-h)", fontWeight: 700, letterSpacing: "1px" }}>
              {views !== null ? views.toLocaleString() : "..."}
            </span>
          </div>
        </div>

        Made with <Heart size={11} fill="#ef4444" color="#ef4444" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> in South India &nbsp;·&nbsp; © 2026 <Link href="/" style={{ color: "var(--color-gold)", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>Maddy BGMI Store</Link> &nbsp;&nbsp;
        <Link href="/terms" style={{ color: "var(--color-muted)", textDecoration: "underline", margin: "0 5px", fontSize: "11px" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>Terms & Conditions</Link> | 
        <Link href="/privacy" style={{ color: "var(--color-muted)", textDecoration: "underline", margin: "0 5px", fontSize: "11px" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>Privacy Policy</Link> | 
        <Link href="/refund" style={{ color: "var(--color-muted)", textDecoration: "underline", margin: "0 5px", fontSize: "11px" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>Refund Policy</Link> | 
        <Link href="/faq" style={{ color: "var(--color-muted)", textDecoration: "underline", margin: "0 5px", fontSize: "11px" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>FAQs</Link>
        &nbsp;-&nbsp; Not affiliated with BGMI or Krafton.
      </div>
    </footer>
  );
}
