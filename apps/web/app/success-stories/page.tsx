import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Star, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Success Stories | Real BGMI Account Trading Reviews",
  description: "Read case studies of verified high-value BGMI transactions (Glacier M416 IDs, X-Suit accounts) completed safely on Maddy BGMI Store.",
  alternates: {
    canonical: "/success-stories",
  },
};

export default function SuccessStoriesPage() {
  const stories = [
    {
      title: "Glacier M416 Max Level Handover to Coimbatore Buyer",
      meta: "Value: ₹34,500 | Category: Premium Account",
      details: "A premium account containing Max Level Glacier M416 and 3 upgradeable weapon skins was sold. Maddy BGMI Store acted as middleman, verifying that the seller's Twitter login was completely detached and the buyer's personal Google Play Games was binded successfully before payment release.",
      result: "Verifiably secured within 45 minutes. Safe and clean.",
    },
    {
      title: "Full Fiorenzo X-Suit Gifting & UC Top-up to Chennai Gamer",
      meta: "Value: ₹12,500 | Category: Gifting Service",
      details: "The client wanted a secure Fiorenzo X-suit gift package. The transfer was made using our official high-level in-game gifting crew, bypassing standard region restrictions securely.",
      result: "Gift delivered successfully in-game with zero cooldown.",
    },
    {
      title: "Coimbatore Mid-Range Account Exchange Trade",
      meta: "Value: Trade Swap + Cash | Category: Exchange Swap",
      details: "Two local South Indian players exchanged accounts. We secured both accounts, processed the identity checks for both parties, reset security questions, and verified unlinking. The trade differential cash was processed through our secure escrow.",
      result: "Successful face-to-face swap verified remotely by Maddy.",
    },
  ];

  return (
    <div className="success-wrapper">
      {/* Hero Banner */}
      <section className="success-hero">
        <div className="overlay" />
        <div className="success-hero-content text-center">
          <span className="badge mb-4"><Heart size={12} className="mr-1 text-red-500 fill-red-500" /> Buyer Testimonials</span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            Gamer <span className="g">Success Stories</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Real transactions, certified handovers, and reviews from players who found their dream BGMI accounts securely on our platform.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto">
        <div className="space-y-12">
          {stories.map((story, idx) => (
            <div key={idx} className="card-glass p-8 sm:p-10 grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <span className="text-gold font-h font-black text-xs uppercase tracking-widest">{story.meta}</span>
                <h3 className="text-white font-extrabold text-lg sm:text-xl uppercase leading-snug mt-2">{story.title}</h3>
                <div className="flex items-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="var(--color-gold)" color="var(--color-gold)" />)}
                  <span className="text-xs text-muted ml-2">5.0 Rating</span>
                </div>
              </div>
              <div className="md:col-span-2 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 pt-6 md:pt-0">
                <h4 className="text-gold font-bold text-xs uppercase mb-2">Deal Walkthrough:</h4>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{story.details}</p>
                <div className="mt-4 p-4 bg-gold/5 border border-gold/10 rounded-xl flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gold shrink-0" />
                  <span className="text-white text-xs font-semibold uppercase">{story.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16 text-center">
          <div className="card-glass p-8">
            <MessageSquare className="text-gold mx-auto mb-4" size={32} />
            <h3 className="text-white font-extrabold text-sm uppercase mb-2">Read Buyer Reviews</h3>
            <p className="text-muted text-xs sm:text-sm mb-6 leading-relaxed">Browse through hundreds of real feedback logs from our community.</p>
            <Link href="/reviews" className="btn btn-gold w-full justify-center">Go to Reviews <ArrowRight size={14} /></Link>
          </div>
          
          <div className="card-glass p-8">
            <ShieldCheck className="text-gold mx-auto mb-4" size={32} />
            <h3 className="text-white font-extrabold text-sm uppercase mb-2">Transaction Proofs</h3>
            <p className="text-muted text-xs sm:text-sm mb-6 leading-relaxed">Check monthly payment logs and customer chat confirmation screenshots.</p>
            <Link href="/proofs" className="btn btn-gold w-full justify-center">Go to Proofs <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      <style>{`
        .success-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .success-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/success-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .success-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .success-hero-content {
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
