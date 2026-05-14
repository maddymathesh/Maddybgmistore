import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MessageCircle, Send, Loader2, Star, Zap } from "lucide-react";
import { supabase } from "../../utils/supabase";

export default function UCPurchase() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacks = async () => {
      const { data, error } = await supabase
        .from('uc_prices')
        .select('*')
        .order('offer_price', { ascending: true });
      
      if (!error) setPacks(data);
      setLoading(false);
    };
    fetchPacks();
  }, []);

  const contactText = (uc) => `Hi Maddy! I want to buy the ${uc} pack. Please guide me on the payment.`;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", minHeight: "100vh", background: "var(--bg)" }}>
        
        <section style={{ position: "relative", padding: "80px 5%", textAlign: "center", background: "linear-gradient(to bottom, rgba(255,215,0,0.05) 0%, transparent 100%)" }}>
          <div className="badge" style={{ marginBottom: "20px" }}><Zap size={14} /> Instant Delivery</div>
          <h1 className="stitle" style={{ fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 900, marginBottom: "20px" }}>
            Premium <span style={{ color: "var(--gold)" }}>UC Purchase</span>
          </h1>
          <p style={{ color: "var(--muted)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6, fontSize: "17px" }}>
            The most reliable and fastest UC service for BGMI. Select your pack below and contact us to complete your purchase instantly.
          </p>
        </section>

        <section className="section">
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", maxWidth: "1200px", margin: "0 auto" }}>
              {packs.map((p) => (
                <div key={p.id} className="card uc-card" style={{ padding: "32px", border: "1px solid rgba(255,215,0,0.15)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                    <Star size={20} color="var(--gold)" fill="var(--gold)" />
                  </div>
                  
                  <div style={{ fontSize: "32px", fontWeight: 900, fontFamily: "var(--font-h)", marginBottom: "8px" }}>
                    {p.uc_amount}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "32px" }}>
                    <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--gold)" }}>₹{Number(p.offer_price).toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: "15px", color: "var(--muted)", textDecoration: "line-through" }}>₹{Number(p.market_price).toLocaleString("en-IN")}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <a href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(p.uc_amount))}`} 
                       target="_blank" rel="noreferrer" className="btn btn-gold"
                       style={{ background: "#25D366", borderColor: "#25D366", fontSize: "13px", padding: "12px" }}>
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                    <a href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(p.uc_amount))}`} 
                       target="_blank" rel="noreferrer" className="btn btn-gold"
                       style={{ background: "#0088cc", borderColor: "#0088cc", fontSize: "13px", padding: "12px" }}>
                      <Send size={16} /> Telegram
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section-alt" style={{ textAlign: "center" }}>
           <div className="card" style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
              <h3 style={{ marginBottom: "16px" }}>Why choose MBS UC Service?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>100% Safe</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>No risk of ban, official methods.</div>
                 </div>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>Fast Delivery</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>UC added within 5-15 minutes.</div>
                 </div>
                 <div>
                    <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "20px" }}>Cheapest Price</div>
                    <div style={{ fontSize: "14px", color: "var(--muted)" }}>Lower than official in-game store.</div>
                 </div>
              </div>
           </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
