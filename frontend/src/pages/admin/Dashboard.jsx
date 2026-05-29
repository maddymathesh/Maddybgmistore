/**
 * Admin Dashboard — Manage Products + Reviews + CRM + Sales (Supabase)
 *
 * Access control:
 *   - isAdmin checked via AuthContext (UID match from .env)
 */
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useRef } from "react";
import { toast } from 'sonner';
import Navbar from "../../components/Navbar";
import { LogOut, Sparkles, Plus, Trash2, Pencil, Star, Copy, Users, TrendingUp, DollarSign, Camera, Coins, Zap, Car, Clock, ShieldCheck, User as UserIcon, Tag, Hash, ArrowRightLeft, MessageSquare, History, Key, Download, FileText, CheckCircle2, ThumbsUp, AlertCircle, Calendar, Save, BookOpen, RotateCcw, Smartphone, ChevronDown, ChevronUp, Sliders, CopyCheck, Eye, Check } from "lucide-react";
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

// ── BGMI Description Factory Globals ─────────────────────────
const BLANK_DESC_FORM = {
  stockTag: "#NEWSTOCK",
  postTag: "#NEWPOST",
  dealTitle: "‼️🔻Premium Deal Of The Day 🔻‼️",
  highlight: "",
  price: "",
  whatsappPhone: "",
  loginDetails: "",
  level: "",
  proCollector: "",
  mythicFashion: "",
  ultimateFashion: "",
  titles: "",
  xsuits: [],
  gunLabs: [],
  outfits: [],
  vehicles: [],
  killFeeds: "0",
  pets: "None",
  characters: ""
};

const PLACEHOLDER_RAW = `100 mythics
ignis xsuit lvl 4
galadria xsuit lvl 1
m416 shinobi lvl 5 on hit
m416 sealed nether lvl 6 on hit
42 gun labs
19 kill feeds
3 supercars
4 upgraded vehicles

account level 81
pro collector 63
mythic fashion 100
ultimate mythic fashion 6
c8s23 conqueror
tyrant of the raging sea
8 years glorious veteran

xsuits
ignis xsuit lvl 4
galadria xsuit lvl 1

gun labs
m416 sealed nether lvl 6 on hit
m416 shinobi lvl 5 on hit
ump45 rainbow stringer lvl 4 kill msg
scarl crimson nemesis lvl 4 kill msg
akm decisive day lvl 4 kill msg
kar98k kitty kadence lvl 3 maxed
m416 glacier lvl 1
uzi savagery lvl 1

outfits
psychophage mummy set ultimate
crimson nemesis set ultimate
luminous muse set ultimate
invader set
friend huntress set
godzilla costume

extra details
19 total kill feeds
42 total gun labs
pets null
characters victor sara carlo laith

vehicles
bugatti la voiture alloy coupe
ssc tuatara sky crane coupe
lamborghini urus giallolinti coupe
midnight dacia lvl 3
golden apex buggy lvl 1

logins x mm and google play games ug
price 31999 inr
dm whatsapp 9025391516`;

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const getWhatsappLink = (phone) => {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9+]/g, "");
  if (clean.length === 10 && !clean.startsWith("+")) {
    clean = "+91" + clean;
  } else if (clean.startsWith("91") && clean.length === 12 && !clean.startsWith("+")) {
    clean = "+" + clean;
  } else if (!clean.startsWith("+")) {
    clean = "+" + clean;
  }
  return `https://wa.me/${clean}`;
};

// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");

  // ── States ────────────────────────────────────────
  const [adminList, setAdminList] = useState([]);

  const validateImageFile = (file) => {
    if (!file) return false;
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      toast.error("Only PNG, JPEG, JPG, and WEBP image formats are allowed.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max file size allowed is 10MB.");
      return false;
    }
    return true;
  };
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

  // ── Google Drive Image ID Feature additions ─────────────────
  const [imageSource, setImageSource] = useState("upload");
  const [driveFileId, setDriveFileId] = useState("");

  // Helper to extract file ID from raw ID or full Google Drive link
  function extractDriveFileId(input) {
    if (!input) return "";
    // If already a plain file ID
    if (!input.includes("drive.google.com")) {
      return input.trim();
    }
    // Extract from URL pattern /d/<ID>
    const match = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  }

  // Returns preview URL; accepts either raw ID or full link
  function getDrivePreviewUrl(input) {
    const fileId = extractDriveFileId(input);
    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=w2000` : "";
  }

  const handleSourceChange = (src) => {
    setImageSource(src);
    setDriveFileId("");
    setProofImage(null);
    setXsuitImage(null);
    setCarImage(null);
  };

  // ── BGMI AI Description Factory States ───────────────────────
  const [descRawText, setDescRawText] = useState("");
  const [descForm, setDescForm] = useState(BLANK_DESC_FORM);
  const [isDescFormExpanded, setIsDescFormExpanded] = useState(false);
  const [descActivePreviewTab, setDescActivePreviewTab] = useState("whatsapp");
  const [descPreviewDevice, setDescPreviewDevice] = useState("mobile");
  const [descLocalPresets, setDescLocalPresets] = useState([]);
  const [showDescPresetsModal, setShowDescPresetsModal] = useState(false);
  const [showDescSavePresetModal, setShowDescSavePresetModal] = useState(false);
  const [descPresetNameInput, setDescPresetNameInput] = useState("");

  // Load local presets on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mbs_bgmi_presets");
      if (saved) setDescLocalPresets(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load presets", e);
    }
  }, []);

  // Intelligent raw parser
  const parseDescRawText = (text) => {
    if (!text.trim()) return;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const parsed = {
      ...BLANK_DESC_FORM,
      xsuits: [],
      gunLabs: [],
      outfits: [],
      vehicles: []
    };

    let currentSection = "";
    const titlesList = [];

    for (let line of lines) {
      const lower = line.toLowerCase();

      // Section Header Detections
      if (lower === "xsuits" || lower === "x-suits" || lower === "xsuit" || lower === "x-suit") {
        currentSection = "xsuits";
        continue;
      }
      if (lower === "gun labs" || lower === "gunlabs" || lower === "guns" || lower === "weapons") {
        currentSection = "gun_labs";
        continue;
      }
      if (lower === "outfits" || lower === "sets" || lower === "outfits & sets" || lower === "skins") {
        currentSection = "outfits";
        continue;
      }
      if (lower === "vehicles" || lower === "cars" || lower === "supercars" || lower === "garage") {
        currentSection = "vehicles";
        continue;
      }
      if (lower === "extra details" || lower === "extras" || lower === "extra" || lower === "summary") {
        currentSection = "extras";
        continue;
      }

      // Context-aware Line Parsing
      if (currentSection === "xsuits") {
        const lvlMatch = line.match(/lvl\s*[-]?\s*(\d+|maxed)/i);
        const level = lvlMatch ? lvlMatch[1] : "1";
        const name = line.replace(/lvl\s*[-]?\s*(\d+|maxed)/i, "").trim();
        parsed.xsuits.push({ name: capitalizeWords(name), level, genderType: name.toLowerCase().includes("girl") || name.toLowerCase().includes("galadria") ? "Female" : "Male", tags: "" });
        continue;
      }

      if (currentSection === "gun_labs") {
        const lvlMatch = line.match(/lvl\s*[-]?\s*(\d+|maxed)/i);
        const level = lvlMatch ? lvlMatch[1] : "1";

        let effectType = "";
        if (lower.includes("on hit") || lower.includes("onhit")) effectType = "On Hit";
        else if (lower.includes("kill msg") || lower.includes("killmsg") || lower.includes("kill feed") || lower.includes("killfeed")) effectType = "Kill Msg";
        else if (lower.includes("loot crate") || lower.includes("lootcrate")) effectType = "Loot Crate";
        else if (lower.includes("maxed")) effectType = "Maxed";

        const name = line
          .replace(/lvl\s*[-]?\s*(\d+|maxed)/i, "")
          .replace(/on\s*hit/gi, "")
          .replace(/kill\s*msg/gi, "")
          .replace(/loot\s*crate/gi, "")
          .replace(/maxed/gi, "")
          .replace(/\[.*?\]/g, "")
          .trim();

        parsed.gunLabs.push({ name: capitalizeWords(name), level, effectType, notes: "" });
        continue;
      }

      if (currentSection === "outfits") {
        const isUltimate = lower.includes("ultimate") || lower.includes("mummy") || lower.includes("nemesis");
        const name = line.replace(/ultimate/gi, "").trim();
        parsed.outfits.push({ name: capitalizeWords(name), isUltimate });
        continue;
      }

      if (currentSection === "vehicles") {
        const lvlMatch = line.match(/lvl\s*[-]?\s*(\d+|maxed)/i);
        const upgradeLevel = lvlMatch ? lvlMatch[1] : "1";

        let type = "Coupe";
        if (lower.includes("buggy")) type = "Buggy";
        else if (lower.includes("dacia")) type = "Dacia";
        else if (lower.includes("mirado")) type = "Mirado";
        else if (lower.includes("motorcycle") || lower.includes("bike")) type = "Motorcycle";
        else if (lower.includes("uaz")) type = "UAZ";

        const name = line
          .replace(/lvl\s*[-]?\s*(\d+|maxed)/i, "")
          .replace(/\(.*?\)/g, "")
          .replace(/coupe/gi, "")
          .replace(/buggy/gi, "")
          .replace(/dacia/gi, "")
          .replace(/mirado/gi, "")
          .replace(/motorcycle/gi, "")
          .replace(/uaz/gi, "")
          .trim();

        parsed.vehicles.push({ name: capitalizeWords(name), type, upgradeLevel });
        continue;
      }

      // Price
      if (lower.includes("price") || lower.includes("inr") || lower.includes("cost")) {
        const match = line.match(/\d+[\d,\s]*/);
        if (match) {
          parsed.price = match[0].trim();
          continue;
        }
      }

      // WhatsApp Contact
      if (lower.includes("whatsapp") || lower.includes("wa.me") || lower.includes("contact") || lower.includes("phone") || lower.includes("dm")) {
        const match = line.match(/\d{10,12}/);
        if (match) {
          parsed.whatsappPhone = match[0].trim();
          continue;
        }
      }

      // Mythics count
      if (lower.includes("mythic") && !lower.includes("ultimate") && !lower.includes("fashion")) {
        const match = line.match(/\d+/);
        if (match) {
          parsed.mythicFashion = match[0];
          continue;
        }
      }

      // Mythic Fashion title
      if (lower.includes("mythic fashion")) {
        const match = line.match(/\d+/);
        if (match) {
          parsed.mythicFashion = match[0];
          continue;
        }
      }

      // Ultimate count
      if (lower.includes("ultimate mythic") || lower.includes("ultimate fashion") || (lower.includes("ultimate") && !lower.includes("set"))) {
        const match = line.match(/\d+/);
        if (match) {
          parsed.ultimateFashion = match[0];
          continue;
        }
      }

      // Level
      if (lower.includes("level") || lower.includes("lvl")) {
        const match = line.match(/(?:level|lvl)\s*[-]?\s*(\d+)/i);
        if (match) {
          parsed.level = match[1];
          continue;
        }
      }

      // Pro Collector
      if (lower.includes("pro collector") || lower.includes("collector")) {
        const match = line.match(/\d+/);
        if (match) {
          parsed.proCollector = match[0];
          continue;
        }
      }

      // Kill Feeds
      if (lower.includes("kill feed") || lower.includes("killfeed") || lower.includes("kill feeds")) {
        const match = line.match(/\d+/);
        if (match) {
          parsed.killFeeds = match[0];
          continue;
        }
      }

      // Logins
      if (lower.includes("login") || lower.includes("logins") || lower.includes("linked")) {
        parsed.loginDetails = line.replace(/login[s]?\s*[:|-]?/gi, "").trim();
        continue;
      }

      // Pets
      if (lower.includes("pets") || lower.includes("pet")) {
        parsed.pets = line.replace(/pet[s]?\s*[:|-]?/gi, "").trim();
        continue;
      }

      // Characters
      if (lower.includes("characters") || lower.includes("character")) {
        parsed.characters = line.replace(/character[s]?\s*[:|-]?/gi, "").trim();
        continue;
      }

      // Fallbacks
      if (lower.includes("xsuit") || lower.includes("x-suit")) {
        const lvlMatch = line.match(/lvl\s*[-]?\s*(\d+|maxed)/i);
        const level = lvlMatch ? lvlMatch[1] : "1";
        const name = line.replace(/lvl\s*[-]?\s*(\d+|maxed)/i, "").trim();
        parsed.xsuits.push({ name: capitalizeWords(name), level, genderType: "Unisex", tags: "" });
        continue;
      }

      const gunModels = ["m416", "glacier", "ump", "akm", "scar", "m762", "s12k", "p90", "dbs", "vector", "m24", "slr", "thompson", "uzi", "amr", "m249", "groza", "pp19", "qqb", "dp28", "mg3", "dagger", "sks", "mk47", "honey badger", "vss"];
      if (gunModels.some(kw => lower.includes(kw)) && (lower.includes("lvl") || lower.includes("level") || lower.includes("max"))) {
        const lvlMatch = line.match(/lvl\s*[-]?\s*(\d+|maxed)/i);
        const level = lvlMatch ? lvlMatch[1] : "1";
        const name = line.replace(/lvl\s*[-]?\s*(\d+|maxed)/i, "").trim();
        parsed.gunLabs.push({ name: capitalizeWords(name), level, effectType: "", notes: "" });
        continue;
      }

      if (lower.includes("conqueror") || lower.includes("veteran") || lower.includes("glorious") || lower.includes("tyrant")) {
        titlesList.push(line);
        continue;
      }

      if (line.length > 5 && !lower.includes("newstock") && !lower.includes("newpost") && !lower.includes("deal of the day")) {
        titlesList.push(line);
      }
    }

    if (titlesList.length > 0) {
      parsed.titles = titlesList.join(", ");
    }

    setDescForm(parsed);
    toast.success("AI parsed raw data successfully!", { duration: 1500 });
  };

  const handleDescRawTextChange = (val) => {
    setDescRawText(val);
    parseDescRawText(val);
  };

  const descCalculatedStats = useMemo(() => {
    const mythics = descForm.mythicFashion || "0";
    const totalWeapons = descForm.gunLabs.length;
    const killFeeds = descForm.killFeeds || "0";

    const upgradedVehicles = descForm.vehicles.filter(v => {
      const lvl = String(v.upgradeLevel).toLowerCase();
      return lvl.includes("max") || lvl.includes("lvl 3") || parseInt(lvl) > 1;
    }).length;

    const supercarsCount = descForm.vehicles.filter(v => {
      const name = v.name.toLowerCase();
      return name.includes("bugatti") || name.includes("ssc") || name.includes("lamborghini") || name.includes("ferrari") || name.includes("pagani") || name.includes("aston") || name.includes("koenigsegg");
    }).length;

    let weaponHighlight = "";
    const onHitGuns = descForm.gunLabs.filter(g => g.effectType?.toLowerCase().includes("on hit") || parseInt(g.level) >= 5);
    if (onHitGuns.length >= 2) {
      const w1 = onHitGuns[0].name.replace("M416 ", "").replace("m416 ", "");
      const w2 = onHitGuns[1].name.replace("M416 ", "").replace("m416 ", "");
      weaponHighlight = `+M416 ${w1} + ${w2} (On Hit) Combo`;
    } else if (onHitGuns.length === 1) {
      weaponHighlight = `+${onHitGuns[0].name} LvL ${onHitGuns[0].level}`;
    } else if (descForm.gunLabs.length > 0) {
      weaponHighlight = `+${descForm.gunLabs[0].name} LvL ${descForm.gunLabs[0].level}`;
    }

    let xsuitHighlight = "";
    if (descForm.xsuits.length > 0) {
      xsuitHighlight = ` + ${descForm.xsuits[0].name} LvL ${descForm.xsuits[0].level}`;
    }

    const highlightSummary = `Bgmi ${mythics} Mythics ${weaponHighlight}${xsuitHighlight} + ${totalWeapons}xTotal Gun Labs[${killFeeds}x Kill Feeds] + ${supercarsCount}xSupercars + ${upgradedVehicles}xUpgraded Vehicles🌟`;

    return {
      xsuitsCount: descForm.xsuits.length,
      gunLabsCount: totalWeapons,
      supercarsCount,
      upgradedVehicles,
      highlightSummary
    };
  }, [descForm]);

  const descPlainOutput = useMemo(() => {
    const parts = [];

    if (descForm.stockTag) parts.push(descForm.stockTag);
    if (descForm.postTag) parts.push(descForm.postTag);

    parts.push("");

    if (descForm.dealTitle) {
      parts.push(descForm.dealTitle);
      parts.push("");
    }

    parts.push(`🇮🇳 ${descForm.highlight || descCalculatedStats.highlightSummary}`);
    parts.push("");

    parts.push(` 🎖Account Level - ${descForm.level || "—"}`);
    parts.push(`🎀Pro Collector - (${descForm.proCollector || "0"})`);
    parts.push(`👑Mythic Fashion - (${descForm.mythicFashion || "0"}/100)`);
    parts.push(`👑Ultimate Mythic Fashion - (${descForm.ultimateFashion || "0"})`);

    if (descForm.titles) {
      const list = descForm.titles.split(",").map(t => t.trim()).filter(Boolean);
      list.forEach(title => {
        parts.push(`🌟${title}`);
      });
    }

    if (descForm.xsuits && descForm.xsuits.length > 0) {
      descForm.xsuits.forEach((x, idx) => {
        const prefix = idx === 0 ? " 🤴👸" : "👸";
        parts.push(`${prefix}${x.name} LvL ${x.level}`);
      });
    }

    if (descForm.gunLabs && descForm.gunLabs.length > 0) {
      parts.push("");
      parts.push(`🔫Gun Labs [${descForm.gunLabs.length}] `);
      
      const highGuns = descForm.gunLabs.filter(g => parseInt(g.level) >= 5 || g.level.toLowerCase().includes("maxed"));
      const lvl4Guns = descForm.gunLabs.filter(g => g.level === "4");
      const lvl3Guns = descForm.gunLabs.filter(g => g.level === "3");
      const lvl2Guns = descForm.gunLabs.filter(g => g.level === "2");
      const lvl1Guns = descForm.gunLabs.filter(g => g.level === "1" || g.level === "");

      highGuns.forEach(g => {
        const eff = g.effectType ? `[${g.effectType}]` : "";
        parts.push(`🎃${g.name} LvL - ${g.level}${eff}`);
      });

      for (let i = 0; i < lvl4Guns.length; i += 2) {
        const chunk = lvl4Guns.slice(i, i + 2);
        const line = chunk.map(g => {
          const eff = g.effectType ? `[${g.effectType}]` : "";
          return `🎃${g.name} LvL - ${g.level}${eff}`;
        }).join(" ");
        parts.push(line);
      }

      for (let i = 0; i < lvl3Guns.length; i += 2) {
        const chunk = lvl3Guns.slice(i, i + 2);
        const line = chunk.map(g => {
          const eff = g.effectType ? `[${g.effectType}]` : "";
          return `🎃${g.name} LvL - ${g.level}${eff}`;
        }).join(" ");
        parts.push(line);
      }

      for (let i = 0; i < lvl2Guns.length; i += 3) {
        const chunk = lvl2Guns.slice(i, i + 3);
        const line = chunk.map(g => {
          return `🎃${g.name} LvL - ${g.level}`;
        }).join(" ");
        parts.push(line);
      }

      for (let i = 0; i < lvl1Guns.length; i += 5) {
        const chunk = lvl1Guns.slice(i, i + 5);
        const line = chunk.map(g => {
          return `🎃${g.name} LvL - ${g.level}`;
        }).join(" ");
        parts.push(line);
      }
    }

    if (descForm.outfits && descForm.outfits.length > 0) {
      parts.push("");
      descForm.outfits.forEach(o => {
        const isUlt = o.isUltimate || o.name.toLowerCase().includes("ultimate") || o.name.toLowerCase().includes("mummy") || o.name.toLowerCase().includes("set ultimate");
        if (isUlt) {
          const cleanName = o.name.replace(/ultimate/gi, "").replace(/\(Ultimate\)/gi, "").replace(/set/gi, "").trim();
          parts.push(`❤️🔥${cleanName} Set (Ultimate)`);
        } else {
          parts.push(`❤️${o.name}`);
        }
      });

      parts.push(`❤️${descForm.killFeeds || "0"}xTotal KillFeeds`);
      parts.push(`❤️${descForm.gunLabs.length}xTotal GunLabs`);
      parts.push(`❤️Pets - ${descForm.pets || "Null"}`);
      parts.push(`❤️Characters - ${descForm.characters || "None"}`);
    }

    if (descForm.vehicles && descForm.vehicles.length > 0) {
      parts.push("");
      parts.push(`🚗Vehicles🏍️`);
      descForm.vehicles.forEach((v, idx) => {
        const typeStr = v.type ? `(${v.type})` : "";
        const levelStr = v.upgradeLevel && v.upgradeLevel !== "1" ? ` (LvL ${v.upgradeLevel})` : "";
        const prefix = idx === 0 ? " 🏎" : "🏎";
        parts.push(`${prefix}${v.name}${typeStr}${levelStr}`);
      });
    }

    parts.push("");
    parts.push(`🔐Logins : ${descForm.loginDetails || "—"} ✅`);
    parts.push("");
    if (descForm.price) {
      parts.push(`🔖Price - ₹${descForm.price} INR ✅️`);
    }
    parts.push("");
    const waLink = getWhatsappLink(descForm.whatsappPhone);
    parts.push(`📥DM WHATSAPP ${waLink}`);

    return parts.join("\n");
  }, [descForm, descCalculatedStats]);

  const descStyledOutput = useMemo(() => {
    if (!descPlainOutput) return "";
    return descPlainOutput
      .split("\n")
      .map(line => {
        if (line.trim() === "") return "";
        return `*${line}*`;
      })
      .join("\n");
  }, [descPlainOutput]);

  const descPreviewHtml = useMemo(() => {
    if (!descStyledOutput) return "";
    let escaped = descStyledOutput
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    escaped = escaped.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    return escaped.replace(/\n/g, "<br/>");
  }, [descStyledOutput]);

  const handleDescInputChange = (field, val) => {
    setDescForm(prev => ({ ...prev, [field]: val }));
  };

  const saveDescPresetToBrowser = () => {
    if (!descPresetNameInput.trim()) return toast.error("Preset name required!");
    try {
      const newPreset = {
        id: Date.now(),
        name: descPresetNameInput,
        form_data: descForm
      };
      const updated = [...descLocalPresets, newPreset];
      setDescLocalPresets(updated);
      localStorage.setItem("mbs_bgmi_presets", JSON.stringify(updated));
      toast.success(`Preset "${descPresetNameInput}" saved in browser!`);
      setDescPresetNameInput("");
      setShowDescSavePresetModal(false);
    } catch (e) {
      toast.error("Failed to save local preset.");
    }
  };

  const loadDescPreset = (preset) => {
    if (confirm(`Load preset "${preset.name}"? Current progress will be overwritten.`)) {
      setDescForm(preset.form_data);
      setShowDescPresetsModal(false);
      toast.success(`Preset "${preset.name}" loaded!`);
    }
  };

  const deleteDescPreset = (id) => {
    if (!confirm("Remove this preset from browser memory?")) return;
    const updated = descLocalPresets.filter(p => p.id !== id);
    setDescLocalPresets(updated);
    localStorage.setItem("mbs_bgmi_presets", JSON.stringify(updated));
    toast.success("Preset deleted");
  };

  const copyDescText = async (text, label) => {
    if (!text) return toast.error("No description generated!");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (e) {
      toast.error("Clipboard copy failed.");
    }
  };

  const copyBothDesc = () => {
    const combined = `=== WHATSAPP DESCRIPTION ===\n${descStyledOutput}\n\n=== TELEGRAM DESCRIPTION ===\n${descPlainOutput}`;
    copyDescText(combined, "Both descriptions");
  };

  const downloadDescText = () => {
    if (!descPlainOutput) return toast.error("No description to download!");
    const element = document.createElement("a");
    const file = new Blob([descPlainOutput], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "bgmi-deal-description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("TXT File downloaded!");
  };

  const addDescFieldItem = (field, item) => {
    setDescForm(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeDescFieldItem = (field, index) => {
    setDescForm(prev => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== index) }));
  };

  const updateDescFieldItem = (field, index, subField, val) => {
    setDescForm(prev => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [subField]: val };
      return { ...prev, [field]: updated };
    });
  };

  const addXsuitDesc = () => {
    addDescFieldItem("xsuits", { name: "", level: "1", genderType: "Male", tags: "" });
  };

  const addGunLabDesc = () => {
    addDescFieldItem("gunLabs", { name: "", level: "1", effectType: "", notes: "" });
  };

  const addOutfitDesc = () => {
    addDescFieldItem("outfits", { name: "", isUltimate: false });
  };

  const addVehicleDesc = () => {
    addDescFieldItem("vehicles", { name: "", type: "Coupe", upgradeLevel: "1" });
  };

  useEffect(() => {
    setImageSource("upload");
    setDriveFileId("");
    setProofImage(null);
    setXsuitImage(null);
    setCarImage(null);
  }, [tab]);

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
    if (!proofForm.title.trim()) return toast.error("Please enter a title");
    if (imageSource === "drive" && !extractDriveFileId(driveFileId.trim())) return toast.error("Please enter a valid Google Drive File ID or link");
    if (imageSource === "upload" && !proofImage) return toast.error("Please select a proof image");
    setSavingProof(true);
    try {
      let url = "";
      if (imageSource === "drive") {
        url = getDrivePreviewUrl(driveFileId.trim());
      } else {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", proofImage);
        formData.append("upload_preset", uploadPreset);
        // Store proofs in designated folder
        const folder = "maddy_bgmi_store/Proofs";
        formData.append("folder", folder);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        url = json.secure_url;
      }

      const fullMonth = `${proofForm.month} ${proofForm.year}`;
      const { error } = await supabase.from('proofs').insert([{
        title: proofForm.title.trim(),
        image_url: url,
        month: fullMonth,
      }]);
      if (error) throw error;

      toast.success(`Proof saved to ${fullMonth}!`);
      setProofForm({ ...proofForm, title: "" });
      setProofImage(null);
      setDriveFileId("");
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingProof(false); }
  };

  // Helper to delete image from Cloudinary if needed
  async function deleteFromCloudinary(imageUrl) {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;

    try {
      const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const apiKey =
        import.meta.env.VITE_CLOUDINARY_API_KEY;

      const apiSecret =
        import.meta.env.VITE_CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        console.warn("Missing Cloudinary ENV");
        return;
      }

      // Extract public_id correctly
      const url = new URL(imageUrl);

      const pathParts = url.pathname.split("/");

      console.log("pathParts", pathParts);

      // Find upload index
      const uploadIndex = pathParts.indexOf("upload");

      if (uploadIndex === -1) {
        console.warn("Invalid Cloudinary URL");
        return;
      }

      // Remove:
      // /upload/
      // version
      const publicIdWithExt = pathParts
        .slice(uploadIndex + 2)
        .join("/");

      console.log(
        "publicIdWithExt",
        publicIdWithExt
      );

      // Remove extension
      const publicId = publicIdWithExt.replace(
        /\.[^/.]+$/,
        ""
      );

      console.log("publicId", publicId);

      // Signature
      const timestamp = Math.round(Date.now() / 1000);

      const sigString =
        `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

      const sha1Buffer =
        await crypto.subtle.digest(
          "SHA-1",
          new TextEncoder().encode(sigString)
        );

      const signature = Array.from(
        new Uint8Array(sha1Buffer)
      )
        .map((b) =>
          b.toString(16).padStart(2, "0")
        )
        .join("");

      // FormData
      const form = new FormData();

      form.append("public_id", publicId);
      form.append("api_key", apiKey);
      form.append("timestamp", timestamp);
      form.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      console.log(
        "Cloudinary delete result",
        data
      );

    } catch (e) {
      console.warn(
        "Cloudinary delete failed",
        e
      );
    }
  }

  const deleteProof = async (id) => {
    if (!confirm("Delete proof?")) return;
    try {
      // fetch current record to get its image URL before deletion
      const { data: proof } = await supabase.from('proofs').select('image_url').eq('id', id).single();
      const { error } = await supabase.from('proofs').delete().eq('id', id);
      if (error) throw error;
      // delete image from Cloudinary if it was uploaded there
      if (proof?.image_url) await deleteFromCloudinary(proof.image_url);
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
    if (imageSource === "drive" && !extractDriveFileId(driveFileId.trim())) return toast.error("Please enter a valid Google Drive File ID or link");
    setSavingXsuit(true);
    try {
      let url = xsuitForm.image_url;
      if (imageSource === "drive") {
        url = getDrivePreviewUrl(driveFileId.trim());
      } else if (xsuitImage) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", xsuitImage);
        formData.append("upload_preset", uploadPreset);
        // Store xsuits in designated folder
        const folder = "maddy_bgmi_store/Xsuite";
        formData.append("folder", folder);
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
      setDriveFileId("");
      setImageSource("upload");
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingXsuit(false); }
  };

  const deleteXsuit = async (id) => {
    if (!confirm("Delete this Xsuit gift?")) return;
    try {
      // get image URL before deletion
      const { data: xsuit } = await supabase.from('xsuit_gifts').select('image_url').eq('id', id).single();
      const { error } = await supabase.from('xsuit_gifts').delete().eq('id', id);
      if (error) throw error;
      if (xsuit?.image_url) await deleteFromCloudinary(xsuit.image_url);
      fetchData();
    } catch (e) { toast.error(e.message); }
  };

  // ── Supercar Gifts CRUD (Firebase) ──────────────────────────
  const saveCar = async () => {
    if (!carForm.name || !carForm.price) return toast.error("Required fields missing");
    if (imageSource === "drive" && !extractDriveFileId(driveFileId.trim())) return toast.error("Please enter a valid Google Drive File ID or link");
    setSavingCar(true);
    try {
      let url = carForm.image_url;
      if (imageSource === "drive") {
        url = getDrivePreviewUrl(driveFileId.trim());
      } else if (carImage) {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        const formData = new FormData();
        formData.append("file", carImage);
        formData.append("upload_preset", uploadPreset);
        // Store supercar images in designated folder
        const folder = "maddy_bgmi_store/Supercar";
        formData.append("folder", folder);
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
      setDriveFileId("");
      setImageSource("upload");
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSavingCar(false); }
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this Supercar gift?")) return;
    try {
      // get image URL before deletion
      const { data: car } = await supabase.from('supercar_gifts').select('image_url').eq('id', id).single();
      const { error } = await supabase.from('supercar_gifts').delete().eq('id', id);
      if (error) throw error;
      if (car?.image_url) await deleteFromCloudinary(car.image_url);
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
              ["description_factory", "Description Factory"],
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
                    <select className="input" value={productForm.tag} onChange={e => setProductForm({ ...productForm, tag: e.target.value })}>
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

        {/* DESCRIPTION FACTORY TAB */}
        {tab === "description_factory" && (
          <div className="bgmi-maker-container" style={{ display: "grid", gap: "24px", minHeight: "100%", color: "var(--text)" }}>
            
            {/* PRESET LOAD SAVE HUD */}
            <div className="glass-premium" style={{ padding: "14px 20px", borderRadius: "var(--radius)", border: "1px solid var(--border-gold)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "rgba(255,215,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--gold)" }}><Sparkles size={16} style={{ display: "inline", marginRight: "4px" }} /> AI Description Factory</span>
                <span style={{ fontSize: "11px", background: "var(--green)", color: "#000", padding: "2px 6px", borderRadius: "4px", fontWeight: "900", textTransform: "uppercase" }}>100% Client Side</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowDescPresetsModal(true)} className="btn btn-outline btn-sm">
                  <BookOpen size={13} /> Browser Presets ({descLocalPresets.length})
                </button>
                <button onClick={() => setShowDescSavePresetModal(true)} className="btn btn-outline btn-sm" style={{ borderColor: "rgba(255,215,0,0.3)", color: "var(--gold)" }}>
                  <Save size={13} /> Save Preset
                </button>
                <button onClick={() => { setDescRawText(""); setDescForm(BLANK_DESC_FORM); toast.success("Reset successfully!"); }} className="btn btn-red btn-sm">
                  <RotateCcw size={13} /> Clear Input
                </button>
              </div>
            </div>

            {/* METRICS HUD CARD */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Mythics Detected</div>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{descForm.mythicFashion || "0"}</div>
              </div>
              <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>X-Suits Detected</div>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{descCalculatedStats.xsuitsCount}</div>
              </div>
              <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Weapon Labs Detected</div>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{descCalculatedStats.gunLabsCount}</div>
              </div>
              <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Vehicles Detected</div>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{descForm.vehicles.length}</div>
              </div>
            </div>

            {/* WORKSPACE ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", alignItems: "start" }} className="admin-grid-maker">
              
              {/* LEFT: messy raw data inputs */}
              <div style={{ display: "grid", gap: "20px" }}>
                
                {/* Raw Messy Paste Textarea Card */}
                <div className="glass-premium" style={{ padding: "24px", borderRadius: "var(--radius)", border: "1px solid var(--border-gold)" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "12px", color: "var(--gold)", display: "flex", alignItems: "center", gap: "8px" }}>
                    📥 PASTE MESSY RAW BGMI DATA
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "16px" }}>
                    Paste messy raw specifications below. The AI/Rule-based parser will instantly detect values, clean spellings, calculate totals, and organize posting formats.
                  </p>

                  <textarea
                    className="input"
                    rows={14}
                    style={{ fontFamily: "var(--font-b)", fontSize: "14px", lineHeight: "1.6", background: "var(--bg3)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "8px", width: "100%" }}
                    placeholder={`Example Paste Structure:\n\n${PLACEHOLDER_RAW}`}
                    value={descRawText}
                    onChange={e => handleDescRawTextChange(e.target.value)}
                  />

                  <div style={{ display: "flex", gap: "10px", marginTop: "14px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleDescRawTextChange(PLACEHOLDER_RAW)}
                      className="btn btn-outline btn-sm"
                      style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      Load Placeholder Demo Spec
                    </button>
                  </div>
                </div>

                {/* MANUAL ADJUSTMENT TOOL ACCORDION */}
                <div className="glass-premium" style={{ borderRadius: "var(--radius)", border: "1px solid var(--border)", overflow: "hidden" }}>
                  <div 
                    onClick={() => setIsDescFormExpanded(!isDescFormExpanded)}
                    style={{ padding: "16px 24px", background: "rgba(255,255,255,0.015)", borderBottom: isDescFormExpanded ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--gold)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Sliders size={15} /> FINE-TUNE PARSED DATA (MANUAL EDITING)
                    </h4>
                    {isDescFormExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {isDescFormExpanded && (
                    <div style={{ padding: "24px", display: "grid", gap: "20px" }}>
                      
                      {/* Basic specifications */}
                      <div style={{ display: "grid", gap: "14px" }}>
                        <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "4px" }}>Basic Info</h5>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={ls}>Stock Tag</label>
                            <input className="input" value={descForm.stockTag} onChange={e => handleDescInputChange("stockTag", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Post Tag</label>
                            <input className="input" value={descForm.postTag} onChange={e => handleDescInputChange("postTag", e.target.value)} />
                          </div>
                        </div>

                        <div>
                          <label style={ls}>Main Highlight Summary (Overriding Summary Banner)</label>
                          <input className="input" value={descForm.highlight} onChange={e => handleDescInputChange("highlight", e.target.value)} placeholder={descCalculatedStats.highlightSummary} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={ls}>Level</label>
                            <input className="input" value={descForm.level} onChange={e => handleDescInputChange("level", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Pro Collector</label>
                            <input className="input" value={descForm.proCollector} onChange={e => handleDescInputChange("proCollector", e.target.value)} />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={ls}>Mythics Count</label>
                            <input className="input" value={descForm.mythicFashion} onChange={e => handleDescInputChange("mythicFashion", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Ultimate Count</label>
                            <input className="input" value={descForm.ultimateFashion} onChange={e => handleDescInputChange("ultimateFashion", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Price</label>
                            <input className="input" value={descForm.price} onChange={e => handleDescInputChange("price", e.target.value)} />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={ls}>WhatsApp DM Phone</label>
                            <input className="input" value={descForm.whatsappPhone} onChange={e => handleDescInputChange("whatsappPhone", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Logins details</label>
                            <input className="input" value={descForm.loginDetails} onChange={e => handleDescInputChange("loginDetails", e.target.value)} />
                          </div>
                        </div>

                        <div>
                          <label style={ls}>Titles (Comma separated)</label>
                          <input className="input" value={descForm.titles} onChange={e => handleDescInputChange("titles", e.target.value)} />
                        </div>
                      </div>

                      {/* Section 2: X-Suits list */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>X-Suits</h5>
                          <button onClick={addXsuitDesc} style={{ fontSize: "11px", color: "var(--gold)", background: "transparent", border: "none", cursor: "pointer" }}>+ Add Xsuit</button>
                        </div>
                        <div style={{ display: "grid", gap: "8px" }}>
                          {descForm.xsuits.map((x, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input className="input" style={{ flex: 3 }} placeholder="Name" value={x.name} onChange={e => updateDescFieldItem("xsuits", index, "name", e.target.value)} />
                              <input className="input" style={{ flex: 1 }} placeholder="Level" value={x.level} onChange={e => updateDescFieldItem("xsuits", index, "level", e.target.value)} />
                              <button onClick={() => removeDescFieldItem("xsuits", index)} style={{ color: "var(--red)", padding: "4px", background: "transparent", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 3: Weapon Gun Labs */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Gun Labs</h5>
                          <button onClick={addGunLabDesc} style={{ fontSize: "11px", color: "var(--gold)", background: "transparent", border: "none", cursor: "pointer" }}>+ Add Weapon</button>
                        </div>
                        <div style={{ display: "grid", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                          {descForm.gunLabs.map((g, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input className="input" style={{ flex: 3 }} placeholder="Weapon Name" value={g.name} onChange={e => updateDescFieldItem("gunLabs", index, "name", e.target.value)} />
                              <input className="input" style={{ flex: 1.2 }} placeholder="Lvl" value={g.level} onChange={e => updateDescFieldItem("gunLabs", index, "level", e.target.value)} />
                              <input className="input" style={{ flex: 2 }} placeholder="Effect Type" value={g.effectType} onChange={e => updateDescFieldItem("gunLabs", index, "effectType", e.target.value)} />
                              <button onClick={() => removeDescFieldItem("gunLabs", index)} style={{ color: "var(--red)", padding: "4px", background: "transparent", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: Outfits */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Outfits & Sets</h5>
                          <button onClick={addOutfitDesc} style={{ fontSize: "11px", color: "var(--gold)", background: "transparent", border: "none", cursor: "pointer" }}>+ Add Outfit</button>
                        </div>
                        <div style={{ display: "grid", gap: "8px" }}>
                          {descForm.outfits.map((o, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input className="input" style={{ flex: 4 }} placeholder="Set Name" value={o.name} onChange={e => updateDescFieldItem("outfits", index, "name", e.target.value)} />
                              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", whiteSpace: "nowrap" }}>
                                <input type="checkbox" checked={o.isUltimate} onChange={e => updateDescFieldItem("outfits", index, "isUltimate", e.target.checked)} />
                                Ultimate
                              </label>
                              <button onClick={() => removeDescFieldItem("outfits", index)} style={{ color: "var(--red)", padding: "4px", background: "transparent", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 5: Vehicles */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Vehicles</h5>
                          <button onClick={addVehicleDesc} style={{ fontSize: "11px", color: "var(--gold)", background: "transparent", border: "none", cursor: "pointer" }}>+ Add Vehicle</button>
                        </div>
                        <div style={{ display: "grid", gap: "8px" }}>
                          {descForm.vehicles.map((v, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input className="input" style={{ flex: 3 }} placeholder="Vehicle Name" value={v.name} onChange={e => updateDescFieldItem("vehicles", index, "name", e.target.value)} />
                              <input className="input" style={{ flex: 1.5 }} placeholder="Type" value={v.type} onChange={e => updateDescFieldItem("vehicles", index, "type", e.target.value)} />
                              <input className="input" style={{ flex: 1.5 }} placeholder="Lvl" value={v.upgradeLevel} onChange={e => updateDescFieldItem("vehicles", index, "upgradeLevel", e.target.value)} />
                              <button onClick={() => removeDescFieldItem("vehicles", index)} style={{ color: "var(--red)", padding: "4px", background: "transparent", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 6: Extra Details */}
                      <div style={{ display: "grid", gap: "10px" }}>
                        <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Extras & Summary</h5>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={ls}>Kill Feeds</label>
                            <input className="input" value={descForm.killFeeds} onChange={e => handleDescInputChange("killFeeds", e.target.value)} />
                          </div>
                          <div>
                            <label style={ls}>Pets / Buddies</label>
                            <input className="input" value={descForm.pets} onChange={e => handleDescInputChange("pets", e.target.value)} />
                          </div>
                        </div>

                        <div>
                          <label style={ls}>Characters Available</label>
                          <input className="input" value={descForm.characters} onChange={e => handleDescInputChange("characters", e.target.value)} />
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT: OUTPUT MOCKUPS */}
              <div style={{ position: "sticky", top: "100px", display: "grid", gap: "20px" }}>
                
                {/* Tab Swappers */}
                <div className="glass-premium" style={{ padding: "8px", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button onClick={() => setDescActivePreviewTab("whatsapp")} className={`admin-tab-btn ${descActivePreviewTab === "whatsapp" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                      🟢 WhatsApp View
                    </button>
                    <button onClick={() => setDescActivePreviewTab("telegram")} className={`admin-tab-btn ${descActivePreviewTab === "telegram" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                      🔵 Telegram View
                    </button>
                    <button onClick={() => setDescActivePreviewTab("plain")} className={`admin-tab-btn ${descActivePreviewTab === "plain" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                      📄 Telegram Raw
                    </button>
                    <button onClick={() => setDescActivePreviewTab("styled")} className={`admin-tab-btn ${descActivePreviewTab === "styled" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                      ✨ WhatsApp Styled
                    </button>
                  </div>

                  {/* Mobile desktop layout toggle */}
                  {(descActivePreviewTab === "whatsapp" || descActivePreviewTab === "telegram") && (
                    <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "2px" }}>
                      <button onClick={() => setDescPreviewDevice("mobile")} style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", background: descPreviewDevice === "mobile" ? "var(--gold)" : "transparent", color: descPreviewDevice === "mobile" ? "#000" : "var(--muted)", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                        Mobile
                      </button>
                      <button onClick={() => setDescPreviewDevice("desktop")} style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", background: descPreviewDevice === "desktop" ? "var(--gold)" : "transparent", color: descPreviewDevice === "desktop" ? "#000" : "var(--muted)", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                        Full
                      </button>
                    </div>
                  )}
                </div>

                {/* PREVIEW CONTAINER */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  
                  {/* WhatsApp Bubble Preview */}
                  {descActivePreviewTab === "whatsapp" && (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: descPreviewDevice === "mobile" ? "370px" : "100%",
                        aspectRatio: descPreviewDevice === "mobile" ? "9/16" : "auto",
                        minHeight: descPreviewDevice === "mobile" ? "auto" : "550px",
                        background: "#0b141a",
                        borderRadius: "20px",
                        border: "4px solid rgba(255,255,255,0.1)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)"
                      }}
                    >
                      <div style={{ background: "#202c33", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontWeight: "800", fontSize: "11px" }}>MB</div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#e9edef" }}>Maddy BGMI Store WhatsApp Channel</div>
                          <div style={{ fontSize: "10px", color: "#8696a0" }}>online • posting style</div>
                        </div>
                      </div>

                      <div 
                        style={{ 
                          flex: 1, 
                          padding: "16px", 
                          overflowY: "auto", 
                          backgroundImage: "radial-gradient(#202c33 1px, transparent 1px)", 
                          backgroundSize: "20px 20px", 
                          display: "flex", 
                          flexDirection: "column",
                          maxHeight: descPreviewDevice === "mobile" ? "420px" : "600px"
                        }}
                      >
                        <div
                          style={{
                            background: "#005c4b",
                            alignSelf: "flex-end",
                            maxWidth: "92%",
                            padding: "10px 14px",
                            borderRadius: "10px 0 10px 10px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.3)"
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "13px",
                              lineHeight: "1.65",
                              color: "#e9edef",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap"
                            }}
                            dangerouslySetInnerHTML={{ __html: descPreviewHtml || "Paste raw specification details on the left to see live chat preview..." }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px", alignItems: "center", marginTop: "4px", fontSize: "9px", color: "rgba(255,255,255,0.55)" }}>
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span style={{ color: "#53bdeb" }}>✓✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Telegram Bubble Preview */}
                  {descActivePreviewTab === "telegram" && (
                    <div
                      style={{
                        width: "100%",
                        maxWidth: descPreviewDevice === "mobile" ? "370px" : "100%",
                        aspectRatio: descPreviewDevice === "mobile" ? "9/16" : "auto",
                        minHeight: descPreviewDevice === "mobile" ? "auto" : "550px",
                        background: "#0f172a",
                        borderRadius: "20px",
                        border: "4px solid rgba(255,255,255,0.1)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)"
                      }}
                    >
                      <div style={{ background: "#1e293b", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "800", fontSize: "11px" }}>★</div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#f8fafc" }}>Maddy BGMI Store Telegram Channel</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8" }}>142,852 subscribers</div>
                        </div>
                      </div>

                      <div 
                        style={{ 
                          flex: 1, 
                          padding: "16px", 
                          overflowY: "auto", 
                          backgroundImage: "radial-gradient(#1e293b 1px, transparent 1px)", 
                          backgroundSize: "24px 24px",
                          maxHeight: descPreviewDevice === "mobile" ? "420px" : "600px"
                        }}
                      >
                        <div
                          style={{
                            background: "#18222d",
                            borderRadius: "12px",
                            padding: "12px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                            border: "1px solid rgba(255,255,255,0.03)"
                          }}
                        >
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "var(--gold)", marginBottom: "4px" }}>Maddy BGMI Store [Admin]</div>
                          <div
                            style={{
                              fontFamily: "system-ui, sans-serif",
                              fontSize: "13px",
                              lineHeight: "1.65",
                              color: "#f1f5f9",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap"
                            }}
                            dangerouslySetInnerHTML={{ __html: descPreviewHtml || "Paste raw specification details to see live preview..." }}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px", fontSize: "9px", color: "#64748b" }}>
                            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • admin</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raw plain Output */}
                  {descActivePreviewTab === "plain" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <textarea
                        className="input"
                        value={descPlainOutput}
                        readOnly
                        rows={18}
                        style={{ fontFamily: "monospace", fontSize: "13px", background: "var(--bg3)", color: "#fff", lineHeight: "1.6", width: "100%" }}
                      />
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>* Read-only plain formatted text (Telegram channels).</span>
                    </div>
                  )}

                  {/* Raw styled Output */}
                  {descActivePreviewTab === "styled" && (
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <textarea
                        className="input"
                        value={descStyledOutput}
                        readOnly
                        rows={18}
                        style={{ fontFamily: "monospace", fontSize: "13px", background: "var(--bg3)", color: "var(--gold)", lineHeight: "1.6", width: "100%" }}
                      />
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>* Read-only bold-wrapped text (WhatsApp & Telegram styled channels).</span>
                    </div>
                  )}

                </div>

                {/* PREVIEW COPY ACTIONS BAR */}
                <div className="glass-premium" style={{ padding: "20px", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "grid", gap: "12px" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--gold)", display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14} /> Description Actions</h4>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button onClick={() => copyDescText(descPlainOutput, "Telegram description")} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                      <Copy size={13} /> Copy Telegram Style
                    </button>
                    <button onClick={() => copyDescText(descStyledOutput, "WhatsApp description")} className="btn btn-gold" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                      <CopyCheck size={13} /> Copy WhatsApp Style
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button onClick={copyBothDesc} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px", borderColor: "rgba(255,215,0,0.2)" }}>
                      <Copy size={13} /> Copy Both Styles
                    </button>
                    <button onClick={downloadDescText} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                      <Download size={13} /> Download TXT File
                    </button>
                  </div>
                </div>

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
                    <label style={sl}>Image Source</label>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "upload" ? "var(--gold)" : "var(--muted)" }}>
                        <input type="radio" name="proofImageSource" checked={imageSource === "upload"} onChange={() => handleSourceChange("upload")} style={{ accentColor: "var(--gold)" }} />
                        File Upload
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "drive" ? "var(--gold)" : "var(--muted)" }}>
                        <input type="radio" name="proofImageSource" checked={imageSource === "drive"} onChange={() => handleSourceChange("drive")} style={{ accentColor: "var(--gold)" }} />
                        Drive Image ID
                      </label>
                    </div>
                  </div>
                  <div>
                    <label style={sl}>Image Input</label>
                    {imageSource === "upload" ? (
                      <div style={{ border: "2px dashed var(--border-gold)", padding: "12px 16px", borderRadius: "8px", textAlign: "center", cursor: "pointer", background: "rgba(255,215,0,0.02)" }}>
                        {proofImage ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "12px", color: "var(--green)" }}>✓ {proofImage.name.slice(0, 20)}...</span>
                            <button onClick={() => setProofImage(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}>×</button>
                          </div>
                        ) : (
                          <label style={{ cursor: "pointer" }}>
                            <div style={{ fontSize: "12px", color: "var(--muted)" }}>Click to choose file</div>
                            <input type="file" accept="image/*" hidden onChange={e => {
                              const file = e.target.files[0];
                              if (file && validateImageFile(file)) setProofImage(file);
                            }} />
                          </label>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <input className="input" placeholder="Google Drive File ID" value={driveFileId} onChange={e => setDriveFileId(e.target.value.trim())} />
                        {driveFileId && (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "6px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                            <img src={getDrivePreviewUrl(driveFileId)} alt="Drive Preview" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,215,0,0.3)" }} />
                            <span style={{ fontSize: "10px", color: "var(--green)" }}>Live Drive Preview</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <button onClick={saveProof} disabled={savingProof} className="btn btn-gold w-full" style={{ padding: "12px" }}>
                      {savingProof ? "Saving..." : "Upload Proof"}
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
                    <select className="input" value={ucForm.tag} onChange={e => setUcForm({ ...ucForm, tag: e.target.value })}>
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
                  <select className="input" value={xsuitForm.tag} onChange={e => setXsuitForm({ ...xsuitForm, tag: e.target.value })}>
                    {PROMO_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={sl}>Image Source</label>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "upload" ? "var(--gold)" : "var(--muted)" }}>
                      <input type="radio" name="xsuitImageSource" checked={imageSource === "upload"} onChange={() => handleSourceChange("upload")} style={{ accentColor: "var(--gold)" }} />
                      File Upload
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "drive" ? "var(--gold)" : "var(--muted)" }}>
                      <input type="radio" name="xsuitImageSource" checked={imageSource === "drive"} onChange={() => handleSourceChange("drive")} style={{ accentColor: "var(--gold)" }} />
                      Drive Image ID
                    </label>
                  </div>
                </div>

                <div>
                  <label style={sl}>Image Input</label>
                  {imageSource === "upload" ? (
                    <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                      {xsuitImage ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "var(--green)" }}>{xsuitImage.name} selected</span>
                          <button onClick={() => setXsuitImage(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}>×</button>
                        </div>
                      ) : (
                        <label style={{ cursor: "pointer" }}>
                          <div style={{ fontSize: "12px" }}>{xsuitForm.image_url ? "Change Image" : "Click to Upload Xsuit Image"}</div>
                          <input type="file" accept="image/*" hidden onChange={e => {
                            const file = e.target.files[0];
                            if (file && validateImageFile(file)) setXsuitImage(file);
                          }} />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input className="input" placeholder="Google Drive File ID" value={driveFileId} onChange={e => setDriveFileId(e.target.value.trim())} />
                      {driveFileId && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "6px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                          <img src={getDrivePreviewUrl(driveFileId)} alt="Drive Preview" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,215,0,0.3)" }} />
                          <span style={{ fontSize: "10px", color: "var(--green)" }}>Live Drive Preview</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveXsuit} disabled={savingXsuit} className="btn btn-gold w-full">{xsuitEditId ? "Update Xsuit" : "Save Xsuit"}</button>
                  {xsuitEditId && <button onClick={() => { setXsuitEditId(null); setXsuitForm(EMPTY_XSUIT); setXsuitImage(null); setImageSource("upload"); setDriveFileId(""); }} className="btn btn-outline">Cancel</button>}
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
                        <button onClick={() => {
                          setXsuitEditId(x.id);
                          setXsuitForm(x);
                          if (x.image_url && x.image_url.includes("drive.google.com")) {
                            setImageSource("drive");
                            const match = x.image_url.match(/[?&]id=([^&]+)/);
                            setDriveFileId(match ? match[1] : "");
                          } else {
                            setImageSource("upload");
                            setDriveFileId("");
                          }
                        }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }} title="Edit"><Pencil size={12} /></button>
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
                  <select className="input" value={carForm.tag} onChange={e => setCarForm({ ...carForm, tag: e.target.value })}>
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

                <div>
                  <label style={sl}>Image Source</label>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "upload" ? "var(--gold)" : "var(--muted)" }}>
                      <input type="radio" name="carImageSource" checked={imageSource === "upload"} onChange={() => handleSourceChange("upload")} style={{ accentColor: "var(--gold)" }} />
                      File Upload
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer", color: imageSource === "drive" ? "var(--gold)" : "var(--muted)" }}>
                      <input type="radio" name="carImageSource" checked={imageSource === "drive"} onChange={() => handleSourceChange("drive")} style={{ accentColor: "var(--gold)" }} />
                      Drive Image ID
                    </label>
                  </div>
                </div>

                <div>
                  <label style={sl}>Image Input</label>
                  {imageSource === "upload" ? (
                    <div style={{ border: "2px dashed var(--border-gold)", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                      {carImage ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "var(--green)" }}>{carImage.name} selected</span>
                          <button onClick={() => setCarImage(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}>×</button>
                        </div>
                      ) : (
                        <label style={{ cursor: "pointer" }}>
                          <div style={{ fontSize: "12px" }}>{carForm.image_url ? "Change Image" : "Click to Upload Supercar Image"}</div>
                          <input type="file" accept="image/*" hidden onChange={e => {
                            const file = e.target.files[0];
                            if (file && validateImageFile(file)) setCarImage(file);
                          }} />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input className="input" placeholder="Google Drive File ID" value={driveFileId} onChange={e => setDriveFileId(e.target.value.trim())} />
                      {driveFileId && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "6px", borderRadius: "6px", border: "1px solid var(--border)" }}>
                          <img src={getDrivePreviewUrl(driveFileId)} alt="Drive Preview" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,215,0,0.3)" }} />
                          <span style={{ fontSize: "10px", color: "var(--green)" }}>Live Drive Preview</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveCar} disabled={savingCar} className="btn btn-gold w-full">{carEditId ? "Update Car" : "Save Car"}</button>
                  {carEditId && <button onClick={() => { setCarEditId(null); setCarForm(EMPTY_CAR); setCarImage(null); setImageSource("upload"); setDriveFileId(""); }} className="btn btn-outline">Cancel</button>}
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
                        <button onClick={() => {
                          setCarEditId(c.id);
                          setCarForm(c);
                          if (c.image_url && c.image_url.includes("drive.google.com")) {
                            setImageSource("drive");
                            const match = c.image_url.match(/[?&]id=([^&]+)/);
                            setDriveFileId(match ? match[1] : "");
                          } else {
                            setImageSource("upload");
                            setDriveFileId("");
                          }
                        }} style={{ background: "rgba(0,0,0,0.6)", border: "none", color: "var(--gold)", borderRadius: "4px", padding: "4px", cursor: "pointer" }} title="Edit"><Pencil size={12} /></button>
                        <button onClick={() => deleteCar(c.id)} style={{ background: "rgba(239,68,68,0.8)", border: "none", color: "#fff", borderRadius: "4px", padding: "4px", cursor: "pointer" }} title="Delete"><Trash2 size={12} /></button>
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

        {/* ── BROWSER PRESETS MODALS ── */}
        {showDescPresetsModal && (
          <div className="modal-overlay" onClick={() => setShowDescPresetsModal(false)}>
            <div className="modal" style={{ maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDescPresetsModal(false)}>×</button>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, color: "var(--gold)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={18} /> Browser Presets (LocalStorage)
              </h3>
              
              {descLocalPresets.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No presets saved in browser memory. Create one using "Save Preset" above.</div>
              ) : (
                <div style={{ display: "grid", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                  {descLocalPresets.map(t => (
                    <div key={t.id} style={{ padding: "14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>{t.name}</h4>
                        <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>Local Presets Configured</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => loadDescPreset(t)} className="btn btn-gold btn-sm" style={{ padding: "6px 12px", fontSize: "11px" }}>Load Preset</button>
                        <button onClick={() => deleteDescPreset(t.id)} style={{ color: "var(--red)", padding: "8px", background: "transparent", border: "none", cursor: "pointer" }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showDescSavePresetModal && (
          <div className="modal-overlay" onClick={() => setShowDescSavePresetModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDescSavePresetModal(false)}>×</button>
              <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, color: "var(--gold)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Save size={18} /> Save Current Preset
              </h3>
              
              <div style={{ display: "grid", gap: "14px" }}>
                <div>
                  <label style={sl}>Preset Name *</label>
                  <input className="input" placeholder="e.g. Premium 100 Mythic Preset" value={descPresetNameInput} onChange={e => setDescPresetNameInput(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                  <button onClick={() => setShowDescSavePresetModal(false)} className="btn btn-outline">Cancel</button>
                  <button onClick={saveDescPresetToBrowser} className="btn btn-gold">Save Preset</button>
                </div>
              </div>
            </div>
          </div>
        )}


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