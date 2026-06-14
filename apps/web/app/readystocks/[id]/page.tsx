import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getProductById } from "../../actions";
import { extractIdFromSlug, getProductSlug } from "../../../lib/seo";
import ProductDetailsClient from "./ProductDetailsClient";
import { ProductSchema, BreadcrumbSchema } from "../../../components/SEO";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = extractIdFromSlug(resolvedParams.id);
  const res = await getProductById(id);

  if (!res.success || !res.product) {
    return {
      title: "Account Details Not Found",
      description: "This verified BGMI account listing is not available or has already been sold.",
    };
  }

  const p = res.product;
  const descSnippet = p.description 
    ? `${p.description.substring(0, 150)}...`
    : "Explore this verified premium BGMI account on Maddy BGMI Store.";

  const firstImg = p.imageUrls && p.imageUrls.length > 0 && p.imageUrls[0] 
    ? p.imageUrls[0] 
    : "";

  return {
    title: `${p.title} - ₹${Number(p.price).toLocaleString("en-IN")} | Buy BGMI Account`,
    description: `${descSnippet} Safe handover and single login guarantee from South India's #1 trusted marketplace.`,
    alternates: {
      canonical: `/readystocks/${getProductSlug(p.title, p.id)}`,
    },
    openGraph: {
      title: `${p.title} - Buy verified BGMI ID`,
      description: descSnippet,
      url: `https://maddybgmistore.in/readystocks/${getProductSlug(p.title, p.id)}`,
      images: firstImg ? [{ url: firstImg, alt: p.title }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} - Buy BGMI Account`,
      description: descSnippet,
      images: firstImg ? [firstImg] : [],
    },
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = extractIdFromSlug(resolvedParams.id);
  const res = await getProductById(id);

  if (!res.success || !res.product) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = res.product as any;

  // 1. Technical Canonical Redirect:
  // If the user visits using raw UUID (e.g. /readystocks/UUID) instead of /readystocks/slug-UUID
  // Redirect them to the canonical slug-based URL to ensure Google indexes the SEO-friendly URL!
  const canonicalSlug = getProductSlug(product.title, product.id);
  if (resolvedParams.id === product.id) {
    redirect(`/readystocks/${canonicalSlug}`);
  }

  // Determine availability mapping for Schema.org
  let availability: "InStock" | "OutOfStock" | "PreOrder" | "SoldOut" = "InStock";
  const statusLower = (product.status || "").toLowerCase();
  if (statusLower === "sold") availability = "SoldOut";
  else if (statusLower === "on_hold" || statusLower === "on hold" || statusLower === "reserved") availability = "OutOfStock";

  const firstImg = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls[0] 
    : "https://maddybgmistore.in/logo.png";

  return (
    <div className="rs-details-page">
      {/* 1. Inject Product Schema (Rich Snippets) */}
      <ProductSchema
        details={{
          name: product.title,
          description: product.description || "Verified premium BGMI Account",
          image: firstImg,
          price: product.price,
          availability: availability,
          sku: product.id,
          category: product.category || "Premium",
          sellerName: "Maddy BGMI Store",
          ratingValue: 4.8, // Fallback EEAT store ratings
          reviewCount: 42,
        }}
      />

      {/* 2. Inject Breadcrumbs Schema */}
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://maddybgmistore.in" },
          { name: "Ready Stocks", item: "https://maddybgmistore.in/readystocks" },
          { name: product.category || "Premium", item: `https://maddybgmistore.in/readystocks?category=${product.category}` },
          { name: product.title, item: `https://maddybgmistore.in/readystocks/${canonicalSlug}` },
        ]}
      />

      {/* 3. Render client UI detail component */}
      <ProductDetailsClient stock={product} />

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
