import { useState, useEffect } from "react";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { Star, Loader2 } from "lucide-react";

export default function ReviewForm({ onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const lastSubmit = localStorage.getItem("lastReviewSubmit");
    if (lastSubmit) {
      const timePassed = (Date.now() - parseInt(lastSubmit)) / 1000;
      if (timePassed < 60) {
        setCooldown(Math.floor(60 - timePassed));
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating.");
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!comment.trim()) return toast.error("Please enter a review.");
    if (cooldown > 0) return toast.error(`Please wait ${cooldown}s before submitting again.`);

    setSubmitting(true);
    try {
      const statsRef = doc(db, "globals", "reviewStats");
      const newReviewRef = doc(collection(db, "reviews"));

      const newReviewData = {
        name: name.trim(),
        rating: rating,
        comment: comment.trim(),
        // We use Date.now() locally for optimistic UI updates
        clientDate: Date.now()
      };

      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);
        let total = 0;
        let avg = 0;

        if (statsDoc.exists()) {
          total = statsDoc.data().totalReviews || 0;
          avg = statsDoc.data().averageRating || 0;
        }

        const newTotal = total + 1;
        const newAvg = ((avg * total) + rating) / newTotal;

        transaction.set(statsRef, {
          totalReviews: newTotal,
          averageRating: newAvg
        }, { merge: true });

        // Include serverTimestamp for accurate sorting in DB
        transaction.set(newReviewRef, { ...newReviewData, createdAt: serverTimestamp() });
      });

      toast.success("Review submitted successfully!");
      localStorage.setItem("lastReviewSubmit", Date.now().toString());
      setCooldown(60);
      setRating(0);
      setName("");
      setComment("");
      
      if (onReviewAdded) {
        onReviewAdded({
          id: newReviewRef.id,
          ...newReviewData,
          createdAt: { toMillis: () => Date.now() } // Mock timestamp for immediate UI rendering
        });
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border-gold)",
      borderRadius: "14px",
      padding: "28px 24px",
      maxWidth: "600px",
      margin: "0 auto",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
    }}>
      <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>
        Write a Review
      </h3>
      <form onSubmit={handleSubmit}>
        
        {/* Rating Stars */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                transition: "transform 0.1s"
              }}
            >
              <Star
                size={28}
                fill={(hoverRating || rating) >= star ? "var(--gold)" : "transparent"}
                color={(hoverRating || rating) >= star ? "var(--gold)" : "rgba(255,215,0,0.3)"}
                style={{
                  transform: (hoverRating || rating) >= star ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s"
                }}
              />
            </button>
          ))}
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: "16px" }}>
          <input
            type="text"
            className="input"
            placeholder="Your Name (e.g. Rahul)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            required
            disabled={submitting || cooldown > 0}
          />
        </div>

        {/* Comment Input */}
        <div style={{ marginBottom: "20px" }}>
          <textarea
            className="input"
            placeholder="Tell others about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            required
            disabled={submitting || cooldown > 0}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-gold"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={submitting || cooldown > 0}
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : cooldown > 0 ? (
            `Wait ${cooldown}s`
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
}
