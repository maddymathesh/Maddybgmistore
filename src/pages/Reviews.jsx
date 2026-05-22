import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReviewForm from "../components/ReviewForm";
import useSEO from "../hooks/useSEO";
import { Star, Loader2, ChevronDown } from "lucide-react";

export default function Reviews() {
  useSEO(
    "Verified Customer Reviews — 2000+ Happy Buyers",
    "Explore thousands of real transaction proofs and reviews from South Indian players. Real feedback, 100% verified safety."
  );
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    const from = page * 6;
    const to = from + 5;

    try {
      const { data, count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error) {
        setReviews(prev => isLoadMore ? [...prev, ...data] : data);
        setHasMore(data.length === 6);
        if (count !== null) {
          // Calculate stats from data for now
          // In a real app, use an RPC or a stats table
          const { data: allReviews } = await supabase.from('reviews').select('stars').eq('status', 'approved');
          const total = allReviews?.length || 0;
          const avg = total > 0 ? allReviews.reduce((acc, r) => acc + (r.stars || 5), 0) / total : 5.0;
          setStats({ averageRating: avg, totalReviews: total });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleReviewAdded = (newReview) => {
    // If review is pending, we don't show it yet
    if (newReview.status === 'approved') {
      setReviews(prev => [newReview, ...prev]);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "102px" }}>

        <section style={{ position: "relative", width: "100%", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/reviews-banner.webp" alt="Maddy BGMI Store Customer Reviews Banner" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5)" }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(30px,5.5vw,66px)", fontWeight: 900 }}>What Our<br /><span style={{ color: "var(--gold)" }}>Buyers Say</span></h1>
          </div>
        </section>

        <section className="section">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", padding: "30px", background: "var(--card)", borderRadius: "20px", border: "1px solid var(--border-gold)" }}>
              <div style={{ fontSize: "64px", fontFamily: "var(--font-h)", fontWeight: 800, color: "var(--gold)" }}>{stats.averageRating.toFixed(1)}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "12px 0" }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="var(--gold)" color="var(--gold)" />)}
              </div>
              <div style={{ color: "var(--muted)" }}>Based on {stats.totalReviews} reviews</div>
            </div>
            <ReviewForm onReviewAdded={handleReviewAdded} />
          </div>
        </section>

        <section className="section-alt">
          <div className="reviews-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {reviews.map(r => (
              <div key={r.id} className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--gold)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {(r.name || "?")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.name}</div>
                    {r.tracking_id && <div style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 600 }}>Transaction ID: {r.tracking_id}</div>}
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < (r.stars || 5) ? "var(--gold)" : "transparent"} color="var(--gold)" />)}
                </div>
                <p style={{ fontSize: "14px", lineHeight: 1.6 }}>{r.text}</p>
                {r.image_url && <img src={r.image_url} alt="Proof" loading="lazy" decoding="async" style={{ width: "100%", borderRadius: "8px", marginTop: "12px" }} />}
              </div>
            ))}
          </div>
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button onClick={() => setPage(p => p + 1)} className="btn btn-outline" disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
