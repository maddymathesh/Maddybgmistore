import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";
import { Star, MessageCircle } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Reviews fetch error:", err);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <>
      <Navbar />
      <Ticker />
      <div style={{ paddingTop: "84px" }}>

        {/* ── HERO BANNER ─────────────────────────────────── */}
        <section style={{
          position: "relative", width: "100%",
          height: "clamp(300px, 50vw, 500px)",
          overflow: "hidden", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          <img
            src="/reviews-banner.jpg"
            alt="BGMI Reviews golden car scene" loading="lazy" decoding="async"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 25%",
              filter: "brightness(0.55)",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 35%, transparent 50%, rgba(8,10,15,0.97) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, rgba(255,165,0,0.08) 0%, transparent 55%)" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: "740px" }}>
            <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px", backdropFilter: "blur(8px)" }}>
              <Star size={13} fill="var(--gold)" color="var(--gold)" /> Reviews &amp; Sold Proofs
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(30px,5.5vw,66px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "14px",
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}>
              What Our<br /><span style={{ color: "var(--gold)" }}>Buyers Say</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(13px,1.6vw,17px)",
              maxWidth: "520px", margin: "0 auto", lineHeight: 1.7,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Real reviews from real buyers. Every deal verified and completed successfully.
            </p>
          </div>
        </section>

        {/* Reviews grid */}
        <section className="section-alt">
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)" }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)" }}>
              <Star size={40} style={{ color: "var(--gold)", marginBottom: "16px" }} />
              <p>No reviews yet. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="section-alt" style={{ textAlign: "center" }}>
          <h2 className="stitle">Already a Happy Buyer?</h2>
          <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
            Your review helps other players trust the platform and make safe decisions.
          </p>
          <a
            href="https://wa.me/+919025391516?text=Hi!%20I%20want%20to%20submit%20my%20review%20for%20Maddy%20BGMI%20Store."
            target="_blank" rel="noreferrer"
            className="btn btn-gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <MessageCircle size={15} /> Submit Your Review
          </a>
        </section>
      </div>
      <Footer />
    </>
  );
}

function ReviewCard({ r }) {
  const avatarText = r.initials || (r.name || "?").slice(0, 2).toUpperCase();
  const stars = Math.min(5, Math.max(1, Number(r.stars) || 5));

  return (
    <div className="review-card">
      <div className="review-top">
        {r.image ? (
          <img
            src={r.image}
            alt={r.name}
            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--gold)" }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="review-avatar">{avatarText}</div>
        )}
        <div>
          <div className="review-name">{r.name}</div>
          <div className="review-date">{r.date || ""}</div>
        </div>
      </div>

      {/* Stars */}
      <div style={{ display: "flex", gap: "2px", margin: "10px 0 8px" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < stars ? "var(--gold)" : "transparent"}
            color={i < stars ? "var(--gold)" : "rgba(255,215,0,0.25)"}
          />
        ))}
      </div>

      <p className="review-text">{r.text}</p>
      <span className="review-verified">✅ Sold Proof Verified</span>
    </div>
  );
}
