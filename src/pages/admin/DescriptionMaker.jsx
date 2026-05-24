import { useState, useEffect, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";
import {
  Copy,
  Plus,
  Trash2,
  Save,
  BookOpen,
  Zap,
  RotateCcw,
  Smartphone,
  Download,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders,
  CopyCheck,
  Eye,
  Check
} from "lucide-react";

// Standard Blank Form Structure
const BLANK_FORM = {
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

// Helper to capitalize strings
const capitalizeWords = (str) => {
  if (!str) return "";
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

// Auto-expand WhatsApp links securely
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

export default function DescriptionMaker() {
  const [rawText, setRawText] = useState("");
  const [form, setForm] = useState(BLANK_FORM);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState("whatsapp"); // whatsapp, telegram, plain, styled
  const [previewDevice, setPreviewDevice] = useState("mobile"); // mobile, desktop
  
  // Local Storage Presets
  const [localPresets, setLocalPresets] = useState([]);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState("");

  // Load local presets on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mbs_bgmi_presets");
      if (saved) setLocalPresets(JSON.parse(saved));
    } catch (e) {
      console.warn("Could not load presets", e);
    }
  }, []);

  // ── INTELLIGENT REAL-TIME PARSING ENGINE ───────────────────
  const parseRawText = (text) => {
    if (!text.trim()) return;

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const parsed = {
      ...BLANK_FORM,
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

      // ── Unstructured Fallbacks (Line-by-line keyword parsing) ──
      
      // Price
      if (lower.includes("price") || lower.includes("inr") || lower.includes("cost") || lower.includes("price")) {
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

      // Fallback dynamic detections (no headers)
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

      // Conqueror Frame or titles detection
      if (lower.includes("conqueror") || lower.includes("veteran") || lower.includes("glorious") || lower.includes("tyrant") || lower.includes("gloriou")) {
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

    setForm(parsed);
    toast.success("AI parsed raw data successfully!", { duration: 1500 });
  };

  // Trigger parsing on text change
  const handleRawTextChange = (val) => {
    setRawText(val);
    parseRawText(val);
  };

  // ── SMART CALCULATIONS (EXACT BRAND STYLE) ──────────────────
  const calculatedStats = useMemo(() => {
    const mythics = form.mythicFashion || "0";
    const totalWeapons = form.gunLabs.length;
    const killFeeds = form.killFeeds || "0";

    const upgradedVehicles = form.vehicles.filter(v => {
      const lvl = String(v.upgradeLevel).toLowerCase();
      return lvl.includes("max") || lvl.includes("lvl 3") || parseInt(lvl) > 1;
    }).length;

    const supercarsCount = form.vehicles.filter(v => {
      const name = v.name.toLowerCase();
      return name.includes("bugatti") || name.includes("ssc") || name.includes("lamborghini") || name.includes("ferrari") || name.includes("pagani") || name.includes("aston") || name.includes("koenigsegg");
    }).length;

    // Auto-generate premium highlight summary EXACTLY:
    // Bgmi 100 Mythics +M416 Sealed Nether + Shinobi (On Hit) Combo + Ignis Xsuit LvL 4 + 42xTotal Gun Labs[19x Kill Feeds] + 3xSupercars + 4xUpgraded Vehicles🌟
    let weaponHighlight = "";
    const onHitGuns = form.gunLabs.filter(g => g.effectType?.toLowerCase().includes("on hit") || parseInt(g.level) >= 5);
    if (onHitGuns.length >= 2) {
      const w1 = onHitGuns[0].name.replace("M416 ", "").replace("m416 ", "");
      const w2 = onHitGuns[1].name.replace("M416 ", "").replace("m416 ", "");
      weaponHighlight = `+M416 ${w1} + ${w2} (On Hit) Combo`;
    } else if (onHitGuns.length === 1) {
      weaponHighlight = `+${onHitGuns[0].name} LvL ${onHitGuns[0].level}`;
    } else if (form.gunLabs.length > 0) {
      weaponHighlight = `+${form.gunLabs[0].name} LvL ${form.gunLabs[0].level}`;
    }

    let xsuitHighlight = "";
    if (form.xsuits.length > 0) {
      xsuitHighlight = ` + ${form.xsuits[0].name} LvL ${form.xsuits[0].level}`;
    }

    const highlightSummary = `Bgmi ${mythics} Mythics ${weaponHighlight}${xsuitHighlight} + ${totalWeapons}xTotal Gun Labs[${killFeeds}x Kill Feeds] + ${supercarsCount}xSupercars + ${upgradedVehicles}xUpgraded Vehicles🌟`;

    return {
      xsuitsCount: form.xsuits.length,
      gunLabsCount: totalWeapons,
      supercarsCount,
      upgradedVehicles,
      highlightSummary
    };
  }, [form]);

  // ── DYNAMIC DESCRIPTION GENERATOR ───────────────────────────
  const plainOutput = useMemo(() => {
    const parts = [];

    // Stock & Post Tags
    if (form.stockTag) parts.push(form.stockTag);
    if (form.postTag) parts.push(form.postTag);

    parts.push(""); // Spacing

    // Deal Title Enclosure
    if (form.dealTitle) {
      parts.push(form.dealTitle);
      parts.push("");
    }

    // Main highlight line
    parts.push(`🇮🇳 ${form.highlight || calculatedStats.highlightSummary}`);
    parts.push("");

    // Details Grid
    parts.push(` 🎖Account Level - ${form.level || "—"}`);
    parts.push(`🎀Pro Collector - (${form.proCollector || "0"})`);
    parts.push(`👑Mythic Fashion - (${form.mythicFashion || "0"}/100)`);
    parts.push(`👑Ultimate Mythic Fashion - (${form.ultimateFashion || "0"})`);

    // Titles comma separation
    if (form.titles) {
      const list = form.titles.split(",").map(t => t.trim()).filter(Boolean);
      list.forEach(title => {
        parts.push(`🌟${title}`);
      });
    }

    // XSUITS (Gender aware emojis)
    if (form.xsuits && form.xsuits.length > 0) {
      form.xsuits.forEach((x, idx) => {
        const prefix = idx === 0 ? " 🤴👸" : "👸";
        parts.push(`${prefix}${x.name} LvL ${x.level}`);
      });
    }

    // GUN LABS SECTION (With intelligent groupings for clean mobile post layouts)
    if (form.gunLabs && form.gunLabs.length > 0) {
      parts.push("");
      parts.push(`🔫Gun Labs [${form.gunLabs.length}] `);
      
      const highGuns = form.gunLabs.filter(g => parseInt(g.level) >= 5 || g.level.toLowerCase().includes("maxed"));
      const lvl4Guns = form.gunLabs.filter(g => g.level === "4");
      const lvl3Guns = form.gunLabs.filter(g => g.level === "3");
      const lvl2Guns = form.gunLabs.filter(g => g.level === "2");
      const lvl1Guns = form.gunLabs.filter(g => g.level === "1" || g.level === "");

      // 1. High level guns (Level >= 5): individual lines
      highGuns.forEach(g => {
        const eff = g.effectType ? `[${g.effectType}]` : "";
        parts.push(`🎃${g.name} LvL - ${g.level}${eff}`);
      });

      // 2. Level 4 guns: grouped 2 per line
      for (let i = 0; i < lvl4Guns.length; i += 2) {
        const chunk = lvl4Guns.slice(i, i + 2);
        const line = chunk.map(g => {
          const eff = g.effectType ? `[${g.effectType}]` : "";
          return `🎃${g.name} LvL - ${g.level}${eff}`;
        }).join(" ");
        parts.push(line);
      }

      // 3. Level 3 guns: grouped 2 per line
      for (let i = 0; i < lvl3Guns.length; i += 2) {
        const chunk = lvl3Guns.slice(i, i + 2);
        const line = chunk.map(g => {
          const eff = g.effectType ? `[${g.effectType}]` : "";
          return `🎃${g.name} LvL - ${g.level}${eff}`;
        }).join(" ");
        parts.push(line);
      }

      // 4. Level 2 guns: grouped 3 per line
      for (let i = 0; i < lvl2Guns.length; i += 3) {
        const chunk = lvl2Guns.slice(i, i + 3);
        const line = chunk.map(g => {
          return `🎃${g.name} LvL - ${g.level}`;
        }).join(" ");
        parts.push(line);
      }

      // 5. Level 1 guns: grouped 5 per line
      for (let i = 0; i < lvl1Guns.length; i += 5) {
        const chunk = lvl1Guns.slice(i, i + 5);
        const line = chunk.map(g => {
          return `🎃${g.name} LvL - ${g.level}`;
        }).join(" ");
        parts.push(line);
      }
    }

    // OUTFITS & SETS (Detects ultimate mummy/weapon titles)
    if (form.outfits && form.outfits.length > 0) {
      parts.push("");
      form.outfits.forEach(o => {
        const isUlt = o.isUltimate || o.name.toLowerCase().includes("ultimate") || o.name.toLowerCase().includes("mummy") || o.name.toLowerCase().includes("set ultimate");
        if (isUlt) {
          const cleanName = o.name.replace(/ultimate/gi, "").replace(/\(Ultimate\)/gi, "").replace(/set/gi, "").trim();
          parts.push(`❤️🔥${cleanName} Set (Ultimate)`);
        } else {
          parts.push(`❤️${o.name}`);
        }
      });

      // Stats aggregation prefixing
      parts.push(`❤️${form.killFeeds || "0"}xTotal KillFeeds`);
      parts.push(`❤️${form.gunLabs.length}xTotal GunLabs`);
      parts.push(`❤️Pets - ${form.pets || "Null"}`);
      parts.push(`❤️Characters - ${form.characters || "None"}`);
    }

    // VEHICLES (Simulate exact leading space layout)
    if (form.vehicles && form.vehicles.length > 0) {
      parts.push("");
      parts.push(`🚗Vehicles🏍️`);
      form.vehicles.forEach((v, idx) => {
        const typeStr = v.type ? `(${v.type})` : "";
        const levelStr = v.upgradeLevel && v.upgradeLevel !== "1" ? ` (LvL ${v.upgradeLevel})` : "";
        const prefix = idx === 0 ? " 🏎" : "🏎";
        parts.push(`${prefix}${v.name}${typeStr}${levelStr}`);
      });
    }

    // LOGINS, PRICE, CONTACT
    parts.push("");
    parts.push(`🔐Logins : ${form.loginDetails || "—"} ✅`);
    parts.push("");
    if (form.price) {
      parts.push(`🔖Price - ₹${form.price} INR ✅️`);
    }
    parts.push("");
    const waLink = getWhatsappLink(form.whatsappPhone);
    parts.push(`📥DM WHATSAPP ${waLink}`);

    return parts.join("\n");
  }, [form, calculatedStats]);

  // WhatsApp formatted: wraps all non-empty lines with asterisks
  const styledOutput = useMemo(() => {
    if (!plainOutput) return "";
    return plainOutput
      .split("\n")
      .map(line => {
        if (line.trim() === "") return "";
        return `*${line}*`;
      })
      .join("\n");
  }, [plainOutput]);

  const previewHtml = useMemo(() => {
    if (!styledOutput) return "";
    let escaped = styledOutput
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    escaped = escaped.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    return escaped.replace(/\n/g, "<br/>");
  }, [styledOutput]);

  // Form Field Changers
  const handleInputChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  // Local Storage Preset Savers
  const savePresetToBrowser = () => {
    if (!presetNameInput.trim()) return toast.error("Preset name required!");
    try {
      const newPreset = {
        id: Date.now(),
        name: presetNameInput,
        form_data: form
      };
      const updated = [...localPresets, newPreset];
      setLocalPresets(updated);
      localStorage.setItem("mbs_bgmi_presets", JSON.stringify(updated));
      toast.success(`Preset "${presetNameInput}" saved in browser!`);
      setPresetNameInput("");
      setShowSavePresetModal(false);
    } catch (e) {
      toast.error("Failed to save local preset.");
    }
  };

  const loadPreset = (preset) => {
    if (confirm(`Load preset "${preset.name}"? Current progress will be overwritten.`)) {
      setForm(preset.form_data);
      setShowPresetsModal(false);
      toast.success(`Preset "${preset.name}" loaded!`);
    }
  };

  const deletePreset = (id) => {
    if (!confirm("Remove this preset from browser memory?")) return;
    const updated = localPresets.filter(p => p.id !== id);
    setLocalPresets(updated);
    localStorage.setItem("mbs_bgmi_presets", JSON.stringify(updated));
    toast.success("Preset deleted");
  };

  // Copy Features
  const copyText = async (text, label) => {
    if (!text) return toast.error("No description generated!");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (e) {
      toast.error("Clipboard copy failed.");
    }
  };

  const copyBoth = () => {
    const combined = `=== WHATSAPP DESCRIPTION ===\n${styledOutput}\n\n=== TELEGRAM DESCRIPTION ===\n${plainOutput}`;
    copyText(combined, "Both descriptions");
  };

  const downloadText = () => {
    if (!plainOutput) return toast.error("No description to download!");
    const element = document.createElement("a");
    const file = new Blob([plainOutput], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "bgmi-deal-description.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("TXT File downloaded!");
  };

  // Field Array Adders (For direct form tune-ups)
  const addFieldItem = (field, item) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeFieldItem = (field, index) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, idx) => idx !== index) }));
  };

  const updateFieldItem = (field, index, subField, val) => {
    setForm(prev => {
      const updated = [...prev[field]];
      updated[index] = { ...updated[index], [subField]: val };
      return { ...prev, [field]: updated };
    });
  };

  return (
    <AdminLayout title="BGMI AI Description Factory">
      <div className="bgmi-maker-container" style={{ display: "grid", gap: "24px", minHeight: "100%", color: "var(--text)" }}>
        
        {/* PRESET LOAD SAVE HUD */}
        <div className="glass-premium" style={{ padding: "14px 20px", borderRadius: "var(--radius)", border: "1px solid var(--border-gold)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", background: "rgba(255,215,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px", fontWeight: "800", color: "var(--gold)" }}><Sparkles size={16} style={{ display: "inline", marginRight: "4px" }} /> AI Description Factory</span>
            <span style={{ fontSize: "11px", background: "var(--green)", color: "#000", padding: "2px 6px", borderRadius: "4px", fontWeight: "900", textTransform: "uppercase" }}>100% Client Side</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowPresetsModal(true)} className="btn btn-outline btn-sm">
              <BookOpen size={13} /> Browser Presets ({localPresets.length})
            </button>
            <button onClick={() => setShowSavePresetModal(true)} className="btn btn-outline btn-sm" style={{ borderColor: "rgba(255,215,0,0.3)", color: "var(--gold)" }}>
              <Save size={13} /> Save Preset
            </button>
            <button onClick={() => { setRawText(""); setForm(BLANK_FORM); toast.success("Reset successfully!"); }} className="btn btn-red btn-sm">
              <RotateCcw size={13} /> Clear Input
            </button>
          </div>
        </div>

        {/* METRICS HUD CARD */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Mythics Detected</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{form.mythicFashion || "0"}</div>
          </div>
          <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>X-Suits Detected</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{calculatedStats.xsuitsCount}</div>
          </div>
          <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Weapon Labs Detected</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{calculatedStats.gunLabsCount}</div>
          </div>
          <div className="glass-premium" style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Vehicles Detected</div>
            <div style={{ fontSize: "24px", fontWeight: "900", color: "var(--gold)", marginTop: "4px" }}>{form.vehicles.length}</div>
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
                style={{ fontFamily: "var(--font-b)", fontSize: "14px", lineHeight: "1.6", background: "var(--bg3)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: "8px" }}
                placeholder={`Example Paste Structure:\n\n${PLACEHOLDER_RAW}`}
                value={rawText}
                onChange={e => handleRawTextChange(e.target.value)}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "14px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleRawTextChange(PLACEHOLDER_RAW)}
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
                onClick={() => setIsFormExpanded(!isFormExpanded)}
                style={{ padding: "16px 24px", background: "rgba(255,255,255,0.015)", borderBottom: isFormExpanded ? "1px solid var(--border)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              >
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--gold)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sliders size={15} /> FINE-TUNE PARSED DATA (MANUAL EDITING)
                </h4>
                {isFormExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {isFormExpanded && (
                <div style={{ padding: "24px", display: "grid", gap: "20px" }}>
                  
                  {/* Basic specifications */}
                  <div style={{ display: "grid", gap: "14px" }}>
                    <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "4px" }}>Basic Info</h5>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={sl}>Stock Tag</label>
                        <input className="input" value={form.stockTag} onChange={e => handleInputChange("stockTag", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Post Tag</label>
                        <input className="input" value={form.postTag} onChange={e => handleInputChange("postTag", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={sl}>Main Highlight Summary (Overriding Summary Banner)</label>
                      <input className="input" value={form.highlight} onChange={e => handleInputChange("highlight", e.target.value)} placeholder={calculatedStats.highlightSummary} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={sl}>Level</label>
                        <input className="input" value={form.level} onChange={e => handleInputChange("level", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Pro Collector</label>
                        <input className="input" value={form.proCollector} onChange={e => handleInputChange("proCollector", e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={sl}>Mythics Count</label>
                        <input className="input" value={form.mythicFashion} onChange={e => handleInputChange("mythicFashion", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Ultimate Count</label>
                        <input className="input" value={form.ultimateFashion} onChange={e => handleInputChange("ultimateFashion", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Price</label>
                        <input className="input" value={form.price} onChange={e => handleInputChange("price", e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={sl}>WhatsApp DM Phone</label>
                        <input className="input" value={form.whatsappPhone} onChange={e => handleInputChange("whatsappPhone", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Logins details</label>
                        <input className="input" value={form.loginDetails} onChange={e => handleInputChange("loginDetails", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={sl}>Titles (Comma separated)</label>
                      <input className="input" value={form.titles} onChange={e => handleInputChange("titles", e.target.value)} />
                    </div>
                  </div>

                  {/* Section 2: X-Suits list */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>X-Suits</h5>
                      <button onClick={addXsuit} style={{ fontSize: "11px", color: "var(--gold)" }}>+ Add Xsuit</button>
                    </div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {form.xsuits.map((x, index) => (
                        <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input className="input" style={{ flex: 3 }} placeholder="Name" value={x.name} onChange={e => updateFieldItem("xsuits", index, "name", e.target.value)} />
                          <input className="input" style={{ flex: 1 }} placeholder="Level" value={x.level} onChange={e => updateFieldItem("xsuits", index, "level", e.target.value)} />
                          <button onClick={() => removeFieldItem("xsuits", index)} style={{ color: "var(--red)", padding: "4px" }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Weapon Gun Labs */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Gun Labs</h5>
                      <button onClick={addGunLab} style={{ fontSize: "11px", color: "var(--gold)" }}>+ Add Weapon</button>
                    </div>
                    <div style={{ display: "grid", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                      {form.gunLabs.map((g, index) => (
                        <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input className="input" style={{ flex: 3 }} placeholder="Weapon Name" value={g.name} onChange={e => updateFieldItem("gunLabs", index, "name", e.target.value)} />
                          <input className="input" style={{ flex: 1.2 }} placeholder="Lvl" value={g.level} onChange={e => updateFieldItem("gunLabs", index, "level", e.target.value)} />
                          <input className="input" style={{ flex: 2 }} placeholder="Effect Type" value={g.effectType} onChange={e => updateFieldItem("gunLabs", index, "effectType", e.target.value)} />
                          <button onClick={() => removeFieldItem("gunLabs", index)} style={{ color: "var(--red)", padding: "4px" }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: Outfits */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Outfits & Sets</h5>
                      <button onClick={addOutfit} style={{ fontSize: "11px", color: "var(--gold)" }}>+ Add Outfit</button>
                    </div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {form.outfits.map((o, index) => (
                        <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input className="input" style={{ flex: 4 }} placeholder="Set Name" value={o.name} onChange={e => updateFieldItem("outfits", index, "name", e.target.value)} />
                          <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", whiteSpace: "nowrap" }}>
                            <input type="checkbox" checked={o.isUltimate} onChange={e => updateFieldItem("outfits", index, "isUltimate", e.target.checked)} />
                            Ultimate
                          </label>
                          <button onClick={() => removeFieldItem("outfits", index)} style={{ color: "var(--red)", padding: "4px" }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 5: Vehicles */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Vehicles</h5>
                      <button onClick={addVehicle} style={{ fontSize: "11px", color: "var(--gold)" }}>+ Add Vehicle</button>
                    </div>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {form.vehicles.map((v, index) => (
                        <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input className="input" style={{ flex: 3 }} placeholder="Vehicle Name" value={v.name} onChange={e => updateFieldItem("vehicles", index, "name", e.target.value)} />
                          <input className="input" style={{ flex: 1.5 }} placeholder="Type" value={v.type} onChange={e => updateFieldItem("vehicles", index, "type", e.target.value)} />
                          <input className="input" style={{ flex: 1.5 }} placeholder="Lvl" value={v.upgradeLevel} onChange={e => updateFieldItem("vehicles", index, "upgradeLevel", e.target.value)} />
                          <button onClick={() => removeFieldItem("vehicles", index)} style={{ color: "var(--red)", padding: "4px" }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Extra Details */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <h5 style={{ fontSize: "12px", fontWeight: "800", color: "var(--orange)" }}>Extras & Summary</h5>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div>
                        <label style={sl}>Kill Feeds</label>
                        <input className="input" value={form.killFeeds} onChange={e => handleInputChange("killFeeds", e.target.value)} />
                      </div>
                      <div>
                        <label style={sl}>Pets / Buddies</label>
                        <input className="input" value={form.pets} onChange={e => handleInputChange("pets", e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={sl}>Characters Available</label>
                      <input className="input" value={form.characters} onChange={e => handleInputChange("characters", e.target.value)} />
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
                <button onClick={() => setActivePreviewTab("whatsapp")} className={`admin-tab-btn ${activePreviewTab === "whatsapp" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                  🟢 WhatsApp View
                </button>
                <button onClick={() => setActivePreviewTab("telegram")} className={`admin-tab-btn ${activePreviewTab === "telegram" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                  🔵 Telegram View
                </button>
                <button onClick={() => setActivePreviewTab("plain")} className={`admin-tab-btn ${activePreviewTab === "plain" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                  📄 Telegram Raw
                </button>
                <button onClick={() => setActivePreviewTab("styled")} className={`admin-tab-btn ${activePreviewTab === "styled" ? "active" : ""}`} style={{ fontSize: "11px", padding: "6px 12px" }}>
                  ✨ WhatsApp Styled
                </button>
              </div>

              {/* Mobile desktop layout toggle */}
              {(activePreviewTab === "whatsapp" || activePreviewTab === "telegram") && (
                <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "2px" }}>
                  <button onClick={() => setPreviewDevice("mobile")} style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", background: previewDevice === "mobile" ? "var(--gold)" : "transparent", color: previewDevice === "mobile" ? "#000" : "var(--muted)", fontWeight: "bold" }}>
                    Mobile
                  </button>
                  <button onClick={() => setPreviewDevice("desktop")} style={{ fontSize: "10px", padding: "3px 6px", borderRadius: "4px", background: previewDevice === "desktop" ? "var(--gold)" : "transparent", color: previewDevice === "desktop" ? "#000" : "var(--muted)", fontWeight: "bold" }}>
                    Full
                  </button>
                </div>
              )}
            </div>

            {/* PREVIEW CONTAINER */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              
              {/* WhatsApp Bubble Preview */}
              {activePreviewTab === "whatsapp" && (
                <div
                  style={{
                    width: "100%",
                    maxWidth: previewDevice === "mobile" ? "370px" : "100%",
                    aspectRatio: previewDevice === "mobile" ? "9/16" : "auto",
                    minHeight: previewDevice === "mobile" ? "auto" : "550px",
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
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gold-dim)", border: "1px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontWeight: "800", fontSize: "11px" }}>MB</div>
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
                      maxHeight: previewDevice === "mobile" ? "420px" : "600px"
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
                        dangerouslySetInnerHTML={{ __html: previewHtml || "Paste raw specification details on the left to see live chat preview..." }}
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
              {activePreviewTab === "telegram" && (
                <div
                  style={{
                    width: "100%",
                    maxWidth: previewDevice === "mobile" ? "370px" : "100%",
                    aspectRatio: previewDevice === "mobile" ? "9/16" : "auto",
                    minHeight: previewDevice === "mobile" ? "auto" : "550px",
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
                      maxHeight: previewDevice === "mobile" ? "420px" : "600px"
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
                        dangerouslySetInnerHTML={{ __html: previewHtml || "Paste raw specification details to see live preview..." }}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px", fontSize: "9px", color: "#64748b" }}>
                        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • admin</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw plain Output */}
              {activePreviewTab === "plain" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <textarea
                    className="input"
                    value={plainOutput}
                    readOnly
                    rows={18}
                    style={{ fontFamily: "monospace", fontSize: "13px", background: "var(--bg3)", color: "#fff", lineHeight: "1.6" }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>* Read-only plain formatted text (Telegram channels).</span>
                </div>
              )}

              {/* Raw styled Output */}
              {activePreviewTab === "styled" && (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <textarea
                    className="input"
                    value={styledOutput}
                    readOnly
                    rows={18}
                    style={{ fontFamily: "monospace", fontSize: "13px", background: "var(--bg3)", color: "var(--gold)", lineHeight: "1.6" }}
                  />
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>* Read-only bold-wrapped text (WhatsApp & Telegram styled channels).</span>
                </div>
              )}

            </div>

            {/* PREVIEW COPY ACTIONS BAR */}
            <div className="glass-premium" style={{ padding: "20px", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "grid", gap: "12px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--gold)", display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14} /> Description Actions</h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={() => copyText(plainOutput, "Telegram description")} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                  <Copy size={13} /> Copy Telegram Style
                </button>
                <button onClick={() => copyText(styledOutput, "WhatsApp description")} className="btn btn-gold" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                  <CopyCheck size={13} /> Copy WhatsApp Style
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={copyBoth} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px", borderColor: "rgba(255,215,0,0.2)" }}>
                  <Copy size={13} /> Copy Both Styles
                </button>
                <button onClick={downloadText} className="btn btn-outline" style={{ display: "flex", justifyContent: "center", gap: "8px", fontSize: "12px", padding: "10px" }}>
                  <Download size={13} /> Download TXT File
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── BROWSER PRESETS MODAL ── */}
      {showPresetsModal && (
        <div className="modal-overlay" onClick={() => setShowPresetsModal(false)}>
          <div className="modal" style={{ maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPresetsModal(false)}>×</button>
            <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, color: "var(--gold)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={18} /> Browser Presets (LocalStorage)
            </h3>
            
            {localPresets.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No presets saved in browser memory. Create one using "Save Preset" above.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                {localPresets.map(t => (
                  <div key={t.id} style={{ padding: "14px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>{t.name}</h4>
                      <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>Local Presets Configured</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => loadPreset(t)} className="btn btn-gold btn-sm" style={{ padding: "6px 12px", fontSize: "11px" }}>Load Preset</button>
                      <button onClick={() => deletePreset(t.id)} style={{ color: "var(--red)", padding: "8px" }} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SAVE PRESET MODAL ── */}
      {showSavePresetModal && (
        <div className="modal-overlay" onClick={() => setShowSavePresetModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSavePresetModal(false)}>×</button>
            <h3 style={{ fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 700, color: "var(--gold)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Save size={18} /> Save Current Preset
            </h3>
            
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={sl}>Preset Name *</label>
                <input className="input" placeholder="e.g. Premium 100 Mythic Preset" value={presetNameInput} onChange={e => setPresetNameInput(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button onClick={() => setShowSavePresetModal(false)} className="btn btn-outline">Cancel</button>
                <button onClick={savePresetToBrowser} className="btn btn-gold">Save Preset</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

const sl = { display: "block", fontSize: "11px", fontWeight: 600, color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" };
