import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PageNotFound() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "calc(100vh - 102px)", display: "flex", alignItems: "center", justifyContent: "center", background: "#05070f", color: "#f5f5f5", textAlign: "center", padding: "40px 20px" }}>
        <div style={{ maxWidth: "700px" }}>
          <div style={{ fontSize: "clamp(90px, 12vw, 140px)", fontWeight: 900, letterSpacing: "-0.05em", marginBottom: "16px", color: "#FFD700" }}>
            404
          </div>
          <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "16px" }}>
            Page not found
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "16px", lineHeight: 1.8, marginBottom: "32px" }}>
            The page you’re looking for doesn’t exist or may have moved. Return to the homepage to continue browsing.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 28px",
              borderRadius: "999px",
              background: "#FFD700",
              color: "#05070f",
              fontWeight: 700,
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
          >
            Go to homepage
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
