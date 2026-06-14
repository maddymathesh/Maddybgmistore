/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ArrowLeft, Lock, Send, 
  Gamepad2, Mail, ExternalLink, Info,
  ShieldCheck, ChevronRight, X
} from "lucide-react";

// YouTube embed helper
function getEmbed(url: string | null) {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const s = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (s) return `https://www.youtube-nocookie.com/embed/${s[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${s[1]}`;
  const w = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (w) return `https://www.youtube-nocookie.com/embed/${w[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${w[1]}`;
  return null;
}

function formatStatus(status: string | null) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "available") return "Available";
  if (s === "coming_soon" || s === "coming soon") return "Coming Soon";
  if (s === "reserved") return "Reserved";
  if (s === "on_hold" || s === "on hold") return "On Hold";
  if (s === "sold") return "Sold";
  if (s === "ready_to_exchange" || s === "ready to exchange") return "Ready to Exchange";
  return status;
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const GameCenterLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
    <circle cx="8" cy="9" r="4.5" fill="#FF3B30" opacity="0.85" />
    <circle cx="16" cy="9" r="4.5" fill="#007AFF" opacity="0.85" />
    <circle cx="8" cy="15" r="4.5" fill="#4CD964" opacity="0.85" />
    <circle cx="16" cy="15" r="4.5" fill="#FFCC00" opacity="0.85" />
    <circle cx="12" cy="12" r="4" fill="#5856D6" opacity="0.85" />
  </svg>
);

const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.05 13.605c-.015-2.42 1.974-3.574 2.064-3.626-1.125-1.645-2.875-1.87-3.51-1.902-1.503-.153-2.93.882-3.693.882-.764 0-1.94-.85-3.18-.828-1.614.022-3.107.937-3.935 2.378-1.678 2.91-.428 7.217 1.205 9.584.795 1.157 1.733 2.455 2.983 2.408 1.198-.047 1.666-.77 3.11-.77 1.444 0 1.884.77 3.134.747 1.272-.02 2.08-1.18 2.868-2.34 1.002-1.465 1.415-2.88 1.434-2.955-.03-.013-2.673-1.025-2.68-3.582M15.42 5.48c.646-.78 1.08-1.865.96-2.95-.928.037-2.05.62-2.71 1.402-.53.618-1.045 1.72-.907 2.785.105.008.22.015.334.015.864 0 1.66-.465 2.323-1.252"/>
  </svg>
);

const PlayGamesLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5L12 12l-3.5-3.5M12 12l3.5 3.5M12 12L8.5 15.5" />
  </svg>
);

