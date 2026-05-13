import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle } from "lucide-react";

export default function UCPurchase() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <section className="section" style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="badge" style={{ marginBottom: "20px" }}>IN-GAME SERVICES</div>
          <h1 className="stitle" style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "16px" }}>
            Premium <span style={{ color: "var(--gold)" }}>UC Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6, fontSize: "16px" }}>
            Get Unknown Cash (UC) delivered directly to your BGMI account quickly and securely. Contact us on WhatsApp to see the latest offers and purchase UC.
          </p>
          <a href="https://wa.me/+919025391516?text=Hi%20Maddy!%20I%20am%20interested%20in%20purchasing%20UC." target="_blank" rel="noreferrer"
            className="btn btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px" }}>
            <MessageCircle size={18} /> Contact to Buy UC
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}
