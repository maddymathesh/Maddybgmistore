/**
 * Admin Dashboard — Manage Products + Reviews + CRM + Sales (Supabase)
 *
 * Access control:
 *   - isAdmin checked via AuthContext (UID match from .env)
 */
import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { LogOut, Plus, Trash2, Pencil, Star, Copy, Users, TrendingUp, DollarSign, Camera } from "lucide-react";

// ── Shared label style ────────────────────────────────────────
const ls = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "var(--muted)", letterSpacing: "1.2px",
  textTransform: "uppercase", marginBottom: "7px",
};

const LOGIN_OPTIONS = ["Facebook", "X", "Apple ID", "Game Center", "Google Play Games"];

// ── Empty form defaults ───────────────────────────────────────
const EMPTY_PRODUCT = {
  title: "", description: "", price: "",
  category: "Budget", status: "available",
  youtubeUrl: "", loginType: [], // Store as array internally for checkboxes
};
const EMPTY_REVIEW = {
  name: "", text: "", stars: 5,
  image_url: "", tracking_id: "",
};
const EMPTY_CUSTOMER = {
  name: "", contact: "", social_handle: "", notes: "",
};
const EMPTY_SALE = {
  transaction_id: "", product_id: "", customer_id: "",
  owner_price: "", sold_price: "", profit: 0,
  mode_of_deal: "Telegram",
  deal_date: new Date().toISOString().split('T')[0],
  link: "",
  logins: "",
  unlinking_1: "",
  unlink_range_1: "",
  unlink_guarantee_1: "",
  unlinking_2: "",
  unlink_range_2: "",
  unlink_guarantee_2: "",
  credentials: "",
  owner_phone: "",
  seller_phone: "",
  reseller_phone: "",
  buyer_phone: "",
  account_owner: ""
};