function LoginBadge({ type, showText = false }: { type: string, showText?: boolean }) {
  const t = (type || "").toLowerCase();
  if (t === "none" || t === "none (single login)" || !t) return null;

  let icon = <GoogleLogo />;
  let color = "#4285F4"; 
  let bg = "rgba(66,133,244,0.08)";
  let displayName = "Google";

  if (t.includes("facebook") || t === "fb") { 
    icon = <FacebookLogo />; color = "#4A9FFF"; bg = "rgba(24,119,242,0.08)"; displayName = "Facebook";
  }
  else if (t.includes("twitter") || t === "x") { 
    icon = <XLogo />; color = "#fff"; bg = "rgba(255,255,255,0.05)"; displayName = "X (Twitter)";
  }
  else if (t.includes("apple")) { 
    icon = <AppleLogo />; color = "#fff"; bg = "rgba(255,255,255,0.05)"; displayName = "Apple ID";
  }
  else if (t.includes("play games") || t.includes("playgames")) { 
    icon = <PlayGamesLogo />; color = "#34A853"; bg = "rgba(52,168,83,0.08)"; displayName = "Play Games";
  }
  else if (t.includes("whats app") || t.includes("whatsapp")) {
    icon = <WhatsAppLogo />; color = "#25D366"; bg = "rgba(37,211,102,0.08)"; displayName = "Whats App";
  }
  else if (t.includes("game center") || t.includes("gamecenter")) {
    icon = <GameCenterLogo />; color = "#00A3FF"; bg = "rgba(0,163,255,0.08)"; displayName = "Game Center";
  }
  else if (t.includes("google")) { 
    icon = <GoogleLogo />; color = "#4285F4"; bg = "rgba(66,133,244,0.08)"; displayName = "Google";
  }
  else if (t.includes("email") || t.includes("mail")) { 
    icon = <Mail size={20} />; color = "#ea4335"; bg = "rgba(234,67,53,0.08)"; displayName = "E-Mail";
  }

  if (showText) {
    return (
      <div style={{ color, background: bg, border: `1px solid ${color}33`, display: "flex", alignItems: "center", gap: "10px", padding: "8px 16px", borderRadius: "12px", width: "100%" }}>
        {icon}
        <span className="font-h font-bold text-xs uppercase tracking-wider">{displayName}</span>
      </div>
    );
  }

  return (
    <div title={type} style={{ color, background: bg, border: `1px solid ${color}33`, width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} className="hover:scale-105">
      {icon}
    </div>
  );
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: string;
  category: string;
  status: string;
  youtubeUrl: string | null;
  primaryLogin: string | null;
  secondaryLogin: string | null;
  unlinkGuarantee: string;
  tag: string;
  imageUrls: string[] | null;
  createdAt: Date;
}

export default function ProductDetailsClient({ stock }: { stock: Product }) {
  const { isSignedIn, isLoaded } = useUser();
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const embed = getEmbed(stock.youtubeUrl);
  const guarantee = stock.unlinkGuarantee || "Safe & Secured";
  const waLink = `https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20buy%20this%20account%20listed%20for%20₹${stock.price}.%20${encodeURIComponent(stock.title)}`;
  const hasImages = stock.imageUrls && stock.imageUrls.length > 0;
  const allScreenshots = stock.imageUrls || [];

  let statusColor = "#8b949e";
  const sStatus = (stock.status || "").toLowerCase();
  if (sStatus === "available") statusColor = "#4ade80";
  else if (sStatus === "sold") statusColor = "#f87171";
  else if (sStatus === "coming_soon" || sStatus === "coming soon") statusColor = "#60a5fa";
  else if (sStatus === "reserved") statusColor = "#c084fc";
  else if (sStatus === "on_hold" || sStatus === "on hold") statusColor = "#fb923c";
  else if (sStatus === "ready_to_exchange" || sStatus === "ready to exchange") statusColor = "#22d3ee";

  return (
    <div className="rs-details-container">
      
      {/* Back navigation & Breadcrumbs */}
      <div className="back-nav mb-6">
        <Link href="/readystocks" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to catalog</span>
        </Link>
        <div className="breadcrumbs">
          <Link href="/readystocks">Ready Stocks</Link>
          <ChevronRight size={14} />
          <span>{stock.category}</span>
          <ChevronRight size={14} />
          <span className="active-crumb">{stock.title}</span>
        </div>
      </div>

      {/* Cinematic Media Stage (Top & Centered) */}
      <div className="media-stage mb-10">
        <div className="main-media-view">
          {embed ? (
            <div className="iframe-container">
              <iframe 
                src={embed} 
                title="Account Video Preview" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowFullScreen 
                className="video-iframe" 
              />
            </div>
          ) : hasImages ? (
            <div className="image-hero-view">
              <img src={activeImg || allScreenshots[0]} alt={stock.title} className="hero-main-img" />
            </div>
          ) : (
            <div className="no-media-placeholder">
              <Gamepad2 size={48} className="text-gold/30" />
              <span className="text-muted text-xs uppercase tracking-widest mt-3">No Video Preview Available</span>
            </div>
          )}

          {/* Overlay Badges */}
          {stock.status && stock.status !== "available" && (
            <div className={`status-overlay-badge ${stock.status}`}>{formatStatus(stock.status)}</div>
          )}
          {stock.tag && stock.tag !== "None" && (
            <div className="promo-overlay-badge">{stock.tag}</div>
          )}
        </div>

        {/* Screenshots Strip / Gallery thumbnails directly underneath */}
        {hasImages && (
          <div className="media-thumbnails mt-4 justify-center">
            {allScreenshots.map((url, index) => (
              <button 
                key={index}
                className={`thumb-btn ${activeImg === url || (!activeImg && index === 0) ? "active" : ""}`}
                onClick={() => setActiveImg(url)}
              >
                <img src={url} alt={`Screenshot ${index + 1}`} className="thumb-img" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Layout (Bottom) */}
      <div className="details-main-grid">
        
        {/* Left Column: Account Info, Description, Gallery */}
        <div className="details-info-col">
          
          {/* Header / Titles */}
          <div className="info-header mb-8">
            <span className="tier-pill">{stock.category} Tier</span>
            <h1 className="details-title mt-4">{stock.title}</h1>
            <div className="badges-strip mt-4">
              <span className="unlink-badge">
                <ShieldCheck size={14} />
                <span>Unlink Guarantee: {guarantee}</span>
              </span>
            </div>
          </div>

          {/* Description Block */}
          {stock.description && (
            <div className="description-container glass-panel p-6 sm:p-8">
              <h2 className="section-title font-h font-black text-lg text-white uppercase tracking-wider mb-5 flex items-center gap-3">
                <span className="h-5 w-1 bg-gold rounded-full" />
                <span>Account Description & Details</span>
              </h2>
              <div className="description-text whitespace-pre-line text-sm leading-relaxed text-[#c5cdd6]">
                {stock.description}
              </div>
            </div>
          )}

          {/* Screenshot Verification Showcase */}
          {hasImages && (
            <div className="screenshots-showcase mt-10">
              <h2 className="section-title font-h font-black text-lg text-white uppercase tracking-wider mb-5 flex items-center gap-3">
                <span className="h-5 w-1 bg-gold rounded-full" />
                <span>Inventory & Skins Verification</span>
              </h2>
              <div className="screenshots-grid">
                {allScreenshots.map((url, idx) => (
                  <div 
                    key={idx} 
                    className="screenshot-card" 
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img src={url} alt={`Inventory Item ${idx + 1}`} className="screenshot-img" />
                    <div className="screenshot-hover-overlay">
                      <ExternalLink size={20} className="text-gold" />
                      <span className="text-xs font-bold font-h uppercase tracking-wider text-white mt-2">Enlarge</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Purchasing and Bindings Sidebar */}
        <div className="details-sidebar-col">
          <div className="sticky-sidebar">
            
            {/* Price & Purchase Card */}
            <div className="price-card mb-6">
              {!isLoaded ? (
                <div className="p-6 text-center text-xs text-muted">Checking login status...</div>
              ) : isSignedIn ? (
                <div className="price-content p-6">
                  <div className="price-row flex justify-between items-center mb-6">
                    <div className="price-col">
                      <span className="price-label">LISTING PRICE</span>
                      <span className="price-val">₹{Number(stock.price).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="status-col flex flex-col items-end">
                      <span className="status-label">AVAILABILITY</span>
                      <span className="status-val uppercase font-bold text-sm" style={{ color: statusColor }}>
                        {formatStatus(stock.status)}
                      </span>
                    </div>
                  </div>

                  <div className="cta-divider my-4 border-t border-white/5" />

                  <div className="action-buttons-group flex flex-col gap-3">
                    <a 
                      href={waLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="cta-btn wa"
                    >
                      <WhatsAppLogo />
                      <span>ORDER VIA WHATSAPP</span>
                    </a>
                    <a 
                      href="https://t.me/MBSxMADDY17" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="cta-btn tg"
                    >
                      <Send size={20} />
                      <span>ORDER VIA TELEGRAM</span>
                    </a>
                  </div>
                  
                  <p className="cta-note text-center text-muted text-[10px] uppercase tracking-wider mt-4">
                    * 10% advance booking locks the ID. Full verification completed before handover.
                  </p>
                </div>
              ) : (
                <div className="price-login-gate p-6 text-center">
                  <Lock size={32} className="text-gold mx-auto mb-4 animate-pulse-slow" />
                  <h3 className="font-h font-black text-base text-white uppercase tracking-wider mb-2">Secure Pricing Details</h3>
                  <p className="text-muted text-xs leading-relaxed mb-6 max-w-[280px] mx-auto">
                    Pricing and CTA buttons are visible to logged in users only to protect credential safety.
                  </p>
                  <Link href="/login" className="login-gate-btn">
                    <span>Login to View Price & Buy</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Login Bindings Info Card */}
            <div className="bindings-card p-5">
              <h3 className="binding-header font-h font-bold text-xs uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                <Info size={14} className="text-gold" />
                <span>Verification & Bindings Info</span>
              </h3>
              
              <div className="binding-column flex flex-col gap-4">
                <div className="binding-item flex flex-col gap-2">
                  <span className="binding-label">Primary Login Method</span>
                  {stock.primaryLogin && stock.primaryLogin !== "None" ? (
                    <LoginBadge type={stock.primaryLogin} showText={true} />
                  ) : (
                    <span className="no-binding-val">None</span>
                  )}
                </div>
                {stock.secondaryLogin && stock.secondaryLogin !== "None" && (
                  <div className="binding-item flex flex-col gap-2 pt-3 border-t border-white/5">
                    <span className="binding-label">Secondary Login Method</span>
                    <LoginBadge type={stock.secondaryLogin} showText={true} />
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Lightbox for enlarged gallery images */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)}>
            <X size={28} />
          </button>
          
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={allScreenshots[lightboxIndex]} 
              alt="Verification screenshot"
              className="lightbox-main-img" 
            />
            
            {allScreenshots.length > 1 && (
              <div className="lightbox-nav-footer">
                <button 
                  className="lightbox-nav-btn prev"
                  onClick={() => setLightboxIndex((prev) => (prev === null || prev === 0 ? allScreenshots.length - 1 : prev - 1))}
                >
                  Prev
                </button>
                <span className="lightbox-counter font-h font-bold text-sm">
                  {lightboxIndex + 1} / {allScreenshots.length}
                </span>
                <button 
                  className="lightbox-nav-btn next"
                  onClick={() => setLightboxIndex((prev) => (prev === null || prev === allScreenshots.length - 1 ? 0 : prev + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
