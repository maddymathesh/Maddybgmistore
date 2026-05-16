import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Info, CheckCircle, Car } from "lucide-react";
import { supabase } from "../../utils/supabase";
import { ShieldCheck } from "lucide-react";

export default function SupercarGift() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await supabase
          .from('supercar_gifts')
          .select('*')
          .order('created_at', { ascending: false });
        setCars(data || []);
      } catch (error) {
        console.error("Error fetching supercars:", error);
      }
      setLoading(false);
    };
    fetchCars();
  }, []);

  const contactText = (name) => `Hi Maddy! I am interested in gifting the ${name}. Please guide me on the process.`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        <section style={{ padding: "80px 5%", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}><Car size={14} /> Luxury Gifting</div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 900, marginBottom: "20px" }}>
            Supercar <span style={{ color: "var(--gold)" }}>Gifting Service</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6, fontSize: "17px" }}>
            Drive the most exclusive supercars in BGMI. Official gifting service with guaranteed delivery to your account.
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
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Choose your Supercar & Card type.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Send In-Game ID after payment.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> Accept our friend request.</li>
                       <li style={{ display: "flex", gap: "10px", fontSize: "14px" }}><CheckCircle size={16} color="var(--green)" /> 72 Hours wait for official gifting.</li>
                    </ul>
                 </div>
                 <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px" }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--gold)" }}>Requirements</h3>
                    <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "10px", fontSize: "13px" }}>
                       <li>• Friends for at least <b>72 Hours</b></li>
                       <li>• Synergy level must be <b>50+</b></li>
                       <li>• Account level must be <b>10+</b></li>
                       <li style={{ marginTop: "10px", color: "var(--muted)", fontStyle: "italic" }}>* Standard BGMI gifting requirements.</li>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
              {cars.map((c) => (
                <div key={c.id} className="card gift-card" style={{ padding: "0", overflow: "hidden", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <div style={{ aspectRatio: "16/9", background: "var(--bg2)", overflow: "hidden", position: "relative" }}>
                    <img src={c.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} className="hover-zoom" />
                    <div style={{ position: "absolute", top: "12px", left: "12px", background: "var(--gold)", color: "#000", fontSize: "10px", fontWeight: 900, padding: "4px 10px", borderRadius: "4px" }}>
                      {c.type}
                    </div>
                  </div>
                  <div style={{ padding: "24px", textAlign: "center" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>{c.name}</h3>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: "var(--gold)", marginBottom: "24px" }}>₹{Number(c.price).toLocaleString("en-IN")}</div>
                    
                    <div style={{ display: "grid", gap: "10px" }}>
                      <a href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(c.name))}`} 
                         target="_blank" rel="noreferrer" className="btn btn-gold w-full"
                         style={{ background: "#25D366", borderColor: "#25D366" }}>
                        <MessageCircle size={18} /> Buy on WhatsApp
                      </a>
                      <a href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(c.name))}`} 
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
