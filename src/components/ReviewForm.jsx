import { useState, useEffect } from "react";
import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import toast from "react-hot-toast";
import { Star, Loader2, LogIn, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ReviewForm({ onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (user && user.displayName && !name) {
      setName(user.displayName);
    }
  }, [user]);

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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size should be less than 5MB");
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to submit a review.");
    if (rating === 0) return toast.error("Please select a rating.");
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!comment.trim()) return toast.error("Please enter a review.");
    if (!image) return toast.error("Please upload a BGMI Account Lobby Screenshot.");
    if (cooldown > 0) return toast.error(`Please wait ${cooldown}s before submitting again.`);

    setSubmitting(true);
    try {
      let imageUrl = null;

      if (image) {
        const storageRef = ref(storage, `reviews/${user.uid}_${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      const statsRef = doc(db, "globals", "reviewStats");
      const newReviewRef = doc(collection(db, "reviews"));

      const newReviewData = {
        name: name.trim(),
        rating: rating,
        comment: comment.trim(),
        imageUrl: imageUrl,
        uid: user.uid,
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
      removeImage();
      
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
      setUploadProgress(0);
    }
  };

  if (!user) {
    return (
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border-gold)",
        borderRadius: "14px",
        padding: "40px 24px",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, marginBottom: "16px" }}>
          Write a Review
        </h3>
        <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "14px" }}>
          You must be logged in to share your experience and rate the store.
        </p>
        <Link to="/login" className="btn btn-gold" style={{ display: "inline-flex", justifyContent: "center", width: "100%" }}>
          <LogIn size={18} /> Login to Post Review
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border-gold)",
      borderRadius: "14px",
      padding: "28px 24px",
      maxWidth: "600px",
      margin: "0 auto",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
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
            placeholder="Type your experience here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            required
            disabled={submitting || cooldown > 0}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "var(--text)" }}>
            BGMI Account Lobby Screenshot Upload <span style={{ color: "var(--red)", fontSize: "12px" }}>*</span>
          </label>
          
          {!imagePreview ? (
            <label style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              border: "2px dashed var(--border-gold)",
              borderRadius: "12px",
              cursor: "pointer",
              background: "rgba(255,215,0,0.05)",
              transition: "all 0.2s"
            }}>
              <ImageIcon size={32} color="var(--gold)" style={{ marginBottom: "8px" }} />
              <span style={{ fontSize: "14px", color: "var(--text)" }}>Click to upload screenshot</span>
              <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>PNG, JPG, WEBP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={submitting || cooldown > 0}
              />
            </label>
          ) : (
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-gold)" }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: "100%", height: "auto", maxHeight: "200px", objectFit: "contain", display: "block", background: "#000" }} 
              />
              {!submitting && (
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fff"
                  }}
                >
                  <X size={18} />
                </button>
              )}
              {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "rgba(255,255,255,0.2)" }}>
                  <div style={{ height: "100%", width: `${uploadProgress}%`, background: "var(--gold)", transition: "width 0.2s" }}></div>
                </div>
              )}
            </div>
          )}
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
