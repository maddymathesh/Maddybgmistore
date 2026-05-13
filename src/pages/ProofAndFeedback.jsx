import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
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
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {Object.entries(
                proofs.reduce((acc, p) => {
                  const m = p.month || "Earlier";
                  if (!acc[m]) acc[m] = [];
                  acc[m].push(p);
                  return acc;
                }, {})
              ).map(([month, monthProofs]) => (
                <div key={month} style={{ marginBottom: "60px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                    <h2 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 800, color: "var(--gold)", whiteSpace: "nowrap" }}>{month}</h2>
                    <div style={{ height: "1px", background: "rgba(255,215,0,0.15)", width: "100%" }}></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "24px" }}>
                    {monthProofs.map((p) => (
                      <div key={p.id} className="card" style={{ padding: "0", overflow: "hidden", border: "1px solid rgba(255,215,0,0.15)", transition: "transform .3s" }}>
                        <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
                          <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <a href={p.image_url} target="_blank" rel="noreferrer" style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><ExternalLink size={14} /></a>
                        </div>
                        <div style={{ padding: "16px", background: "var(--card)" }}>
                          <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{p.title}</h3>
                          <p style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", marginTop: "4px" }}>{p.month}</p>
                        </div>
                      </div>
                    ))}
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
