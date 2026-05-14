import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Info, CheckCircle, ShieldCheck } from "lucide-react";
import { supabase } from "../../utils/supabase";

export default function XsuitGift() {
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuits = async () => {
      const { data, error } = await supabase
        .from('xsuit_gifts')
        .select('*')
        .order('price', { ascending: true });
      
      if (!error) setSuits(data);
      setLoading(false);
    };
    fetchSuits();
  }, []);

  const contactText = (name) => `Hi Maddy! I am interested in gifting the ${name}. Please guide me on the process.`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        <section style={{ padding: "80px 5%", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}><ShieldCheck size={14} /> Official Gifting</div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 900, marginBottom: "20px" }}>
            X-Suit <span style={{ color: "var(--gold)" }}>Gifting Service</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6, fontSize: "17px" }}>
            Get your favorite X-Suit gifted directly to your account. Safe, secure, and handled through official in-game gifting.
          </p>
        </section>

        {/* Procedure Section */}
        <section className="section" style={{ paddingTop: 0 }}>
           <div className="card" style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px", border: "1px solid rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", color: "var(--gold)" }}>
                 <Info size={24} />
                 <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Gifting Procedure & Conditions</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
                 <div>
                    <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--gold)" }}>Step-by-Step Process</h3>
                    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "12px" }}>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Purchase your desired X-Suit.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Send us your In-Game ID.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Accept our friend request.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Wait 72 hours for the gift window.</li>
                    </ul>
                 </div>
                 <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--gold)" }}>Requirements</h3>
                    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "10px", fontSize: "13px" }}>
                       <li>• Must be friends for <b>72 Hours</b></li>
                       <li>• Synergy must be <b>50 or above</b></li>
                       <li>• Account level must be <b>10 or above</b></li>
                       <li style={{ marginTop: "10px", color: "var(--muted)", fontStyle: "italic" }}>* These are official BGMI gifting rules.</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
              {suits.map((s) => (
                <div key={s.id} className="card gift-card" style={{ padding: "0", overflow: "hidden", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <div style={{ aspectRatio: "1/1.2", background: "var(--bg2)", overflow: "hidden" }}>
                    <img src={s.image_url} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} className="hover-zoom" />
                  </div>
                  <div style={{ padding: "24px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>{s.name}</h3>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--gold)", marginBottom: "24px" }}>₹{Number(s.price).toLocaleString("en-IN")}</div>
                    
                    <div style={{ display: "grid", gap: "10px" }}>
                      <a href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(s.name))}`} 
                         target="_blank" rel="noreferrer" className="btn btn-gold w-full"
                         style={{ background: "#25D366", borderColor: "#25D366" }}>
                        <MessageCircle size={18} /> Buy on WhatsApp
                      </a>
                      <a href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(s.name))}`} 
                         target="_blank" rel="noreferrer" className="btn btn-gold w-full"
                         style={{ background: "#0088cc", borderColor: "#0088cc" }}>
                        <Send size={18} /> Buy on Telegram
                      </a>
                    </div>
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
