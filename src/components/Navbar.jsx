import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Settings, LogOut, ChevronDown, X, Menu } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  {
    label: "Accounts",
    subLinks: [
      { to: "/buy", label: "Buy" },
      { to: "/sell", label: "Sell" },
      { to: "/exchange", label: "Exchange" },
      { to: "/f2f-deal", label: "F2F Deals" },
      { to: "/escrow-deal", label: "Escrow Deals" },
    ],
  },
  {
    label: "In-Game",
    subLinks: [
      { to: "/services/uc", label: "UC Purchase" },
      { to: "/services/xsuit", label: "X-Suit Gift" },
      { to: "/services/supercar", label: "Supercar Gift" },
    ],
  },
  {
    label: "Reviews",
    subLinks: [
      { to: "/reviews", label: "Buyer Reviews" },
      { to: "/proofs", label: "Proof & Feedback" },
      { to: "/feedback", label: "Customer Feedback" },
    ],
  },
  { to: "/connectwithus", label: "Connect" },
  { to: "/terms", label: "Terms & Conditions" },
];

const tickerItems = [
  "Safe & Verified Accounts",
  "2000+ Happy Buyers",
  "₹60 Lakhs+ Worth Sold",
  "Secure Single Logins",
  "UPI · Bank · USDT · Cash",
  "Trusted Since 2019",
  "Budget to Premium Range",
  "Face-to-Face Deals Available",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  // Close menu on route change
  useEffect(() => { setMobileOpen(false); setMobileExpanded({}); }, [pathname]);

  // Scroll detection for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setMobileOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <header ref={navRef} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(8,10,15,0.97)" : "rgba(8,10,15,0.80)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,215,0,0.12)",
      boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
      transition: "background 0.3s, box-shadow 0.3s",
    }}>

      {/* ── Main Nav Bar ─────────────────────────────────────── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(16px, 5%, 60px)", height: "64px" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
          <img src="/logo.png" alt="Maddy BGMI Store" className="logo-img" style={{ height: "38px", width: "auto" }} />
        </Link>

        {/* Desktop Links */}
        <ul style={{ display: "flex", alignItems: "center", gap: "2px", listStyle: "none", margin: 0, padding: 0 }} className="nav-desktop-ul">
          {navLinks.map((l) => (
            <li key={l.label || l.to} className="nav-item-group" style={{ position: "relative" }}>
              {l.subLinks ? (
                <div className="dropdown-trigger" style={deskLinkStyle}>
                  {l.label} <ChevronDown size={13} style={{ marginLeft: "3px", flexShrink: 0 }} />
                  <div className="nav-dropdown">
                    {l.subLinks.map((s) => (
                      <Link key={s.to} to={s.to} className="dropdown-item"
                        style={pathname === s.to ? { color: "var(--gold)" } : {}}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link to={l.to} style={{ ...deskLinkStyle, ...(pathname === l.to ? activeLinkStyle : {}) }}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link to="/admin" style={{ ...deskLinkStyle, color: "var(--gold)", gap: "5px" }}>
                <Settings size={13} /> Admin
              </Link>
            </li>
          )}

          {user ? (
            <li className="user-profile-group" style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--gold)", objectFit: "cover" }} />
                  : <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", color: "#000", border: "2px solid var(--gold)" }}>
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                }
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-h)" }}>
                    {(user.displayName || user.email?.split("@")[0] || "User").slice(0, 12)}
                  </span>
                  {isAdmin && <span style={{ fontSize: "10px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700 }}>Admin</span>}
                </div>
                <ChevronDown size={13} style={{ color: "var(--muted)" }} />
              </div>
              <div className="user-dropdown">
                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline btn-sm"
                style={{ fontFamily: "var(--font-h)", fontSize: "11px", letterSpacing: "1px" }}>
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="nav-hamburger"
          style={{
            display: "none",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            width: "42px", height: "42px", borderRadius: "10px",
            background: mobileOpen ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,215,0,0.2)",
            cursor: "pointer", gap: "5px", flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          {mobileOpen ? <X size={20} style={{ color: "var(--gold)" }} /> : <Menu size={20} style={{ color: "var(--gold)" }} />}
        </button>
      </nav>

      {/* ── Ticker ───────────────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span key={i} className="ticker-item" style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
              <img src="/logo.png" alt="" className="logo-ticker" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mobile Overlay Backdrop ───────────────────────────── */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, top: "102px", background: "rgba(0,0,0,0.6)", zIndex: 997 }} />
      )}

      {/* ── Mobile Slide-Down Menu ────────────────────────────── */}
      <div className="nav-mobile-menu" style={{
        position: "fixed", top: "102px", left: 0, right: 0, zIndex: 998,
        background: "rgba(8,10,15,0.99)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,215,0,0.18)",
        maxHeight: mobileOpen ? "calc(100dvh - 102px)" : "0",
        overflowY: mobileOpen ? "auto" : "hidden",
        overflowX: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{ padding: "12px 16px 24px" }}>
          {navLinks.map((l) => (
            <div key={l.label || l.to}>
              {l.subLinks ? (
                <>
                  <button onClick={() => setMobileExpanded(p => ({ ...p, [l.label]: !p[l.label] }))}
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", ...mobileLinkStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    {l.label}
                    <ChevronDown size={16} style={{ transform: mobileExpanded[l.label] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", color: "var(--gold)" }} />
                  </button>
                  <div style={{
                    maxHeight: mobileExpanded[l.label] ? "300px" : "0",
                    overflow: "hidden", transition: "max-height 0.3s ease",
                    paddingLeft: "12px", background: "rgba(255,215,0,0.03)", borderRadius: "8px",
                    marginBottom: mobileExpanded[l.label] ? "4px" : "0",
                  }}>
                    {l.subLinks.map((s) => (
                      <Link key={s.to} to={s.to}
                        style={{ ...mobileLinkStyle, fontSize: "13px", padding: "10px 16px", ...(pathname === s.to ? { color: "var(--gold)" } : {}) }}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link to={l.to}
                  style={{ ...mobileLinkStyle, ...(pathname === l.to ? { color: "var(--gold)", background: "rgba(255,215,0,0.08)" } : {}) }}>
                  {l.label}
                </Link>
              )}
            </div>
          ))}

          {/* Admin Link */}
          {isAdmin && (
            <Link to="/admin" style={{ ...mobileLinkStyle, color: "var(--gold)" }}>
              ⚙ Admin Panel
            </Link>
          )}

          <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "12px 0" }} />

          {/* Auth Section */}
          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px" }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--gold)" }} />
                  : <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700, border: "2px solid var(--gold)" }}>
                      {(user.displayName || "U")[0]}
                    </div>
                }
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{user.displayName || user.email?.split("@")[0]}</div>
                  {isAdmin && <div style={{ fontSize: "11px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700 }}>Admin</div>}
                </div>
              </div>
              <button onClick={handleLogout}
                style={{ ...mobileLinkStyle, color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "none", cursor: "pointer", width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-body)" }}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              style={{ ...mobileLinkStyle, color: "#000", background: "var(--gold)", borderRadius: "10px", textAlign: "center", fontWeight: 700 }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* ── Responsive CSS ────────────────────────────────────── */}
      <style>{`
        .nav-desktop-ul { display: flex !important; }
        .nav-hamburger { display: none !important; }

        @media (max-width: 1024px) {
          .nav-desktop-ul { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const deskLinkStyle = {
  color: "var(--muted)",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  padding: "8px 10px",
  borderRadius: "8px",
  transition: "all .2s",
  display: "inline-flex",
  alignItems: "center",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const activeLinkStyle = { color: "var(--gold)", background: "rgba(255,215,0,0.08)" };

const mobileLinkStyle = {
  color: "var(--muted)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "1px",
  textTransform: "uppercase",
  padding: "13px 16px",
  borderRadius: "10px",
  display: "block",
  transition: "background 0.15s, color 0.15s",
};
