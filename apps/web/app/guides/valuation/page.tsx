import type { Metadata } from "next";
import { BookOpen, Calculator, DollarSign, HelpCircle } from "lucide-react";
import { FAQSchema } from "../../../components/SEO";

export const metadata: Metadata = {
  title: "How to Value a BGMI Account | Price Calculator Guide",
  description: "A complete step-by-step BGMI account valuation guide. Learn how to calculate the price of upgradeable Glacier skins, X-Suits, and Mythics.",
  alternates: {
    canonical: "/guides/valuation",
  },
};

export default function ValuationGuidePage() {
  const multipliers = [
    { skin: "M416 Glacier (Level 1)", type: "Upgradeable Weapon", multiplier: "₹1,500 - ₹2,500", keyFactor: "Base skin unlock" },
    { skin: "M416 Glacier (Max Level)", type: "Upgradeable Weapon", multiplier: "₹18,000 - ₹25,000", keyFactor: "Requires 7 materials + tech parts" },
    { skin: "Pharaoh X-Suit (Level 1)", type: "Premium Outfit", multiplier: "₹2,500 - ₹4,000", keyFactor: "Base unlock" },
    { skin: "Pharaoh X-Suit (Max Level)", type: "Premium Outfit", multiplier: "₹30,000 - ₹50,000", keyFactor: "Level 6/7 final form" },
    { skin: "Mythic Fashion Title", type: "Account Title", multiplier: "+ ₹3,000 - ₹8,000", keyFactor: "Requires 50+ mythic items" },
    { skin: "Sports Car (Koenigsegg/Pagani)", type: "Vehicle Skin", multiplier: "+ ₹5,000 - ₹12,000", keyFactor: "Depends on key count and colors" },
  ];

  const valuationFaqs = [
    {
      question: "What is the most valuable skin in BGMI?",
      answer: "The M416 Glacier (Max Level) and Max Level X-Suits (like Golden Pharaoh, Fiorenzo, or Silvanus) are verifiably the most valuable skins in Battlegrounds Mobile India. Their pricing is driven by the cost of materials required to upgrade them.",
    },
    {
      question: "How is a BGMI account's price calculated?",
      answer: "A BGMI account price is calculated using the formula: Base Value (Level/Tiers) + Upgradeable Weapons Value + Premium Outfits Value + Sports Cars Value + Rare Titles/Achievements. Unlinked accounts with single logins command a 20-30% premium.",
    },
    {
      question: "Why do single-login BGMI accounts cost more?",
      answer: "Single-login accounts (where only one social link, e.g., only Twitter, is connected, and secondary links are blank) are significantly more secure. They eliminate the risk of a seller reclaiming the ID through secondary bindings.",
    },
  ];

  return (
    <div className="guide-wrapper">
      <FAQSchema items={valuationFaqs} />

      {/* Hero Header */}
      <section className="guide-hero">
        <div className="overlay" />
        <div className="guide-hero-content text-center">
          <span className="badge mb-4"><BookOpen size={12} className="mr-1" /> Expert Knowledge Center</span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            How to Value a <br /><span className="g">BGMI Account</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            The definitive pricing audit framework for upgradeable items, vehicle skins, and character levels.
          </p>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-20 px-[5%] max-w-[900px] mx-auto space-y-12">
        {/* Core Formula */}
        <div className="card-glass p-8">
          <h2 className="text-xl font-black font-h text-white uppercase flex items-center gap-3 mb-6">
            <Calculator className="text-gold" size={20} /> The BGMI Valuation Formula
          </h2>
          <div className="bg-black/30 p-6 rounded-xl border border-white/5 font-mono text-center text-sm sm:text-base text-gold font-bold">
            Account Price = Base Level + (Upgradeable Weapons × Level Multiplier) + X-Suits + Sports Cars + Bindings Premium
          </div>
          <p className="text-muted text-xs sm:text-sm mt-6 leading-relaxed">
            Unlike standard accounts, premium BGMI account valuation is heavily skewed toward upgradeable assets. A character level 80 account with no upgrade skins might be worth ₹1,500, whereas a level 60 account with a Max Glacier M416 can easily fetch over ₹20,000 due to material upgrade costs.
          </p>
        </div>

        {/* Multipliers Table */}
        <div className="card-glass p-8">
          <h2 className="text-xl font-black font-h text-white uppercase flex items-center gap-3 mb-6">
            <DollarSign className="text-gold" size={20} /> Estimated Valuation Matrix (2026)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gold font-bold">
                  <th className="py-3 px-4">Skin / Item Asset</th>
                  <th className="py-3 px-4">Asset Type</th>
                  <th className="py-3 px-4">Market Value range</th>
                  <th className="py-3 px-4">Key Valuation Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-muted">
                {multipliers.map((m, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white font-semibold">{m.skin}</td>
                    <td className="py-3 px-4">{m.type}</td>
                    <td className="py-3 px-4 text-gold font-bold">{m.multiplier}</td>
                    <td className="py-3 px-4">{m.keyFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed FAQ */}
        <div className="card-glass p-8">
          <h2 className="text-xl font-black font-h text-white uppercase flex items-center gap-3 mb-8">
            <HelpCircle className="text-gold" size={20} /> Valuation &amp; Pricing FAQs
          </h2>
          <div className="space-y-6">
            {valuationFaqs.map((faq, idx) => (
              <div key={idx} className="border-l-2 border-gold/30 pl-4 py-1">
                <h4 className="text-white font-extrabold text-xs sm:text-sm uppercase">{faq.question}</h4>
                <p className="text-muted text-xs sm:text-sm mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .guide-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .guide-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/guides-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .guide-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .guide-hero-content {
          position: relative;
          z-index: 5;
          padding: 0 20px;
        }
        .card-glass {
          background: rgba(17, 21, 32, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--color-border-gold);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
