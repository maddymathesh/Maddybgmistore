import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, ExternalLink, Loader2 } from "lucide-react";

export default function ProofAndFeedback() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "proofs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setProofs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        {/* ── HERO ────────────────────────────────────────── */}
        <section style={{
          position: "relative", padding: "60px 5%", textAlign: "center",
          background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)"
        }}>
          <div className="badge" style={{ marginBottom: "20px" }}>
            <Camera size={14} /> Trust & Transparency
          </div>
          <h1 className="stitle" style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "16px" }}>
            Proof & <span style={{ color: "var(--gold)" }}>Feedback</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Browse our gallery of successful deals, payment proofs, and chat feedback from our amazing community.
          </p>
        </section>

        {/* ── GALLERY GRID ────────────────────────────────── */}
        <section className="section" style={{ paddingTop: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
            </div>
          ) : proofs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 0", color: "var(--muted)" }}>
              <p>No proof images uploaded yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: "24px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {proofs.map((p) => (
                <div key={p.id} className="card" style={{ padding: "0", overflow: "hidden", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
                    <img 
                      src={p.imageUrl} 
                      alt={p.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <a 
                      href={p.imageUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "rgba(0,0,0,0.6)", borderRadius: "50%",
                        width: "32px", height: "32px", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "#fff", backdropFilter: "blur(4px)"
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div style={{ padding: "16px", background: "var(--card)" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-h)" }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "4px" }}>
                      {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "Recent Deal"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
      <Footer />
    </>
  );
}
