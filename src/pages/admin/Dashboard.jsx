/**
 * Admin Dashboard — Manage Products + Reviews + CRM + Sales (Supabase)
 *
 * Access control:
 *   - isAdmin checked via AuthContext (UID match from .env)
 */
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { LogOut, Plus, Trash2, Pencil, Star, Copy, Users, TrendingUp, DollarSign } from "lucide-react";

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
  image_url: "", tracking_id: "",
};
const EMPTY_CUSTOMER = {
  name: "", contact: "", social_handle: "", notes: "",
};
const EMPTY_SALE = {
  transaction_id: "", product_id: "", customer_id: "",
  mode_of_deal: "Direct", logins: "",
  owner_price: "", sold_price: "",
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
  const [proofForm, setProofForm] = useState({ title: "", imageUrl: "" });
  const [savingProof, setSavingProof] = useState(false);

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
        login_type: productForm.loginType,
        available: productForm.status === "available",
      };
      if (editId) {
        await supabase.from('products').update(data).eq('id', editId);
        toast.success("Product updated!");
        setEditId(null);
      } else {
        await supabase.from('products').insert([data]);
        toast.success("Product added!");
      }
      setProductForm(EMPTY_PRODUCT);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingProduct(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchData();
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

  const approveReview = async (review) => {
    setApprovingId(review.id);
    try {
      await supabase.from('reviews').update({ status: 'approved' }).eq('id', review.id);
      toast.success("Review approved!");
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setApprovingId(null); }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete review?")) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetchData();
  };

  // ── Proofs CRUD ────────────────────────────────────────────
  const saveProof = async () => {
    if (!proofForm.imageUrl) return toast.error("Image URL required");
    setSavingProof(true);
    try {
      await supabase.from('proofs').insert([{ title: proofForm.title, image_url: proofForm.imageUrl }]);
      toast.success("Proof added!");
      setProofForm({ title: "", imageUrl: "" });
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
    if (!saleForm.transaction_id || !saleForm.product_id || !saleForm.customer_id) return toast.error("Required fields missing");
    setSavingSale(true);
    try {
      const data = {
        transaction_id: saleForm.transaction_id,
        product_id: saleForm.product_id,
        customer_id: saleForm.customer_id,
        mode_of_deal: saleForm.mode_of_deal,
        logins: saleForm.logins,
        owner_price: Number(saleForm.owner_price),
        sold_price: Number(saleForm.sold_price),
      };
      await supabase.from('sales').insert([data]);
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
                <input className="input" placeholder="Title" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                <textarea className="input" placeholder="Description" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                <input className="input" type="number" placeholder="Price" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                <select className="input" value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
                <button onClick={saveProduct} disabled={savingProduct} className="btn btn-gold">{savingProduct ? "..." : "Save Product"}</button>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden" }}>
              {products.map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.title}</div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>₹{p.price} · {p.status}</div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} style={{ color: "#ef4444" }}><Trash2 size={16}/></button>
                </div>
              ))}
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
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden" }}>
              {reviews.map(r => (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{r.name} {r.status === 'pending' && <span style={{ color: "var(--orange)", fontSize: "10px" }}>PENDING</span>}</div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>{r.text}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {r.status === 'pending' && <button onClick={() => approveReview(r)} style={{ color: "var(--green)" }}><Star size={16}/></button>}
                    <button onClick={() => deleteReview(r.id)} style={{ color: "#ef4444" }}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
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
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><TrendingUp size={18}/> Record Sale</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="Transaction ID (e.g. MSID-001)" value={saleForm.transaction_id} onChange={e => setSaleForm({...saleForm, transaction_id: e.target.value})} />
                <select className="input" value={saleForm.product_id} onChange={e => setSaleForm({...saleForm, product_id: e.target.value})}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
                <select className="input" value={saleForm.customer_id} onChange={e => setSaleForm({...saleForm, customer_id: e.target.value})}>
                  <option value="">Select Customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input className="input" placeholder="Owner Price" type="number" value={saleForm.owner_price} onChange={e => setSaleForm({...saleForm, owner_price: e.target.value})} />
                <input className="input" placeholder="Sold Price" type="number" value={saleForm.sold_price} onChange={e => setSaleForm({...saleForm, sold_price: e.target.value})} />
                <button onClick={saveSale} disabled={savingSale} className="btn btn-gold">Record Sale</button>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden" }}>
              <table style={{ width: "100%", textAlign: "left", fontSize: "13px" }}>
                <thead style={{ background: "rgba(255,215,0,0.05)" }}>
                  <tr>
                    <th style={{ padding: "12px" }}>ID</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Sold</th>
                    <th style={{ color: "var(--green)" }}>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(s => (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px", fontWeight: 700 }}>{s.transaction_id}</td>
                      <td>{s.products?.title}</td>
                      <td>{s.customers?.name}</td>
                      <td>₹{s.sold_price}</td>
                      <td style={{ color: "var(--green)", fontWeight: 700 }}>₹{s.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
