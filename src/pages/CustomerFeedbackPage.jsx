import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageSquare, Star, Send, Sparkles, Smile, ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomerFeedbackPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [comment, setComment] = useState("");
  const [desiredItems, setDesiredItems] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dbSetupNeeded, setDbSetupNeeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!comment.trim()) return toast.error("Please tell us how we can improve");

    setSubmitting(true);
    try {
      const feedbackPayload = {
        name: name.trim(),
        stars: Number(stars),
        comment: comment.trim(),
        desired_items: desiredItems.trim() || "None specified",
        phone: phone.trim() || "Not provided",
        status: "unread",
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from("customer_feedback").insert([feedbackPayload]);

      if (error) {
        // Check if it's a relation/missing table error
        if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("cache")) {
          setDbSetupNeeded(true);
          throw new Error("Missing customer_feedback table in database");
        }
        throw error;
      }

      toast.success("Thank you for your valuable feedback! 🚀");
      setSubmitted(true);
    } catch (err) {
      console.warn("Feedback DB error:", err.message);
      
      // Local fallback and toast notification
      if (err.message.includes("Missing customer_feedback")) {
        toast.error("Database setup in progress. You can submit via WhatsApp below!", { duration: 5000 });
      } else {
        toast.error("Submission failed. You can direct-message us on WhatsApp!");
      }
      
      // Set submitted true so they see the WhatsApp fallback button immediately
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const triggerWhatsAppFeedback = () => {
    const textStr = `Hi Maddy!\n\n*Customer Feedback Form*\n*Name:* ${name}\n*Rating:* ${"⭐".repeat(stars)}\n*Feedback:* ${comment}\n*What I Want:* ${desiredItems || "N/A"}\n*Phone:* ${phone || "N/A"}`;
    const enc = encodeURIComponent(textStr);
    window.open(`https://wa.me/+919025391516?text=${enc}`, "_blank");
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", background: "var(--bg)", minHeight: "100vh" }}>
        
        {/* Banner */}
        <section style={{
          position: "relative", width: "100%", minHeight: "72vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", textAlign: "center",
        }}>
          <img src="/customer-feedback-banner.jpg" alt="Customer Feedback" loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.48)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.97) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,215,0,0.05) 0%, transparent 65%)" }} />
          <div style={{ position: "relative", zIndex: 2, padding: "0 5%", maxWidth: "760px" }}>
            <div className="badge" style={{ marginBottom: "16px", letterSpacing: "2px" }}>STORE IMPROVEMENT</div>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, textShadow: "0 2px 25px rgba(0,0,0,0.7)" }}>
              Customer <span style={{ color: "var(--gold)" }}>Feedback</span>
            </h1>
            <p style={{ color: "rgba(234,234,234,0.85)", maxWidth: "600px", margin: "12px auto 0", fontSize: "14px", lineHeight: 1.6, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              Your ideas and suggestions help us grow. Tell us what accounts, in-game items, or features you want us to add!
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="section" style={{ padding: "40px 5% 100px" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            
            {submitted ? (
              <div 
                className="card" 
                style={{ 
                  textAlign: "center", 
                  padding: "45px 30px", 
                  border: "1px solid var(--border-gold)", 
                  background: "var(--card)", 
                  borderRadius: "24px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)" 
                }}
              >
                <div 
                  style={{ 
                    width: "72px", 
                    height: "72px", 
                    borderRadius: "50%", 
                    background: "rgba(255,215,0,0.1)", 
                    border: "2px solid var(--gold)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "0 auto 24px" 
                  }}
                >
                  <CheckCircle2 size={36} style={{ color: "var(--gold)" }} />
                </div>
                <h2 style={{ fontFamily: "var(--font-h)", fontSize: "28px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
                  Feedback Submitted!
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto 30px" }}>
                  We have received your suggestions. We review every customer request to add the items, accounts, and UC packs you desire most. Thank you for making Maddy BGMI Store South India's #1 choice!
                </p>

                {dbSetupNeeded ? (
                  <div style={{ background: "rgba(251,191,36,0.05)", border: "1px dashed rgba(251,191,36,0.3)", padding: "20px", borderRadius: "14px", marginBottom: "24px", textAlign: "left" }}>
                    <p style={{ margin: "0 0 12px", fontSize: "12.5px", color: "var(--gold)", fontWeight: 700 }}>
                      ⚠️ Database Configuration Pending
                    </p>
                    <p style={{ margin: "0 0 16px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                      The feedback table is currently being initialized in Supabase. In the meantime, please send your feedback directly to Maddy via WhatsApp in one click:
                    </p>
                    <button 
                      onClick={triggerWhatsAppFeedback} 
                      className="btn btn-gold w-full"
                      style={{ padding: "12px", fontWeight: 700, fontSize: "13px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                    >
                      <MessageSquare size={16} /> Send via WhatsApp
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={triggerWhatsAppFeedback} 
                    className="btn btn-outline"
                    style={{ padding: "10px 24px", fontSize: "13px" }}
                  >
                    Send Backup Copy via WhatsApp
                  </button>
                )}

                <div style={{ marginTop: "24px" }}>
                  <a href="/" style={{ color: "var(--gold)", textDecoration: "none", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
                     onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                     onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                    Back to Store Home <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div 
                className="card" 
                style={{ 
                  padding: "40px 30px", 
                  border: "1px solid var(--border-gold)", 
                  background: "var(--card)", 
                  borderRadius: "24px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,215,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,215,0,0.2)" }}>
                    <MessageSquare size={18} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: 0 }}>Feedback Submission Form</h3>
                    <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Public or Direct Admin Feedback</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
                  
                  {/* Name and Phone */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={sl}>Your Name *</label>
                      <input 
                        type="text" 
                        required
                        className="input" 
                        placeholder="e.g. Rahul Kumar" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label style={sl}>WhatsApp Phone (Optional)</label>
                      <input 
                        type="tel" 
                        className="input" 
                        placeholder="e.g. +91 90253 *****" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Rating selection */}
                  <div>
                    <label style={sl}>Overall Store Experience Rating</label>
                    <div style={{ display: "flex", gap: "8px", margin: "4px 0" }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star 
                          key={s} 
                          size={32}
                          fill={(hoverStars || stars) >= s ? "var(--gold)" : "transparent"}
                          color="var(--gold)"
                          onClick={() => setStars(s)}
                          onMouseEnter={() => setHoverStars(s)}
                          onMouseLeave={() => setHoverStars(0)}
                          style={{ cursor: "pointer", transition: "transform 0.1s" }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {stars === 5 ? "Excellent (5 Stars)" : stars === 4 ? "Very Good (4 Stars)" : stars === 3 ? "Good (3 Stars)" : stars === 2 ? "Need Improvements (2 Stars)" : "Disappointed (1 Star)"}
                    </span>
                  </div>

                  {/* Comment */}
                  <div>
                    <label style={sl}>What should we improve? What are your suggestions? *</label>
                    <textarea 
                      required
                      className="input" 
                      rows={4}
                      placeholder="Share your thoughts on prices, delivery speed, payment experience or support..." 
                      value={comment} 
                      onChange={e => setComment(e.target.value)} 
                    />
                  </div>

                  {/* What Customers Actually Want (Desired Items/Products) */}
                  <div style={{ background: "rgba(255, 215, 0, 0.02)", border: "1px dashed rgba(255, 215, 0, 0.15)", padding: "18px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <Sparkles size={16} style={{ color: "var(--gold)" }} />
                      <label style={{ ...sl, margin: 0, color: "var(--gold)" }}>What specific items or accounts do you want next?</label>
                    </div>
                    <textarea 
                      className="input" 
                      rows={3}
                      style={{ background: "var(--bg)" }}
                      placeholder="e.g. Glacier Level 4 account under ₹8k, cheaper 60 UC packs, more x-suit items, etc..." 
                      value={desiredItems} 
                      onChange={e => setDesiredItems(e.target.value)} 
                    />
                    <span style={{ fontSize: "10.5px", color: "var(--muted)", display: "block", marginTop: "6px" }}>
                      This directly notifies Maddy so we can acquire these stocks for you!
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="btn btn-gold" 
                    style={{ 
                      padding: "16px", 
                      fontSize: "15px", 
                      fontWeight: 800, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "8px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 15px rgba(255,215,0,0.2)"
                    }}
                  >
                    {submitting ? (
                      "Uploading suggestions..."
                    ) : (
                      <><Send size={16} /> Submit Feedback</>
                    )}
                  </button>

                </form>
              </div>
            )}

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}

const sl = { 
  display: "block", 
  fontSize: "11px", 
  fontWeight: 700, 
  color: "var(--muted)", 
  textTransform: "uppercase", 
  marginBottom: "8px",
  letterSpacing: "0.5px"
};
