import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupercarGiftById } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ShieldCheck, CheckCircle, Zap, Send, MessageCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const res = await getSupercarGiftById(resolvedParams.id);

  if (!res.success || !res.product) {
    return {
      title: "Supercar Not Found",
      description: "This supercar listing is not available.",
    };
  }

  const p = res.product;
  return {
    title: `${p.supercarName} - Supercar Gifting | Maddy BGMI Store`,
    description: `Buy the ${p.supercarName} supercar in BGMI via our premium gifting service.`,
    openGraph: {
      title: `${p.supercarName} - BGMI Supercar Gift`,
      description: `Premium supercar gifting service for ${p.supercarName}.`,
      images: p.imageUrl ? [{ url: p.imageUrl }] : [],
    },
  };
}

const contactText = (name: string, id: string) => 
  `Hi Maddy! I am interested in buying the ${name} Supercar (ID: ${id}) via your premium Gifting service. Please guide me.`;

const formatVehicle = (vehicle: string | null) => {
  if (!vehicle) return "UAZ";
  const v = vehicle.toUpperCase();
  if (["DACIA", "MIRADO", "COUPE", "ROADSTER"].includes(v) || v.includes("SEDEN") || v.includes("SEDAN")) {
    return `Sedan (${vehicle})`;
  }
  if (v.includes("UAZ")) {
    return `UAZ (${vehicle})`;
  }
  if (v.includes("BUGGY")) {
    return `Buggy`;
  }
  return vehicle;
};

