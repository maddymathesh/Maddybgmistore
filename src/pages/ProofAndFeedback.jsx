import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, ExternalLink, Loader2 } from "lucide-react";

export default function ProofAndFeedback() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      const { data, error } = await supabase
        .from('proofs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setProofs(data);
      setLoading(false);
    };
    fetchProofs();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        <section style={{ position: "relative", padding: "60px 5%", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}><Camera size={14} /> Trust & Transparency</div>
          <h1 className="stitle" style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "16px" }}>Proof & <span style={{ color: "var(--gold)" }}>Feedback</span></h1>
          <p style={{ color: "var(--muted)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>Browse our gallery of successful deals, payment proofs, and chat feedback from our amazing community.</p>
        </section>

        <section className="section" style={{ paddingTop: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}><Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} /></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
              {proofs.map((p) => (
                <div key={p.id} className="card" style={{ padding: "0", overflow: "hidden", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
                    <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <a href={p.image_url} target="_blank" rel="noreferrer" style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><ExternalLink size={14} /></a>
                  </div>
                  <div style={{ padding: "16px", background: "var(--card)" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{p.title}</h3>
                    <p style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", marginTop: "4px" }}>{new Date(p.created_at).toLocaleDateString()}</p>
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
