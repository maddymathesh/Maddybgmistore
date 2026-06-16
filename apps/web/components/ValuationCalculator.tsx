"use client";

import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Car, 
  Sword, 
  Crown, 
  Info, 
  XCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus,
  RefreshCw,
  Trash2,
  FileText
} from "lucide-react";

// Types
interface XSuitItem {
  id: string;
  name: string;
  level: number; // 4 to 7
}

interface GunLabItem {
  id: string;
  weaponType: string; // "m416_glacier" | "m416_crimson" | "primary_other" | "secondary"
  level: number; // 4 to 8
}

interface CustomCarItem {
  id: string;
  type: "legendary" | "one_card" | "three_card";
  recency: "old" | "standard" | "latest";
}

// Gun Lab Option Definitions
const WEAPON_OPTIONS = [
  { value: "m416_crimson", label: "M416 Crimson (Primary)", isPrimary: true },
  { value: "m416_glacier", label: "M416 Glacier (Primary)", isPrimary: true },
  { value: "primary_other", label: "Other Primary (AKM, UMP, SCAR-L, S12K)", isPrimary: true },
  { value: "secondary", label: "Secondary Gun Lab (All Other Weapons)", isPrimary: false }
];

export default function ValuationCalculator() {
  // Description Parser Input
  const [descriptionText, setDescriptionText] = useState("");
  const [parseFeedback, setParseFeedback] = useState<string | null>(null);

  // Simple Counts
  const [rareMythics, setRareMythics] = useState(0);
  const [ultimateSets, setUltimateSets] = useState(0);

  // Lists
  const [xsuits, setXsuits] = useState<XSuitItem[]>([]);
  const [gunLabs, setGunLabs] = useState<GunLabItem[]>([]);
  const [cars, setCars] = useState<CustomCarItem[]>([]);

  // Appearance Features
  const [s4Ponytail, setS4Ponytail] = useState(false);
  const [s7Beard, setS7Beard] = useState(false);
  const [s2Hair, setS2Hair] = useState(false);

  // Reset Calculator
  const handleReset = () => {
    setRareMythics(0);
    setUltimateSets(0);
    setXsuits([]);
    setGunLabs([]);
    setCars([]);
    setS4Ponytail(false);
    setS7Beard(false);
    setS2Hair(false);
    setDescriptionText("");
    setParseFeedback(null);
  };

  // Add Item Helpers
  const addXSuit = () => {
    const newItem: XSuitItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "Raven / Pharaoh Suit",
      level: 4
    };
    setXsuits([...xsuits, newItem]);
  };

  const removeXSuit = (id: string) => {
    setXsuits(xsuits.filter(item => item.id !== id));
  };

  const updateXSuitLevel = (id: string, level: number) => {
    setXsuits(xsuits.map(item => item.id === id ? { ...item, level } : item));
  };

  const addGunLab = () => {
    const newItem: GunLabItem = {
      id: Math.random().toString(36).substr(2, 9),
      weaponType: "m416_glacier",
      level: 4
    };
    setGunLabs([...gunLabs, newItem]);
  };

  const removeGunLab = (id: string) => {
    setGunLabs(gunLabs.filter(item => item.id !== id));
  };

  const updateGunLabType = (id: string, weaponType: string) => {
    setGunLabs(gunLabs.map(item => item.id === id ? { ...item, weaponType } : item));
  };

  const updateGunLabLevel = (id: string, level: number) => {
    setGunLabs(gunLabs.map(item => item.id === id ? { ...item, level } : item));
  };

  const addCar = (type: "legendary" | "one_card" | "three_card") => {
    const newItem: CustomCarItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      recency: "standard"
    };
    setCars([...cars, newItem]);
  };

  const removeCar = (id: string) => {
    setCars(cars.filter(item => item.id !== id));
  };

  const updateCarRecency = (id: string, recency: "old" | "standard" | "latest") => {
    setCars(cars.map(item => item.id === id ? { ...item, recency } : item));
  };

  // Account Description Parser Logic
  const handleParseDescription = () => {
    if (!descriptionText.trim()) {
      setParseFeedback("Please enter a description to parse.");
      return;
    }

    const normalized = descriptionText.toLowerCase();
    
    // 1. Rare Mythics
    let mythicsParsed = 0;
    const mythicMatch = normalized.match(/(\d+)\s*(?:rare\s+)?mythic/);
    if (mythicMatch && mythicMatch[1]) {
      mythicsParsed = parseInt(mythicMatch[1]);
      setRareMythics(mythicsParsed);
    }

    // 2. Ultimate Sets
    let ultimatesParsed = 0;
    const ultimateMatch = normalized.match(/(\d+)\s*(?:rare\s+)?ultimate/);
    if (ultimateMatch && ultimateMatch[1]) {
      ultimatesParsed = parseInt(ultimateMatch[1]);
      setUltimateSets(ultimatesParsed);
    }

    // 3. Appearance
    const hasPony = normalized.includes("pony") || normalized.includes("ponytail");
    const hasBeard = normalized.includes("beard");
    const hasHair = normalized.includes("s2 hair") || normalized.includes("s2hair") || normalized.includes("season 2 hair") || normalized.includes("s2 hair");

    setS4Ponytail(hasPony);
    setS7Beard(hasBeard);
    setS2Hair(hasHair);

    // 4. X-Suits
    const parsedXsuits: XSuitItem[] = [];
    const xsuitMatches = normalized.matchAll(/(?:pharaoh|raven|poseidon|fiorenzo|silvanus|x-suit|xsuit|x\s+suit)\s*(?:lvl|level)?\s*([4-7])/g);
    for (const match of xsuitMatches) {
      if (match[1]) {
        parsedXsuits.push({
          id: Math.random().toString(36).substr(2, 9),
          name: "Raven / Pharaoh Suit",
          level: parseInt(match[1])
        });
      }
    }
    if (parsedXsuits.length > 0) {
      setXsuits(parsedXsuits);
    }

    // 5. Gun Labs
    const parsedGuns: GunLabItem[] = [];
    // Matches expressions like: glacier level 7, crimson lvl 7, m416 lvl 4, akm lvl 7, etc.
    const gunMatches = normalized.matchAll(/(glacier|crimson|m416|akm|ump|scarl|scar-l|s12k|gun\s+lab|gunlab|lab)\s*(?:lvl|level)?\s*([4-8])/g);
    for (const match of gunMatches) {
      if (match[1] && match[2]) {
        const typeStr = match[1];
        const level = parseInt(match[2]);
        let weaponType = "primary_other";
        
        if (typeStr.includes("glacier")) {
          weaponType = "m416_glacier";
        } else if (typeStr.includes("crimson")) {
          weaponType = "m416_crimson";
        } else if (typeStr.includes("m416")) {
          weaponType = "m416_glacier"; // default M416 to Glacier
        } else if (["akm", "ump", "scarl", "scar-l", "s12k"].some(x => typeStr.includes(x))) {
          weaponType = "primary_other";
        } else {
          weaponType = "secondary";
        }

        parsedGuns.push({
          id: Math.random().toString(36).substr(2, 9),
          weaponType,
          level
        });
      }
    }
    if (parsedGuns.length > 0) {
      setGunLabs(parsedGuns);
    }

    // 6. Cars
    const parsedCars: CustomCarItem[] = [];

    // Match legendary cars
    const legMatch = normalized.match(/(\d+)\s*(?:legendary\s+)?car/);
    let legCount = 0;
    if (legMatch && legMatch[1]) {
      legCount = parseInt(legMatch[1]);
    } else if (normalized.includes("legendary car") || normalized.includes("mustang") || normalized.includes("ssr")) {
      legCount = 1;
    }
    for (let i = 0; i < legCount; i++) {
      parsedCars.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "legendary",
        recency: "standard"
      });
    }

    // Match 1 card elimination cars
    const oneCardMatch = normalized.match(/(\d+)\s*(?:1\s+card|elimination)/);
    let oneCardCount = 0;
    if (oneCardMatch && oneCardMatch[1]) {
      oneCardCount = parseInt(oneCardMatch[1]);
    } else if (normalized.includes("elimination car") || normalized.includes("black lambo")) {
      oneCardCount = 1;
    }
    for (let i = 0; i < oneCardCount; i++) {
      const isLatest = normalized.includes("latest 1 card") || normalized.includes("new 1 card");
      const isOld = normalized.includes("old 1 card") || normalized.includes("legacy 1 card");
      parsedCars.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "one_card",
        recency: isLatest ? "latest" : (isOld ? "old" : "standard")
      });
    }

    // Match 3 card drop cars
    const threeCardMatch = normalized.match(/(\d+)\s*(?:3\s+card|drop\s+car|spawn)/);
    let threeCardCount = 0;
    if (threeCardMatch && threeCardMatch[1]) {
      threeCardCount = parseInt(threeCardMatch[1]);
    } else if (normalized.includes("drop car") || normalized.includes("pink lambo")) {
      threeCardCount = 1;
    }
    for (let i = 0; i < threeCardCount; i++) {
      const isLatest = normalized.includes("latest 3 card") || normalized.includes("new 3 card");
      const isOld = normalized.includes("old 3 card") || normalized.includes("legacy 3 card");
      parsedCars.push({
        id: Math.random().toString(36).substr(2, 9),
        type: "three_card",
        recency: isLatest ? "latest" : (isOld ? "old" : "standard")
      });
    }

    if (parsedCars.length > 0) {
      setCars(parsedCars);
    }

    // Form feedback log
    const feedbackItems = [];
    if (mythicsParsed > 0) feedbackItems.push(`${mythicsParsed} Mythics`);
    if (ultimatesParsed > 0) feedbackItems.push(`${ultimatesParsed} Ultimates`);
    if (parsedXsuits.length > 0) feedbackItems.push(`${parsedXsuits.length} X-Suits`);
    if (parsedGuns.length > 0) feedbackItems.push(`${parsedGuns.length} Gun Labs`);
    if (parsedCars.length > 0) feedbackItems.push(`${parsedCars.length} Cars`);
    if (hasPony || hasBeard || hasHair) feedbackItems.push("Appearance cosmetics");

    if (feedbackItems.length > 0) {
      setParseFeedback(`Successfully parsed: ${feedbackItems.join(", ")}!`);
    } else {
      setParseFeedback("Could not detect any specific values. Please ensure you state counts and levels explicitly.");
    }
  };

  // Detailed calculations memoized
  const valuationResult = useMemo(() => {
    let total = 0;
    const breakdown: { name: string; value: number }[] = [];

    // 1. Rare Mythics: ₹200 each
    if (rareMythics > 0) {
      const val = rareMythics * 200;
      total += val;
      breakdown.push({ name: `Rare Mythics (${rareMythics}x)`, value: val });
    }

    // 2. Ultimate Sets: ₹400 each
    if (ultimateSets > 0) {
      const val = ultimateSets * 400;
      total += val;
      breakdown.push({ name: `Ultimate Outfits (${ultimateSets}x)`, value: val });
    }

    // 3. X-Suits LvL 4+ (₹3500 + ₹1000 for each level above 4)
    xsuits.forEach((xs, index) => {
      const baseVal = 3500 + (xs.level - 4) * 1000;
      total += baseVal;
      breakdown.push({ name: `X-Suit LvL ${xs.level} (#${index + 1})`, value: baseVal });
    });

    // 4. Gun Labs Calculations
    const calculatedGuns = gunLabs.map((gun) => {
      let baseVal = 0;
      const isPrimary = gun.weaponType !== "secondary";

      if (gun.weaponType === "m416_crimson") {
        if (gun.level === 4) baseVal = 1500;
        else if (gun.level === 5) baseVal = 2500;
        else if (gun.level === 6) baseVal = 3000;
        else if (gun.level === 7) baseVal = 7000;
        else if (gun.level === 8) baseVal = 8000;
      } else if (gun.weaponType === "m416_glacier" || gun.weaponType === "primary_other") {
        if (gun.level === 4) baseVal = 1500;
        else if (gun.level === 5) baseVal = 2500;
        else if (gun.level === 6) baseVal = 3000;
        else if (gun.level === 7) baseVal = 4000;
        else if (gun.level === 8) baseVal = 5000;
      } else {
        if (gun.level === 4) baseVal = 1200;
        else if (gun.level === 5) baseVal = 2000;
        else if (gun.level === 6) baseVal = 2500;
        else if (gun.level === 7) baseVal = 3000;
        else if (gun.level === 8) baseVal = 4000;
      }

      return {
        id: gun.id,
        weaponType: gun.weaponType,
        level: gun.level,
        isPrimary,
        initialValue: baseVal,
        finalValue: baseVal,
      };
    });

    // Apply rule: "IF 2 PRIMARY GUN SKINS HAS LVL 7/8 IN SAME ACCOUNT, ONLY ONE HAS FULL VALUE SECOND ONE HAS 2K VALUE"
    const highLvlPrimaries = calculatedGuns.filter(g => g.isPrimary && (g.level === 7 || g.level === 8));
    
    if (highLvlPrimaries.length > 1) {
      highLvlPrimaries.sort((a, b) => b.initialValue - a.initialValue);
      for (let i = 1; i < highLvlPrimaries.length; i++) {
        const target = highLvlPrimaries[i];
        if (target) {
          const gunIdx = calculatedGuns.findIndex(g => g.id === target.id);
          if (gunIdx !== -1) {
            const matchingGun = calculatedGuns[gunIdx];
            if (matchingGun) {
              matchingGun.finalValue = 2000;
            }
          }
        }
      }
    }

    // Add gun values to total and breakdown
    calculatedGuns.forEach((g) => {
      total += g.finalValue;
      const typeLabel = WEAPON_OPTIONS.find(opt => opt.value === g.weaponType)?.label || "Gun Lab";
      const dupNote = g.initialValue !== g.finalValue ? " (Duplicate primary Lvl 7/8 discount applied)" : "";
      breakdown.push({ 
        name: `${typeLabel.split(" (")[0]} LvL ${g.level}${dupNote}`, 
        value: g.finalValue 
      });
    });

    // 5. Vehicles (Refined Values)
    cars.forEach((car, index) => {
      let val = 0;
      let nameStr = "";

      if (car.type === "legendary") {
        val = 300;
        nameStr = `Legendary Car #${index + 1}`;
      } else if (car.type === "one_card") {
        nameStr = `1 Card Elimination Car #${index + 1}`;
        if (car.recency === "old") {
          val = 1500;
          nameStr += " (Old)";
        } else if (car.recency === "latest") {
          val = 2500;
          nameStr += " (Latest)";
        } else {
          val = 2000;
        }
      } else if (car.type === "three_card") {
        nameStr = `3 Card Drop Car #${index + 1}`;
        if (car.recency === "old") {
          val = 5000;
          nameStr += " (Old)";
        } else if (car.recency === "latest") {
          val = 7000;
          nameStr += " (Latest)";
        } else {
          val = 6000;
        }
      }

      total += val;
      breakdown.push({ name: nameStr, value: val });
    });

    // 6. Appearance (₹200 flat each)
    if (s4Ponytail) {
      total += 200;
      breakdown.push({ name: "👤 S4 Ponytail", value: 200 });
    }
    if (s7Beard) {
      total += 200;
      breakdown.push({ name: "👤 S7 Beard", value: 200 });
    }
    if (s2Hair) {
      total += 200;
      breakdown.push({ name: "👤 S2 Hair (Unlocked)", value: 200 });
    }

    return { total, breakdown };
  }, [
    rareMythics, ultimateSets, xsuits, gunLabs, cars,
    s4Ponytail, s7Beard, s2Hair
  ]);

  const adjustCount = (setter: React.Dispatch<React.SetStateAction<number>>, delta: number) => {
    setter(prev => Math.max(0, prev + delta));
  };

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* Description Parser Box - Paste Account Details */}
      <div className="card-glass p-5 sm:p-8 border border-gold/30 bg-[#0d1017] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <FileText size={150} className="text-gold" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <span className="badge">
            <Sparkles size={11} className="animate-spin-slow" /> AUTO-PARSER SYSTEM
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-h text-white uppercase tracking-tight">
            Paste Account Description to Calculate
          </h2>
          <p className="text-muted text-xs sm:text-sm leading-relaxed">
            Have a copy of your account details from a seller or your inventory? Paste it below and our AI parser will automatically identify assets like Mythics, Ultimates, X-Suits, Gun Labs, and Vehicles to run your estimation instantly!
          </p>

          <div className="space-y-3">
            <textarea
              className="input-field min-h-[120px] font-mono text-xs sm:text-sm"
              placeholder='Example: "Maddy account: 15 rare mythics, 3 ultimate outfits, Pharaoh level 4 xsuit, M416 Glacier lvl 7, Mustang, 1 Card elimination car (Latest), s4 ponytail, and s7 beard."'
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={handleParseDescription}
                className="btn btn-gold py-2.5 px-6 rounded-lg text-xs font-bold w-full sm:w-auto"
              >
                Parse &amp; Calculate Value
              </button>
              
              {parseFeedback && (
                <span className={`text-xs font-semibold ${parseFeedback.includes("Successfully") ? "text-emerald-400" : "text-amber-400"}`}>
                  {parseFeedback}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner / Formula */}
      <div className="card-glass p-5 sm:p-8 relative overflow-hidden border border-white/5 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="badge">OFFICIAL FORMULA</span>
            <button 
              onClick={handleReset} 
              className="text-muted hover:text-gold transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
              title="Reset Calculator"
            >
              <RefreshCw size={12} /> Reset
            </button>
          </div>
          
          <h3 className="text-lg font-black font-h text-white uppercase tracking-tight mb-4">
            Refined Account Valuation Formula
          </h3>
          
          <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-center mb-4">
            <p className="text-gold font-bold text-xs sm:text-base leading-relaxed tracking-wide">
              Account Value = Mythics (₹200) + Ultimates (₹400) + X-Suits (LvL 4+) + Gun Labs (LvL 4+) + Vehicles + Appearance (₹200)
            </p>
          </div>

          <p className="text-muted text-xs sm:text-sm leading-relaxed">
            All estimates represent secondary market baseline rates in Indian Rupees (INR). You can fine-tune specific items parsed below.
          </p>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Left/Middle: Customizers */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Outfits & Core Tiers */}
          <div className="card-glass p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Crown className="text-gold" size={20} />
              <h3 className="text-base font-black font-h text-white uppercase tracking-wider">Mythics &amp; Outfits</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Rare Mythics */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-gold tracking-widest block mb-1">Rare Mythic Outfits</span>
                  <span className="text-2xs text-muted block mb-4">Forest Elf, Fool Set, etc. (₹200 flat each)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white font-mono">{rareMythics}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => adjustCount(setRareMythics, -1)} className="p-2 rounded bg-white/5 border border-white/10 hover:border-gold/50 text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => adjustCount(setRareMythics, 1)} className="p-2 rounded bg-white/5 border border-white/10 hover:border-gold/50 text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ultimate Outfits */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-gold tracking-widest block mb-1">Ultimate Mythic Sets</span>
                  <span className="text-2xs text-muted block mb-4">Inferno Mummy, etc. (₹400 flat each)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white font-mono">{ultimateSets}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => adjustCount(setUltimateSets, -1)} className="p-2 rounded bg-white/5 border border-white/10 hover:border-gold/50 text-white transition-colors">
                      <Minus size={14} />
                    </button>
                    <button onClick={() => adjustCount(setUltimateSets, 1)} className="p-2 rounded bg-white/5 border border-white/10 hover:border-gold/50 text-white transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkboxes: Appearance Value */}
            <div className="pt-4 border-t border-white/5">
              <span className="text-xs font-black uppercase text-muted tracking-wider block mb-3">👤 Appearance Upgrades (₹200 flat each)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${s4Ponytail ? 'bg-gold-dim border-gold/40 text-gold' : 'bg-black/20 border-white/5 text-muted hover:border-white/15'}`}>
                  <span>S4 Ponytail</span>
                  <input 
                    type="checkbox" 
                    checked={s4Ponytail} 
                    onChange={(e) => setS4Ponytail(e.target.checked)}
                    className="accent-gold rounded ml-2"
                  />
                </label>
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${s7Beard ? 'bg-gold-dim border-gold/40 text-gold' : 'bg-black/20 border-white/5 text-muted hover:border-white/15'}`}>
                  <span>S7 Beard</span>
                  <input 
                    type="checkbox" 
                    checked={s7Beard} 
                    onChange={(e) => setS7Beard(e.target.checked)}
                    className="accent-gold rounded ml-2"
                  />
                </label>
                <label className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${s2Hair ? 'bg-gold-dim border-gold/40 text-gold' : 'bg-black/20 border-white/5 text-muted hover:border-white/15'}`}>
                  <span>S2 Hair Unlocked</span>
                  <input 
                    type="checkbox" 
                    checked={s2Hair} 
                    onChange={(e) => setS2Hair(e.target.checked)}
                    className="accent-gold rounded ml-2"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* X-Suits List */}
          <div className="card-glass p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Crown className="text-gold" size={20} />
                <h3 className="text-base font-black font-h text-white uppercase tracking-wider">X-Suits (LvL 4+)</h3>
              </div>
              <button 
                onClick={addXSuit} 
                className="btn btn-outline py-1.5 px-3 rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 border border-white/10 hover:border-gold/50"
              >
                <Plus size={11} /> Add X-Suit
              </button>
            </div>

            {xsuits.length === 0 ? (
              <div className="text-center py-6 text-muted text-xs italic bg-black/10 rounded-xl border border-dashed border-white/5">
                No level 4+ X-suits added yet. Click &quot;Add X-Suit&quot; to configure.
              </div>
            ) : (
              <div className="space-y-3">
                {xsuits.map((xs, index) => (
                  <div key={xs.id} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 gap-4">
                    <span className="text-xs font-bold text-white uppercase">X-Suit #{index + 1}</span>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xs text-muted uppercase">Level:</span>
                        <select 
                          value={xs.level} 
                          onChange={(e) => updateXSuitLevel(xs.id, parseInt(e.target.value))}
                          className="bg-black/80 border border-white/10 text-gold font-mono text-xs rounded p-1"
                        >
                          <option value={4}>LvL 4 (₹3,500)</option>
                          <option value={5}>LvL 5 (₹4,500)</option>
                          <option value={6}>LvL 6 (₹5,500)</option>
                          <option value={7}>LvL 7 (₹6,500)</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => removeXSuit(xs.id)} 
                        className="text-muted hover:text-red transition-colors"
                        title="Remove X-Suit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gun Labs List */}
          <div className="card-glass p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sword className="text-gold" size={20} />
                <h3 className="text-base font-black font-h text-white uppercase tracking-wider">Gun Skins (LvL 4+)</h3>
              </div>
              <button 
                onClick={addGunLab} 
                className="btn btn-outline py-1.5 px-3 rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 border border-white/10 hover:border-gold/50"
              >
                <Plus size={11} /> Add Gun Lab
              </button>
            </div>

            <div className="p-3 bg-amber-950/10 border border-amber-500/10 rounded-xl text-2xs text-amber-300 leading-relaxed flex gap-2">
              <AlertTriangle size={14} className="shrink-0 text-amber-500" />
              <div>
                <strong>Primary Weapons:</strong> M416, AKM, UMP, SCAR-L, S12K. All others are Secondary.
                <br />
                <strong>Duplicate rule:</strong> If you have 2 primary level 7/8 gun labs, only the highest one maintains full value; the second is discounted to a flat ₹2,000.
              </div>
            </div>

            {gunLabs.length === 0 ? (
              <div className="text-center py-6 text-muted text-xs italic bg-black/10 rounded-xl border border-dashed border-white/5">
                No level 4+ Gun Labs configured. Click &quot;Add Gun Lab&quot; to configure.
              </div>
            ) : (
              <div className="space-y-3">
                {gunLabs.map((gun, index) => (
                  <div key={gun.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white font-mono bg-white/5 px-2 py-0.5 rounded">#{index + 1}</span>
                      <select 
                        value={gun.weaponType} 
                        onChange={(e) => updateGunLabType(gun.id, e.target.value)}
                        className="bg-black/80 border border-white/10 text-white text-xs rounded p-1.5 max-w-[220px]"
                      >
                        {WEAPON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xs text-muted uppercase">Level:</span>
                        <select 
                          value={gun.level} 
                          onChange={(e) => updateGunLabLevel(gun.id, parseInt(e.target.value))}
                          className="bg-black/80 border border-white/10 text-gold font-mono text-xs rounded p-1.5"
                        >
                          <option value={4}>LvL 4 (₹1,500)</option>
                          <option value={5}>LvL 5 (₹2,500)</option>
                          <option value={6}>LvL 6 (₹3,000)</option>
                          <option value={7}>LvL 7 (Custom)</option>
                          <option value={8}>LvL 8 (Custom)</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => removeGunLab(gun.id)} 
                        className="text-muted hover:text-red transition-colors"
                        title="Remove Gun"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Vehicles Section */}
          <div className="card-glass p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Car className="text-gold" size={20} />
                <h3 className="text-base font-black font-h text-white uppercase tracking-wider">Vehicles Configurator</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => addCar("legendary")}
                  className="btn btn-outline py-1.5 px-3 rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 border border-white/10 hover:border-gold/50"
                >
                  + Legendary (₹300)
                </button>
                <button 
                  onClick={() => addCar("one_card")}
                  className="btn btn-outline py-1.5 px-3 rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 border border-white/10 hover:border-gold/50"
                >
                  + 1 Card (₹2k)
                </button>
                <button 
                  onClick={() => addCar("three_card")}
                  className="btn btn-outline py-1.5 px-3 rounded-lg text-2xs uppercase tracking-wider flex items-center gap-1 border border-white/10 hover:border-gold/50"
                >
                  + 3 Card (₹6k)
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-950/10 border border-amber-500/10 rounded-xl text-2xs text-amber-300 leading-relaxed flex gap-2">
              <Info size={14} className="shrink-0 text-amber-500" />
              <div>
                Prices for 1-Card and 3-Card vehicles depend on standard releases: **Old releases** yield lower values, whereas **Latest releases** yield slightly premium pricing.
              </div>
            </div>

            {cars.length === 0 ? (
              <div className="text-center py-6 text-muted text-xs italic bg-black/10 rounded-xl border border-dashed border-white/5">
                No vehicles configured yet. Click buttons above to add cars.
              </div>
            ) : (
              <div className="space-y-3">
                {cars.map((car, index) => (
                  <div key={car.id} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white font-mono bg-white/5 px-2 py-0.5 rounded">#{index + 1}</span>
                      <span className="text-xs text-white uppercase font-semibold">
                        {car.type === "legendary" ? "Legendary Car (₹300)" : car.type === "one_card" ? "1-Card Elimination Car (₹2,000 avg)" : "3-Card Drop Car (₹6,000 avg)"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {car.type !== "legendary" && (
                        <div className="flex items-center gap-2">
                          <span className="text-2xs text-muted uppercase">Release:</span>
                          <select 
                            value={car.recency} 
                            onChange={(e) => updateCarRecency(car.id, e.target.value as "old" | "standard" | "latest")}
                            className="bg-black/80 border border-white/10 text-gold font-mono text-xs rounded p-1"
                          >
                            <option value="old">Old Release (Lighter Value)</option>
                            <option value="standard">Standard Value</option>
                            <option value="latest">Latest Release (Premium Value)</option>
                          </select>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => removeCar(car.id)} 
                        className="text-muted hover:text-red transition-colors"
                        title="Remove Car"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Pane: Live Calculation Display */}
        <div className="space-y-6">
          <div className="card-glass p-5 sm:p-6 border-gold/30 lg:sticky lg:top-6 bg-gradient-to-b from-[#111520] to-[#0d1017] shadow-xl">
            <h3 className="text-sm font-black font-h text-muted uppercase tracking-wider mb-6 flex items-center gap-2">
              <Info size={14} className="text-gold" /> Accounts Value Report
            </h3>
            
            <div className="text-center py-6 border-y border-white/5 mb-6">
              <span className="text-xs uppercase text-muted font-bold block mb-1">Calculated Price</span>
              <div className="text-4xl font-extrabold font-h tracking-tight text-white">
                <span className="g">₹{valuationResult.total.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[10px] text-muted block mt-2">Verified Secondary Market Value (INR)</span>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-black uppercase text-white tracking-widest">Pricing Breakdown</h4>
              <div className="space-y-2 text-xs text-muted max-h-[260px] overflow-y-auto pr-2 divide-y divide-white/5">
                {valuationResult.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 items-center">
                    <span className="max-w-[120px] sm:max-w-[160px] truncate" title={item.name}>{item.name}</span>
                    <span className="text-white font-mono font-semibold">₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                
                {valuationResult.breakdown.length === 0 && (
                  <div className="text-center py-6 text-muted italic">
                    No assets configured. Use the Auto-Parser or add items to calculate!
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5 text-[11px] text-muted leading-relaxed">
              <div className="flex gap-2">
                <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                <span>Single logins (only Twitter or Play Games) command a 20-30% premium over dual-linked accounts.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: What holds Value vs What does NOT hold Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        
        {/* Adds Value Card */}
        <div className="card-glass p-5 sm:p-8 border-emerald-500/20 bg-emerald-950/5">
          <h3 className="text-lg font-black font-h text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} /> Valued Assets (Adds Value)
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">👤 Appearance Items</h4>
              <p className="text-xs text-muted leading-relaxed">
                Classic cosmetics like the legendary **S4 Ponytail** (₹200), **S7 Beard** (₹200), and **S2 Hair (Unlocked)** (₹200) add flat market value as they are collectable.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">👑 Mythics &amp; X-Suits</h4>
              <p className="text-xs text-muted leading-relaxed">
                **Rare Mythic Outfits** (₹200 per set), **Ultimate Sets** (₹400 per set), and upgradeable **X-Suits** Level 4 (₹3,500) up to Level 7 (adding ₹1,000 per level above 4) command significant value.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">🔫 Primary vs. Secondary Gun Labs</h4>
              <p className="text-xs text-muted leading-relaxed">
                **Primary Gun Labs** (M416, AKM, UMP, SCAR-L, S12K) yield high returns. Specific skins like **M416 Crimson** fetch up to ₹7,000 (Lvl 7) and ₹8,000 (Lvl 8), whereas **Glacier** yields ₹4,000 (Lvl 7) and ₹5,000 (Lvl 8). Secondary Gun Labs hold slightly lower value.
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/10">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1.5">🚗 Vehicles Configuration</h4>
              <p className="text-xs text-muted leading-relaxed">
                Includes **Legendary Cars** (SSR, Mustang - ₹300), **1-Card Elimination Cars** (₹2,000 base), and **3-Card Drop Cars** (₹6,000 base). Release status (Old vs. Latest) fine-tunes vehicle valuation.
              </p>
            </div>
          </div>
        </div>

        {/* No Value Card */}
        <div className="card-glass p-5 sm:p-8 border-rose-500/20 bg-rose-950/5">
          <h3 className="text-lg font-black font-h text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <XCircle className="text-rose-500" size={20} /> No Value Items (Does Not Add Value)
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/10">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1.5">❌ Season Royal Pass &amp; UC</h4>
              <p className="text-xs text-muted leading-relaxed">
                **2020+ Season Royal Passes** and **UC (Unknown Cash)** do not contribute to fixed valuation. UC has no fixed market value since it is highly variable. 
                <span className="block mt-1 text-rose-300 font-semibold">⚠️ Note: UC has no fixed value. Example: Vehicle value remains the same with or without fuel.</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/10">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1.5">❌ Common Collectibles</h4>
              <p className="text-xs text-muted leading-relaxed">
                Consumables such as **Room Cards**, **X-Suit Coins**, and **Supercar Tokens** hold no secondary market valuation. **Popularity Gifts** also carry zero value.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/10">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1.5">❌ Post-S10 Items</h4>
              <p className="text-xs text-muted leading-relaxed">
                Any **Royal Pass after Season 10** or **S10+ Conqueror Frames/Titles** do not add valuation due to extreme saturation in the secondary market.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
