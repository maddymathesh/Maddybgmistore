import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageCircle, ShieldCheck, CheckCircle } from "lucide-react";

export default function Exchange() {
  const [activeTrustCard, setActiveTrustCard] = useState(null);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <section className="section" style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="badge" style={{ marginBottom: "20px" }}>ACCOUNT EXCHANGE</div>
          <h1 className="stitle" style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "16px" }}>
            Exchange Your <span style={{ color: "var(--gold)" }}>BGMI Account</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6, fontSize: "16px" }}>
            Want to upgrade your current account? We offer secure and hassle-free account exchange services. Connect with us to discuss the value of your current account and the premium account you wish to get!
          </p>
          <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20want%20to%20exchange%20my%20BGMI%20account." target="_blank" rel="noreferrer"
            className="btn btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px" }}>
            <MessageCircle size={18} /> Contact for Exchange
          </a>
        </section>

        {/* WHY TRUST */}
        <section className="section" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.005)" }}>
          <h2 className="stitle" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", fontSize: "clamp(26px,4vw,38px)", marginBottom: "32px", fontFamily: "var(--font-h)" }}>
            <ShieldCheck size={28} style={{ color: "var(--gold)" }} /> Why Trust <span className="g">Maddy Store?</span>
          </h2>
          
          <div className="why-us-grid" style={{ marginBottom: "20px" }}>
            {[
              { h: "100% Trusted Deals", p: "Over 5000+ satisfied customers globally." },
              { h: "Safe Transfers", p: "Proprietary security protocol for handovers." },
              { h: "24/7 Support", p: "Dedicated team for after-sales assistance." },
              { h: "Verified Listings", p: "Every account is manually checked by Maddy." }
            ].map((item, idx) => (
              <div 
                key={item.h} 
                className={`why-us-card why-us-card-green ${activeTrustCard === idx ? 'highlighted' : ''}`}
                onClick={() => setActiveTrustCard(idx)}
                style={{ cursor: "pointer", textAlign: "left" }}
              >
                <div className="why-us-icon-wrap" style={{ color: "#22c55e", background: "rgba(34, 197, 94, 0.04)", borderColor: "rgba(34, 197, 94, 0.15)" }}>
                  <CheckCircle size={20} />
                </div>
                <h3>{item.h}</h3>
                <p>{item.p}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
