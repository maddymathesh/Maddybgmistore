import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Shield, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { LocalBusinessSchema, BreadcrumbSchema } from "../../../components/SEO";

interface CityData {
  slug: string;
  name: string;
  latitude: string;
  longitude: string;
  postalCode: string;
  addressLocality: string;
  desc: string;
  localTitle: string;
  intro: string;
}

const citiesData: Record<string, CityData> = {
  chennai: {
    slug: "chennai",
    name: "Chennai",
    latitude: "13.0827",
    longitude: "80.2707",
    postalCode: "600001",
    addressLocality: "George Town, Chennai",
    desc: "Maddy BGMI Store's Chennai branch is the primary verification headquarters for North Tamil Nadu, providing instant local escrow handovers and face-to-face deals.",
    localTitle: "Maddy BGMI Store Chennai | Buy Verified BGMI Accounts",
    intro: "Serving the active gaming community in Chennai, George Town, and surrounding North Tamil Nadu regions with secure gaming escrow setups.",
  },
  coimbatore: {
    slug: "coimbatore",
    name: "Coimbatore",
    latitude: "11.0168",
    longitude: "76.9558",
    postalCode: "641001",
    addressLocality: "Gandhipuram, Coimbatore",
    desc: "Maddy BGMI Store's Coimbatore hub services Western Tamil Nadu players with premium verified account swaps, middleman validations, and secure payment setups.",
    localTitle: "Maddy BGMI Store Coimbatore | Trusted BGMI Seller",
    intro: "Our Coimbatore hub is the premier destination for gamers in Gandhipuram, Tiruppur, and Erode seeking certified BGMI Glacier skins and X-suits.",
  },
  madurai: {
    slug: "madurai",
    name: "Madurai",
    latitude: "9.9252",
    longitude: "78.1198",
    postalCode: "625001",
    addressLocality: "Anna Nagar, Madurai",
    desc: "Our Madurai escrow center serves Southern Tamil Nadu, coordinating safe multi-login unlinking, character ID inspects, and regional cash deals.",
    localTitle: "Maddy BGMI Store Madurai | Secure BGMI ID Marketplace",
    intro: "Trusted by thousands in Madurai Anna Nagar and surrounding southern districts for zero-risk gaming asset purchases.",
  },
  trichy: {
    slug: "trichy",
    name: "Trichy",
    latitude: "10.7905",
    longitude: "78.7047",
    postalCode: "620001",
    addressLocality: "Cantonment, Trichy",
    desc: "The Trichy hub is our central Tamil Nadu service node. Facilitates fast digital account swaps, instant UC pricing bundles, and rapid credential bindings.",
    localTitle: "Maddy BGMI Store Trichy | Cheap UC & Accounts Shop",
    intro: "Catering to players in Trichy Cantonment and Central district areas with fast response times and 100% verified listings.",
  },
  salem: {
    slug: "salem",
    name: "Salem",
    latitude: "11.6643",
    longitude: "78.1460",
    postalCode: "636001",
    addressLocality: "Meyyanur, Salem",
    desc: "Our Salem escrow office coordinates safety checks for the Salem-Erode gaming hub, verifying Twitter/FB attachment detachments and credentials handovers.",
    localTitle: "Maddy BGMI Store Salem | Face-to-Face BGMI Escrow",
    intro: "Delivering absolute transaction safety and instant payment releases for gamers in Salem Meyyanur and Erode regions.",
  },
  "south-india": {
    slug: "south-india",
    name: "South India",
    latitude: "12.9716",
    longitude: "77.5946",
    postalCode: "560001",
    addressLocality: "MG Road, Bengaluru",
    desc: "Our South India regional center coordinates secure gaming escrow transactions across Karnataka, Kerala, Andhra Pradesh, and Telangana.",
    localTitle: "Maddy BGMI Store South India | #1 Secure Gaming Marketplace",
    intro: "Bridging borders with digital payment safety, single-login warranties, and immediate customer assistance since 2019.",
  },
};

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return Object.keys(citiesData).map((city) => ({
    city,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const cityInfo = citiesData[resolvedParams.city.toLowerCase()];

  if (!cityInfo) {
    return {
      title: "Location Not Found",
      description: "This branch location is not available.",
    };
  }

  return {
    title: cityInfo.localTitle,
    description: `${cityInfo.desc} South India's #1 trusted marketplace with unlinking guarantees since 2019.`,
    alternates: {
      canonical: `/locations/${cityInfo.slug}`,
    },
  };
}

export default async function CityLocationPage({ params }: PageProps) {
  const resolvedParams = await params;
  const cityInfo = citiesData[resolvedParams.city.toLowerCase()];

  if (!cityInfo) {
    notFound();
  }

  return (
    <div className="city-wrapper">
      {/* Schemas */}
      <LocalBusinessSchema
        cityName={cityInfo.name}
        latitude={cityInfo.latitude}
        longitude={cityInfo.longitude}
        postalCode={cityInfo.postalCode}
        addressLocality={cityInfo.addressLocality}
      />
      
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://maddybgmistore.in" },
          { name: "Locations", item: "https://maddybgmistore.in/locations" },
          { name: cityInfo.name, item: `https://maddybgmistore.in/locations/${cityInfo.slug}` },
        ]}
      />

      {/* Content Layout */}
      <section className="py-12 px-[5%] max-w-[1000px] mx-auto">
        <Link href="/locations" className="back-link mb-8">
          <ArrowLeft size={16} /> Back to Locations Directory
        </Link>

        <div className="card-glass p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <MapPin size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Maddy BGMI Store Branch</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-h text-white uppercase mt-2">{cityInfo.name} Hub</h1>
            </div>
            <div className="text-muted text-xs sm:text-sm">
              <div className="font-bold text-white uppercase">Coord Location:</div>
              <div>Lat: {cityInfo.latitude} / Lng: {cityInfo.longitude}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-10">
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold font-h text-white uppercase">Branch Overview</h2>
              <p className="text-muted text-sm sm:text-base leading-relaxed">{cityInfo.desc}</p>
              <p className="text-muted text-sm sm:text-base leading-relaxed">{cityInfo.intro}</p>
              
              <div className="p-6 bg-gold/5 border border-gold/15 rounded-2xl space-y-4">
                <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                  <Shield size={16} className="text-gold" /> Branch Buyer Safeguards
                </h3>
                <ul className="text-muted text-xs sm:text-sm space-y-2 list-disc pl-5 leading-relaxed">
                  <li>Mandatory verification of seller identity and social links.</li>
                  <li>Escrow hold guarantees: payment released only after buyer confirmation.</li>
                  <li>Direct access to Maddy's verification panel for contract audits.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold font-h text-white uppercase">Address &amp; Contact</h2>
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <div className="text-gold font-bold uppercase">Postal Address:</div>
                  <div className="text-muted mt-1">{cityInfo.addressLocality}, Region: Tamil Nadu, Postal Code: {cityInfo.postalCode}, IN.</div>
                </div>
                <div>
                  <div className="text-gold font-bold uppercase">Direct Support:</div>
                  <div className="text-muted mt-1">Mon-Sun: 09:00 AM - 11:00 PM</div>
                </div>
                <div className="pt-4 space-y-3">
                  <a href="https://wa.me/+919025391516" className="btn btn-gold w-full justify-center text-xs tracking-wider gap-2">
                    <Phone size={14} /> WhatsApp Support
                  </a>
                  <a href="https://t.me/maddy_bgmistore" className="btn btn-outline w-full justify-center text-xs tracking-wider gap-2">
                    <MessageSquare size={14} /> Telegram Channel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .city-wrapper {
          background: var(--color-bg);
          color: #eaeaea;
          min-height: 100vh;
        }
        .card-glass {
          background: rgba(17, 21, 32, 0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--color-border-gold);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
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
      `}</style>
    </div>
  );
}
