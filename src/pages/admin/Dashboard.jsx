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
import { useTransactionStore } from "../../store/useTransactionStore";
import { useRef } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { LogOut, Plus, Trash2, Pencil, Star, Copy, Users, TrendingUp, DollarSign, Camera, Coins, Zap, Car } from "lucide-react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";

// ── Shared label style ────────────────────────────────────────
const ls = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "var(--muted)", letterSpacing: "1.2px",
  textTransform: "uppercase", marginBottom: "7px",
};

const LOGIN_OPTIONS = ["X", "Facebook", "Google Playgames", "Apple ID", "Game Center", "Whats App"];
const GUARANTEE_OPTIONS = [
  "37 days unlink Garuntee for Secondary Login",
  "22 Days Unlink Garuntee for Secondary Login",
  "75 Days Unlink Garuntee For Both logins",
  "Single & Safe Login"
];

// ── Empty form defaults ───────────────────────────────────────
const EMPTY_PRODUCT = {
  title: "", description: "", price: "",
  category: "Budget", status: "available",
  youtubeUrl: "", 
  primaryLogin: "X",
  secondaryLogin: "null",
  unlinkGuarantee: "Single & Safe Login"
};
const EMPTY_REVIEW = {
  name: "", text: "", stars: 5,
  image_url: "", tracking_id: "",
};
const EMPTY_UC = { uc_amount: "", bonus_uc: "", market_price: "", offer_price: "", status: "available", method: "view_login" };
const EMPTY_XSUIT = { name: "", price: "", image_url: "" };
const EMPTY_CAR = { name: "", price: "", image_url: "", type: "One-Card" };
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
  const [proofForm, setProofForm] = useState({ title: "", month: "May 2026" });
  const [savingProof, setSavingProof] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  const [paymentLinks, setPaymentLinks] = useState([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ customer_name: "", amount: "", note: "", expires_in: "24", pin: "9025" });

  const [ucPrices, setUcPrices] = useState([]);
  const [ucForm, setUcForm] = useState(EMPTY_UC);
  const [ucEditId, setUcEditId] = useState(null);
  const [savingUc, setSavingUc] = useState(false);

  const [xsuits, setXsuits] = useState([]);
  const [xsuitForm, setXsuitForm] = useState(EMPTY_XSUIT);
  const [xsuitEditId, setXsuitEditId] = useState(null);
  const [xsuitImage, setXsuitImage] = useState(null);
  const [savingXsuit, setSavingXsuit] = useState(false);

  const [supercars, setSupercars] = useState([]);
  const [carForm, setCarForm] = useState(EMPTY_CAR);
  const [carEditId, setCarEditId] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const [savingCar, setSavingCar] = useState(false);
  const [sales, setSales] = useState([]);
  const [saleForm, setSaleForm] = useState(EMPTY_SALE);
  const [savingSale, setSavingSale] = useState(false);

  // Transaction Panel Auth
  const isTxAuthenticated = useTransactionStore(state => state.isAuthenticated);
  const loginTx = useTransactionStore(state => state.login);
  const [showTxAuth, setShowTxAuth] = useState(false);
  const [txPin, setTxPin] = useState(["", "", "", ""]);
  const txInputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleTxPinChange = (e, index) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return;

    const newPin = [...txPin];
    newPin[index] = val.slice(-1);
    setTxPin(newPin);

    if (val && index < 3) {
      txInputRefs[index + 1].current.focus();
    }
  };

  const handleTxPinKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !txPin[index] && index > 0) {
      txInputRefs[index - 1].current.focus();
    }
  };

  const fetchData = async () => {
    try {
      const [
        { data: p }, 
        { data: r }, 
        { data: pl }, 
        { data: pr }, 
        { data: uc }, 
        { data: xs }, 
        { data: sc }, 
        { data: s }
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('payment_links').select('*').order('created_at', { ascending: false }),
        supabase.from('proofs').select('*').order('created_at', { ascending: false }),
        supabase.from('uc_prices').select('*').order('offer_price', { ascending: true }),
        supabase.from('xsuit_gifts').select('*').order('created_at', { ascending: false }),
        supabase.from('supercar_gifts').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*, products(*)').order('deal_date', { ascending: false })
      ]);

      setProducts(p || []);
      setReviews(r || []);
      setPaymentLinks(pl || []);
      setProofs(pr || []);
      setUcPrices(uc || []);
      setXsuits(xs || []);
      setSupercars(sc || []);
      setSales(s || []);
    } catch (globalErr) {
      console.error("Global Data Fetch Error:", globalErr);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Guard: redirect non-admins
  useEffect(() => {
    if (user !== undefined && !isAdmin) navigate("/");
  }, [user, isAdmin, navigate]);

  const logoutTx = useTransactionStore(state => state.logout);
  const handleLogout = async () => { 
    logoutTx();
    await logout(); 
    navigate("/"); 
  };

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
        primary_login: productForm.primaryLogin,
        secondary_login: productForm.secondaryLogin === "null" ? null : productForm.secondaryLogin,
        unlink_guarantee: productForm.unlinkGuarantee,
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
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success("Product deleted");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Review CRUD ────────────────────────────────────────────
  const saveReview = async () => {
    if (!reviewForm.name || !reviewForm.text) return toast.error("Required fields missing");
    setSavingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        name: reviewForm.name,
        text: reviewForm.text,
        stars: Number(reviewForm.stars),
        image_url: reviewForm.image_url,
        tracking_id: reviewForm.tracking_id,
        status: 'approved',
      }]);
      if (error) throw error;
      toast.success("Review published!");
      setReviewForm(EMPTY_REVIEW);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingReview(false); }
  };

  const approveReview = async (id) => {
    try {
      const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
      if (error) throw error;
      toast.success("Review approved!");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const rejectReview = async (id) => {
    try {
      const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
      if (error) throw error;
      toast.success("Review rejected!");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete review?")) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Proofs CRUD (Cloudinary) ───────────────────────────
  const saveProof = async () => {
    if (!proofImage) return toast.error("Please select a proof image");
    if (!proofForm.title.trim()) return toast.error("Please enter a title");
    setSavingProof(true);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const formData = new FormData();
      formData.append("file", proofImage);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", `mbs_proofs/${proofForm.month.replace(" ", "_")}`);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      const url = json.secure_url;

      const { error } = await supabase.from('proofs').insert([{
        title: proofForm.title.trim(),
        image_url: url,
        month: proofForm.month,
      }]);
      if (error) throw error;

      toast.success(`Proof uploaded to ${proofForm.month}!`);
      setProofForm({ title: "", month: proofForm.month });
      setProofImage(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingProof(false); }
  };

  const deleteProof = async (id) => {
    if (!confirm("Delete proof?")) return;
    try {
      const { error } = await supabase.from('proofs').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── UC Prices CRUD ─────────────────────────────────────────
  const saveUc = async () => {
    if (!ucForm.uc_amount || !ucForm.offer_price) return toast.error("Required fields missing");
    setSavingUc(true);
    try {
      const data = {
        ...ucForm,
        market_price: Number(ucForm.market_price),
        offer_price: Number(ucForm.offer_price),
        bonus_uc: Number(ucForm.bonus_uc || 0)
      };
      if (ucEditId) {
        const { error } = await supabase.from('uc_prices').update(data).eq('id', ucEditId);
        if (error) throw error;
        toast.success("UC Pack updated!");
        setUcEditId(null);
      } else {
        const { error } = await supabase.from('uc_prices').insert([data]);
        if (error) throw error;
        toast.success("UC Pack added!");
      }
      setUcForm(EMPTY_UC);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingUc(false); }
  };

  const deleteUc = async (id) => {
    if (!confirm("Delete this UC pack?")) return;
    try {
      const { error } = await supabase.from('uc_prices').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Xsuit Gifts CRUD ────────────────────────────────────────
  const saveXsuit = async () => {
    if (!xsuitForm.name || !xsuitForm.price) return toast.error("Required fields missing");
    setSavingXsuit(true);
    try {
      let url = xsuitForm.image_url;
      if (xsuitImage) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", xsuitImage);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "mbs_xsuits");
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        url = json.secure_url;
      }

      const data = { ...xsuitForm, image_url: url };
      if (xsuitEditId) {
        const { error } = await supabase.from('xsuit_gifts').update(data).eq('id', xsuitEditId);
        if (error) throw error;
        toast.success("Xsuit updated!");
        setXsuitEditId(null);
      } else {
        const { error } = await supabase.from('xsuit_gifts').insert([data]);
        if (error) throw error;
        toast.success("Xsuit added!");
      }
      setXsuitForm(EMPTY_XSUIT);
      setXsuitImage(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingXsuit(false); }
  };

  const deleteXsuit = async (id) => {
    if (!confirm("Delete this Xsuit gift?")) return;
    try {
      const { error } = await supabase.from('xsuit_gifts').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Supercar Gifts CRUD (Firebase) ──────────────────────────
  const saveCar = async () => {
    if (!carForm.name || !carForm.price) return toast.error("Required fields missing");
    setSavingCar(true);
    try {
      let url = carForm.image_url;
      if (carImage) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", carImage);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "mbs_supercars");
        
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        url = json.secure_url;
      }

      const data = { 
        name: carForm.name,
        price: Number(carForm.price),
        type: carForm.type,
        image_url: url,
        updated_at: new Date().toISOString()
      };

      if (carEditId) {
        const { error } = await supabase.from('supercar_gifts').update(data).eq('id', carEditId);
        if (error) throw error;
        toast.success("Supercar updated!");
        setCarEditId(null);
      } else {
        const { error } = await supabase.from('supercar_gifts').insert([{ ...data, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success("Supercar added!");
      }
      setCarForm(EMPTY_CAR);
      setCarImage(null);
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingCar(false); }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this Supercar gift?")) return;
    try {
      const { error } = await supabase.from('supercar_gifts').delete().eq('id', id);
      if (error) throw error;
      toast.success("Deleted from Supabase");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Payment Links ───────────────────────────────────────────
  const generatePaymentLink = async () => {
    if (!paymentForm.amount) return toast.error("Amount is required");
    setGeneratingLink(true);
    try {
      const linkId = `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + Number(paymentForm.expires_in) * 3600 * 1000).toISOString();
      const { error } = await supabase.from('payment_links').insert([{
        id: linkId,
        customer_name: paymentForm.customer_name || "Customer",
        amount: Number(paymentForm.amount),
        note: paymentForm.note,
        status: "active",
        expires_at: expiresAt,
        pin: paymentForm.pin || "9025",
      }]);
      if (error) throw error;
      toast.success(`Payment link generated! ID: ${linkId}`);
      setPaymentForm({ customer_name: "", amount: "", note: "", expires_in: "24" });
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setGeneratingLink(false); }
  };

  const revokePaymentLink = async (id) => {
    if (!confirm("Revoke this payment link? The customer won't be able to use it.")) return;
    try {
      const { error } = await supabase.from('payment_links').update({ status: "revoked" }).eq('id', id);
      if (error) throw error;
      toast.success("Link revoked");
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  const deletePaymentLink = async (id) => {
    if (!confirm("Delete this payment link permanently?")) return;
    try {
      const { error } = await supabase.from('payment_links').delete().eq('id', id);
      if (error) throw error;
      toast.success("Link deleted");
      fetchData();
    } catch (e) { toast.error(e.message); }
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
        sold_price: Number(saleForm.sold_price),
        created_at: new Date().toISOString()
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
            Admin <span style={{ color: "var(--gold)" }}>Panel</span>
          </h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => {
                logoutTx();
                setShowTxAuth(true);
              }} 
              className="btn btn-gold"
            >
              <DollarSign size={15} /> Transaction Panel
            </button>
            <button onClick={handleLogout} className="btn btn-outline" style={{ color: "#ef4444" }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", borderBottom: "1px solid rgba(255,215,0,0.15)", overflowX: "auto" }}>
          {[
            ["products", "Accounts"],
            ["uc", "UC Prices"],
            ["xsuits", "Xsuit Gifts"],
            ["supercars", "Supercar Gifts"],
            ["reviews", "Reviews"],
            ["proofs", "Proofs"],
            ["payment_links", "🔗 Payment Links"]
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

                <div style={{ display: "grid", gap: "12px", padding: "12px", background: "rgba(255,215,0,0.05)", borderRadius: "10px", border: "1px solid rgba(255,215,0,0.12)" }}>
                  <div>
                    <label style={ls}>Primary Login</label>
                    <select className="input" value={productForm.primaryLogin} onChange={e => setProductForm({...productForm, primaryLogin: e.target.value})}>
                      {LOGIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ls}>Secondary Login</label>
                    <select className="input" value={productForm.secondaryLogin} onChange={e => setProductForm({...productForm, secondaryLogin: e.target.value})}>
                      <option value="null">None (Single Login)</option>
                      {LOGIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ls}>Unlink Guarantee</label>
                    <select className="input" value={productForm.unlinkGuarantee} onChange={e => setProductForm({...productForm, unlinkGuarantee: e.target.value})}>
                      {GUARANTEE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
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
                          primaryLogin: p.primary_login || "X",
                          secondaryLogin: p.secondary_login || "null",
                          unlinkGuarantee: p.unlink_guarantee || "Single & Safe Login"
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
          <div style={{ display: "grid", gap: "24px" }}>
            
            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
              {[
                { label: "Total", value: reviews.length, color: "var(--gold)" },
                { label: "Approved", value: reviews.filter(r => r.status === "approved").length, color: "#22c55e" },
                { label: "Pending", value: reviews.filter(r => r.status === "pending").length, color: "#f59e0b" },
                { label: "Rejected", value: reviews.filter(r => r.status === "rejected").length, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ background: "var(--card)", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Review List */}
            <div style={{ background: "var(--card)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Review Management</h3>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Reviews submitted by buyers • No manual entries</span>
              </div>
              <div style={{ maxHeight: "700px", overflowY: "auto" }}>
                {reviews.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--muted)" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                    <p>No buyer reviews yet. Share your review link after each successful deal.</p>
                  </div>
                ) : reviews.map(r => (
                  <div key={r.id} style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "20px", alignItems: "start" }}>
                    {/* Thumbnail */}
                    <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {r.image_url ? (
                        <a href={r.image_url} target="_blank" rel="noreferrer">
                          <img src={r.image_url} alt="Lobby" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </a>
                      ) : (
                        <span style={{ fontSize: "10px", color: "var(--muted)" }}>No img</span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700 }}>{r.name}</span>
                        <span style={{ display: "flex", gap: "2px" }}>
                          {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < r.stars ? "var(--gold)" : "transparent"} color="var(--gold)" />)}
                        </span>
                        <span style={{
                          fontSize: "10px", fontWeight: 800, padding: "2px 8px", borderRadius: "100px",
                          background: r.status === "approved" ? "rgba(34,197,94,0.1)" : r.status === "rejected" ? "rgba(239,68,68,0.1)" : "rgba(251,191,36,0.1)",
                          color: r.status === "approved" ? "#22c55e" : r.status === "rejected" ? "#ef4444" : "#f59e0b",
                          border: `1px solid ${r.status === "approved" ? "rgba(34,197,94,0.3)" : r.status === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(251,191,36,0.3)"}`,
                          textTransform: "uppercase"
                        }}>
                          {r.status === "approved" ? "✓ Approved" : r.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                        </span>
                        {r.uid && <span style={{ fontSize: "10px", color: "var(--muted)" }}>Firebase UID: {r.uid.slice(0, 10)}...</span>}
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.6, marginBottom: "6px" }}>{r.text}</p>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                        Submitted {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {r.email && ` • ${r.email}`}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                      {r.status !== "approved" && (
                        <button onClick={() => approveReview(r.id)} className="btn btn-gold" style={{ padding: "6px 14px", fontSize: "11px" }}>Approve</button>
                      )}
                      {r.status !== "rejected" && (
                        <button onClick={() => rejectReview(r.id)} className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "11px", color: "#ef4444", borderColor: "#ef4444" }}>Reject</button>
                      )}
                      <button onClick={() => deleteReview(r.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "11px" }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROOFS TAB */}
        {tab === "proofs" && (() => {
          const MONTHS_2026 = ["January 2026","February 2026","March 2026","April 2026","May 2026","June 2026","July 2026","August 2026","September 2026","October 2026","November 2026","December 2026"];
          const grouped = MONTHS_2026.reduce((acc, m) => { acc[m] = proofs.filter(p => p.month === m); return acc; }, {});
          return (
            <div style={{ display: "grid", gap: "24px" }}>

              {/* Upload Panel */}
              <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><Camera size={18}/> Upload New Proof</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "end" }}>
                  <div>
                    <label style={sl}>Title</label>
                    <input className="input" placeholder="e.g. Payment Proof, Deal Feedback" value={proofForm.title} onChange={e => setProofForm({...proofForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label style={sl}>Month</label>
                    <select className="input" value={proofForm.month} onChange={e => setProofForm({...proofForm, month: e.target.value})}>
                      {MONTHS_2026.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={sl}>Image</label>
                    <div style={{ border: "2px dashed var(--border-gold)", padding: "12px 16px", borderRadius: "8px", textAlign: "center", cursor: "pointer", background: "rgba(255,215,0,0.02)" }}>
                      {proofImage ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "var(--green)" }}>✓ {proofImage.name.slice(0, 20)}...</span>
                          <button onClick={() => setProofImage(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}>×</button>
                        </div>
                      ) : (
                        <label style={{ cursor: "pointer" }}>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Click to choose file</div>
                          <input type="file" accept="image/*" hidden onChange={e => setProofImage(e.target.files[0])} />
                        </label>
                      )}
                    </div>
                  </div>
                  <div>
                    <button onClick={saveProof} disabled={savingProof} className="btn btn-gold w-full" style={{ padding: "12px" }}>
                      {savingProof ? "Uploading to Cloudinary..." : "Upload Proof"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Grouped Gallery */}
              {MONTHS_2026.filter(m => grouped[m].length > 0).length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)", background: "var(--card)", borderRadius: "14px" }}>
                  <Camera size={40} style={{ opacity: 0.3, marginBottom: "16px" }} />
                  <p>No proofs uploaded yet. Use the upload panel above to get started.</p>
                </div>
              ) : (
                MONTHS_2026.map(month => {
                  const monthProofs = grouped[month];
                  if (monthProofs.length === 0) return null;
                  return (
                    <div key={month} style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontWeight: 800, color: "var(--gold)" }}>{month}</h3>
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{monthProofs.length} proof{monthProofs.length > 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", padding: "16px" }}>
                        {monthProofs.map(p => (
                          <div key={p.id} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)" }}>
                            <div style={{ aspectRatio: "3/4" }}>
                              <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ fontSize: "11px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title || "Proof"}</div>
                              <button onClick={() => deleteProof(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px", flexShrink: 0 }}><Trash2 size={13}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })()}

        {/* UC PRICES TAB */}
        {tab === "uc" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><Coins size={18}/> {ucEditId ? "Edit UC Pack" : "Add UC Pack"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>UC Amount</label>
                  <input className="input" placeholder="e.g. 8,000 UC" value={ucForm.uc_amount} onChange={e => setUcForm({...ucForm, uc_amount: e.target.value})} />
                </div>
                <div>
                  <label style={sl}>Bonus UC</label>
                  <input className="input" placeholder="e.g. 60" type="number" value={ucForm.bonus_uc} onChange={e => setUcForm({...ucForm, bonus_uc: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={sl}>Market Price (₹)</label>
                    <input className="input" placeholder="e.g. 7,500" type="number" value={ucForm.market_price} onChange={e => setUcForm({...ucForm, market_price: e.target.value})} />
                  </div>
                  <div>
                    <label style={sl}>Our Offer Price (₹)</label>
                    <input className="input" placeholder="e.g. 6,500" type="number" value={ucForm.offer_price} onChange={e => setUcForm({...ucForm, offer_price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={sl}>Purchase Method</label>
                  <select className="input" value={ucForm.method} onChange={e => setUcForm({...ucForm, method: e.target.value})}>
                    <option value="view_login">View Login UC (Facebook / X)</option>
                    <option value="character_id">Character ID UC (In-game ID)</option>
                  </select>
                </div>
                <div>
                  <label style={sl}>Status</label>
                  <select className="input" value={ucForm.status} onChange={e => setUcForm({...ucForm, status: e.target.value})}>
                    <option value="available">Available</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveUc} disabled={savingUc} className="btn btn-gold w-full">{ucEditId ? "Update Pack" : "Save Pack"}</button>
                  {ucEditId && <button onClick={() => { setUcEditId(null); setUcForm(EMPTY_UC); }} className="btn btn-outline">Cancel</button>}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ padding: "16px", fontWeight: 700, borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)" }}>UC Price List</div>
              {/* Market Demand Notice */}
              <div style={{ margin: "16px", padding: "12px 16px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: "10px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>💡</span>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(251,191,36,0.85)", lineHeight: 1.7 }}>
                  <strong>Note:</strong> UC prices fluctuate based on market demand and availability. Update prices regularly to reflect the current market rate.
                </p>
              </div>
              {ucPrices.map(u => (
                <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", opacity: u.status === 'sold_out' ? 0.6 : 1 }}>
                  <div>
                    <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {u.uc_amount}
                      {u.bonus_uc > 0 && <span style={{ fontSize: "10px", background: "var(--gold-dim)", color: "var(--gold)", padding: "2px 6px", borderRadius: "4px" }}>+{u.bonus_uc} Bonus</span>}
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: u.method === 'character_id' ? "rgba(249,115,22,0.1)" : "rgba(59,130,246,0.1)", color: u.method === 'character_id' ? "#f97316" : "#60a5fa", fontWeight: 700 }}>
                        {u.method === 'character_id' ? "🎮 Char ID" : "🔑 View Login"}
                      </span>
                      {u.status === 'sold_out' && <span style={{ fontSize: "10px", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "2px 6px", borderRadius: "4px" }}>SOLD OUT</span>}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                      Market: <span style={{ textDecoration: "line-through" }}>₹{u.market_price}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ color: "var(--green)", fontWeight: 700 }}>₹{u.offer_price}</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => { 
                        setUcEditId(u.id); 
                        setUcForm({ 
                          uc_amount: u.uc_amount, 
                          bonus_uc: u.bonus_uc || "",
                          market_price: u.market_price, 
                          offer_price: u.offer_price,
                          status: u.status || "available",
                          method: u.method || "view_login"
                        }); 
                      }} 
                        style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}><Pencil size={14}/></button>
                      <button onClick={() => deleteUc(u.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* XSUIT GIFTS TAB */}
        {tab === "xsuits" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><Zap size={18}/> {xsuitEditId ? "Edit Xsuit" : "Add Xsuit Gift"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>Xsuit Name</label>
                  <input className="input" placeholder="e.g. Poseidon X-Suit" value={xsuitForm.name} onChange={e => setXsuitForm({...xsuitForm, name: e.target.value})} />
                </div>
                <div>
                  <label style={sl}>Price (₹)</label>
                  <input className="input" placeholder="e.g. 15000" type="number" value={xsuitForm.price} onChange={e => setXsuitForm({...xsuitForm, price: e.target.value})} />
                </div>
                
                <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                  {xsuitImage ? (
                    <div style={{ fontSize: "12px", color: "var(--green)" }}>{xsuitImage.name} selected</div>
                  ) : (
                    <label style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "12px" }}>{xsuitForm.image_url ? "Change Image" : "Click to Upload Xsuit Image"}</div>
                      <input type="file" hidden onChange={e => setXsuitImage(e.target.files[0])} />
                    </label>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveXsuit} disabled={savingXsuit} className="btn btn-gold w-full">{xsuitEditId ? "Update Xsuit" : "Save Xsuit"}</button>
                  {xsuitEditId && <button onClick={() => { setXsuitEditId(null); setXsuitForm(EMPTY_XSUIT); setXsuitImage(null); }} className="btn btn-outline">Cancel</button>}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ padding: "16px", fontWeight: 700, borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)" }}>Xsuit Gift List</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", padding: "12px" }}>
                {xsuits.map(x => (
                  <div key={x.id} style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "var(--bg2)" }}>
                    <div style={{ aspectRatio: "1/1", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {x.image_url ? (
                        <img src={x.image_url} alt={x.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Zap size={30} style={{ opacity: 0.2 }} />
                      )}
                      <div style={{ position: "absolute", top: "5px", right: "5px", display: "flex", gap: "4px" }}>
                        <button onClick={() => { setXsuitEditId(x.id); setXsuitForm(x); }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Pencil size={12}/></button>
                        <button onClick={() => deleteXsuit(x.id)} style={{ background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Trash2 size={12}/></button>
                      </div>
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>{x.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--gold)", fontWeight: 800 }}>₹{x.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPERCAR GIFTS TAB */}
        {tab === "supercars" && (
          <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
            <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
              <h3 style={{ marginBottom: "20px" }}><Car size={18}/> {carEditId ? "Edit Supercar" : "Add Supercar Gift"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>Supercar Name</label>
                  <input className="input" placeholder="e.g. Lamborghini Aventador" value={carForm.name} onChange={e => setCarForm({...carForm, name: e.target.value})} />
                </div>
                <div>
                  <label style={sl}>Price (₹)</label>
                  <input className="input" placeholder="e.g. 15000" type="number" value={carForm.price} onChange={e => setCarForm({...carForm, price: e.target.value})} />
                </div>
                <div>
                  <label style={sl}>Card Type</label>
                  <select className="input" value={carForm.type} onChange={e => setCarForm({...carForm, type: e.target.value})}>
                    <option value="One-Card">One-Card</option>
                    <option value="Two-Card">Two-Card</option>
                    <option value="Three-Card">Three-Card</option>
                  </select>
                </div>

                <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                  {carImage ? (
                    <div style={{ fontSize: "12px", color: "var(--green)" }}>{carImage.name} selected</div>
                  ) : (
                    <label style={{ cursor: "pointer" }}>
                      <div style={{ fontSize: "12px" }}>{carForm.image_url ? "Change Image" : "Click to Upload Supercar Image"}</div>
                      <input type="file" hidden onChange={e => setCarImage(e.target.files[0])} />
                    </label>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveCar} disabled={savingCar} className="btn btn-gold w-full">{carEditId ? "Update Car" : "Save Car"}</button>
                  {carEditId && <button onClick={() => { setCarEditId(null); setCarForm(EMPTY_CAR); setCarImage(null); }} className="btn btn-outline">Cancel</button>}
                </div>
              </div>
            </div>
            <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
              <div style={{ padding: "16px", fontWeight: 700, borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)" }}>Supercar Gift List</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", padding: "12px" }}>
                {supercars.map(c => (
                  <div key={c.id} style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "var(--bg2)" }}>
                    <div style={{ aspectRatio: "1/1", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Car size={30} style={{ opacity: 0.2 }} />
                      )}
                      <div style={{ position: "absolute", top: "5px", right: "5px", display: "flex", gap: "4px" }}>
                        <button onClick={() => { setCarEditId(c.id); setCarForm(c); }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Pencil size={12}/></button>
                        <button onClick={() => deleteCar(c.id)} style={{ background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Trash2 size={12}/></button>
                      </div>
                      <div style={{ position: "absolute", bottom: "5px", left: "5px", background: "var(--gold)", color: "#000", fontSize: "9px", fontWeight: 900, padding: "2px 6px", borderRadius: "4px" }}>
                        {c.type}
                      </div>
                    </div>
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>{c.name}</div>
                      <div style={{ fontSize: "14px", color: "var(--gold)", fontWeight: 800 }}>₹{c.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* PAYMENT LINKS TAB */}
        {tab === "payment_links" && (() => {
          const activeLinks = paymentLinks.filter(l => l.status === "active");
          const revokedLinks = paymentLinks.filter(l => l.status !== "active");
          const siteBase = window.location.origin;
          return (
            <div style={{ display: "grid", gap: "24px" }}>

              {/* Generator Form */}
              <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
                  <span style={{ fontSize: "20px" }}>🔗</span> Generate Payment Link
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={sl}>Customer Name</label>
                    <input className="input" placeholder="e.g. Ravi Kumar" value={paymentForm.customer_name} onChange={e => setPaymentForm({...paymentForm, customer_name: e.target.value})} />
                  </div>
                  <div>
                    <label style={sl}>Amount (₹) *</label>
                    <input className="input" type="number" placeholder="e.g. 4999" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} />
                  </div>
                  <div>
                    <label style={sl}>Expires In</label>
                    <select className="input" value={paymentForm.expires_in} onChange={e => setPaymentForm({...paymentForm, expires_in: e.target.value})}>
                      <option value="6">6 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                      <option value="72">72 Hours</option>
                    </select>
                  </div>
                  <div>
                    <label style={sl}>Note (Optional)</label>
                    <input className="input" placeholder="e.g. BGMI Account #XYZ" value={paymentForm.note} onChange={e => setPaymentForm({...paymentForm, note: e.target.value})} />
                  </div>
                  <div>
                    <label style={sl}>Access PIN / Password</label>
                    <input className="input" placeholder="9025" value={paymentForm.pin} onChange={e => setPaymentForm({...paymentForm, pin: e.target.value})} />
                  </div>
                </div>
                <button
                  onClick={generatePaymentLink}
                  disabled={generatingLink}
                  className="btn btn-gold"
                  style={{ marginTop: "18px", padding: "12px 32px" }}
                >
                  {generatingLink ? "Generating..." : "⚡ Generate Payment Link"}
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px" }}>
                {[
                  { label: "Total", value: paymentLinks.length, color: "var(--gold)" },
                  { label: "Active", value: activeLinks.length, color: "#22c55e" },
                  { label: "Revoked", value: revokedLinks.length, color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} style={{ background: "var(--card)", borderRadius: "12px", padding: "18px", textAlign: "center", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Active Links Table */}
              <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(34,197,94,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 800 }}>✅ Active Links</h3>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{activeLinks.length} link{activeLinks.length !== 1 ? "s" : ""}</span>
                </div>
                {activeLinks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)", fontSize: "14px" }}>No active links. Generate one above.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead style={{ background: "rgba(255,215,0,0.04)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px", color: "var(--muted)" }}>
                        <tr>
                          <th style={{ padding: "12px 16px" }}>Link ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Note</th>
                          <th>Expires</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeLinks.map(link => {
                          const fullUrl = `${siteBase}/pay/${link.id}`;
                          const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
                          return (
                            <tr key={link.id} style={{ borderBottom: "1px solid var(--border)", opacity: isExpired ? 0.6 : 1 }}>
                              <td style={{ padding: "13px 16px", fontWeight: 700, fontFamily: "monospace", fontSize: "12px", color: "var(--gold)" }}>{link.id}</td>
                              <td>{link.customer_name || "—"}</td>
                              <td><strong style={{ color: "var(--green)" }}>₹{Number(link.amount).toLocaleString("en-IN")}</strong></td>
                              <td style={{ color: "var(--muted)", fontSize: "12px" }}>{link.note || "—"}</td>
                              <td style={{ fontSize: "11px", color: isExpired ? "#ef4444" : "var(--muted)" }}>
                                {link.expires_at ? new Date(link.expires_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "No expiry"}
                                {isExpired && <span style={{ marginLeft: "4px", fontWeight: 800 }}>(EXPIRED)</span>}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Link copied!"); }}
                                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", background: "rgba(255,215,0,0.1)", color: "var(--gold)", border: "1px solid rgba(255,215,0,0.2)", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                                  >
                                    <Copy size={12} /> Copy
                                  </button>
                                  <a
                                    href={fullUrl} target="_blank" rel="noreferrer"
                                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                                  >
                                    Open
                                  </a>
                                  <button
                                    onClick={() => revokePaymentLink(link.id)}
                                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "7px", background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}
                                  >
                                    Revoke
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Revoked / Old Links */}
              {revokedLinks.length > 0 && (
                <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(239,68,68,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ef4444" }}>🚫 Revoked / Expired Links</h3>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>{revokedLinks.length} records</span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "left", opacity: 0.7 }}>
                      <thead style={{ background: "rgba(239,68,68,0.04)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px", color: "var(--muted)" }}>
                        <tr>
                          <th style={{ padding: "12px 16px" }}>Link ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revokedLinks.map(link => (
                          <tr key={link.id} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px" }}>{link.id}</td>
                            <td>{link.customer_name || "—"}</td>
                            <td>₹{Number(link.amount).toLocaleString("en-IN")}</td>
                            <td><span style={{ fontSize: "10px", background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "2px 8px", borderRadius: "4px", fontWeight: 800, textTransform: "uppercase" }}>{link.status}</span></td>
                            <td>
                              <button onClick={() => deletePaymentLink(link.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          );
        })()}

        {/* Transaction Panel Auth Modal */}
        {showTxAuth && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10000, padding: "20px"
          }}>
            <div className="card" style={{ maxWidth: "400px", width: "100%", padding: "40px 30px", textAlign: "center", border: "1px solid var(--border-gold)" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--gold-dim)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--gold)" }}>
                <DollarSign size={30} />
              </div>
              <h2 style={{ fontFamily: "var(--font-h)", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Secure Access</h2>
              <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "24px" }}>Enter the management PIN to access the Transaction Panel.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const fullPin = txPin.join("");
                if (loginTx(fullPin)) {
                  setShowTxAuth(false);
                  setTxPin(["", "", "", ""]);
                  navigate("/transactions");
                } else {
                  toast.error("Invalid PIN. Access Denied.");
                  setTxPin(["", "", "", ""]);
                  txInputRefs[0].current.focus();
                }
              }}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
                  {txPin.map((digit, i) => (
                    <input
                      key={i}
                      ref={txInputRefs[i]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleTxPinChange(e, i)}
                      onKeyDown={e => handleTxPinKeyDown(e, i)}
                      className="input"
                      style={{
                        width: "50px", height: "60px", textAlign: "center", fontSize: "24px", fontWeight: 700,
                        background: "rgba(255,215,0,0.05)", borderColor: digit ? "var(--gold)" : "var(--border-gold)"
                      }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" onClick={() => setShowTxAuth(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" disabled={txPin.join("").length !== 4} className="btn btn-gold" style={{ flex: 1 }}>Unlock</button>
                </div>
              </form>
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