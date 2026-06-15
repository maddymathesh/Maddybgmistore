import type { Metadata } from "next";
import { BookOpen, HelpCircle } from "lucide-react";
import { FAQSchema } from "../../../components/SEO";
import ValuationCalculator from "../../../components/ValuationCalculator";

export const metadata: Metadata = {
  title: "How to Value a BGMI Account | Price Calculator Guide",
  description: "A complete step-by-step BGMI account valuation guide. Learn how to calculate the price of upgradeable Glacier skins, X-Suits, and Mythics.",
  alternates: {
    canonical: "/guides/valuation",
  },
};

export default function ValuationGuidePage() {
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
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto space-y-16">
        {/* Interactive Valuation Calculator */}
        <ValuationCalculator />

        {/* Detailed FAQ */}
        <div className="card-glass p-8 max-w-[900px] mx-auto">
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
          background: url('/valuation-banner.jpg') no-repeat center center;
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

