import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle } from "lucide-react";

export default function XsuitGift() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <section className="section" style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="badge" style={{ marginBottom: "20px" }}>IN-GAME SERVICES</div>
          <h1 className="stitle" style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "16px" }}>
            X-Suit <span style={{ color: "var(--gold)" }}>Gift Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6, fontSize: "16px" }}>
            Looking for the latest X-Suit? We provide safe and fast X-Suit gifting services directly to your BGMI account. Reach out to know the pricing and requirements!
          </p>
          <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20am%20interested%20in%20the%20X-Suit%20Gift%20Service." target="_blank" rel="noreferrer"
            className="btn btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px" }}>
            <MessageCircle size={18} /> Contact for X-Suit
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
