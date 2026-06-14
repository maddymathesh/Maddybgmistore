"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Star, Loader2, ShieldCheck, PenTool } from "lucide-react";
import { getReviews, submitReview } from "../actions";
import { toast } from "sonner";

export interface SerializedReview {
  id: string;
  name: string;
  comment: string | null;
  rating: number;
  status: string;
  createdAt: string;
}

interface ReviewsClientProps {
  initialReviews: SerializedReview[];
  initialStats: { averageRating: number; totalReviews: number };
  initialHasMore: boolean;
}

export default function ReviewsClient({ initialReviews, initialStats, initialHasMore }: ReviewsClientProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const [reviews, setReviews] = useState<SerializedReview[]>(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);

  // Form States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  useEffect(() => {
    if (user && !name) {
      setName(user.fullName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "");
    }
  }, [user, name]);

  useEffect(() => {
    const lastSubmit = localStorage.getItem("lastReviewSubmit");
    if (lastSubmit) {
      const elapsed = (Date.now() - parseInt(lastSubmit)) / 1000;
      if (elapsed < 120) setCooldown(Math.floor(120 - elapsed));
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const res = await getReviews(nextPage);
      if (res.success && res.reviews) {
        const fetchedReviews = res.reviews.map(r => ({
          ...r,
          createdAt: new Date(r.createdAt).toISOString()
        })) as SerializedReview[];

        setReviews(prev => [...prev, ...fetchedReviews]);
        setHasMore(res.reviews.length === 6);
        setPage(nextPage);
        setStats({
          averageRating: res.averageRating,
          totalReviews: res.totalReviews
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      return toast.error("Please login to submit a review");
    }
    if (rating === 0) {
      return toast.error("Please select a star rating");
    }
    if (!comment.trim() || comment.trim().length < 15) {
      return toast.error("Review comments must be at least 15 characters long");
    }
    if (cooldown > 0) return;

    setSubmitting(true);
    try {
      const res = await submitReview(name, rating, comment);
      if (res.success && res.review) {
        toast.success("✅ Submitted! Your review is awaiting admin approval.");

        localStorage.setItem("lastReviewSubmit", Date.now().toString());
        setCooldown(120);
        setRating(0);
        setComment("");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* STATS & REVIEW FORM SECTION */}
      <section className="py-16 px-[5%] max-w-[1200px] mx-auto">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
          
          {/* Stats Card */}
          <div style={{ 
            textAlign: "center", padding: "40px 30px", background: "#131722", 
            borderRadius: "20px", border: "1px solid var(--color-border-gold)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <span className="badge mb-4 mx-auto"><ShieldCheck size={13} /> Verified Score</span>
            <div style={{ fontSize: "72px", fontFamily: "var(--font-h)", fontWeight: 900, color: "var(--color-gold)", lineHeight: 1 }}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", margin: "18px 0" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star 
                  key={i} 
                  size={22} 
                  fill={i <= Math.round(stats.averageRating) ? "var(--color-gold)" : "transparent"} 
                  color="var(--color-gold)" 
                />
              ))}
            </div>
            <div style={{ color: "var(--color-muted)", fontSize: "14px", fontWeight: 500 }}>
              Based on {stats.totalReviews} verified submissions
            </div>
          </div>

          {/* Review Form */}
          <div style={{ background: "#131722", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", padding: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
            <h3 style={{ fontFamily: "var(--font-h)", fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
              <PenTool size={18} style={{ color: "var(--color-gold)" }} /> Share Your Experience
            </h3>
            
            {!isLoaded ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Loader2 className="animate-spin text-gold" size={24} />
              </div>
            ) : !isSignedIn ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--color-muted)", marginBottom: "20px", fontSize: "13.5px" }}>
                  Leave a review to help other buyers. Sign in with your Clerk account to access the submission portal.
                </p>
                <Link href="/sign-in" className="btn btn-gold w-full justify-center">
                  Login / Sign Up
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
                
                {/* Star Rating Select */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Your Rating
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star 
                        key={s} 
                        size={28}
                        fill={(hoverRating || rating) >= s ? "var(--color-gold)" : "transparent"}
                        color="var(--color-gold)"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ cursor: "pointer", transition: "transform 0.1s" }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Your Name
                  </label>
                  <input 
                    className="input-field" 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Review Comment
                  </label>
                  <textarea 
                    className="input-field" 
                    placeholder="Share your experience (minimum 15 characters)..." 
                    value={comment} 
                    onChange={e => setComment(e.target.value)} 
                    rows={4} 
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "none"
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || cooldown > 0} 
                  className="btn btn-gold w-full justify-center" 
                  style={{ padding: "14px" }}
                >
                  {submitting ? (
                    <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                  ) : cooldown > 0 ? (
                    `Wait ${cooldown}s before re-submitting`
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* APPROVED REVIEWS LIST */}
      <section style={{ background: "rgba(10, 13, 20, 0.4)", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }} className="py-20 px-[5%]">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-h)", fontSize: "26px", fontWeight: 800, color: "#fff", marginBottom: "32px" }} className="uppercase">
            Verified Feedback Feed
          </h2>

          {reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#131722", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px" }}>
              <p style={{ color: "var(--color-muted)", margin: 0, fontSize: "14px" }}>
                No approved reviews available yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 350px), 1fr))", gap: "24px" }}>
                {reviews.map(r => (
                  <div 
                    key={r.id} 
                    style={{ 
                      padding: "26px", background: "rgba(17, 21, 32, 0.45)", 
                      border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "16px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column"
                    }}
                    className="review-feed-card"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ 
                        width: "36px", height: "36px", borderRadius: "50%", 
                        background: "var(--color-gold)", color: "#000", 
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        fontWeight: 800, fontFamily: "var(--font-h)" 
                      }}>
                        {(r.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: "14.5px" }}>{r.name}</div>
                        <div style={{ fontSize: "11.5px", color: "var(--color-muted)" }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < r.rating ? "var(--color-gold)" : "transparent"} 
                          color="var(--color-gold)" 
                        />
                      ))}
                    </div>

                    <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.85)", margin: 0 }}>
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <button 
                    onClick={loadMore} 
                    className="btn btn-outline" 
                    disabled={loadingMore}
                  >
                    {loadingMore ? <Loader2 className="animate-spin" size={14} /> : "Load More Reviews"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        .review-feed-card {
          transition: all 0.25s ease;
        }
        .review-feed-card:hover {
          border-color: rgba(255, 215, 0, 0.25) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </>
  );
}