function getInitials(name) {
  return (name || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");

  // ── States ────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [savingReview, setSavingReview] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const [proofs, setProofs] = useState([]);
  const [proofForm, setProofForm] = useState({ title: "", imageUrl: "", month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });
  const [savingProof, setSavingProof] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  const [paymentLinks, setPaymentLinks] = useState([]);
  const [generatingLink, setGeneratingLink] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerForm, setCustomerForm] = useState(EMPTY_CUSTOMER);
  const [savingCustomer, setSavingCustomer] = useState(false);

  const [sales, setSales] = useState([]);
  const [saleForm, setSaleForm] = useState(EMPTY_SALE);
  const [savingSale, setSavingSale] = useState(false);

  // ── Real-time listeners (Simulated with fetch on tab change or updates) ──
  const fetchData = async () => {
    const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(p || []);

    const { data: r } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews(r || []);

    const { data: pl } = await supabase.from('payment_links').select('*').order('created_at', { ascending: false });
    setPaymentLinks(pl || []);

    const { data: pr } = await supabase.from('proofs').select('*').order('created_at', { ascending: false });
    setProofs(pr || []);

    const { data: c } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    setCustomers(c || []);

    const { data: s } = await supabase.from('sales').select('*, products(title), customers(name)').order('created_at', { ascending: false });
    setSales(s || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Guard: redirect non-admins
  useEffect(() => {
    if (user !== undefined && !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => { await logout(); navigate("/"); };

  // ── Product CRUD ───────────────────────────────────────────
  const saveProduct = async () => {
    if (!productForm.title || !productForm.price) return toast.error("Title & price are required");
    setSavingProduct(true);
    try {
      const data = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        status: productForm.status,
        youtube_url: productForm.youtubeUrl,
        login_type: productForm.loginType.join(", "), // Join for database
        available: productForm.status === "available",
      };
      if (editId) {
        const { error } = await supabase.from('products').update(data).eq('id', editId);
        if (error) throw error;
        toast.success("Product updated!");
        setEditId(null);
      } else {
        const { error } = await supabase.from('products').insert([data]);
        if (error) throw error;
        toast.success("Product added!");
      }
      setProductForm(EMPTY_PRODUCT);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingProduct(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  // ── Review CRUD ────────────────────────────────────────────
  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) return toast.error("Required fields missing");
    setSavingReview(true);
    try {
      await supabase.from('reviews').insert([{
        name: reviewForm.name,
        text: reviewForm.text,
        stars: Number(reviewForm.stars),
        image_url: reviewForm.image_url,
        tracking_id: reviewForm.tracking_id,
        status: 'approved',
      }]);
      toast.success("Review published!");
      setReviewForm(EMPTY_REVIEW);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingReview(false); }
  };

  const approveReview = async (id) => {
    try {
      await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
      toast.success("Review approved!");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const rejectReview = async (id) => {
    try {
      await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
      toast.success("Review rejected!");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete review?")) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetchData();
  };

  // ── Proofs CRUD ────────────────────────────────────────────
  const saveProof = async () => {
    if (!proofImage && !proofForm.imageUrl) return toast.error("Image is required");
    setSavingProof(true);
    try {
      let url = proofForm.imageUrl;
      if (proofImage) {
        const fileExt = proofImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `proofs/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('reviews').upload(filePath, proofImage);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('reviews').getPublicUrl(filePath);
        url = publicUrl;
      }

      const { error } = await supabase.from('proofs').insert([{ 
        title: proofForm.title || "Deal Proof", 
        image_url: url,
        month: proofForm.month 
      }]);
      if (error) throw error;

      toast.success("Proof added!");
      setProofForm({ title: "", imageUrl: "", month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) });
      setProofImage(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingProof(false); }
  };

  const deleteProof = async (id) => {
    if (!confirm("Delete proof?")) return;
    await supabase.from('proofs').delete().eq('id', id);
    fetchData();
  };

  // ── CRM CRUD ───────────────────────────────────────────────
  const saveCustomer = async () => {
    if (!customerForm.name) return toast.error("Name required");
    setSavingCustomer(true);
    try {
      await supabase.from('customers').insert([customerForm]);
      toast.success("Customer added!");
      setCustomerForm(EMPTY_CUSTOMER);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingCustomer(false); }
  };

  // ── Sales CRUD ──────────────────────────────────────────────
  const saveSale = async () => {
    if (!saleForm.sold_price) return toast.error("Sold Price is required");
    setSavingSale(true);
    try {
      const profit = Number(saleForm.sold_price) - Number(saleForm.owner_price || 0);
      const { error } = await supabase.from('sales').insert([{ 
        ...saleForm, 
        profit,
        owner_price: Number(saleForm.owner_price),
        sold_price: Number(saleForm.sold_price)
      }]);
      if (error) throw error;
      toast.success("Sale recorded!");
      setSaleForm(EMPTY_SALE);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingSale(false); }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 5% 60px" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "var(--font-h)", fontSize: "32px", fontWeight: 700 }}>
            Supabase <span style={{ color: "var(--gold)" }}>Admin</span>
          </h1>
          <button onClick={handleLogout} className="btn btn-outline" style={{ color: "#ef4444" }}>
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "1px solid rgba(255,215,0,0.15)", overflowX: "auto" }}>
          {[
            ["products", "Products"],
            ["reviews", "Reviews"],
            ["proofs", "Proofs"],
            ["crm", "CRM"],
            ["sales", "Sales Tracking"]
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: "10px 24px", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "12px",
                background: tab === key ? "var(--gold)" : "transparent",
                color: tab === key ? "#000" : "var(--muted)",
                border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer"
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><Plus size={18}/> {editId ? "Edit" : "Add"} Product</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="YouTube Video URL" value={productForm.youtubeUrl} onChange={e => setProductForm({...productForm, youtubeUrl: e.target.value})} />
                <input className="input" placeholder="Account Title (e.g. M416 Maxed 60K UC)" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                <textarea className="input" placeholder="Account Description (items, skins, levels...)" rows={5} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input className="input" type="number" placeholder="Price (₹)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                  <select className="input" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                    <option value="Budget">Budget</option>
                    <option value="Mid Range">Mid Range</option>
                    <option value="Premium">Premium</option>
                    <option value="Ultra Premium">Ultra Premium</option>
                  </select>
                </div>

                <div style={{ padding: "10px", background: "rgba(255,215,0,0.05)", borderRadius: "8px", border: "1px solid rgba(255,215,0,0.1)" }}>
                  <label style={ls}>Login Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {LOGIN_OPTIONS.map(opt => (
                      <label key={opt} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                        <input type="checkbox" checked={productForm.loginType.includes(opt)} 
                          onChange={e => {
                            if (e.target.checked && productForm.loginType.length >= 2) {
                              return toast.error("Maximum 2 login types allowed");
                            }
                            const val = e.target.checked 
                              ? [...productForm.loginType, opt]
                              : productForm.loginType.filter(t => t !== opt);
                            setProductForm({...productForm, loginType: val});
                          }} 
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <select className="input" value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveProduct} disabled={savingProduct} className="btn btn-gold" style={{ flex: 1 }}>
                    {savingProduct ? "Saving..." : editId ? "Update Product" : "Save Product"}
                  </button>
                  {editId && (
                    <button onClick={() => { setEditId(null); setProductForm(EMPTY_PRODUCT); }} className="btn btn-outline">Cancel</button>
                  )}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,215,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Account Inventory</h3>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>{products.length} Items</span>
              </div>
              
              <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                {products.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "100px 20px", color: "var(--muted)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>📦</div>
                    <p style={{ fontSize: "14px" }}>No accounts found in Supabase.</p>
                    <p style={{ fontSize: "12px", marginTop: "8px" }}>Start by adding a new product on the left.</p>
                  </div>
                ) : products.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border)", transition: "background .2s" }} className="product-item">
                    <div style={{ flex: 1, minWidth: 0, marginRight: "16px" }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{p.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--gold)" }}>₹{Number(p.price).toLocaleString("en-IN")}</span>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "var(--muted)" }}></span>
                        <span style={{ 
                          fontSize: "10px", 
                          fontWeight: 900, 
                          color: p.status === 'available' ? "var(--green)" : p.status === 'coming_soon' ? "var(--gold)" : "#ef4444",
                          textTransform: "uppercase" 
                        }}>
                          {p.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => { 
                        setEditId(p.id); 
                        setProductForm({ 
                          title: p.title || "", 
                          description: p.description || "", 
                          price: p.price || "", 
                          category: p.category || "Budget", 
                          status: p.status || "available", 
                          youtubeUrl: p.youtube_url || "", 
                          loginType: (p.login_type || "").split(", ").filter(Boolean) 
                        }); 
                      }} style={{ padding: "8px", borderRadius: "8px", background: "rgba(255,215,0,0.1)", color: "var(--gold)", border: "1px solid rgba(255,215,0,0.2)", cursor: "pointer", transition: "all .2s" }} title="Edit"><Pencil size={16}/></button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: "8px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", transition: "all .2s" }} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}>Add Review</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="Buyer Name" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} />
                <textarea className="input" placeholder="Feedback" value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} />
                <input className="input" type="number" placeholder="Stars (1-5)" value={reviewForm.stars} onChange={e => setReviewForm({...reviewForm, stars: e.target.value})} />
                <button onClick={saveReview} disabled={savingReview} className="btn btn-gold">Publish Review</button>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,215,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Review Management</h3>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>{reviews.length} Total</span>
              </div>
              
              <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                {reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted)" }}>
                    <p>No reviews submitted yet.</p>
                  </div>
                ) : reviews.map(r => (
                  <div key={r.id} style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "20px", alignItems: "start" }}>
                    {r.image_url && (
                      <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                        <img src={r.image_url} alt="Lobby" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: 700 }}>{r.name}</span>
                        <span style={{ display: "flex", gap: "2px" }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < r.stars ? "var(--gold)" : "transparent"} color="var(--gold)" />)}
                        </span>
                        <span style={{ 
                          fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "100px",
                          background: r.status === 'approved' ? "rgba(34,197,94,0.1)" : r.status === 'rejected' ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                          color: r.status === 'approved' ? "#22c55e" : r.status === 'rejected' ? "#ef4444" : "#f59e0b",
                          border: `1px solid ${r.status === 'approved' ? "rgba(34,197,94,0.3)" : r.status === 'rejected' ? "rgba(239,68,68,0.3)" : "rgba(251,191,36,0.3)"}`,
                          textTransform: "uppercase"
                        }}>
                          {r.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5, marginBottom: "8px" }}>{r.text}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>Submitted on {new Date(r.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {r.status !== 'approved' && (
                        <button onClick={() => approveReview(r.id)} className="btn btn-gold btn-sm" style={{ padding: "6px 12px", fontSize: "11px" }}>Approve</button>
                      )}
                      {r.status !== 'rejected' && (
                        <button onClick={() => rejectReview(r.id)} className="btn btn-outline btn-sm" style={{ padding: "6px 12px", fontSize: "11px", color: "#ef4444" }}>Reject</button>
                      )}
                      <button onClick={() => deleteReview(r.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "11px", marginTop: "4px" }}>Delete Permanently</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROOFS TAB */}
        {tab === "proofs" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><Camera size={18}/> Add Proof</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="Title (e.g. Payment Proof)" value={proofForm.title} onChange={e => setProofForm({...proofForm, title: e.target.value})} />
                <input className="input" placeholder="Month (e.g. May 2026)" value={proofForm.month} onChange={e => setProofForm({...proofForm, month: e.target.value})} />
                
                <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                  {proofImage ? (
                    <div style={{ fontSize: "12px", color: "var(--green)" }}>{proofImage.name} selected</div>
                  ) : (
                    <label style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "12px" }}>Click to Upload Proof Image</div>
                      <input type="file" hidden onChange={e => setProofImage(e.target.files[0])} />
                    </label>
                  )}
                </div>

                <button onClick={saveProof} disabled={savingProof} className="btn btn-gold w-full">
                  {savingProof ? "Uploading..." : "Save Proof"}
                </button>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Proof Gallery</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px", padding: "20px", maxHeight: "600px", overflowY: "auto" }}>
                {proofs.map(p => (
                  <div key={p.id} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                    <img src={p.image_url} alt="Proof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={() => deleteProof(p.id)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Trash2 size={12}/></button>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "10px", padding: "4px", textAlign: "center" }}>{p.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM TAB */}
        {tab === "crm" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><Users size={18}/> Add Customer</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
                <input className="input" placeholder="Contact (WhatsApp/TG)" value={customerForm.contact} onChange={e => setCustomerForm({...customerForm, contact: e.target.value})} />
                <input className="input" placeholder="Social Handle" value={customerForm.social_handle} onChange={e => setCustomerForm({...customerForm, social_handle: e.target.value})} />
                <textarea className="input" placeholder="Notes" value={customerForm.notes} onChange={e => setCustomerForm({...customerForm, notes: e.target.value})} />
                <button onClick={saveCustomer} disabled={savingCustomer} className="btn btn-gold">Save Customer</button>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden" }}>
              {customers.map(c => (
                <div key={c.id} style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>{c.contact} · {c.social_handle}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SALES TAB */}
        {tab === "sales" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "32px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "24px", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}><TrendingUp size={20}/> Comprehensive Deal Record</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
                
                {/* SECTION 1: GENERAL & LOGINS */}
                <div>
                  <h4 style={sh}>1. Deal & Login Details</h4>
                  <div style={sg}>
                    <div><label style={sl}>Transaction ID</label><input className="input" placeholder="e.g. MSID-311" value={saleForm.transaction_id} onChange={e => setSaleForm({...saleForm, transaction_id: e.target.value})} /></div>
                    <div><label style={sl}>Mode of Deal</label><input className="input" placeholder="e.g. Telegram / WhatsApp" value={saleForm.mode_of_deal} onChange={e => setSaleForm({...saleForm, mode_of_deal: e.target.value})} /></div>
                    <div><label style={sl}>Deal Date</label><input className="input" type="date" value={saleForm.deal_date} onChange={e => setSaleForm({...saleForm, deal_date: e.target.value})} /></div>
                    <div><label style={sl}>Deal Link</label><input className="input" placeholder="t.me/..." value={saleForm.link} onChange={e => setSaleForm({...saleForm, link: e.target.value})} /></div>
                    <div><label style={sl}>Current Logins</label><input className="input" placeholder="e.g. FB, Twitter, Apple" value={saleForm.logins} onChange={e => setSaleForm({...saleForm, logins: e.target.value})} /></div>
                    <div><label style={sl}>Login Credentials / ID Code</label><input className="input" placeholder="#MSID..." value={saleForm.credentials} onChange={e => setSaleForm({...saleForm, credentials: e.target.value})} /></div>
                  </div>
                </div>

                {/* SECTION 2: UNLINKING PROCESS */}
                <div>
                  <h4 style={sh}>2. Unlinking Process</h4>
                  <div style={sg}>
                    <div><label style={sl}>1st Login Under Unlink</label><input className="input" placeholder="e.g. Twitter" value={saleForm.unlinking_1} onChange={e => setSaleForm({...saleForm, unlinking_1: e.target.value})} /></div>
                    <div><label style={sl}>1st Unlink Range</label><input className="input" placeholder="June 7 -> June 21" value={saleForm.unlink_range_1} onChange={e => setSaleForm({...saleForm, unlink_range_1: e.target.value})} /></div>
                    <div><label style={sl}>1st Unlink Guarantee</label><input className="input" type="date" value={saleForm.unlink_guarantee_1} onChange={e => setSaleForm({...saleForm, unlink_guarantee_1: e.target.value})} /></div>
                    <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }}></div>
                    <div><label style={sl}>2nd Login Under Unlink</label><input className="input" placeholder="e.g. Facebook" value={saleForm.unlinking_2} onChange={e => setSaleForm({...saleForm, unlinking_2: e.target.value})} /></div>
                    <div><label style={sl}>2nd Unlink Range</label><input className="input" placeholder="June 7 -> July 21" value={saleForm.unlink_range_2} onChange={e => setSaleForm({...saleForm, unlink_range_2: e.target.value})} /></div>
                    <div><label style={sl}>2nd Unlink Guarantee</label><input className="input" type="date" value={saleForm.unlink_guarantee_2} onChange={e => setSaleForm({...saleForm, unlink_guarantee_2: e.target.value})} /></div>
                  </div>
                </div>

                {/* SECTION 3: FINANCIALS & CONTACTS */}
                <div>
                  <h4 style={sh}>3. Financials & Contacts</h4>
                  <div style={sg}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div><label style={sl}>Owner Price</label><input className="input" type="number" value={saleForm.owner_price} onChange={e => setSaleForm({...saleForm, owner_price: e.target.value})} /></div>
                      <div><label style={sl}>Sold Price</label><input className="input" type="number" value={saleForm.sold_price} onChange={e => setSaleForm({...saleForm, sold_price: e.target.value})} /></div>
                    </div>
                    <div><label style={sl}>Account Owner Name</label><input className="input" value={saleForm.account_owner} onChange={e => setSaleForm({...saleForm, account_owner: e.target.value})} /></div>
                    <div><label style={sl}>Owner Phone</label><input className="input" value={saleForm.owner_phone} onChange={e => setSaleForm({...saleForm, owner_phone: e.target.value})} /></div>
                    <div><label style={sl}>Seller Phone</label><input className="input" value={saleForm.seller_phone} onChange={e => setSaleForm({...saleForm, seller_phone: e.target.value})} /></div>
                    <div><label style={sl}>Reseller Phone</label><input className="input" value={saleForm.reseller_phone} onChange={e => setSaleForm({...saleForm, reseller_phone: e.target.value})} /></div>
                    <div><label style={sl}>Buyer Phone</label><input className="input" value={saleForm.buyer_phone} onChange={e => setSaleForm({...saleForm, buyer_phone: e.target.value})} /></div>
                  </div>
                </div>

              </div>

              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>
                  Estimated Profit: <span style={{ color: "var(--green)" }}>₹{(Number(saleForm.sold_price) - Number(saleForm.owner_price || 0)).toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                   <select className="input" style={{ width: "auto" }} value={saleForm.product_id} onChange={e => setSaleForm({...saleForm, product_id: e.target.value})}>
                     <option value="">Link to Product</option>
                     {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                   </select>
                   <button onClick={saveSale} disabled={savingSale} className="btn btn-gold" style={{ padding: "12px 40px" }}>Record Deal</button>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
               <div style={{ padding: "20px", background: "rgba(255,215,0,0.02)", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>Recent Deals</div>
               <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", textAlign: "left", fontSize: "13px", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(255,215,0,0.05)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <tr>
                      <th style={{ padding: "14px" }}>Deal ID</th>
                      <th>Account</th>
                      <th>Owner</th>
                      <th>Sold Price</th>
                      <th style={{ color: "var(--green)" }}>Profit</th>
                      <th>Logins</th>
                      <th>1st Unlink</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(s => (
                      <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "14px", fontWeight: 700 }}>{s.transaction_id || "N/A"}</td>
                        <td>{s.products?.title || "Manual Entry"}</td>
                        <td>{s.account_owner || "—"}</td>
                        <td>₹{Number(s.sold_price).toLocaleString("en-IN")}</td>
                        <td style={{ color: "var(--green)", fontWeight: 700 }}>₹{Number(s.profit).toLocaleString("en-IN")}</td>
                        <td><span style={{ fontSize: "11px", background: "var(--bg2)", padding: "2px 6px", borderRadius: "4px" }}>{s.logins || "None"}</span></td>
                        <td>{s.unlinking_1 ? <span style={{ color: "var(--gold)", fontSize: "11px" }}>{s.unlinking_1} ({s.unlink_range_1})</span> : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ── New Section Styles ──────────────────────────────────────
const sh = { fontSize: "14px", fontWeight: 800, color: "var(--gold)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px", borderLeft: "3px solid var(--gold)", paddingLeft: "10px" };
const sg = { display: "grid", gap: "16px" };
const sl = { display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase" };
