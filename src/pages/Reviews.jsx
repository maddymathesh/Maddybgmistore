import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs, startAfter, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import Ticker from "../components/Ticker";
import Footer from "../components/Footer";
import ReviewForm from "../components/ReviewForm";
import { Star, Loader2, ChevronDown } from "lucide-react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Load overall stats
  const fetchStats = async () => {
    try {
      const statsDoc = await getDoc(doc(db, "globals", "reviewStats"));
      if (statsDoc.exists()) {
        setStats(statsDoc.data());
      }
    } catch (err) {
      console.error("Failed to load review stats:", err);
    }
  };

  // Load paginated reviews
  const fetchReviews = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      let q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(6));
      
      if (isLoadMore && lastVisible) {
        q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(6));
      }

      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const newReviews = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setReviews(prev => isLoadMore ? [...prev, ...newReviews] : newReviews);
        setLastVisible(snap.docs[snap.docs.length - 1]);
        setHasMore(snap.docs.length === 6);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchReviews();
  }, []);

  // Handle optimistic UI update when a user submits a review
  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    // Optimistically update stats
    setStats(prev => ({
      totalReviews: prev.totalReviews + 1,
      averageRating: ((prev.averageRating * prev.totalReviews) + newReview.rating) / (prev.totalReviews + 1)
    }));
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "Just now";
    // Check if it's a Firestore timestamp or a JS Date/ms
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.toMillis ? timestamp.toMillis() : timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

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
            <div className="badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "16px", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
              <Star size={13} fill="var(--gold)" color="var(--gold)" /> Trusted Community
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

        {/* ── STATS & REVIEW FORM ─────────────────────────── */}
        <section className="section" style={{ paddingBottom: "40px" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", 
            gap: "40px", 
            maxWidth: "1200px", 
            margin: "0 auto",
            alignItems: "center" 
          }}>
            {/* Stats View */}
            <div style={{ textAlign: "center", padding: "30px", background: "var(--card)", borderRadius: "20px", border: "1px solid var(--border-gold)" }}>
              <div style={{ fontSize: "64px", fontFamily: "var(--font-h)", fontWeight: 800, color: "var(--gold)", lineHeight: 1 }}>
                {stats.averageRating ? stats.averageRating.toFixed(1) : "5.0"}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "12px 0 16px" }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={24} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "15px", fontWeight: 600 }}>
                Based on {stats.totalReviews || 0} reviews
              </div>
            </div>

            {/* Review Form Component */}
            <ReviewForm onReviewAdded={handleReviewAdded} />
          </div>
        </section>

        {/* ── REVIEWS GRID ─────────────────────────────────── */}
        <section className="section-alt" style={{ paddingTop: "60px" }}>
          <h2 className="stitle" style={{ textAlign: "center", marginBottom: "40px" }}>Latest Reviews</h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)" }}>
              <Loader2 className="animate-spin mx-auto" size={40} style={{ color: "var(--gold)", marginBottom: "16px" }} />
              <p>Loading authentic reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)" }}>
              <Star size={40} style={{ color: "var(--gold)", marginBottom: "16px" }} />
              <p>No reviews yet. Be the first to leave one!</p>
            </div>
          ) : (
            <>
              <div className="reviews-grid">
                {reviews.map((r) => (
                  <div key={r.id} className="review-card">
                    <div className="review-top">
                      <div className="review-avatar">
                        {(r.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="review-name">{r.name || "Anonymous"}</div>
                        <div className="review-date">{formatRelativeTime(r.createdAt || r.clientDate)}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "2px", margin: "10px 0 8px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < (r.rating || 5) ? "var(--gold)" : "transparent"}
                          color={i < (r.rating || 5) ? "var(--gold)" : "rgba(255,215,0,0.25)"}
                        />
                      ))}
                    </div>

                    <p className="review-text">{r.comment || r.text}</p>
                    <span className="review-verified">✅ Verified Buyer</span>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <button 
                    onClick={() => fetchReviews(true)} 
                    className="btn btn-outline"
                    disabled={loadingMore}
                    style={{ minWidth: "160px", justifyContent: "center" }}
                  >
                    {loadingMore ? <Loader2 className="animate-spin" size={16} /> : <><ChevronDown size={16} /> Load More</>}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </div>
      <Footer />
    </>
  );
}
