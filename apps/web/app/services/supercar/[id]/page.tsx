import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupercarGiftById } from "../../../../actions";
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
            <div className="badges-strip mt-4">
              <span className="unlink-badge">
                <ShieldCheck size={14} />
                <span>Applicable Vehicle: {formatVehicle(stock.applicableVehicle)}</span>
              </span>
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
    </div>
  );
}
