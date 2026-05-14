import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import toast from "react-hot-toast";
import { Star, Loader2, X, Upload } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// ── AI Sentiment Check ──────────────────────────────────────────
const checkAIApproval = (text) => {
  const positive = ["good","great","awesome","best","safe","secured","trusted","fast","legit","nice","excellent","perfect","maddy","mbs","recommend","happy","satisfied","smooth","quick","reliable"];
  const negative = ["bad","scam","fake","worst","slow","terrible","poor","hate","fraud","cheat","theft","stolen","avoid","warned"];
  const lower = text.toLowerCase();
  return positive.some(w => lower.includes(w)) && !negative.some(w => lower.includes(w));
};

// ── Upload to Cloudinary (unsigned) ────────────────────────────
const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "mbs_reviews");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.secure_url;
};

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

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName);
  }, [user]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max file size is 10MB");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");
    if (rating === 0) return toast.error("Please select a star rating");
    if (!comment.trim() || comment.trim().length < 15) return toast.error("Review must be at least 15 characters");
    if (!image) return toast.error("Please upload your lobby screenshot");
    if (cooldown > 0) return;

    setSubmitting(true);
    try {
      const imageUrl = await uploadToCloudinary(image);
      const aiApproved = checkAIApproval(comment);
      const status = aiApproved ? "approved" : "pending";

      const { data, error } = await supabase.from("reviews").insert([{
        name: name.trim() || user.displayName || "Anonymous",
        stars: rating,
        text: comment.trim(),
        image_url: imageUrl,
        uid: user.uid,
        email: user.email,
        status,
      }]).select().single();

      if (error) throw error;

      if (aiApproved) {
        toast.success("🎉 Review published! Thank you.");
      } else {
        toast.success("✅ Submitted! Awaiting admin approval.");
      }

      localStorage.setItem("lastReviewSubmit", Date.now().toString());
      setCooldown(120);
      setRating(0);
      setComment("");
      removeImage();
      if (onReviewAdded) onReviewAdded(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="card" style={{ padding: "40px", textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔐</div>
      <h3 style={{ marginBottom: "12px" }}>Login to Leave a Review</h3>
      <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "14px" }}>
        Share your experience to help other buyers. Firebase login required.
      </p>
      <Link to="/login" className="btn btn-gold w-full">Login / Sign Up</Link>
    </div>
  );

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ marginBottom: "6px" }}>Share Your Experience</h3>
      <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "20px" }}>
        Logged in as <b style={{ color: "var(--gold)" }}>{user.displayName || user.email}</b>
      </p>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>

        {/* Star Rating */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "8px" }}>Your Rating</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={28}
                fill={(hoverRating || rating) >= s ? "var(--gold)" : "transparent"}
                color="var(--gold)"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ cursor: "pointer", transition: "transform 0.1s" }}
              />
            ))}
          </div>
        </div>

        <input className="input" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="input" placeholder="Share your experience (minimum 15 characters)..." value={comment} onChange={e => setComment(e.target.value)} rows={4} />

        {/* Lobby Screenshot */}
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            Lobby Screenshot <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center", background: "rgba(255,215,0,0.02)" }}>
            {imagePreview ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "180px", borderRadius: "8px" }} />
                <button type="button" onClick={removeImage} style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", border: "none", color: "#fff", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <Upload size={28} style={{ color: "var(--gold)" }} />
                <div style={{ fontSize: "13px", color: "var(--text)" }}>Upload Lobby Screenshot</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>PNG, JPG up to 10MB • Hosted on ImgBB</div>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            )}
          </div>
        </div>

        <button type="submit" disabled={submitting || cooldown > 0} className="btn btn-gold w-full" style={{ padding: "14px" }}>
          {submitting
            ? <><Loader2 className="animate-spin" size={18} style={{ display: "inline" }} /> Uploading & Submitting...</>
            : cooldown > 0
              ? `Please wait ${cooldown}s before re-submitting`
              : "Submit Review"
          }
        </button>
      </form>
    </div>
  );
}
