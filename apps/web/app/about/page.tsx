import type { Metadata } from "next";
import { Users, Mail, Phone, Calendar } from "lucide-react";
import { AboutPageSchema } from "../../components/SEO";

export const metadata: Metadata = {
  title: "About Us | South India's Premium BGMI Marketplace",
  description: "Learn about Maddy BGMI Store, the most trusted marketplace in India for buying, selling, and exchanging premium verified BGMI accounts since 2019.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const team = [
    {
      name: "Maddy (Mateshwaran R)",
      role: "Founder & Lead Escrow Agent",
      desc: "Managing and verifying safe social logins and unlinking setups since 2019. Trusted by 2,000+ gamers across South India.",
      avatar: "M",
    },
    {
      name: "Technical Verification Crew",
      role: "Security Audit Team",
      desc: "Verifies account login integrity, check for third-party attachment removals, and guarantees safe single-login handovers.",
      avatar: "V",
    },
  ];

  const milestones = [
    { year: "2019", title: "Inception", desc: "Started as a trusted regional gaming escrow middleman service in Tamil Nadu." },
    { year: "2021", title: "Expansion", desc: "Expanded services to cover UC Purchases, X-Suit Gifting, and Supercar upgrades across South India." },
    { year: "2024", title: "Automated Platform", desc: "Launched MaddyBGMIStore.in, implementing secure Clerk logins and payment tracking systems." },
    { year: "2026", title: "The Industry Standard", desc: "Recognized as the primary and most secure verified BGMI marketplace in India." },
  ];

  return (
    <div className="about-wrapper">
      <AboutPageSchema />
      
      {/* Cinematic Hero */}
      <section className="about-hero">
        <div className="overlay" />
        <div className="about-hero-content text-center">
          <span className="badge mb-4"><Users size={12} className="mr-1" /> Est. 2019</span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            The Story of <br /><span className="g">Maddy BGMI Store</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            South India's first secure gaming escrow network built by players, for players. Delivering trust, security, and elite BGMI assets.
          </p>
        </div>
      </section>

      {/* Brand Story & Mission */}
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="card-glass p-8 sm:p-10">
            <h2 className="text-2xl font-black font-h text-white uppercase tracking-wide mb-6">Our Mission</h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              At <strong>Maddy BGMI Store</strong>, our mission is to eliminate transaction scams in the mobile esports market. We believe players should be able to upgrade, exchange, and transact verified BGMI accounts with complete peace of mind.
            </p>
            <p className="text-muted text-sm sm:text-base leading-relaxed mt-4">
              By leveraging a strict, manually audited middleman escrow verification process, we ensure all credentials are bound correctly, unlinked from third parties, and handed over securely.
            </p>
          </div>
          
          <div className="relative">
            <div className="border-l-2 border-gold/20 pl-8 space-y-8">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative timeline-item">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#080a0f] border-2 border-gold flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                  </div>
                  <span className="text-gold font-bold font-h text-lg">{m.year}</span>
                  <h3 className="text-white font-extrabold text-sm uppercase mt-1">{m.title}</h3>
                  <p className="text-muted text-xs sm:text-sm mt-1 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Bios */}
      <section className="py-20 bg-black/30 border-y border-white/5 px-[5%]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl font-black font-h text-white uppercase mb-12">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((t, idx) => (
              <div key={idx} className="card-glass p-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center text-2xl font-black font-h mb-4">
                  {t.avatar}
                </div>
                <h3 className="text-white font-extrabold text-lg">{t.name}</h3>
                <span className="text-gold text-xs font-bold uppercase tracking-wider mt-1">{t.role}</span>
                <p className="text-muted text-xs sm:text-sm mt-4 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support info */}
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto text-center">
        <h2 className="text-3xl font-black font-h text-white uppercase mb-4">Support & Contact Info</h2>
        <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mb-12">
          Have questions about a BGMI account trade, UC transfer, or middleman fee? Reach out directly to our verification team.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card-glass p-6 flex flex-col items-center">
            <Phone className="text-gold mb-3" size={24} />
            <h4 className="text-white font-bold text-xs uppercase">WhatsApp Call/Text</h4>
            <a href="https://wa.me/+919025391516" className="text-gold font-h font-extrabold text-sm mt-2 hover:underline">+91 90253 91516</a>
          </div>
          
          <div className="card-glass p-6 flex flex-col items-center">
            <Mail className="text-gold mb-3" size={24} />
            <h4 className="text-white font-bold text-xs uppercase">Email Address</h4>
            <a href="mailto:contact@maddybgmistore.in" className="text-gold font-h font-extrabold text-sm mt-2 hover:underline">contact@maddybgmistore.in</a>
          </div>

          <div className="card-glass p-6 flex flex-col items-center">
            <Calendar className="text-gold mb-3" size={24} />
            <h4 className="text-white font-bold text-xs uppercase">Support Hours</h4>
            <span className="text-gold font-h font-extrabold text-sm mt-2">09:00 AM - 11:00 PM</span>
          </div>
        </div>
      </section>

      <style>{`
        .about-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .about-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/about-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .about-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .about-hero-content {
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
        .timeline-item {
          transition: transform 0.2s;
        }
        .timeline-item:hover {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
