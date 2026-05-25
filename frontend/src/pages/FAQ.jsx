import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useSEO from "../hooks/useSEO";
import { 
  Search, HelpCircle, ChevronDown, ShoppingBag, 
  RefreshCw, ShieldCheck, Gamepad2, Landmark, 
  ChevronRight, Sparkles 
} from "lucide-react";

export default function FAQ() {
  useSEO(
    "Frequently Asked Questions & Help Center",
    "Preempting common queries about account handovers, payments, safety, trade conditions, and customized sourcing."
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = [
    { id: "all", label: "All Questions", icon: <HelpCircle size={14} /> },
    { id: "buying", label: "Buying", icon: <ShoppingBag size={14} /> },
    { id: "selling", label: "Selling & Trade", icon: <RefreshCw size={14} /> },
    { id: "uc", label: "UC & Gifting", icon: <Gamepad2 size={14} /> },
    { id: "trust", label: "Trust & Security", icon: <ShieldCheck size={14} /> }
  ];

  const faqs = [
    {
      category: "buying",
      question: "How long does account delivery typically take?",
      answer: "Upon successful payment verification, account credentials are typically delivered within 30 minutes to 3 hours. This timeframe allows our administrative verification team to execute standard social linkage checks and ensure clean transition coordinates."
    },
    {
      category: "buying",
      question: "Can I choose between Online or Face-to-Face delivery?",
      answer: "Yes, absolutely! Before finalizing any booking, you choose your preferred deal mode. We support fast online handovers via secure chat, or face-to-face deals at designated South Indian coordinates (highly recommended for high-tier accounts above ₹80,000)."
    },
    {
      category: "buying",
      question: "How does the Customized Requirement Sourcing process work?",
      answer: "If you have highly specific needs (skins, frames, supercars) that aren't currently listed in our ready stock, you share your realistic budget and demand. After a consultation, you pay a 15% security deposit. We search the market for 24–48 hours to find the closest matching account. If we find no match, your deposit is fully refunded immediately. If a match is found and finalized, it becomes a non-refundable booking lock."
    },
    {
      category: "selling",
      question: "What is the difference between Instant Sell and Hold & Sell?",
      answer: "Instant Sell is designed for owners seeking immediate cash settlements. We evaluate the market value, secure one login, perform brief KYC steps, and release your payout instantly. Hold & Sell (Waited Sell) is for sellers who want to maximize their payout. We secure one login, record an HD showcase video, broadcast your listing to our WhatsApp/Telegram channels (typically selling in 3–7 days), and release the final payout once the buyer confirms delivery."
    },
    {
      category: "selling",
      question: "How does the Account Exchange trade-in process work?",
      answer: "The process is simple: you share your current account details for valuation and declare your target account budget. If your trade-in account is evaluated lower, you pay the remaining differential balance. If your trade-in is evaluated higher, we secure the trade and cash out the surplus difference to you. Note: we always secure and verify your trade-in account logins in custody before finalizing the new target handover."
    },
    {
      category: "selling",
      question: "What payment methods do you accept for payouts and purchases?",
      answer: "We support a wide variety of secure payment methods, including UPI (Google Pay, PhonePe, Paytm), Direct Bank Transfer (IMPS/NEFT), USDT, Bitcoin (BTC), and Face-to-Face physical cash deals for elite accounts."
    },
    {
      category: "uc",
      question: "What is the difference between View Login UC and Character ID UC?",
      answer: "View Login UC is a premium sourcing method that requires temporary linked social login coordinates (Facebook/Twitter). Our admins log in, purchase the UC officially in-game, and log out. Character ID UC requires absolutely no login credentials; you only share your numeric Character ID, and we transmit the UC directly to your in-game mailbox (safe and fast)."
    },
    {
      category: "uc",
      question: "Why do X-Suit and Supercar giftings require a 72-hour wait?",
      answer: "This is a strict BGMI in-game design restriction, not ours. BGMI mechanics mandate that players must be in-game friends for at least 72 hours and possess a Synergy Level of 50+ before cosmetic gifting tokens can be successfully transferred. There is no workaround to bypass this official cooldown window."
    },
    {
      category: "trust",
      question: "How safe are my login credentials during UC or account trades?",
      answer: "Your credentials are 100% secure. We maintain a strict Zero-Retention Policy. All social logins submitted for transactions are processed inside isolated administrative tunnels and deleted permanently the very second the handover or injection is completed. We never backup or store customer passwords."
    },
    {
      category: "trust",
      question: "Do you require government ID proof (KYC) for transactions?",
      answer: "Yes, to protect both buyers and sellers from cyber-frauds and reclaim scams, we collect valid government ID proof (Aadhaar or PAN Card) from sellers and exchange trade-ins before releasing payouts. All KYC details are kept on encrypted, secure servers and are never shared publicly."
    },
    {
      category: "trust",
      question: "Are you officially affiliated with Krafton?",
      answer: "No. Maddy BGMI Store is an independent, third-party player-to-player secondary marketplace. All copyrights, game elements, assets, and titles belong entirely to their respective intellectual property owners (KRAFTON, Inc.)."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px", background: "var(--bg)", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section style={{
          position: "relative", width: "100%", minHeight: "68vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", textAlign: "center",
        }}>
          <img src="/faq-banner.jpg" alt="FAQ Help Center" loading="lazy" decoding="async"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.45)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 35%, transparent 55%, rgba(8,10,15,0.97) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 65%)" }} />
          <div style={{ position: "relative", zIndex: 2, padding: "0 5%", maxWidth: "760px" }}>
            <div className="badge" style={{ marginBottom: "16px", letterSpacing: "2px" }}>HELP CENTER</div>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, color: "#fff", lineHeight: 1.2, textShadow: "0 2px 25px rgba(0,0,0,0.7)" }}>
              Frequently Asked <span style={{ color: "var(--gold)" }}>Questions</span>
            </h1>
            <p style={{ color: "rgba(234,234,234,0.85)", maxWidth: "600px", margin: "12px auto 0", fontSize: "14px", lineHeight: 1.6, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              Preempting common queries about account handovers, customized requirements, payments, and trade conditions.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="section" style={{ padding: "40px 5% 100px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            
            {/* Live Search Bar */}
            <div 
              style={{
                position: "relative",
                marginBottom: "35px"
              }}
            >
              <Search 
                size={18} 
                style={{ 
                  position: "absolute", 
                  left: "20px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: "var(--gold)" 
                }} 
              />
              <input 
                type="text" 
                placeholder="Search common questions, processes, or rules..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 24px 16px 52px",
                  borderRadius: "30px",
                  border: "1px solid var(--border-gold)",
                  background: "rgba(17, 21, 32, 0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease"
                }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--gold)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border-gold)"}
              />
            </div>

            {/* Category Filter Tabs */}
            <div 
              style={{ 
                display: "flex", 
                gap: "10px", 
                overflowX: "auto", 
                paddingBottom: "16px",
                marginBottom: "30px",
                scrollBehavior: "smooth"
              }}
              className="faq-scrollbar-hide"
            >
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setExpandedIndex(null); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "30px",
                    border: activeCategory === cat.id ? "1px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.05)",
                    background: activeCategory === cat.id ? "rgba(255, 215, 0, 0.08)" : "rgba(17, 21, 32, 0.45)",
                    color: activeCategory === cat.id ? "var(--gold)" : "var(--muted)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={e => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.3)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeCategory !== cat.id) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "var(--muted)";
                    }
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* FAQ Accordion List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        background: "rgba(17, 21, 32, 0.45)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: isExpanded ? "1px solid rgba(255, 215, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: "18px",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        boxShadow: isExpanded ? "0 10px 30px rgba(255, 215, 0, 0.02)" : "none"
                      }}
                    >
                      {/* Question Trigger */}
                      <button
                        onClick={() => toggleExpand(index)}
                        style={{
                          width: "100%",
                          padding: "20px 24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          color: isExpanded ? "var(--gold)" : "#fff",
                          transition: "color 0.2s ease"
                        }}
                      >
                        <span 
                          style={{ 
                            fontSize: "15px", 
                            fontWeight: 700, 
                            lineHeight: 1.4,
                            fontFamily: "var(--font-h)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                          }}
                        >
                          <Sparkles size={14} style={{ color: "var(--gold)", opacity: isExpanded ? 1 : 0.4, transition: "opacity 0.2s" }} />
                          {faq.question}
                        </span>
                        <ChevronDown 
                          size={18} 
                          style={{ 
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", 
                            transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            color: isExpanded ? "var(--gold)" : "var(--muted)",
                            flexShrink: 0,
                            marginLeft: "15px"
                          }} 
                        />
                      </button>

                      {/* Expandable Content Area */}
                      <div
                        style={{
                          maxHeight: isExpanded ? "300px" : "0",
                          opacity: isExpanded ? 1 : 0,
                          overflow: "hidden",
                          transition: "max-height 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease",
                          background: "rgba(0, 0, 0, 0.15)",
                          borderTop: isExpanded ? "1px solid rgba(255, 255, 255, 0.03)" : "none"
                        }}
                      >
                        <p
                          style={{
                            padding: "20px 24px 24px 48px",
                            color: "var(--muted)",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            textAlign: "justify"
                          }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div 
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(17, 21, 32, 0.25)",
                    borderRadius: "20px",
                    border: "1px dashed rgba(255, 255, 255, 0.08)"
                  }}
                >
                  <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                    No matching questions found in this category. Try adjusting your search query!
                  </p>
                </div>
              )}
            </div>

            {/* Support Coordination Coord card */}
            <div 
              style={{
                marginTop: "50px",
                background: "radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.04) 0%, transparent 60%), var(--card)",
                border: "1px solid var(--border-gold)",
                borderRadius: "24px",
                padding: "30px",
                textAlign: "center"
              }}
            >
              <h4 style={{ fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                Still Have Unanswered Queries?
              </h4>
              <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, maxWidth: "500px", margin: "0 auto 20px" }}>
                Connect directly with Maddy's administrative experts. We are active 24/7 to resolve purchase, trade, or pricing coordination queries!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-gold btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "30px", padding: "10px 24px" }}>
                  WhatsApp Chat <ChevronRight size={14} />
                </a>
                <a href="https://t.me/MBSxMADDY17" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "30px", padding: "10px 24px" }}>
                  Telegram Support <ChevronRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
      <Footer />
      <style>{`
        /* Hide scrollbars for categories list */
        .faq-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .faq-scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}
