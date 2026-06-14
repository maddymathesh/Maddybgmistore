import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { FAQSchema } from "../../components/SEO";

export const metadata: Metadata = {
  title: "Why Trust Us | Safe BGMI Account Trading Guarantee",
  description: "Discover why Maddy BGMI Store is India's most trusted gaming escrow marketplace. Learn about our 100% unlinking guarantee, secure escrow, and track record since 2019.",
  alternates: {
    canonical: "/why-trust-us",
  },
};

export default function WhyTrustUsPage() {
  const securitySteps = [
    {
      title: "1. Identity & Credentials Check",
      desc: "Every seller's identity and BGMI account character ID are validated. No placeholder listings or unverified IDs are allowed.",
    },
    {
      title: "2. Social Media Unlinking Verification",
      desc: "Our escrow agents manually confirm that secondary login links (Google Play Games, Facebook, Twitter, Apple ID, Email) are successfully detached or securely locked.",
    },
    {
      title: "3. Secure Escrow Hold",
      desc: "Buyer payments are held securely in our business accounts. Funds are only transferred to the seller after the buyer logs in and changes all security credentials.",
    },
    {
      title: "4. Single Login Warranty",
      desc: "We verify that only the buyer retains active login access, completely neutralizing the risk of retrieving accounts back.",
    },
  ];

  const trustFaqs = [
    {
      question: "How does Maddy BGMI Store guarantee transaction safety?",
      answer: "We act as a secure escrow middleman. The buyer pays Maddy BGMI Store directly. We secure the BGMI account details from the seller, verify that all social networks are unlinked or binded properly, assist the buyer in logging in, and only release the payment to the seller after account secure transfer is complete.",
    },
    {
      question: "What happens if a seller tries to retrieve an account?",
      answer: "We enforce a strict single-login warranty. Sellers are audited, and accounts undergo a hold period to ensure unlinking is permanent. If a retrieval occurs, Maddy BGMI Store's buyer protection plan steps in, assisting in dispute resolution or refunding the transaction.",
    },
    {
      question: "How many transactions has Maddy BGMI Store successfully completed?",
      answer: "Since 2019, Maddy BGMI Store has safely processed over 2,000 verified BGMI account trades and UC gift deliveries with a 4.8/5-star average rating.",
    },
  ];

  return (
    <div className="trust-wrapper">
      <FAQSchema items={trustFaqs} />

      {/* Hero Header */}
      <section className="trust-hero">
        <div className="overlay" />
        <div className="trust-hero-content text-center">
          <span className="badge mb-4"><ShieldCheck size={12} className="mr-1" /> Safe &amp; Secure Escrow</span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            Why Shop With <br /><span className="g">Maddy BGMI Store?</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Eliminating transaction risks since 2019. Read our E-E-A-T trust signals and security protocols.
          </p>
        </div>
      </section>

      {/* Security Pillars Cards */}
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black font-h text-center text-white uppercase mb-12">
          Our Four Pillars of Buyer Safety
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securitySteps.map((step, idx) => (
            <div key={idx} className="card-glass p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 text-gold flex items-center justify-center font-bold font-h mb-4">
                  0{idx + 1}
                </div>
                <h3 className="text-white font-extrabold text-sm uppercase mb-3">{step.title}</h3>
                <p className="text-muted text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
              <div className="flex justify-end mt-4">
                <CheckCircle2 size={16} className="text-gold" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Metrics Stats */}
      <section className="py-20 bg-black/30 border-y border-white/5 px-[5%]">
        <div className="max-w-[1000px] mx-auto grid sm:grid-cols-3 gap-8 text-center">
          <div className="metric-box">
            <span className="text-4xl sm:text-5xl font-black font-h text-gold">2,000+</span>
            <h4 className="text-white font-extrabold text-xs uppercase mt-2">Successful Deals</h4>
            <p className="text-muted text-xs mt-1">Verified account &amp; UC trades</p>
          </div>
          <div className="metric-box">
            <span className="text-4xl sm:text-5xl font-black font-h text-gold">4.8 / 5</span>
            <h4 className="text-white font-extrabold text-xs uppercase mt-2">Customer Score</h4>
            <p className="text-muted text-xs mt-1">Based on real buyer reviews</p>
          </div>
          <div className="metric-box">
            <span className="text-4xl sm:text-5xl font-black font-h text-gold">100%</span>
            <h4 className="text-white font-extrabold text-xs uppercase mt-2">Unlink Guarantee</h4>
            <p className="text-muted text-xs mt-1">Zero multi-login vulnerabilities</p>
          </div>
        </div>
      </section>

      {/* Detailed Escrow FAQ Accordion */}
      <section className="py-20 px-[5%] max-w-[800px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black font-h text-center text-white uppercase mb-12">
          Trust &amp; Escrow FAQs
        </h2>

        <div className="space-y-6">
          {trustFaqs.map((faq, idx) => (
            <div key={idx} className="card-glass p-6">
              <h3 className="text-white font-extrabold text-sm sm:text-base uppercase flex items-start gap-3">
                <span className="text-gold">Q:</span> {faq.question}
              </h3>
              <p className="text-muted text-xs sm:text-sm mt-3 leading-relaxed pl-6 border-l-2 border-gold/30">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/reviews" className="btn btn-gold justify-center inline-flex items-center gap-2">
            Read Real Buyer Testimonials <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <style>{`
        .trust-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .trust-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/trust-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .trust-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .trust-hero-content {
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
        .metric-box {
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
