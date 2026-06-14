import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Navigation, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Locations | Local BGMI Escrow Service Centers",
  description: "Browse our South India regional store locations and local escrow service hubs. Fast, face-to-face secure BGMI account trading in Tamil Nadu.",
  alternates: {
    canonical: "/locations",
  },
};

export default function LocationsPage() {
  const cities = [
    { slug: "chennai", name: "Chennai Hub", desc: "Capital city verification services and express escrow handovers for North Tamil Nadu players." },
    { slug: "coimbatore", name: "Coimbatore Hub", desc: "Serving Western Tamil Nadu gamers with local middleman swaps and instant payment setups." },
    { slug: "madurai", name: "Madurai Hub", desc: "Escrow center catering to Southern Tamil Nadu players. Secure Glacier and X-Suit trading." },
    { slug: "trichy", name: "Trichy Hub", desc: "Centrally located hub facilitating fast trade swaps and UC gifting coordination." },
    { slug: "salem", name: "Salem Hub", desc: "Express verification branch serving players in the Salem and Erode gaming circles." },
    { slug: "south-india", name: "South India Hub", desc: "Broad regional escrow support for Karnataka, Kerala, Andhra Pradesh, and Telangana." },
  ];

  return (
    <div className="loc-wrapper">
      {/* Hero */}
      <section className="loc-hero">
        <div className="overlay" />
        <div className="loc-hero-content text-center">
          <span className="badge mb-4"><MapPin size={12} className="mr-1" /> South India Coverage</span>
          <h1 className="text-4xl sm:text-6xl font-black font-h uppercase text-white leading-none">
            Regional <span className="g">Hub Centers</span>
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Maddy BGMI Store operates localized verification channels to facilitate secure, fast face-to-face and remote account escrow deals.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="py-20 px-[5%] max-w-[1200px] mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, idx) => (
            <div key={idx} className="card-glass p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-gold mb-4">
                  <Navigation size={16} />
                  <h3 className="text-white font-extrabold text-lg uppercase font-h">{city.name}</h3>
                </div>
                <p className="text-muted text-xs sm:text-sm leading-relaxed mb-6">{city.desc}</p>
              </div>
              <Link href={`/locations/${city.slug}`} className="btn btn-gold w-full justify-center text-xs tracking-wider">
                Visit Branch Page <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .loc-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .loc-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: url('/locations-banner.jpg') no-repeat center center;
          background-size: cover;
        }
        .loc-hero .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(8,10,15,0.3) 0%, rgba(8,10,15,0.95) 100%);
        }
        .loc-hero-content {
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
