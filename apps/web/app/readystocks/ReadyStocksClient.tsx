/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Search, Lock, Gamepad2, Play } from "lucide-react";
import { getProductSlug } from "../../lib/seo";

// YouTube thumbnail helper
function getYoutubeThumbnail(url: string | null) {
  if (!url) return null;
  const s = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (s) return `https://img.youtube.com/vi/${s[1]}/hqdefault.jpg`;
  const w = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (w) return `https://img.youtube.com/vi/${w[1]}/hqdefault.jpg`;
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embed) return `https://img.youtube.com/vi/${embed[1]}/hqdefault.jpg`;
  return null;
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M17.05 13.605c-.015-2.42 1.974-3.574 2.064-3.626-1.125-1.645-2.875-1.87-3.51-1.902-1.503-.153-2.93.882-3.693.882-.764 0-1.94-.85-3.18-.828-1.614.022-3.107.937-3.935 2.378-1.678 2.91-.428 7.217 1.205 9.584.795 1.157 1.733 2.455 2.983 2.408 1.198-.047 1.666-.77 3.11-.77 1.444 0 1.884.77 3.134.747 1.272-.02 2.08-1.18 2.868-2.34 1.002-1.465 1.415-2.88 1.434-2.955-.03-.013-2.673-1.025-2.68-3.582M15.42 5.48c.646-.78 1.08-1.865.96-2.95-.928.037-2.05.62-2.71 1.402-.53.618-1.045 1.72-.907 2.785.105.008.22.015.334.015.864 0 1.66-.465 2.323-1.252"/>
  </svg>
);

const GameCenterLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
    <circle cx="8" cy="9" r="4.5" fill="#FF3B30" opacity="0.85" />
    <circle cx="16" cy="9" r="4.5" fill="#007AFF" opacity="0.85" />
    <circle cx="8" cy="15" r="4.5" fill="#4CD964" opacity="0.85" />
    <circle cx="16" cy="15" r="4.5" fill="#FFCC00" opacity="0.85" />
    <circle cx="12" cy="12" r="4" fill="#5856D6" opacity="0.85" />
  </svg>
);

const PlayGamesLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5L12 12l-3.5-3.5M12 12l3.5 3.5M12 12L8.5 15.5" />
  </svg>
);

const MailLogo = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22 4H2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM20 8l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

function LoginBadge({ type }: { type: string }) {
  const t = (type || "").toLowerCase();
  if (t === "none" || t === "none (single login)" || !t) return null;

  let icon = <GoogleLogo />;
  let color = "#4285F4";
  let bg = "rgba(66,133,244,0.1)";

  if (t.includes("facebook") || t === "fb") {
    icon = <FacebookLogo />; color = "#4A9FFF"; bg = "rgba(24,119,242,0.1)";
  } else if (t.includes("twitter") || t === "x") {
    icon = <XLogo />; color = "#fff"; bg = "rgba(255,255,255,0.05)";
  } else if (t.includes("apple")) {
    icon = <AppleLogo />; color = "#fff"; bg = "rgba(255,255,255,0.05)";
  } else if (t.includes("playgames") || t.includes("play games")) {
    icon = <PlayGamesLogo />; color = "#34A853"; bg = "rgba(52,168,83,0.1)";
  } else if (t.includes("whats app") || t.includes("whatsapp")) {
    icon = <WhatsAppLogo />; color = "#25D366"; bg = "rgba(37,211,102,0.1)";
  } else if (t.includes("game center") || t.includes("gamecenter")) {
    icon = <GameCenterLogo />; color = "#00A3FF"; bg = "rgba(0,163,255,0.1)";
  } else if (t.includes("google")) {
    icon = <GoogleLogo />; color = "#4285F4"; bg = "rgba(66,133,244,0.1)";
  } else if (t.includes("email") || t.includes("mail")) {
    icon = <MailLogo />; color = "#ea4335"; bg = "rgba(234,67,53,0.1)";
  }

  return (
    <div title={type} style={{ color, background: bg, border: `1px solid ${color}33`, width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
  );
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

function StockCard({ stock }: { stock: Product }) {
  const { isSignedIn } = useUser();
  const ytThumb = getYoutubeThumbnail(stock.youtubeUrl);
  const primaryLogin = stock.primaryLogin;
  const secondaryLogin = stock.secondaryLogin;
  const firstImg = stock.imageUrls && stock.imageUrls.length > 0 ? stock.imageUrls[0] : null;

  return (
    <Link href={`/readystocks/${getProductSlug(stock.title, stock.id)}`} className="premium-card-link">
      <div className="premium-card">
        <div className="card-video-wrap">
          {ytThumb ? (
            <img src={ytThumb} alt={stock.title} className="card-thumbnail" />
          ) : firstImg ? (
            <img src={firstImg} alt={stock.title} className="card-thumbnail" />
          ) : (
            <div className="no-video"><Gamepad2 size={40} className="text-gold/25" /></div>
          )}

          {ytThumb && (
            <div className="play-hover-btn">
              <Play size={20} fill="currentColor" />
            </div>
          )}

          <div className="card-tier-badge">{stock.category || "Premium"}</div>
          {stock.status && stock.status !== "available" && (
            <div className={`card-status-badge ${stock.status}`}>{formatStatus(stock.status)}</div>
          )}
          {stock.tag && stock.tag !== "None" && (
            <div className="card-promo-badge">{stock.tag}</div>
          )}
        </div>

        <div className="card-body">
          <h3 className="card-title">{stock.title}</h3>

          <div className="card-footer-summary">
            {isSignedIn ? (
              <span className="card-price-val">₹{Number(stock.price).toLocaleString("en-IN")}</span>
            ) : (
              <span className="card-price-locked flex items-center gap-1.5">
                <Lock size={12} /> PRICE LOCKED
              </span>
            )}

            <div className="card-summary-logins">
              {primaryLogin && primaryLogin !== "None" && <LoginBadge type={primaryLogin} />}
              {secondaryLogin && secondaryLogin !== "None" && <LoginBadge type={secondaryLogin} />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ReadyStocksClient({ initialStocks }: { initialStocks: Product[] }) {
  const [stocks] = useState<Product[]>(initialStocks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = stocks.filter(s => {
    const mSearch = !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    const mCat = category === "all" || s.category?.toLowerCase() === category.toLowerCase();
    const mStat = status === "all" || s.status === status;
    return mSearch && mCat && mStat;
  });

  return (
    <div className="rs-container">
      <div className="filter-bar sticky">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search BGMI accounts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="select-group">
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">All Tiers</option>
            <option value="Budget">Budget Tier</option>
            <option value="Mid Range">Mid Range Tier</option>
            <option value="Premium">Premium Tier</option>
            <option value="Ultra Premium">Ultra Premium Tier</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div className="stocks-grid">
        {filtered.length > 0 ? (
          filtered.map(stock => <StockCard key={stock.id} stock={stock} />)
        ) : (
          <div className="no-results">No verified accounts found matching your filters.</div>
        )}
      </div>
    </div>
  );
}
