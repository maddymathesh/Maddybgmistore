/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { getProducts } from "../actions";
import ReadyStocksClient from "./ReadyStocksClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verified BGMI Accounts Catalog | Ready Stocks",
  description: "Browse South India's largest and most trusted inventory of verified BGMI accounts for sale. Find Glacier M416 IDs, X-Suit accounts, and supercar skins.",
  keywords: [
    "bgmi accounts for sale",
    "buy bgmi account",
    "glacier m416 account",
    "maddy bgmi store stocks",
    "trusted bgmi seller tamil nadu",
  ],
};

export default async function ReadyStocksPage() {
  const res = await getProducts();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const products = res.success ? (res.products as any[]) : [];

  return (
    <div className="rs-page">
      <section className="rs-hero">
        <img src="/readystocks-banner.jpg" alt="BGMI Ready Stocks Account Listings" className="hero-bg" />
        <div className="hero-content">
          <h1 className="text-3xl sm:text-5xl font-black font-h uppercase leading-none text-white">
            Ready To Play <br /><span className="g">Accounts</span>
          </h1>
          <p className="text-muted text-xs sm:text-sm uppercase font-bold tracking-widest mt-3">
            Explore Premium BGMI IDs handpicked for elite gamers.
          </p>
        </div>
      </section>

      <ReadyStocksClient initialStocks={products} />

      <style>{`
        .rs-page { background: var(--color-bg); color: #fff; min-height: 100vh; }
        .rs-hero { position: relative; height: 50vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; background-position: top; background-size: cover; object-fit: cover; filter: brightness(0.25); }
        .hero-content { position: relative; z-index: 2; text-align: center; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 30px; background-color: rgba(17, 21, 32, 0.4); border: 1px solid var(--color-border-gold); border-radius: 24px; }
        
        .rs-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        
        .filter-bar { 
          background: rgba(17, 21, 32, 0.85); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
          padding: 15px; border-radius: 16px; border: 1px solid var(--color-border-gold);
          display: flex; gap: 15px; margin-bottom: 40px; flex-wrap: wrap;
          z-index: 10;
        }
        .filter-bar.sticky { position: sticky; top: 80px; }
        .search-box { flex: 1; min-width: 240px; background: rgba(255,255,255,0.03); border-radius: 10px; display: flex; align-items: center; padding: 0 15px; color: var(--color-gold); border: 1px solid rgba(255,255,255,0.05); }
        .search-box input { background: none; border: none; padding: 12px; color: #fff; width: 100%; outline: none; font-size: 14px; }
        .select-group { display: flex; gap: 10px; }
        .filter-bar select { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 10px; outline: none; cursor: pointer; font-size: 14px; }
        .filter-bar select option { background: #111520; color: #fff; }

        .stocks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; }
        .premium-card-link {
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .premium-card { 
          background: var(--color-card); border: 1px solid var(--color-border-gold); 
          border-radius: 20px; overflow: hidden; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column;
          height: 100%;
        }
        .premium-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.45); border-color: var(--color-gold); }
        .premium-card:hover .card-thumbnail { transform: scale(1.03); }
        
        .card-video-wrap { position: relative; padding-top: 56.25%; background: #000; overflow: hidden; }
        .card-thumbnail { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .play-hover-btn { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(8,10,15,0.4); opacity: 0; transition: opacity 0.2s ease; color: var(--color-gold); }
        .premium-card:hover .play-hover-btn { opacity: 1; }
        
        .no-video { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.02); }
        .card-tier-badge { position: absolute; top: 15px; left: 15px; background: var(--color-gold); color: #000; font-weight: 850; font-size: 10px; padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-h); z-index: 10; }
        .card-status-badge { position: absolute; top: 15px; right: 15px; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 850; text-transform: uppercase; font-family: var(--font-h); z-index: 10; }
        .card-status-badge.sold { background: var(--color-red); color: #fff; }
        .card-status-badge.available { background: var(--color-green); color: #fff; }
        .card-status-badge.coming_soon { background: #3b82f6; color: #fff; }
        .card-status-badge.reserved { background: #a855f7; color: #fff; }
        .card-status-badge.on_hold { background: #f97316; color: #fff; }
        .card-status-badge.ready_to_exchange { background: #06b6d4; color: #fff; }
        .card-promo-badge { position: absolute; bottom: 15px; left: 15px; background: linear-gradient(135deg, #ff007f, #ff004f); color: #fff; padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 850; text-transform: uppercase; font-family: var(--font-h); box-shadow: 0 4px 10px rgba(255,0,127,0.4); z-index: 10; }

        .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .card-title { font-size: 15.5px; font-family: var(--font-h); font-weight: 750; margin-bottom: 15px; color: #fff; line-height: 1.4; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; height: 43px; }
        
        .card-footer-summary { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; margin-top: auto; }
        .card-price-val { font-family: var(--font-h); font-weight: 900; font-size: 20px; color: var(--color-gold); }
        .card-price-locked { font-family: var(--font-h); font-weight: 800; font-size: 10px; letter-spacing: 0.5px; color: var(--color-muted); background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); padding: 4px 10px; border-radius: 8px; }
        .card-summary-logins { display: flex; gap: 6px; }
        
        .no-results { grid-column: 1/-1; text-align: center; padding: 80px; color: var(--color-muted); font-size: 18px; }

        @media (max-width: 768px) {
          .filter-bar { position: static; }
          .select-group { width: 100%; }
          .select-group select { flex: 1; }
          .rs-hero { height: 40vh; }
        }
      `}</style>
    </div>
  );
}
