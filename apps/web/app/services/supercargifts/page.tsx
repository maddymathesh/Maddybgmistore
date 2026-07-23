/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { 
  MessageCircle, Send, Loader2, Info, CheckCircle, 
  Car, ShieldCheck, Clock, Users, Smartphone, Zap, Flame, Calendar, X, ExternalLink, Search, SlidersHorizontal, RotateCcw, Filter
} from "lucide-react";
import Link from "next/link";
import { getSupercarGifts } from "../../actions";

function slugifySupercar(name: string, colour?: string | null): string {
  const text = colour ? `${name} ${colour}` : name;
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface SupercarGift {
  id: string;
  supercarName: string;
  sellingPrice: string;
  offerPrice: string;
  carType: string | null;
  imageUrl: string | null;
  promoTag: string;
  applicableVehicle?: string | null;
  colour?: string | null;
}

export default function SupercarGiftPage() {
  const [cars, setCars] = useState<SupercarGift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all"); // 'all', '1-card', '2-card', '3-card'
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // End date: September 8, 2026, 05:29 AM IST
    const endDate = new Date("2026-09-08T05:29:00+05:30").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timerId = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await getSupercarGifts();
        if (res.success && res.gifts) {
          setCars(res.gifts as SupercarGift[]);
        }
      } catch (error) {
        console.error("Error fetching supercars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const contactText = (name: string, id: string) => `Hi Maddy! I am interested in buying the ${name} Supercar (ID: ${id}) via your premium Gifting service. Please guide me.`;

  // Helper to normalize card type strings for filtering
  const getCardCategory = (typeStr: string | null) => {
    const s = (typeStr || "").toLowerCase();
    if (s.includes("1")) return "1-card";
    if (s.includes("2")) return "2-card";
    if (s.includes("3") || s.includes("more") || s.includes("plus") || s.includes("sports") || s.includes("suv")) return "3-card";
    return "other";
  };

  // Dynamic filter options extracted from loaded cars
  const uniqueVehicles = Array.from(new Set(cars.map(c => c.applicableVehicle).filter(Boolean))) as string[];
  const uniqueModels = Array.from(new Set(cars.map(c => c.supercarName.trim()).filter(Boolean))) as string[];

  const isFilterActive = selectedFilter !== "all" || searchQuery !== "" || selectedVehicle !== "all" || selectedModel !== "all" || sortBy !== "default";

  const resetAllFilters = () => {
    setSelectedFilter("all");
    setSearchQuery("");
    setSelectedVehicle("all");
    setSelectedModel("all");
    setSortBy("default");
  };

  // Filter cars based on selection, model, vehicle, search, and sort
  const filteredCars = cars.filter(c => {
    if (selectedFilter !== "all" && getCardCategory(c.carType) !== selectedFilter) return false;
    if (selectedVehicle !== "all" && (c.applicableVehicle || "").toLowerCase() !== selectedVehicle.toLowerCase()) return false;
    if (selectedModel !== "all" && c.supercarName.trim().toLowerCase() !== selectedModel.toLowerCase()) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = c.supercarName.toLowerCase().includes(q);
      const colourMatch = (c.colour || "").toLowerCase().includes(q);
      const vehicleMatch = (c.applicableVehicle || "").toLowerCase().includes(q);
      if (!nameMatch && !colourMatch && !vehicleMatch) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return parseFloat(a.offerPrice) - parseFloat(b.offerPrice);
    if (sortBy === "price-high") return parseFloat(b.offerPrice) - parseFloat(a.offerPrice);
    return 0;
  });

  const formatVehicle = (vehicle: string | null) => {
    if (!vehicle) return "UAZ";
    const v = vehicle.toUpperCase();
    if (["DACIA", "MIRADO", "COUPE", "ROADSTER"].includes(v) || v.includes("SEDEN") || v.includes("SEDAN")) {
      return `Sedan (${vehicle})`;
    }
    if (v.includes("UAZ")) {
      return `UAZ (${vehicle})`;
    }
    if (v.includes("BUGGY")) {
      return `Buggy`;
    }
    return vehicle;
  };

  return (
    <>
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
        
        {/* HERO BANNER */}
        <section style={{
          position: "relative",
          width: "100%",
          minHeight: "80vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden"
        }}>
          <img
            src="/supercar-banner.jpg"
            alt="BGMI Supercar Gifting"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 40%",
              filter: "brightness(0.5)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,10,15,0.5) 0%, transparent 30%, transparent 50%, rgba(8,10,15,0.97) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 60%)",
          }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5%", maxWidth: "860px" }}>
            <div className="badge mb-5 animate-pulse">
              <Car size={14} style={{ marginRight: "6px" }} /> Luxury Sourcing Showroom
            </div>
            <h1 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(34px,6vw,68px)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "18px",
            }} className="uppercase text-white">
              <span style={{ textShadow: "0 2px 25px rgba(0,0,0,0.7)" }}>Supercar Showcase</span> <br />
              <span className="g" style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.5))" }}>Gifting Service</span>
            </h1>
            <p style={{
              color: "rgba(234,234,234,0.85)", fontSize: "clamp(14px,1.8vw,17px)",
              maxWidth: "680px", margin: "0 auto", lineHeight: 1.6,
              textShadow: "0 1px 8px rgba(0,0,0,0.5)",
            }}>
              Drive the ultimate supercars in BGMI. Fully authorized direct transmission to your account via secure in-game gifting logs.
            </p>
            <div style={{
              display: "inline-flex", flexDirection: "column", gap: "10px",
              marginTop: "28px", padding: "16px 30px",
              background: "rgba(14, 17, 24, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 215, 0, 0.4)",
              borderRadius: "24px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.9), transparent)"
              }} />
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
                <Calendar size={18} style={{ color: "var(--color-gold)" }} />
                <span style={{ color: "#fff", fontWeight: 600, letterSpacing: "0.5px", fontSize: "14px" }}>
                  Event Active: <span style={{ color: "var(--color-gold)", marginLeft: "4px", textShadow: "0 0 10px rgba(255, 215, 0, 0.4)" }}>16/07/2026 (5:30 AM) — 08/09/2026 (5:29 AM)</span>
                </span>
              </div>
              
              {timeLeft && (
                <div style={{ 
                  display: "flex", alignItems: "center", gap: "12px", justifyContent: "center",
                  marginTop: "4px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" 
                }}>
                  <Clock size={16} style={{ color: "var(--color-gold)" }} className="animate-pulse" />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Ends In:</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { label: "d", value: timeLeft.days },
                      { label: "h", value: timeLeft.hours },
                      { label: "m", value: timeLeft.minutes },
                      { label: "s", value: timeLeft.seconds }
                    ].map((item, idx) => (
                      <div key={idx} style={{ 
                        background: "rgba(255,215,0,0.1)", 
                        border: "1px solid rgba(255,215,0,0.2)",
                        borderRadius: "8px", 
                        padding: "6px 10px",
                        minWidth: "48px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}>
                        <span style={{ color: "var(--color-gold)", fontWeight: 700, fontSize: "18px", lineHeight: "1" }}>
                          {item.value.toString().padStart(2, '0')}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", marginTop: "2px", textTransform: "uppercase" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* INTERACTIVE TIMELINE & REQUIREMENTS DASHBOARD */}
        <section style={{ padding: "80px 5% 45px" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{
              background: "rgba(14, 17, 24, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--color-border-gold)",
              borderRadius: "24px",
              padding: "35px",
              boxShadow: "0 15px 45px rgba(0,0,0,0.3)"
            }}>
              {/* Spotlight Title */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "28px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: "16px"
              }}>
                <Info size={22} style={{ color: "var(--color-gold)", filter: "drop-shadow(0 0 8px rgba(255,215,0,0.3))" }} />
                <h2 style={{
                  fontFamily: "var(--font-h)", fontSize: "22px", fontWeight: 800,
                  color: "#fff", margin: 0, letterSpacing: "0.5px"
                }}>
                  Gifting Protocols & Conditions
                </h2>
              </div>

              {/* 2-Column Split */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "35px"
              }}>
                {/* Column 1: Step-by-Step Delivery timeline */}
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700,
                    color: "var(--color-gold)", marginBottom: "20px", letterSpacing: "1px",
                    textTransform: "uppercase"
                  }}>
                    Sourcing Sequence
                  </h3>
                  <div style={{
                    position: "relative", paddingLeft: "30px",
                    borderLeft: "1.5px dashed rgba(255, 215, 0, 0.2)"
                  }}>
                    {[
                      { t: "Select Token Spec", d: "Choose your Supercar design and preferred token card requirement." },
                      { t: "Share Game Details", d: "Send us your numerical In-Game Character ID. No login credentials needed." },
                      { t: "Accept friendship Lock", d: "Accept friend requests sent from our premium merchant account." },
                      { t: "72 Hours Buffer Wait", d: "Wait the official cooldown period required to execute the gift link." }
                    ].map((step, idx) => (
                      <div key={idx} style={{
                        position: "relative", marginBottom: idx === 3 ? 0 : "22px"
                      }}>
                        <div style={{
                          position: "absolute", left: "-41px", top: "2px",
                          width: "20px", height: "20px", borderRadius: "50%",
                          background: "#080a0f", border: "1.5px solid var(--color-gold)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--color-gold)", fontSize: "10px", fontWeight: 900
                        }}>{idx + 1}</div>
                        <strong style={{ display: "block", color: "#fff", fontSize: "13.5px", marginBottom: "3px" }}>
                          {step.t}
                        </strong>
                        <span style={{ display: "block", color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.5" }}>
                          {step.d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Hard requirements info card */}
                <div style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  padding: "24px"
                }}>
                  <h3 style={{
                    fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 700,
                    color: "var(--color-gold)", marginBottom: "20px", letterSpacing: "1px",
                    textTransform: "uppercase"
                  }}>
                    BGMI Official Gifting Limits
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { icon: <Clock size={16} />, label: "72 Hours Cooldown", desc: "Accounts must remain friends in-game for at least 72 hours before a gift can be processed." },
                      { icon: <Users size={16} />, label: "50+ Synergy points", desc: "Requires at least 50 synergy. Easily generated by sending basic synergy gifts or playing matches." },
                      { icon: <Smartphone size={16} />, label: "Level 10+ Requirement", desc: "Receiver BGMI account must be level 10 or above to accept legendary inventory items." }
                    ].map((req, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{
                          color: "var(--color-gold)", background: "rgba(255, 215, 0, 0.05)",
                          width: "32px", height: "32px", borderRadius: "8px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0
                        }}>
                          {req.icon}
                        </div>
                        <div>
                          <strong style={{ color: "#fff", display: "block", fontSize: "13px", marginBottom: "2px" }}>
                            {req.label}
                          </strong>
                          <span style={{ color: "var(--color-muted)", fontSize: "11.5px", lineHeight: "1.4", display: "block" }}>
                            {req.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    marginTop: "20px", paddingTop: "14px",
                    color: "var(--color-muted)", fontSize: "11px", fontStyle: "italic",
                    display: "flex", gap: "6px", alignItems: "center"
                  }}>
                    <Zap size={11} style={{ color: "var(--color-gold)" }} />
                    * These limits are strictly enforced by BGMI game mechanics.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SHOWROOM FILTER BAR */}
        <section style={{ padding: "0 5% 30px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: "var(--color-gold)",
                letterSpacing: "1.5px", textTransform: "uppercase", display: "block",
                marginBottom: "12px", fontFamily: "var(--font-h)"
              }}>
                Interactive Showroom Filters
              </span>
              
              {/* Primary Card Tier Tabs */}
              <div style={{
                display: "inline-flex",
                background: "rgba(17, 21, 32, 0.6)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "100px",
                padding: "6px",
                gap: "6px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                maxWidth: "100%",
                overflowX: "auto"
              }}>
                {[
                  { key: "all", label: "Showroom All" },
                  { key: "1-card", label: "1-Card Models" },
                  { key: "2-card", label: "2-Card Models" },
                  { key: "3-card", label: "3-Card Models +" }
                ].map(f => {
                  const isActive = selectedFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setSelectedFilter(f.key)}
                      style={{
                        padding: "8px 20px",
                        borderRadius: "100px",
                        fontSize: "12.5px",
                        fontWeight: 700,
                        fontFamily: "var(--font-h)",
                        color: isActive ? "#000" : "var(--color-muted)",
                        background: isActive ? "linear-gradient(135deg, var(--color-gold), var(--color-orange))" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        whiteSpace: "nowrap",
                        boxShadow: isActive ? "0 4px 12px rgba(255, 215, 0, 0.25)" : "none"
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Controls Bar: Search, Model Filter, Vehicle Filter, Sort, Reset */}
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(13, 16, 23, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: "16px",
              padding: "12px 18px",
              backdropFilter: "blur(10px)"
            }}>
              {/* Search Bar */}
              <div style={{
                position: "relative",
                flex: "1 1 220px",
                minWidth: "200px"
              }}>
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model or colour..."
                  style={{
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "8px 36px 8px 38px",
                    color: "#fff",
                    fontSize: "12.5px",
                    outline: "none"
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "var(--color-muted)", cursor: "pointer"
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Model Dropdown */}
              <div style={{ flex: "0 1 auto" }}>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    color: selectedModel !== "all" ? "var(--color-gold)" : "#ccc",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="all" style={{ background: "#111318", color: "#fff" }}>All Models ({cars.length})</option>
                  {uniqueModels.map(m => (
                    <option key={m} value={m} style={{ background: "#111318", color: "#fff" }}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vehicle Dropdown */}
              <div style={{ flex: "0 1 auto" }}>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    color: selectedVehicle !== "all" ? "var(--color-gold)" : "#ccc",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="all" style={{ background: "#111318", color: "#fff" }}>All Vehicles</option>
                  {uniqueVehicles.map(v => (
                    <option key={v} value={v} style={{ background: "#111318", color: "#fff" }}>
                      {formatVehicle(v)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ flex: "0 1 auto" }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    color: sortBy !== "default" ? "var(--color-gold)" : "#ccc",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="default" style={{ background: "#111318", color: "#fff" }}>Sort: Featured</option>
                  <option value="price-low" style={{ background: "#111318", color: "#fff" }}>Price: Low to High</option>
                  <option value="price-high" style={{ background: "#111318", color: "#fff" }}>Price: High to Low</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {isFilterActive && (
                <button
                  onClick={resetAllFilters}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: "10px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SUPERCAR GRID CATALOG */}
        <section style={{ padding: "0 5% 80px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Loader2 className="animate-spin mx-auto text-gold" size={42} style={{ color: "var(--color-gold)" }} />
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "16px" }}>Opening showroom gates...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "rgba(17, 21, 32, 0.45)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "24px",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              <Car size={44} style={{ color: "var(--color-gold)", margin: "0 auto 16px" }} />
              <h4 style={{ color: "#fff", fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                No Match in Sourced Showroom
              </h4>
              <p style={{ color: "var(--color-muted)", fontSize: "13.5px", lineHeight: "1.6", margin: 0 }}>
                We currently don't have active stock lists matching this filter card spec. Switch back to **Showroom All** or contact our desk directly to secure custom orders.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: "30px",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {filteredCars.map((c) => {
                const sellingPriceVal = parseFloat(c.sellingPrice);
                const offerPriceVal = parseFloat(c.offerPrice);
                const isThreeCard = getCardCategory(c.carType) === "3-card";
                const activeTag = c.promoTag && c.promoTag !== "None" ? c.promoTag : "";
                
                return (
                  <div 
                    key={c.id} 
                    className="supercar-showroom-card"
                    style={{
                      background: "rgba(17, 21, 32, 0.45)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
                      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    {/* Widescreen image aspect 16/9 */}
                    <div style={{
                      aspectRatio: "16/9",
                      background: "rgba(8,10,15,0.7)",
                      overflow: "hidden",
                      position: "relative",
                      borderBottom: "1px solid rgba(255,255,255,0.03)"
                    }}>
                      {c.imageUrl ? (
                        <img 
                          src={c.imageUrl} 
                          alt={c.supercarName}
                          loading="lazy"
                          className="hover-zoom"
                          onClick={() => setSelectedImage(c.imageUrl!)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            cursor: "zoom-in",
                            transition: "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)"
                          }} 
                        />
                      ) : (
                        <div style={{
                          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--color-muted)", fontSize: "14px"
                        }}>No Image Available</div>
                      )}
                      
                      {/* Premium Top Left Type Tag */}
                      {c.carType && (
                        <div style={{
                          position: "absolute", top: "14px", left: "14px",
                          background: "linear-gradient(135deg, var(--color-gold), var(--color-orange))",
                          color: "#000",
                          fontSize: "10px", fontWeight: 900,
                          fontFamily: "var(--font-h)",
                          padding: "4px 12px", borderRadius: "6px",
                          letterSpacing: "1px", textTransform: "uppercase",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                        }}>
                          {c.carType}
                        </div>
                      )}

                      {/* Hot Listing Badge / Promo Tag on Top Right */}
                      {activeTag ? (
                        <div style={{
                          position: "absolute", top: "14px", right: "14px",
                          background: "rgba(255, 215, 0, 0.15)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid var(--color-border-gold)",
                          color: "var(--color-gold)",
                          fontSize: "10px", fontWeight: 900,
                          fontFamily: "var(--font-h)",
                          padding: "4px 12px", borderRadius: "6px",
                          letterSpacing: "0.5px",
                          display: "flex", alignItems: "center", gap: "4px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                        }}>
                          {activeTag}
                        </div>
                      ) : (
                        isThreeCard && (
                          <div style={{
                            position: "absolute", top: "14px", right: "14px",
                            background: "rgba(239, 68, 68, 0.85)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontSize: "9px", fontWeight: 900,
                            fontFamily: "var(--font-h)",
                            padding: "3px 8px", borderRadius: "4px",
                            letterSpacing: "0.5px",
                            display: "flex", alignItems: "center", gap: "4px"
                          }}>
                            <Flame size={10} /> HYPERCAR
                          </div>
                        )
                      )}
                    </div>

                    {/* Bottom Info Blocks */}
                    <div style={{
                      padding: "24px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        fontFamily: "var(--font-h)",
                        color: "#fff",
                        marginBottom: "6px",
                        letterSpacing: "0.5px"
                      }}>
                        {c.supercarName}
                      </h3>
                      
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px"
                      }}>
                        {c.colour && (
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "6px 16px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "rgba(255,255,255,0.9)"
                          }}>
                            <span>
                              Colour - <strong style={{ color: "#fff", letterSpacing: "0.5px" }}>
                                {c.colour}
                              </strong>
                            </span>
                          </div>
                        )}

                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "6px 16px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.7)"
                        }}>
                          <Car size={13} style={{ color: "var(--color-gold)" }} />
                          <span>
                            Vehicle - <strong style={{ color: "#fff", textTransform: "capitalize", letterSpacing: "0.5px" }}>
                              {formatVehicle(c.applicableVehicle)}
                            </strong>
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        marginBottom: "24px"
                      }}>
                        <span style={{
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.4)",
                          fontFamily: "var(--font-h)",
                          textDecoration: "line-through"
                        }}>
                          ₹{sellingPriceVal.toLocaleString("en-IN")}
                        </span>
                        <span style={{
                          fontSize: "26px",
                          fontWeight: 900,
                          color: "var(--color-gold)",
                          fontFamily: "var(--font-h)",
                          textShadow: "0 2px 10px rgba(255,215,0,0.15)"
                        }}>
                          ₹{offerPriceVal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "grid", gap: "10px", marginTop: "auto"
                      }}>
                        <Link 
                          href={`/services/supercargifts/${slugifySupercar(c.supercarName, c.colour)}`}
                          style={{
                            display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                            padding: "12px", borderRadius: "10px",
                            background: "rgba(255, 215, 0, 0.1)", color: "var(--color-gold)",
                            border: "1px solid var(--color-border-gold)",
                            fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                            textDecoration: "none", transition: "all 0.25s ease"
                          }}
                          className="hover-gold-btn"
                        >
                          <ExternalLink size={16} /> View Details
                        </Link>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <a 
                            href={`https://wa.me/+919025391516?text=${encodeURIComponent(contactText(c.supercarName, c.id))}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="social-btn-wa"
                            style={{
                              display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                              padding: "12px", borderRadius: "10px",
                              background: "#25D366", color: "#fff",
                              fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "12px",
                              textDecoration: "none", transition: "all 0.25s ease"
                            }}
                          >
                            <MessageCircle size={14} /> Buy on WhatsApp
                          </a>
                          <a 
                            href={`https://t.me/maddy_bgmistore?text=${encodeURIComponent(contactText(c.supercarName, c.id))}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="social-btn-tg"
                            style={{
                              display: "flex", justifyContent: "center", alignItems: "center", gap: "8px",
                              padding: "12px", borderRadius: "10px",
                              background: "#0088cc", color: "#fff",
                              fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "12px",
                              textDecoration: "none", transition: "all 0.25s ease"
                            }}
                          >
                            <Send size={14} /> Buy on Telegram
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FULL SCREEN IMAGE MODAL */}
        {selectedImage && (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)"
            }}
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: "30px",
                right: "30px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                padding: "12px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <X size={28} />
            </button>
            <img 
              src={selectedImage} 
              alt="Full Size Car" 
              style={{
                maxWidth: "90%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 10px 50px rgba(0,0,0,0.8)"
              }} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}

        {/* SELL YOUR SUPERCAR SECTION */}
        <section style={{ padding: "40px 5% 80px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{
            background: "rgba(17, 21, 32, 0.45)",
            border: "1px solid rgba(255, 215, 0, 0.2)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(12px)"
          }}>
            <h2 style={{
              fontFamily: "var(--font-h)", fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 900, marginBottom: "16px", color: "#fff",
              display: "flex", alignItems: "center", gap: "12px"
            }}>
              <span style={{ width: "6px", height: "30px", background: "var(--color-gold)", borderRadius: "4px" }} />
              Sell Your Supercar Gifts
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6, marginBottom: "30px" }}>
              Have a BGMI Supercar Gift Card that you want to sell? Maddy BGMI Store purchases genuine Supercar Gift Cards through a secure and transparent process.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
              <div>
                <h3 style={{ color: "var(--color-gold)", fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>
                  How It Works
                </h3>
                <ol style={{ paddingLeft: "20px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "10px" }}>
                  <li>Contact us and provide the details of your Supercar Gift Card.</li>
                  <li>Once both parties agree on the price, your card will be reserved in our system.</li>
                  <li>A refundable security token of <strong>₹1,000</strong> must be paid to confirm the booking.</li>
                  <li>Deliver the Supercar Gift Card to our account.</li>
                  <li>After successful delivery and verification, your full payment will be processed, and the <strong>₹1,000 security token will be refunded</strong>.</li>
                </ol>
              </div>

              <div>
                <h3 style={{ color: "var(--color-gold)", fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>
                  Why We Require a Security Token
                </h3>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7 }}>
                  The refundable security token helps ensure that only serious sellers reserve inventory with us. It protects both parties from fake bookings and unnecessary cancellations. Once the transaction is completed successfully, the full <strong>₹1,000</strong> is refunded along with your payment.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "30px", padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h3 style={{ color: "#fff", fontFamily: "var(--font-h)", fontSize: "16px", fontWeight: 800, marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={16} style={{ color: "#f87171" }} /> Important Rules
              </h3>
              <ul style={{ paddingLeft: "20px", color: "rgba(255,255,255,0.7)", fontSize: "13px", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "8px", listStyleType: "disc" }}>
                <li><strong>Payment is made only after the Supercar Gift has been successfully delivered and verified.</strong></li>
                <li>Once your Supercar Gift Card is booked with Maddy BGMI Store, <strong>it must not be sold, gifted, or reserved for anyone else</strong>, including friends or other buyers.</li>
                <li>A <strong>refundable ₹1,000 security token</strong> is required to confirm the booking and prevent fake reservations or last-minute cancellations.</li>
                <li><strong>Do not negotiate prices or discuss the deal with buyers inside the BGMI game.</strong> All communication must take place through our official WhatsApp or Telegram channels.</li>
                <li>If you discuss pricing in-game, attempt to bypass the agreed process, or sell the booked card to another person, <strong>the deal will be cancelled and the ₹1,000 security token will be forfeited.</strong></li>
                <li>Any attempt to scam, provide false information, or violate these rules may result in a permanent ban from future transactions with Maddy BGMI Store.</li>
              </ul>
            </div>
            
            <div style={{ marginTop: "30px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
               <a 
                 href="https://wa.me/+919025391516?text=Hi Maddy! I want to sell my Supercar Gift Card." 
                 target="_blank" 
                 rel="noreferrer"
                 className="social-btn-wa"
                 style={{
                   display: "flex", alignItems: "center", gap: "8px",
                   padding: "12px 24px", borderRadius: "10px",
                   background: "#25D366", color: "#fff",
                   fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                   textDecoration: "none", transition: "all 0.25s ease"
                 }}
               >
                 <MessageCircle size={16} /> Contact to Sell on WhatsApp
               </a>
               <a 
                 href="https://t.me/MBSxMADDY17?text=Hi Maddy! I want to sell my Supercar Gift Card." 
                 target="_blank" 
                 rel="noreferrer"
                 className="social-btn-tg"
                 style={{
                   display: "flex", alignItems: "center", gap: "8px",
                   padding: "12px 24px", borderRadius: "10px",
                   background: "#0088cc", color: "#fff",
                   fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "13px",
                   textDecoration: "none", transition: "all 0.25s ease"
                 }}
               >
                 <Send size={16} /> Contact to Sell on Telegram
               </a>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .supercar-showroom-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-border-gold) !important;
          box-shadow: 0 15px 35px rgba(255, 215, 0, 0.03), 0 0 20px rgba(0,0,0,0.3) !important;
        }

        .supercar-showroom-card:hover .hover-zoom {
          transform: scale(1.06);
        }

        .social-btn-wa:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }
        
        .social-btn-tg:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
        }

        .hover-gold-btn:hover {
          background: rgba(255, 215, 0, 0.2) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
