/**
 * Admin Dashboard — Manage Products + Reviews
 *
 * Firestore collections:
 *   products: { title, description, price, category, status, youtubeUrl, createdAt }
 *   reviews:  { name, text, stars, image, date, initials, createdAt }
 *
 * Access control:
 *   - isAdmin checked via AuthContext (UID match from .env)
 *   - Firestore security rules enforce write-only for admin UIDs
 */
import { useEffect, useState } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, orderBy, query, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { LogOut, Plus, Trash2, Pencil, Star } from "lucide-react";

// ── Shared label style ────────────────────────────────────────
const ls = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "var(--muted)", letterSpacing: "1.2px",
  textTransform: "uppercase", marginBottom: "7px",
};

// ── Empty form defaults ───────────────────────────────────────
const EMPTY_PRODUCT = {
  title: "", description: "", price: "",
  category: "Budget", status: "available",
  youtubeUrl: "", loginType: "",
};
const EMPTY_REVIEW = {
  name: "", text: "", stars: 5,
  image: "", date: "",
};

function getInitials(name) {
  return (name || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");

  // ── Products state ────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // ── Reviews state ─────────────────────────────────────────
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [savingReview, setSavingReview] = useState(false);

  // ── Real-time listeners ────────────────────────────────────
  useEffect(() => {
    const q1 = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const u1 = onSnapshot(q1, snap =>
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    const q2 = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const u2 = onSnapshot(q2, snap =>
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => { u1(); u2(); };
  }, []);

  // Guard: redirect non-admins
  useEffect(() => {
    if (user !== undefined && !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  // ── Product CRUD ───────────────────────────────────────────
  const saveProduct = async () => {
    if (!productForm.title || !productForm.price) {
      toast.error("Title & price are required");
      return;
    }
    setSavingProduct(true);
    try {
      const data = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        status: productForm.status,
        youtubeUrl: productForm.youtubeUrl,
        loginType: productForm.loginType,
        available: productForm.status === "available",
      };
      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
        toast.success("Product updated!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: serverTimestamp() });
        toast.success("Product added to Ready Stocks!");
      }
      setProductForm(EMPTY_PRODUCT);
    } catch (e) {
      toast.error("Error: " + e.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const editProduct = (p) => { setProductForm({ ...p, price: String(p.price) }); setEditId(p.id); };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Deleted!");
    } catch (e) { toast.error(e.message); }
  };

  const toggleStatus = async (id, current) => {
    const next = current === "available" ? "sold" : "available";
    await updateDoc(doc(db, "products", id), { status: next, available: next === "available" });
    toast.success(`Marked as ${next}`);
  };

  // ── Review CRUD ────────────────────────────────────────────
  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) {
      toast.error("Name & review text required");
      return;
    }
    setSavingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: reviewForm.name,
        text: reviewForm.text,
        stars: Number(reviewForm.stars),
        image: reviewForm.image || "",
        date: reviewForm.date || new Date().toLocaleString("en-IN", { month: "long", year: "numeric" }),
        initials: getInitials(reviewForm.name),
        createdAt: serverTimestamp(),
      });
      toast.success("Review published!");
      setReviewForm(EMPTY_REVIEW);
    } catch (e) {
      toast.error("Error: " + e.message);
    } finally {
      setSavingReview(false);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast.success("Review deleted");
    } catch (e) { toast.error(e.message); }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 5% 60px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-h)", fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, marginBottom: "4px" }}>
              Admin <span style={{ color: "var(--gold)" }}>Dashboard</span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Logged in as <strong style={{ color: "var(--text)" }}>{user?.email}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "10px 20px", borderRadius: "8px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "1px solid rgba(255,215,0,0.15)" }}>
          {[["products", "Manage Products"], ["reviews", "Manage Reviews"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: "10px 24px", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "12px",
                letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", border: "none",
                borderRadius: "8px 8px 0 0", transition: "all .2s",
                background: tab === key ? "var(--gold)" : "transparent",
                color: tab === key ? "#000" : "var(--muted)",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════ PRODUCTS TAB ═══════════ */}
        {tab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,380px) 1fr", gap: "24px", alignItems: "start" }}>

            {/* Add / Edit Form */}
            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "14px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Plus size={18} style={{ color: "var(--gold)" }} />
                <span style={{ fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "16px" }}>
                  {editId ? "Edit Account" : "Add New Account"}
                </span>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={ls}>Title *</label>
                  <input className="input" placeholder="e.g. Galadria Xsuit LvL5 Account" value={productForm.title}
                    onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Description details</label>
                  <textarea className="input" rows={4} placeholder="Full account details..." value={productForm.description}
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Price (INR) *</label>
                  <input className="input" type="number" placeholder="59999" value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>YouTube URL</label>
                  <input className="input" placeholder="https://youtube.com/..." value={productForm.youtubeUrl}
                    onChange={e => setProductForm({ ...productForm, youtubeUrl: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Login Type</label>
                  <input className="input" placeholder="e.g. Facebook, Twitter" value={productForm.loginType}
                    onChange={e => setProductForm({ ...productForm, loginType: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={ls}>Category</label>
                    <select className="input" value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                      <option>Budget</option>
                      <option>Mid Range</option>
                      <option>Premium</option>
                      <option>Ultra Premium</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={ls}>Status</label>
                    <select className="input" value={productForm.status}
                      onChange={e => setProductForm({ ...productForm, status: e.target.value })}>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                  {editId && (
                    <button onClick={() => { setEditId(null); setProductForm(EMPTY_PRODUCT); }} className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }}>
                      Cancel
                    </button>
                  )}
                  <button onClick={saveProduct} disabled={savingProduct} className="btn btn-gold"
                    style={{ flex: 1, justifyContent: "center", fontFamily: "var(--font-h)", fontWeight: 700, letterSpacing: "1px" }}>
                    {savingProduct ? "Saving..." : editId ? "UPDATE ACCOUNT" : "SAVE ACCOUNT"}
                  </button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "14px", overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 90px", gap: "8px", padding: "12px 20px", background: "rgba(255,215,0,0.04)", borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                {["ID / Title", "Price", "Status", "Actions"].map((h, i) => (
                  <span key={h} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: i === 0 ? "var(--muted)" : "var(--gold)" }}>{h}</span>
                ))}
              </div>

              {products.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
                  No accounts yet. Add one from the form.
                </div>
              ) : products.map((p, i) => (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 90px", gap: "8px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13px" }}>
                      BGMI-{String(i + 1).padStart(4, "0")}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "220px" }}>
                      🇮🇳 {(p.title || "").slice(0, 45)}{p.title?.length > 45 ? "..." : ""}
                    </div>
                  </div>
                  <span style={{ fontFamily: "var(--font-h)", fontWeight: 700, color: "var(--gold)", fontSize: "14px" }}>
                    ₹{Number(p.price).toLocaleString("en-IN")}
                  </span>
                  <button onClick={() => toggleStatus(p.id, p.status)}
                    style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 700, cursor: "pointer", border: "none", background: p.status === "available" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: p.status === "available" ? "#22C55E" : "#ef4444" }}>
                    {p.status === "available" ? "available" : "sold"}
                  </button>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => editProduct(p)}
                      style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: "6px", padding: "6px 8px", cursor: "pointer", color: "var(--gold)" }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)}
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "6px 8px", cursor: "pointer", color: "#ef4444" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ REVIEWS TAB ═══════════ */}
        {tab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px,380px) 1fr", gap: "24px", alignItems: "start" }}>

            {/* Add Review Form */}
            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "14px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Plus size={18} style={{ color: "var(--gold)" }} />
                <span style={{ fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "16px" }}>Add New Review</span>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={ls}>Buyer Name *</label>
                  <input className="input" placeholder="e.g. Arun Kumar" value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Image Proof URL (optional)</label>
                  <input className="input" placeholder="https://i.imgur.com/..." value={reviewForm.image}
                    onChange={e => setReviewForm({ ...reviewForm, image: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Review Text *</label>
                  <textarea className="input" rows={4} placeholder="What did the buyer say..." value={reviewForm.text}
                    onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Date Label</label>
                  <input className="input" placeholder="e.g. May 2026" value={reviewForm.date}
                    onChange={e => setReviewForm({ ...reviewForm, date: e.target.value })} />
                </div>
                <div>
                  <label style={ls}>Stars (1–5)</label>
                  <input className="input" type="number" min={1} max={5} value={reviewForm.stars}
                    onChange={e => setReviewForm({ ...reviewForm, stars: e.target.value })} />
                </div>
                <button onClick={saveReview} disabled={savingReview} className="btn btn-gold"
                  style={{ width: "100%", justifyContent: "center", fontFamily: "var(--font-h)", fontWeight: 700, letterSpacing: "1px" }}>
                  {savingReview ? "Saving..." : "SAVE REVIEW"}
                </button>
              </div>
            </div>

            {/* Reviews Table */}
            <div style={{ background: "var(--card)", border: "1px solid rgba(255,215,0,0.18)", borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", gap: "8px", padding: "12px 20px", background: "rgba(255,215,0,0.04)", borderBottom: "1px solid rgba(255,215,0,0.12)" }}>
                {["Review", "Stars", "Actions"].map((h, i) => (
                  <span key={h} style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: i === 0 ? "var(--muted)" : "var(--gold)" }}>{h}</span>
                ))}
              </div>
              {reviews.length === 0 ? (
                <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>No reviews yet.</div>
              ) : reviews.map((r) => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px", gap: "8px", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-h)", fontWeight: 700, color: "#000", fontSize: "12px", flexShrink: 0 }}>
                      {r.initials || getInitials(r.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>{r.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{r.text}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: Number(r.stars) || 5 }).map((_, j) => (
                      <Star key={j} size={12} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>
                  <button onClick={() => deleteReview(r.id)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", padding: "6px 8px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
