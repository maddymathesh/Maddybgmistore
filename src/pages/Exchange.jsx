import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageCircle } from "lucide-react";

export default function Exchange() {
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
      </div>
      <Footer />
    </>
  );
}
