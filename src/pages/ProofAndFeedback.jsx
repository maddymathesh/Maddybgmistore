import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Camera, ExternalLink, Loader2 } from "lucide-react";





export default function ProofAndFeedback() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

const [MONTHS_ORDER, setMonthsOrder] = useState([]);

useEffect(() => {
  getMonthsOrder().then(setMonthsOrder);
}, []);





async function getMonthsOrder() {
  const { data, error } = await supabase
    .from("proofs")
    .select("month")
    .order("month", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  // Deduplicate months
  const uniqueMonths = [...new Set(data.map(p => p.month))];

  return uniqueMonths;
}

const grouped = MONTHS_ORDER.reduce((acc, m) => {
  const items = proofs.filter(p => p.month === m);
  if (items.length > 0) acc[m] = items;
  return acc;
}, {});

  // console.log('proofs', proofs);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const { data } = await supabase
          .from('proofs')
          .select('*')
          .order('created_at', { ascending: false });
        setProofs(data || []);
      } catch (err) {
        console.error('Error fetching proofs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProofs();
  }, []);


  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>

        <section style={{
          position: "relative", width: "100%", minHeight: "72vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", textAlign: "center",
        }}>
          <img src="/proof-feedback-banner.jpg" alt="BGMI Proof & Feedback" loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.97) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 65%)" }} />
          <div style={{ position: "relative", zIndex: 2, padding: "0 5%", maxWidth: "800px" }}>
            <div className="badge" style={{ marginBottom: "20px" }}><Camera size={14} /> Trust &amp; Transparency</div>
            <h1 className="stitle" style={{ fontSize: "clamp(34px, 6vw, 60px)", fontWeight: 900, marginBottom: "16px", textShadow: "0 2px 25px rgba(0,0,0,0.7)" }}>
              Proof &amp; <span style={{ color: "var(--gold)" }}>Feedback</span>
            </h1>
            <p style={{ color: "rgba(234,234,234,0.85)", maxWidth: "620px", margin: "0 auto", lineHeight: 1.7, fontSize: "16px", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              Browse real payment proofs and customer feedback from our successful deals — organized by month for complete transparency.
            </p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 0", color: "var(--muted)" }}>
              <Camera size={48} style={{ opacity: 0.3, marginBottom: "16px", display: "block", margin: "0 auto 16px" }} />
              <p>No proofs available yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              {Object.entries(grouped).map(([month, monthProofs]) => (
                <div key={month} style={{ marginBottom: "70px" }}>

                  {/* Month Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
                    <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 900, color: "var(--gold)", whiteSpace: "nowrap" }}>
                      {month}
                    </h2>
                    <div style={{ height: "1px", background: "rgba(255,215,0,0.15)", flex: 1 }} />
                    <span style={{ whiteSpace: "nowrap", fontSize: "12px", color: "var(--muted)" }}>
                      {monthProofs.length} proof{monthProofs.length > 1 ? "s" : ""}
                    </span>
                  </div>

                 {/* Proof Grid */}
<div style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", 
  gap: "24px" 
}}>
  {monthProofs.map((p) => (
    <div key={p.id} className="card"
      style={{ 
        padding: "0", 
        overflow: "hidden", 
        border: "1px solid rgba(255,215,0,0.12)", 
        transition: "transform 0.3s, box-shadow 0.3s", 
        cursor: "default" 
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.transform = "translateY(-4px)"; 
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,215,0,0.1)"; 
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.transform = ""; 
        e.currentTarget.style.boxShadow = ""; 
      }}>
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <a href={p.image_url} target="_blank" rel="noreferrer"
          style={{ 
            position: "absolute", 
            top: "12px", 
            right: "12px", 
            background: "rgba(0,0,0,0.65)", 
            backdropFilter: "blur(4px)", 
            borderRadius: "50%", 
            width: "34px", 
            height: "34px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            color: "#fff" 
          }}>
          <ExternalLink size={14} />
        </a>
      </div>
      <div style={{ padding: "16px", background: "var(--card)" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700 }}>{p.title}</h3>
        <p style={{ fontSize: "11px", color: "var(--gold)", textTransform: "uppercase", marginTop: "4px", letterSpacing: "0.5px" }}>{p.month}</p>
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