export default async function SupercarDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const res = await getSupercarGiftById(resolvedParams.id);

  if (!res.success || !res.product) {
    notFound();
  }

  const stock = res.product;
  const waLink = `https://wa.me/+919025391516?text=${encodeURIComponent(contactText(stock.supercarName, stock.id))}`;
  const tgLink = `https://t.me/MBSxMADDY17?text=${encodeURIComponent(contactText(stock.supercarName, stock.id))}`;

  return (
    <div className="rs-details-container" style={{ padding: "80px 5% 100px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Back navigation & Breadcrumbs */}
      <div className="back-nav mb-6">
        <Link href="/services/supercar" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Showroom</span>
        </Link>
        <div className="breadcrumbs">
          <Link href="/services/supercar">Supercars</Link>
          <ChevronRight size={14} />
          <span>{stock.carType || "Supercar"}</span>
          <ChevronRight size={14} />
          <span className="active-crumb">{stock.supercarName}</span>
        </div>
      </div>

      {/* Cinematic Media Stage (Top & Centered) */}
      <div className="media-stage mb-10">
        <div className="main-media-view" style={{ aspectRatio: "16/9", background: "rgba(0,0,0,0.4)" }}>
          <div className="image-hero-view">
            <img 
              src={stock.imageUrl || ""} 
              alt={stock.supercarName} 
              className="hero-main-img" 
              style={{ objectFit: "contain", padding: "40px" }}
            />
          </div>

          {/* Overlay Badges */}
          <div className="status-overlay-badge available">Available</div>
          {stock.promoTag && stock.promoTag !== "None" && (
            <div className="promo-overlay-badge">{stock.promoTag}</div>
          )}
        </div>
      </div>

      {/* Two Column Layout (Bottom) */}
      <div className="details-main-grid">
        
        {/* Left Column: Account Info, Description */}
        <div className="details-info-col">
          
          {/* Header / Titles */}
          <div className="info-header mb-8">
            <span className="tier-pill">{stock.carType || "Supercar"} Tier</span>
            <h1 className="details-title mt-4">{stock.supercarName}</h1>
            <div className="badges-strip mt-4 flex flex-wrap gap-3">
              <span className="unlink-badge">
                <ShieldCheck size={14} />
                <span>Applicable Vehicle: {formatVehicle(stock.applicableVehicle)}</span>
              </span>
              {stock.colour && (
                <span className="unlink-badge" style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  <span>Colour: {stock.colour}</span>
                </span>
              )}
            </div>
          </div>

          {/* Description Block */}
          <div className="description-container glass-panel p-6 sm:p-8">
            <h2 className="section-title font-h font-black text-lg text-white uppercase tracking-wider mb-5 flex items-center gap-3">
              <span className="h-5 w-1 bg-gold rounded-full" />
              <span>Service Guarantees & Details</span>
            </h2>
            <ul className="text-sm leading-relaxed text-[#c5cdd6] flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <Zap size={16} className="text-[#4CD964]" /> 
                Instant processing upon payment confirmation
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={16} className="text-[#007AFF]" /> 
                100% Authorized direct in-game gifting system
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-gold" /> 
                Zero risk of account ban or restrictions
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Sticky Purchasing and Bindings Sidebar */}
        <div className="details-sidebar-col">
          <div className="sticky-sidebar">
            
            {/* Price & Purchase Card */}
            <div className="price-card mb-6">
              <div className="price-content p-6">
                <div className="price-row flex justify-between items-center mb-6">
                  <div className="price-col">
                    <span className="price-label">LISTING PRICE</span>
                    <span className="price-val">₹{Number(stock.offerPrice).toLocaleString("en-IN")}</span>
                    <span className="text-muted text-xs line-through mt-1">₹{Number(stock.sellingPrice).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="status-col flex flex-col items-end">
                    <span className="status-label">AVAILABILITY</span>
                    <span className="status-val uppercase font-bold text-sm" style={{ color: "#4ade80" }}>
                      AVAILABLE
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
                    href={tgLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="cta-btn tg"
                  >
                    <Send size={20} />
                    <span>ORDER VIA TELEGRAM</span>
                  </a>
                </div>
                
                <p className="cta-note text-center text-muted text-[10px] uppercase tracking-wider mt-4">
                  * Must provide your BGMI Character ID for the gift transmission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .rs-details-page {
          background: var(--color-bg);
          color: #fff;
          min-height: 100vh;
          padding: 40px 0;
        }
        .rs-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Back Navigation */
        .back-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--color-gold);
          font-family: var(--font-h);
          font-weight: 800;
          text-transform: uppercase;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.5px;
          transition: transform 0.2s;
        }
        .back-link:hover {
          transform: translateX(-4px);
        }
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--color-muted);
        }
        .breadcrumbs a {
          color: var(--color-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumbs a:hover {
          color: #fff;
        }
        .active-crumb {
          color: #fff;
          font-weight: 600;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Cinematic Media Stage (Top & Large) */
        .media-stage {
          width: 100%;
          max-width: 960px;
          margin-left: auto;
          margin-right: auto;
        }
        .main-media-view {
          position: relative;
          background: #000;
          border-radius: 24px;
          border: 1px solid var(--color-border-gold);
          overflow: hidden;
          box-shadow: 0 15px 45px rgba(255, 215, 0, 0.05), 0 30px 60px rgba(0, 0, 0, 0.7);
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iframe-container {
          width: 100%;
          height: 100%;
        }
        .video-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .image-hero-view {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #06080c;
        }
        .no-media-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .status-overlay-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          font-family: var(--font-h);
          letter-spacing: 1px;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .status-overlay-badge.sold { background: var(--color-red); color: #fff; }
        .status-overlay-badge.available { background: var(--color-green); color: #fff; }
        .status-overlay-badge.coming_soon { background: #3b82f6; color: #fff; }
        .status-overlay-badge.reserved { background: #a855f7; color: #fff; }
        .status-overlay-badge.on_hold { background: #f97316; color: #fff; }
        .status-overlay-badge.ready_to_exchange { background: #06b6d4; color: #fff; }

        .promo-overlay-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: linear-gradient(135deg, #ff007f, #ff004f);
          color: #fff;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          font-family: var(--font-h);
          letter-spacing: 1px;
          box-shadow: 0 4px 15px rgba(255, 0, 127, 0.4);
          z-index: 10;
        }

        .media-thumbnails {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 5px;
          scrollbar-width: thin;
        }
        .thumb-btn {
          flex: 0 0 80px;
          height: 50px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          background: #000;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.2s;
          padding: 0;
        }
        .thumb-btn:hover {
          opacity: 0.9;
        }
        .thumb-btn.active {
          opacity: 1;
          border-color: var(--color-gold);
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Two Column Layout (Bottom) */
        .details-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .details-main-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        /* Left side content */
        .info-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 20px;
        }
        .tier-pill {
          display: inline-block;
          background: var(--color-gold-dim);
          border: 1px solid rgba(255, 215, 0, 0.15);
          color: var(--color-gold);
          font-family: var(--font-h);
          font-weight: 800;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 1.5px;
          padding: 4px 12px;
          border-radius: 100px;
        }
        .details-title {
          font-size: clamp(24px, 3.5vw, 36px);
          font-family: var(--font-h);
          font-weight: 950;
          line-height: 1.2;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .unlink-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-gold);
          background: rgba(255, 215, 0, 0.04);
          border: 1px solid rgba(255, 215, 0, 0.15);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }

        /* Description container */
        .description-container {
          border-radius: 20px;
        }
        .section-title {
          font-size: 18px;
          letter-spacing: 0.5px;
        }
        .description-text {
          font-size: 14px;
          line-height: 1.8;
          color: #b9c2cc;
        }

        /* Screenshot Grid */
        .screenshots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .screenshot-card {
          position: relative;
          aspect-ratio: 16/9;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          background: #000;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .screenshot-card:hover {
          transform: scale(1.04);
          border-color: var(--color-gold);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }
        .screenshot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .screenshot-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8, 10, 15, 0.7);
          opacity: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }
        .screenshot-card:hover .screenshot-hover-overlay {
          opacity: 1;
        }

        /* Right side sticky sidebar */
        .sticky-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Pricing Card */
        .price-card {
          background: rgba(17, 21, 32, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--color-border-gold);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }
        .price-label {
          font-size: 10px;
          color: var(--color-muted);
          letter-spacing: 1.5px;
          font-weight: bold;
        }
        .price-val {
          font-size: 38px;
          font-family: var(--font-h);
          font-weight: 950;
          color: var(--color-gold);
          line-height: 1;
          margin-top: 6px;
        }
        .status-label {
          font-size: 9px;
          color: var(--color-muted);
          letter-spacing: 1px;
          font-weight: bold;
        }
        .status-val {
          font-family: var(--font-h);
          margin-top: 4px;
        }

        /* Black buttons */
        .cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 850;
          font-family: var(--font-h);
          font-size: 13px;
          letter-spacing: 0.5px;
          text-decoration: none;
          color: #fff;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
        }
        .cta-btn.wa {
          background: #25D366;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.25);
        }
        .cta-btn.wa:hover {
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }
        .cta-btn.tg {
          background: #229ED9;
          box-shadow: 0 4px 15px rgba(34, 158, 217, 0.25);
        }
        .cta-btn.tg:hover {
          box-shadow: 0 6px 20px rgba(34, 158, 217, 0.4);
        }

        /* Login gate */
        .login-gate-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
          color: #000;
          font-family: var(--font-h);
          font-weight: 850;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
          transition: all 0.2s;
        }
        .login-gate-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
        }

        /* Bindings Card */
        .bindings-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
        }
        .binding-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .binding-label {
          font-size: 10px;
          font-weight: bold;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .no-binding-val {
          font-size: 13px;
          color: var(--color-muted);
          font-weight: 500;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 7, 10, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.25s ease-out;
        }
        .lightbox-close {
          position: absolute;
          top: 30px;
          right: 30px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lightbox-close:hover {
          background: var(--color-red);
          transform: rotate(90deg);
        }
        .lightbox-content {
          max-width: 90%;
          max-height: 80%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .lightbox-main-img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        }
        .lightbox-nav-footer {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 25px;
        }
        .lightbox-nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 20px;
          border-radius: 100px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lightbox-nav-btn:hover {
          background: var(--color-gold);
          color: #000;
        }
        .lightbox-counter {
          color: var(--color-muted);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
