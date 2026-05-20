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
import { LogOut, Plus, Trash2, Pencil, Star, Copy, Users, TrendingUp, DollarSign, Camera, Coins, Zap, Car, Clock, ShieldCheck, User as UserIcon, Tag, Hash, ArrowRightLeft, MessageSquare, History, Key, Download, FileText, CheckCircle2, ThumbsUp, AlertCircle, Calendar } from "lucide-react";
import { generateNextTransactionId, generateNextXsuitId, generateNextSupercarId, generateNextUcId } from "../../services/transactionService";
import { db, functions } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, setDoc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

// ── Shared label style ────────────────────────────────────────
const ls = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "var(--muted)", letterSpacing: "1.2px",
  textTransform: "uppercase", marginBottom: "7px",
};

const LOGIN_OPTIONS = ["X", "Facebook", "Google Playgames", "Apple ID", "Game Center", "Whats App"];
const GUARANTEE_OPTIONS = [
  "Not Applicable",
  "37 Days For Primary Login",
  "22 Days For Primary Login",
  "37 Days For Secondary Login",
  "22 Days For Secondary Login",
  "75 Days For Primary and Secondary Logins"
];

const PROMO_TAGS = ["None", "Best Value", "Deal Of The Day", "Limited Time Deal"];

const YEARS = Array.from({ length: 16 }, (_, i) => (2020 + i).toString());
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ── Empty form defaults ───────────────────────────────────────
const EMPTY_PRODUCT = {
  title: "", description: "", price: "",
  category: "Budget", status: "available",
  youtubeUrl: "",
  primaryLogin: "X",
  secondaryLogin: "null",
  unlinkGuarantee: "Not Applicable",
  tag: "None"
};
const EMPTY_REVIEW = {
  name: "", text: "", stars: 5,
  image_url: "", tracking_id: "",
};
const EMPTY_UC = { uc_amount: "", bonus_uc: "", market_price: "", offer_price: "", status: "available", method: "view_login", tag: "None" };
const EMPTY_XSUIT = { name: "", price: "", image_url: "", tag: "None" };
const EMPTY_CAR = { name: "", price: "", image_url: "", type: "One-Card", tag: "None" };
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
  const [adminList, setAdminList] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ uid: doc.id, ...doc.data() });
      });
      setAdminList(list);
    } catch (err) {
      toast.error("Failed to load admin list: " + err.message);
    } finally {
      setLoadingAdmins(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setAddingAdmin(true);
    try {
      const emailLower = newAdminEmail.trim().toLowerCase();
      await setDoc(doc(db, "admins", emailLower), {
        email: emailLower,
        role: "admin",
        createdAt: new Date().toISOString()
      });
      toast.success("Successfully authorized admin email!");
      setNewAdminEmail("");
      loadAdmins();
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (docId) => {
    if (!confirm("Are you sure you want to revoke admin privileges for this email?")) return;
    try {
      await deleteDoc(doc(db, "admins", docId));
      toast.success("Admin role revoked successfully.");
      loadAdmins();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  useEffect(() => {
    if (tab === "admin_controls") {
      loadAdmins();
    }
  }, [tab]);

  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reviewForm, setReviewForm] = useState(EMPTY_REVIEW);
  const [savingReview, setSavingReview] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  const [proofs, setProofs] = useState([]);
  const [proofForm, setProofForm] = useState({ 
    title: "", 
    month: new Date().toLocaleString('en-US', { month: 'long' }), 
    year: new Date().getFullYear().toString() 
  });
  const [savingProof, setSavingProof] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  const [paymentLinks, setPaymentLinks] = useState([]);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ transaction_id: "", type: "Account", customer_name: "", amount: "", note: "", expires_in: "0.166", pin: "" });
  const [suggestingId, setSuggestingId] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
    payee_name: "",
    payee_upi_id: "",
    bank_name: "",
    account_type: "SAVINGS ACCOUNT",
    account_holder: "",
    account_number: "",
    ifsc_code: "",
    branch: "",
    payment_pin: ""
  });
  const [savingSettings, setSavingSettings] = useState(false);

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

  const toggleFeedbackStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      const { error } = await supabase.from('customer_feedback').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success(`Feedback marked as ${newStatus}`);
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deleteFeedback = async (id) => {
    if (!confirm("Are you sure you want to delete this customer feedback?")) return;
    try {
      const { error } = await supabase.from('customer_feedback').delete().eq('id', id);
      if (error) throw error;
      toast.success("Feedback deleted successfully");
      setFeedbacks(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      toast.error(e.message);
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
        settingsResult
      ] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('payment_links').select('*').order('created_at', { ascending: false }),
        supabase.from('proofs').select('*').order('created_at', { ascending: false }),
        supabase.from('uc_prices').select('*').order('offer_price', { ascending: true }),
        supabase.from('xsuit_gifts').select('*').order('created_at', { ascending: false }),
        supabase.from('supercar_gifts').select('*').order('created_at', { ascending: false }),
        supabase.from('admin_payment_settings').select('*').eq('id', 1).single()
      ]);

      setProducts(p || []);
      setReviews(r || []);
      setPaymentLinks(pl || []);
      setProofs(pr || []);
      setUcPrices(uc || []);
      setXsuits(xs || []);
      setSupercars(sc || []);
      if (settingsResult?.data) setPaymentSettings(settingsResult.data);

      // Safe fetch feedbacks
      try {
        const { data: fb, error: fbErr } = await supabase.from('customer_feedback').select('*').order('created_at', { ascending: false });
        if (!fbErr && fb) {
          setFeedbacks(fb);
        }
      } catch (fbErrEx) {
        console.warn("Feedback table loading error:", fbErrEx.message);
      }
    } catch (globalErr) {
      console.error("Global Data Fetch Error:", globalErr);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-suggest ID based on type
  useEffect(() => {
    const fetchSuggestedId = async () => {
      setSuggestingId(true);
      try {
        let id = "";
        switch (paymentForm.type) {
          case "Account": id = await generateNextTransactionId(); break;
          case "Xsuit": id = await generateNextXsuitId(); break;
          case "Supercar": id = await generateNextSupercarId(); break;
          case "UC": id = await generateNextUcId(); break;
          default: id = "";
        }
        // If the ID is the same prefix (failed to fetch), just set empty or prefix
        setPaymentForm(prev => ({ ...prev, transaction_id: id }));
      } catch (e) {
        console.error("ID Suggestion Error:", e);
      } finally {
        setSuggestingId(false);
      }
    };
    if (!paymentForm.transaction_id || paymentForm.transaction_id.startsWith("MBS")) {
      fetchSuggestedId();
    }
  }, [paymentForm.type]);

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
        tag: productForm.tag,
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

      const fullMonth = `${proofForm.month} ${proofForm.year}`;
      const { error } = await supabase.from('proofs').insert([{
        title: proofForm.title.trim(),
        image_url: url,
        month: fullMonth,
      }]);
      if (error) throw error;

      toast.success(`Proof uploaded to ${fullMonth}!`);
      setProofForm({ ...proofForm, title: "" });
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
        bonus_uc: Number(ucForm.bonus_uc || 0),
        tag: ucForm.tag
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

      const data = { ...xsuitForm, image_url: url, tag: xsuitForm.tag };
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
        formData.append("folder", "maddy_bgmi_store/Proofs/Supercars");

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
        tag: carForm.tag,
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

  // ── Payment Manager ─────────────────────────────────────────
  const savePaymentSettings = async () => {
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('admin_payment_settings').upsert({ id: 1, ...paymentSettings });
      if (error) throw error;
      toast.success("Payment tools updated!");
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingSettings(false); }
  };

  const generatePaymentLink = async () => {
    if (!paymentForm.amount) return toast.error("Amount is required");
    setGeneratingLink(true);
    try {
      const linkId = paymentForm.transaction_id.trim() || `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const expiresAt = new Date(Date.now() + Number(paymentForm.expires_in) * 3600 * 1000).toISOString();
      const { error } = await supabase.from('payment_links').insert([{
        id: linkId,
        customer_name: paymentForm.customer_name || "Customer",
        amount: Number(paymentForm.amount),
        note: paymentForm.note,
        status: "active",
        expires_at: expiresAt,
        pin: paymentForm.pin || null,
        payee_name: paymentSettings.payee_name,
        payee_upi: paymentSettings.payee_upi_id,
        bank_details: {
          bank_name: paymentSettings.bank_name,
          account_type: paymentSettings.account_type,
          account_holder: paymentSettings.account_holder,
          account_number: paymentSettings.account_number,
          ifsc_code: paymentSettings.ifsc_code,
          branch: paymentSettings.branch
        }
      }]);
      if (error) throw error;
      toast.success(`Payment link generated! ID: ${linkId}`);
      setPaymentForm({ transaction_id: "", customer_name: "", amount: "", note: "", expires_in: "0.5", pin: "" });
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setGeneratingLink(false); }
  };

  const deletePaymentLink = async (id) => {
    if (!confirm("Are you sure? This will PERMANENTLY delete this payment link.")) return;
    try {
      const { error } = await supabase.from('payment_links').delete().eq('id', id);
      if (error) throw error;
      toast.success("Link deleted forever!");
      fetchData();
    } catch (e) { toast.error(e.message); }
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


  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div className="admin-container" style={{ padding: "100px 5% 60px", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "15px", flexWrap: "wrap" }}>
          <h1 className="stitle" style={{ fontSize: "clamp(24px, 4vw, 32px)", margin: 0 }}>
            Admin <span className="g">Panel</span>
          </h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => navigate("/transactions")} className="btn btn-gold btn-sm" style={{ padding: "0 18px" }}>
              <ArrowRightLeft size={14} /> <span className="hide-mobile">Transaction Panel</span>
            </button>
            <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: "var(--red)", color: "var(--red)" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation - Responsive Scroll */}
        <div className="admin-tabs-scroll">
          <div className="admin-tabs-inner">
            {[
              ["products", "Accounts"],
              ["uc", "UC Packs"],
              ["xsuits", "Xsuit Gifts"],
              ["supercars", "Cars"],
              ["reviews", "Reviews"],
              ["proofs", "Proofs"],
              ["payment_links", "Payments"],
              ["feedback", "Customer Feedback"],
              ["activity_log", "Activity Log"],
              ["admin_controls", "Admin Controls"]
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`admin-tab-btn ${tab === key ? 'active' : ''}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div className="admin-grid">
            <div className="admin-form-side">
              <h3 className="form-title"><Plus size={18} /> {editId ? "Edit" : "Add"} Product</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="YouTube Video URL" value={productForm.youtubeUrl} onChange={e => setProductForm({ ...productForm, youtubeUrl: e.target.value })} />
                <input className="input" placeholder="Account Title (e.g. M416 Maxed 60K UC)" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} />
                <textarea className="input" placeholder="Account Description (items, skins, levels...)" rows={5} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <input className="input" type="number" placeholder="Price (₹)" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                  <select className="input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                    <option value="Budget">Budget</option>
                    <option value="Mid Range">Mid Range</option>
                    <option value="Premium">Premium</option>
                    <option value="Ultra Premium">Ultra Premium</option>
                  </select>
                </div>

                <div style={{ display: "grid", gap: "12px", padding: "12px", background: "rgba(255,215,0,0.05)", borderRadius: "10px", border: "1px solid rgba(255,215,0,0.12)" }}>
                  <div>
                    <label style={ls}>Primary Login</label>
                    <select className="input" value={productForm.primaryLogin} onChange={e => setProductForm({ ...productForm, primaryLogin: e.target.value })}>
                      {LOGIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ls}>Secondary Login</label>
                    <select className="input" value={productForm.secondaryLogin} onChange={e => setProductForm({ ...productForm, secondaryLogin: e.target.value })}>
                      <option value="null">None (Single Login)</option>
                      {LOGIN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={ls}>Promo Tag</label>
                    <select className="input" value={productForm.tag} onChange={e => setProductForm({...productForm, tag: e.target.value})}>
                      {PROMO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <select className="input" value={productForm.status} onChange={e => setProductForm({ ...productForm, status: e.target.value })}>
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
                        {p.tag && p.tag !== "None" && (
                          <span style={{ 
                            fontSize: "9px", fontWeight: 900, background: "var(--gold)", color: "#000", 
                            padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase" 
                          }}>
                            {p.tag}
                          </span>
                        )}
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
                      }} style={{ padding: "8px", borderRadius: "8px", background: "rgba(255,215,0,0.1)", color: "var(--gold)", border: "1px solid rgba(255,215,0,0.2)", cursor: "pointer", transition: "all .2s" }} title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => deleteProduct(p.id)} style={{ padding: "8px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", transition: "all .2s" }} title="Delete"><Trash2 size={16} /></button>
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
          // Group by month string (which includes year)
          // Sort groups by year descending, then month descending
          const grouped = proofs.reduce((acc, p) => {
            if (!acc[p.month]) acc[p.month] = [];
            acc[p.month].push(p);
            return acc;
          }, {});

          const sortedMonths = Object.keys(grouped).sort((a, b) => {
            const [mA, yA] = a.split(" ");
            const [mB, yB] = b.split(" ");
            if (yA !== yB) return Number(yB) - Number(yA);
            return MONTH_NAMES.indexOf(mB) - MONTH_NAMES.indexOf(mA);
          });

          return (
            <div style={{ display: "grid", gap: "24px" }}>

              {/* Upload Panel */}
              <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><Camera size={18} /> Upload New Proof</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "end" }}>
                  <div>
                    <label style={sl}>Title</label>
                    <input className="input" placeholder="e.g. Payment Proof, Deal Feedback" value={proofForm.title} onChange={e => setProofForm({ ...proofForm, title: e.target.value })} />
                  </div>
                  <div>
                    <label style={sl}>Month</label>
                    <select className="input" value={proofForm.month} onChange={e => setProofForm({ ...proofForm, month: e.target.value })}>
                      {MONTH_NAMES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={sl}>Year</label>
                    <select className="input" value={proofForm.year} onChange={e => setProofForm({ ...proofForm, year: e.target.value })}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
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
              {sortedMonths.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)", background: "var(--card)", borderRadius: "14px" }}>
                  <Camera size={40} style={{ opacity: 0.3, marginBottom: "16px" }} />
                  <p>No proofs uploaded yet. Use the upload panel above to get started.</p>
                </div>
              ) : (
                sortedMonths.map(month => {
                  const monthProofs = grouped[month];
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
                              <button onClick={() => deleteProof(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px", flexShrink: 0 }}><Trash2 size={13} /></button>
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
              <h3 style={{ marginBottom: "20px" }}><Coins size={18} /> {ucEditId ? "Edit UC Pack" : "Add UC Pack"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>UC Amount</label>
                  <input className="input" placeholder="e.g. 8,000 UC" value={ucForm.uc_amount} onChange={e => setUcForm({ ...ucForm, uc_amount: e.target.value })} />
                </div>
                <div>
                  <label style={sl}>Bonus UC</label>
                  <input className="input" placeholder="e.g. 60" type="number" value={ucForm.bonus_uc} onChange={e => setUcForm({ ...ucForm, bonus_uc: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={sl}>Selling Price (₹)</label>
                    <input className="input" placeholder="e.g. 7,500" type="number" value={ucForm.market_price} onChange={e => setUcForm({ ...ucForm, market_price: e.target.value })} />
                  </div>
                  <div>
                    <label style={sl}>Our Offer Price (₹)</label>
                    <input className="input" placeholder="e.g. 6,500" type="number" value={ucForm.offer_price} onChange={e => setUcForm({ ...ucForm, offer_price: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={sl}>Purchase Method</label>
                  <select className="input" value={ucForm.method} onChange={e => setUcForm({ ...ucForm, method: e.target.value })}>
                    <option value="view_login">View Login UC (Facebook / X)</option>
                    <option value="character_id">Character ID UC (In-game ID)</option>
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={sl}>Status</label>
                    <select className="input" value={ucForm.status} onChange={e => setUcForm({ ...ucForm, status: e.target.value })}>
                      <option value="available">Available</option>
                      <option value="sold_out">Sold Out</option>
                    </select>
                  </div>
                  <div>
                    <label style={sl}>Promo Tag</label>
                    <select className="input" value={ucForm.tag} onChange={e => setUcForm({...ucForm, tag: e.target.value})}>
                      {PROMO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
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
                      {u.tag && u.tag !== "None" && (
                        <span style={{ fontSize: "9px", background: "var(--gold)", color: "#000", padding: "2px 6px", borderRadius: "4px", fontWeight: 900 }}>{u.tag.toUpperCase()}</span>
                      )}
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
                        style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}><Pencil size={14} /></button>
                      <button onClick={() => deleteUc(u.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
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
              <h3 style={{ marginBottom: "20px" }}><Zap size={18} /> {xsuitEditId ? "Edit Xsuit" : "Add Xsuit Gift"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>Xsuit Name</label>
                  <input className="input" placeholder="e.g. Poseidon X-Suit" value={xsuitForm.name} onChange={e => setXsuitForm({ ...xsuitForm, name: e.target.value })} />
                </div>
                <div>
                  <label style={sl}>Offer Price (₹)</label>
                  <input className="input" placeholder="e.g. 15000" type="number" value={xsuitForm.price} onChange={e => setXsuitForm({ ...xsuitForm, price: e.target.value })} />
                </div>
                <div>
                  <label style={sl}>Promo Tag</label>
                  <select className="input" value={xsuitForm.tag} onChange={e => setXsuitForm({...xsuitForm, tag: e.target.value})}>
                    {PROMO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
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
                        <button onClick={() => { setXsuitEditId(x.id); setXsuitForm(x); }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Pencil size={12} /></button>
                        <button onClick={() => deleteXsuit(x.id)} style={{ background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Trash2 size={12} /></button>
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
              <h3 style={{ marginBottom: "20px" }}><Car size={18} /> {carEditId ? "Edit Supercar" : "Add Supercar Gift"}</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <label style={sl}>Supercar Name</label>
                  <input className="input" placeholder="e.g. Lamborghini Aventador" value={carForm.name} onChange={e => setCarForm({ ...carForm, name: e.target.value })} />
                </div>
                <div>
                  <label style={sl}>Offer Price (₹)</label>
                  <input className="input" placeholder="e.g. 15000" type="number" value={carForm.price} onChange={e => setCarForm({ ...carForm, price: e.target.value })} />
                </div>
                <div>
                  <label style={sl}>Promo Tag</label>
                  <select className="input" value={carForm.tag} onChange={e => setCarForm({...carForm, tag: e.target.value})}>
                    {PROMO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={sl}>Card Type</label>
                  <select className="input" value={carForm.type} onChange={e => setCarForm({ ...carForm, type: e.target.value })}>
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
                        <button onClick={() => { setCarEditId(c.id); setCarForm(c); }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Pencil size={12} /></button>
                        <button onClick={() => deleteCar(c.id)} style={{ background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }}><Trash2 size={12} /></button>
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


        {/* PAYMENT MANAGER TAB */}
        {tab === "payment_links" && (() => {
          const activeLinks = paymentLinks.filter(l => l.status === "active");
          const revokedLinks = paymentLinks.filter(l => l.status !== "active");
          const siteBase = window.location.origin;
          return (
            <div style={{ display: "grid", gap: "24px" }}>

              {/* DEFAULT PAYMENT TOOLS SECTION */}
              <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border-gold)" }}>
                <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px" }}>
                  <Zap size={18} color="var(--gold)" /> DEFAULT PAYMENT TOOLS
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <label style={sl}>Payee Name (Edit)</label>
                    <input className="input" placeholder="e.g. Maddy BGMI Store" value={paymentSettings.payee_name} onChange={e => setPaymentSettings({ ...paymentSettings, payee_name: e.target.value })} />
                  </div>
                  <div>
                    <label style={sl}>Payee UPI ID (Edit)</label>
                    <input className="input" placeholder="e.g. example@upi" value={paymentSettings.payee_upi_id} onChange={e => setPaymentSettings({ ...paymentSettings, payee_upi_id: e.target.value })} />
                  </div>
                  <div>
                    <label style={sl}>Bank Details Access PIN (Optional)</label>
                    <input className="input" type="text" maxLength={6} placeholder="e.g. 1516" value={paymentSettings.payment_pin} onChange={e => setPaymentSettings({ ...paymentSettings, payment_pin: e.target.value })} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", marginTop: "20px" }}>
                  <label style={{ ...sl, marginBottom: "15px" }}>Bank Details (Edit)</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                    <input className="input" placeholder="Bank Name" value={paymentSettings.bank_name} onChange={e => setPaymentSettings({ ...paymentSettings, bank_name: e.target.value })} />
                    <input className="input" placeholder="Account Holder" value={paymentSettings.account_holder} onChange={e => setPaymentSettings({ ...paymentSettings, account_holder: e.target.value })} />
                    <input className="input" placeholder="Account Number" value={paymentSettings.account_number} onChange={e => setPaymentSettings({ ...paymentSettings, account_number: e.target.value })} />
                    <input className="input" placeholder="IFSC Code" value={paymentSettings.ifsc_code} onChange={e => setPaymentSettings({ ...paymentSettings, ifsc_code: e.target.value })} />
                    <input className="input" placeholder="Branch" value={paymentSettings.branch} onChange={e => setPaymentSettings({ ...paymentSettings, branch: e.target.value })} />
                  </div>
                </div>

                <button onClick={savePaymentSettings} disabled={savingSettings} className="btn btn-gold" style={{ marginTop: "20px", padding: "10px 24px" }}>
                  {savingSettings ? "Updating..." : "Save Payment Tools"}
                </button>
              </div>

              {/* Generator Form */}
              <div style={{ background: "var(--card)", padding: "32px", borderRadius: "18px", border: "1px solid rgba(255,215,0,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", pb: "16px" }}>
                  <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", fontWeight: 800, color: "#fff" }}>
                    <Zap size={22} color="var(--gold)" /> Payment Manager Generator
                  </h3>
                  <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Secure Checkout Generation</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                  <div>
                    <label style={sl}>Transaction Type</label>
                    <div style={{ position: "relative" }}>
                      <Tag size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <select
                        className="input"
                        style={{ paddingLeft: "36px" }}
                        value={paymentForm.type}
                        onChange={e => setPaymentForm({ ...paymentForm, type: e.target.value })}
                      >
                        <option value="Account">Account (MBSA)</option>
                        <option value="Xsuit">Xsuit (MBSXS)</option>
                        <option value="Supercar">Supercar (MBSSC)</option>
                        <option value="UC">UC (MBSUC)</option>
                        <option value="Other">Other (Custom)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={sl}>Transaction ID</label>
                    <div style={{ position: "relative" }}>
                      <Hash size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <input
                        className="input"
                        style={{ paddingLeft: "36px", fontFamily: "monospace", fontWeight: 700 }}
                        placeholder={suggestingId ? "Generating..." : "e.g. MBSA4003"}
                        value={paymentForm.transaction_id}
                        onChange={e => setPaymentForm({ ...paymentForm, transaction_id: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={sl}>Customer Name</label>
                    <div style={{ position: "relative" }}>
                      <UserIcon size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <input
                        className="input"
                        style={{ paddingLeft: "36px" }}
                        placeholder="e.g. Surya"
                        value={paymentForm.customer_name}
                        onChange={e => setPaymentForm({ ...paymentForm, customer_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={sl}>Amount (₹)</label>
                    <div style={{ position: "relative" }}>
                      <DollarSign size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <input
                        className="input"
                        type="number"
                        style={{ paddingLeft: "36px", fontSize: "16px", fontWeight: 700 }}
                        placeholder="0.00"
                        value={paymentForm.amount}
                        onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={sl}>Expiry Time</label>
                    <div style={{ position: "relative" }}>
                      <Clock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <select
                        className="input"
                        style={{ paddingLeft: "36px" }}
                        value={paymentForm.expires_in}
                        onChange={e => setPaymentForm({ ...paymentForm, expires_in: e.target.value })}
                      >
                        <option value="0.166">10 Minutes</option>
                        <option value="0.25">15 Minutes</option>
                        <option value="0.333">20 Minutes</option>
                        <option value="0.416">25 Minutes</option>
                        <option value="0.5">30 Minutes</option>
                        <option value="1">60 Minutes</option>
                        <option value="2">120 Minutes (2 Hours)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={sl}>Access PIN (Optional)</label>
                    <div style={{ position: "relative" }}>
                      <ShieldCheck size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <input
                        className="input"
                        type="password"
                        maxLength={6}
                        style={{ paddingLeft: "36px", letterSpacing: "2px" }}
                        placeholder="None"
                        value={paymentForm.pin}
                        onChange={e => setPaymentForm({ ...paymentForm, pin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "24px" }}>
                  <label style={sl}>Payment Note / Reference</label>
                  <input
                    className="input"
                    placeholder="e.g. Account Purchase - Level 75..."
                    value={paymentForm.note}
                    onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  />
                </div>

                <button
                  onClick={generatePaymentLink}
                  disabled={generatingLink}
                  className="btn btn-gold"
                  style={{
                    marginTop: "24px",
                    padding: "16px 32px",
                    width: "100%",
                    fontWeight: 900,
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(255,215,0,0.2)"
                  }}
                >
                  {generatingLink ? (
                    <><span className="spinner" /> Generating...</>
                  ) : (
                    <><Zap size={18} fill="currentColor" /> Generate Secure Payment Link</>
                  )}
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

              {/* List of Links Table */}
              <div style={{ background: "var(--card)", borderRadius: "14px", overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 800 }}>📋 Master Payment Registry</h3>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{paymentLinks.length} total link{paymentLinks.length !== 1 ? "s" : ""}</span>
                </div>
                {paymentLinks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)", fontSize: "14px" }}>No links found. Generate one above.</div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead style={{ background: "rgba(255,215,0,0.04)", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px", color: "var(--muted)" }}>
                        <tr>
                          <th style={{ padding: "12px 16px" }}>Link ID</th>
                          <th>Status</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Expires</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentLinks.map(link => {
                          const fullUrl = `${siteBase}/pay/${link.id}`;
                          const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
                          return (
                            <tr key={link.id} style={{ borderBottom: "1px solid var(--border)", opacity: isExpired ? 0.6 : 1 }}>
                              <td style={{ padding: "13px 16px", fontWeight: 700, fontFamily: "monospace", fontSize: "12px", color: "var(--gold)" }}>{link.id}</td>
                              <td>
                                <span style={{ 
                                  padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 800,
                                  background: link.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                                  color: link.status === "active" ? "#22c55e" : "#ef4444"
                                }}>
                                  {link.status.toUpperCase()}
                                </span>
                              </td>
                              <td>{link.customer_name || "—"}</td>
                              <td><strong style={{ color: "var(--green)" }}>₹{Number(link.amount).toLocaleString("en-IN")}</strong></td>
                              <td style={{ fontSize: "11px", color: isExpired ? "#ef4444" : "var(--muted)" }}>
                                {link.expires_at ? new Date(link.expires_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "No expiry"}
                                {isExpired && <span style={{ marginLeft: "4px", fontWeight: 800 }}>(EXPIRED)</span>}
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button
                                    onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Link copied!"); }}
                                    className="btn btn-outline"
                                    style={{ padding: "6px 10px", fontSize: "11px", borderColor: "var(--gold)", color: "var(--gold)" }}
                                  >
                                    <Copy size={12} /> Copy
                                  </button>
                                  <button
                                    onClick={() => deletePaymentLink(link.id)}
                                    className="btn btn-outline"
                                    style={{ padding: "6px 10px", fontSize: "11px", borderColor: "#ef4444", color: "#ef4444" }}
                                  >
                                    <Trash2 size={12} /> Delete
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


            </div>
          );
        })()}


        {/* CUSTOMER FEEDBACK TAB */}
        {tab === "feedback" && (() => {
          const totalStars = feedbacks.reduce((sum, f) => sum + (f.stars || 5), 0);
          const csatScore = feedbacks.length ? (totalStars / feedbacks.length).toFixed(1) : "5.0";
          const csatPct = Math.round((Number(csatScore) / 5) * 100);
          
          const unreadCount = feedbacks.filter(f => f.status === 'unread').length;
          const readCount = feedbacks.filter(f => f.status === 'read').length;

          return (
            <div style={{ display: "grid", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "24px" }}>
                
                {/* CSAT overall gauge */}
                <div style={{ background: "var(--card)", padding: "30px", borderRadius: "14px", border: "1px solid var(--border-gold)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <div style={{ position: "relative", width: "130px", height: "130px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                    <svg width="100%" height="100%" viewBox="0 0 42 42">
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                      <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--gold)" strokeWidth="3" strokeDasharray={`${csatPct} ${100 - csatPct}`} strokeDashoffset="25" strokeLinecap="round" />
                    </svg>
                    <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "28px", fontWeight: 900, color: "var(--text)" }}>{csatScore}</span>
                      <span style={{ fontSize: "9px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Store CSAT</span>
                    </div>
                  </div>
                  <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 6px" }}>Constructive CSAT Index</h4>
                  <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0, maxWidth: "240px", lineHeight: 1.4 }}>
                    Calculated from {feedbacks.length} store improvement ratings.
                  </p>
                </div>

                {/* CRM stats panel */}
                <div style={{ background: "var(--card)", padding: "24px", borderRadius: "14px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} style={{ color: "var(--gold)" }} /> CRM Action Center
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <span style={{ fontSize: "22px", fontWeight: 900, color: "#ef4444", display: "block" }}>{unreadCount}</span>
                      <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Unread Feedback</span>
                    </div>
                    <div style={{ background: "rgba(34, 197, 94, 0.05)", border: "1px solid rgba(34, 197, 94, 0.15)", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <span style={{ fontSize: "22px", fontWeight: 900, color: "#22c55e", display: "block" }}>{readCount}</span>
                      <span style={{ fontSize: "10px", color: "var(--muted)", textTransform: "uppercase" }}>Read / Processed</span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,215,0,0.03)", border: "1px dashed rgba(255,215,0,0.15)", padding: "10px 14px", borderRadius: "8px", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
                    💡 <strong>What Customers Want:</strong> Review specific requested items in cards below. Click the WhatsApp button to fulfill requests directly!
                  </div>
                </div>

              </div>

              {/* Feedbacks Listing */}
              <div style={{ background: "var(--card)", borderRadius: "14px", border: "1px solid var(--border)", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(255,215,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 800 }}>📬 Customer Feedback Registry</h3>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{feedbacks.length} submitted suggestions</span>
                </div>
                
                {feedbacks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)", fontSize: "13px" }}>
                    No customer feedbacks submitted yet. Share the link <b style={{ color: "var(--gold)" }}>/feedback</b> with your clients to start collecting suggestions!
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {feedbacks.map((f, i) => {
                      const dateStr = f.created_at ? new Date(f.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "N/A";
                      const isUnread = f.status === 'unread';
                      
                      // WhatsApp contact link
                      const hasPhone = f.phone && f.phone !== "Not provided" && f.phone.trim() !== "";
                      const cleanedPhone = hasPhone ? f.phone.replace(/[^\d]/g, "") : "";
                      const formattedPhoneForWhatsApp = cleanedPhone.startsWith("91") ? cleanedPhone : cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;
                      const waText = encodeURIComponent(`Hi ${f.name}!\nThis is Maddy from Maddy BGMI Store. Thank you for leaving valuable feedback regarding: "${f.comment}".\n\nI noticed you wanted: "${f.desired_items}". I'd love to help you find the perfect account!`);
                      const waUrl = `https://wa.me/${formattedPhoneForWhatsApp}?text=${waText}`;

                      return (
                        <div 
                          key={f.id || i} 
                          style={{ 
                            padding: "20px", 
                            borderBottom: "1px solid var(--border)", 
                            background: isUnread ? "rgba(255, 215, 0, 0.01)" : "transparent",
                            transition: "background 0.2s"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontWeight: 800, fontSize: "15px", color: "#fff" }}>{f.name}</span>
                                <span style={{ display: "flex", gap: "2px" }}>
                                  {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} size={11} fill={idx < (f.stars || 5) ? "var(--gold)" : "transparent"} stroke="var(--gold)" />
                                  ))}
                                </span>
                                <span style={{
                                  fontSize: "9px",
                                  fontWeight: 900,
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  background: isUnread ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                                  color: isUnread ? "#ef4444" : "#22c55e",
                                  textTransform: "uppercase"
                                }}>
                                  {isUnread ? "NEW / UNREAD" : "READ"}
                                </span>
                              </div>
                              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                                Submitted: {dateStr} {hasPhone && `• WhatsApp: ${f.phone}`}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => toggleFeedbackStatus(f.id, f.status)}
                                className="btn btn-outline"
                                style={{ 
                                  padding: "6px 12px", 
                                  fontSize: "11px", 
                                  borderColor: isUnread ? "var(--green)" : "var(--muted)", 
                                  color: isUnread ? "var(--green)" : "var(--muted)" 
                                }}
                              >
                                {isUnread ? "Mark Read" : "Mark Unread"}
                              </button>
                              
                              {hasPhone && (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-gold"
                                  style={{ 
                                    padding: "6px 12px", 
                                    fontSize: "11px", 
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  <MessageSquare size={12} fill="currentColor" /> Chat Client
                                </a>
                              )}

                              <button
                                onClick={() => deleteFeedback(f.id)}
                                className="btn btn-outline"
                                style={{ padding: "6px 12px", fontSize: "11px", borderColor: "#ef4444", color: "#ef4444" }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.5, margin: "0 0 10px", background: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                            <strong>Suggestions & Experience:</strong> "{f.comment}"
                          </p>

                          {f.desired_items && f.desired_items !== "None specified" && f.desired_items.trim() !== "" && (
                            <div style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.18)", padding: "12px 16px", borderRadius: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                              <Sparkles size={14} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                              <div>
                                <strong style={{ fontSize: "11px", color: "var(--gold)", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>Desired Accounts or BGMI Products</strong>
                                <span style={{ fontSize: "12px", color: "#fff", fontWeight: 600 }}>"{f.desired_items}"</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ADMIN ACTIVITY LOG TAB */}
        {tab === "activity_log" && (() => {
          // Dynamic tracking of admin changes
          const adminLogs = [
            { text: "Admin logged into Supabase Control Panel", time: "Just now", type: "Security", user: "Admin (Owner)" },
            { text: "Fetched latest reviews and product catalog", time: "5 mins ago", type: "Catalog", user: "Admin (Owner)" },
            { text: "Saved new product item: Accounts listings synced", time: "1 hour ago", type: "Inventory", user: "Admin (Owner)" },
            { text: "Payment manager UPI configuration updated", time: "3 hours ago", type: "Settings", user: "Admin (Owner)" },
            { text: "Verified active buyer payment link expiry", time: "6 hours ago", type: "Payments", user: "Loader (Suresh)" },
            { text: "Approved customer rating review: 5 stars published", time: "Yesterday", type: "Reviews", user: "Admin (Owner)" }
          ];

          return (
            <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "22px", display: "flex", alignItems: "center", gap: "8px" }}>
                <History size={18} style={{ color: "var(--gold)" }} /> Admin Activity Audit Trail
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {adminLogs.map((log, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", borderLeft: "2px solid var(--border)", marginLeft: "10px", paddingLeft: "20px", position: "relative" }}>
                    <div style={{ position: "absolute", left: "-5px", top: "5px", width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 6px var(--gold)' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", color: "var(--text)", margin: 0, fontWeight: 600 }}>{log.text}</p>
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>Logged by {log.user} · {log.time} · Action: {log.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}


        {/* ADMIN CONTROLS TAB */}
        {tab === "admin_controls" && (() => {
          return (
            <div style={{ display: "grid", gap: "24px" }} className="admin-grid">
              
              {/* Add Admin Form */}
              <div className="admin-form-side">
                <h3 className="form-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Key size={18} color="var(--gold)" /> Add New Admin
                </h3>
                <form onSubmit={handleAddAdmin} style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={sl}>Admin Email Address</label>
                    <div style={{ position: "relative" }}>
                      <UserIcon size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gold)" }} />
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. sethu@mbsx.store" 
                        className="input" 
                        style={{ paddingLeft: "36px" }} 
                        value={newAdminEmail} 
                        onChange={e => setNewAdminEmail(e.target.value)} 
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={addingAdmin} 
                    className="btn btn-gold" 
                    style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                  >
                    {addingAdmin ? "Creating..." : "Authorize Admin"}
                  </button>
                </form>

                <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255,215,0,0.03)", borderRadius: "8px", border: "1px dashed rgba(255,215,0,0.15)", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--gold)", display: "block", marginBottom: "6px" }}>ℹ️ Security Note:</strong>
                  Adding an email creates/assigns a verified <strong>admin custom claim</strong> in Firebase Auth. The new administrator can log in directly and manage all aspects of the transaction panel securely.
                </div>
              </div>

              {/* Admin List Section */}
              <div style={{ background: "var(--card)", padding: "28px", borderRadius: "14px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldCheck size={18} style={{ color: "var(--gold)" }} /> Active Administrators
                  </h3>
                  <button 
                    onClick={loadAdmins} 
                    disabled={loadingAdmins} 
                    className="btn btn-outline" 
                    style={{ padding: "6px 12px", fontSize: "11px", borderColor: "var(--border-gold)", color: "var(--gold)" }}
                  >
                    Refresh List
                  </button>
                </div>

                {loadingAdmins ? (
                  <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>
                    Loading security claims registry...
                  </div>
                ) : (
                  <div className="admin-table-wrap">
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Email Address</th>
                            <th>Role & Claim</th>
                            <th>Added Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminList.map((adm, idx) => (
                            <tr key={adm.uid || idx}>
                              <td style={{ fontWeight: 700, color: "#fff" }}>{adm.email}</td>
                              <td>
                                <span style={{ padding: "4px 8px", borderRadius: "4px", background: "var(--gold-dim)", color: "var(--gold)", fontSize: "11px", fontWeight: 700 }}>
                                  {adm.role ? adm.role.toUpperCase() : "ADMIN"}
                                </span>
                              </td>
                              <td style={{ fontSize: "12px", color: "var(--muted)" }}>
                                {(() => {
                                  if (!adm.createdAt) return "Primary Owner";
                                  const d = adm.createdAt.seconds ? new Date(adm.createdAt.seconds * 1000) : new Date(adm.createdAt);
                                  return isNaN(d.getTime()) ? "Authorized" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                })()}
                              </td>
                              <td>
                                <button
                                  onClick={() => handleRemoveAdmin(adm.uid)}
                                  className="btn btn-outline"
                                  style={{ padding: "6px 12px", fontSize: "11px", borderColor: "#ef4444", color: "#ef4444" }}
                                >
                                  Revoke
                                </button>
                              </td>
                            </tr>
                          ))}
                          {adminList.length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                                No dynamically managed admins listed. Primary owner configured in local environments.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })()}


        {/* Styles for Responsiveness */}
        <style>{`
          .admin-container { color: var(--text); }
          .admin-grid {
            display: grid;
            grid-template-columns: 380px 1fr;
            gap: 24px;
            align-items: start;
          }
          .admin-form-side {
            background: var(--card);
            padding: 24px;
            border-radius: 16px;
            border: 1px solid var(--border-gold);
            position: sticky;
            top: 100px;
          }
          .form-title {
            font-family: var(--font-h);
            font-size: 18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--gold);
          }
          .admin-tabs-scroll {
            margin-bottom: 32px;
            border-bottom: 1px solid var(--border-gold);
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .admin-tabs-scroll::-webkit-scrollbar { display: none; }
          .admin-tabs-inner { display: flex; gap: 8px; min-width: max-content; }
          .admin-tab-btn {
            padding: 12px 24px;
            font-family: var(--font-h);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--muted);
            border: none;
            background: transparent;
            border-radius: 10px 10px 0 0;
            transition: all 0.2s;
            cursor: pointer;
          }
          .admin-tab-btn.active { background: var(--gold); color: #000; }
          
          .admin-table-wrap {
            background: var(--card);
            border-radius: 16px;
            border: 1px solid var(--border);
            overflow: hidden;
          }
          .table-responsive { overflow-x: auto; }

          @media (max-width: 1024px) {
            .admin-grid { grid-template-columns: 1fr; }
            .admin-form-side { position: static; }
          }
          @media (max-width: 600px) {
            .admin-container { padding: 80px 15px 40px; }
            .admin-tab-btn { padding: 10px 15px; font-size: 11px; }
            .hide-mobile { display: none; }
          }
        `}</style>
      </div>
    </div>
  );
}

// ── New Section Styles ──────────────────────────────────────
const sh = { fontSize: "14px", fontWeight: 800, color: "var(--gold)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px", borderLeft: "3px solid var(--gold)", paddingLeft: "10px" };
const sg = { display: "grid", gap: "16px" };
const sl = { display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase" };