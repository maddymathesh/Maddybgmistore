import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { supabase } from "../supabase";
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
    if (user && user.displayName && !name) setName(user.displayName);
  }, [user]);

  useEffect(() => {
    const lastSubmit = localStorage.getItem("lastReviewSubmit");
    if (lastSubmit) {
      const timePassed = (Date.now() - parseInt(lastSubmit)) / 1000;
      if (timePassed < 60) setCooldown(Math.floor(60 - timePassed));
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
      if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");
    if (rating === 0) return toast.error("Rate the service");
    if (!comment.trim()) return toast.error("Enter review text");
    if (!image) return toast.error("Upload lobby screenshot");
    if (cooldown > 0) return;

    setSubmitting(true);
    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `reviews/${user.uid}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", snap => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100), reject, async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          });
        });
      }

      const { data, error } = await supabase.from('reviews').insert([{
        name: name.trim(),
        stars: rating,
        text: comment.trim(),
        image_url: imageUrl,
        uid: user.uid,
        status: 'pending'
      }]).select().single();

      if (error) throw error;

      toast.success("Submitted! Awaiting approval.");
      localStorage.setItem("lastReviewSubmit", Date.now().toString());
      setCooldown(60);
      setRating(0);
      setComment("");
      removeImage();
      if (onReviewAdded) onReviewAdded(data);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="card" style={{ padding: "40px", textAlign: "center" }}>
      <h3>Write a Review</h3>
      <p style={{ margin: "16px 0", color: "var(--muted)" }}>Log in to share your experience.</p>
      <Link to="/login" className="btn btn-gold w-full">Login to Review</Link>
    </div>
  );

  return (
    <div className="card" style={{ padding: "28px" }}>
      <h3 style={{ marginBottom: "20px" }}>Share Your Experience</h3>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={24} fill={(hoverRating || rating) >= s ? "var(--gold)" : "transparent"} color="var(--gold)" 
              onClick={() => setRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} style={{ cursor: "pointer" }} />
          ))}
        </div>
        <input className="input" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="input" placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} rows={4} />
        
        <div style={{ border: "2px dashed var(--border-gold)", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
          {imagePreview ? (
            <div style={{ position: "relative" }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px" }} />
              <X onClick={removeImage} size={16} style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", background: "#000", color: "#fff", borderRadius: "50%" }} />
            </div>
          ) : (
            <label style={{ cursor: "pointer" }}>
              <ImageIcon size={24} style={{ color: "var(--gold)" }} />
              <div style={{ fontSize: "12px", marginTop: "4px" }}>Upload Lobby Screenshot</div>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          )}
        </div>

        <button type="submit" disabled={submitting || cooldown > 0} className="btn btn-gold w-full">
          {submitting ? <Loader2 className="animate-spin" size={18} /> : cooldown > 0 ? `Wait ${cooldown}s` : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
