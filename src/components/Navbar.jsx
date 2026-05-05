import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Settings, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy" },
  { to: "/sell", label: "Sell" },
  { to: "/recovery", label: "Recovery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/connectwithus", label: "Connect" },
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
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const doubledTicker = [...tickerItems, ...tickerItems];

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>
          <img src="/logo.png" alt="Maddy BGMI Store" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
        </Link>

        <ul className="hidden lg:flex items-center gap-1 list-none">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={{ ...linkStyle, ...(pathname === l.to ? activeLinkStyle : {}) }}>
                {l.label}
              </Link>
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link to="/admin" style={{ ...linkStyle, color: "var(--gold)", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Settings size={13} /> Admin
              </Link>
            </li>
          )}

          {user ? (
            <li className="user-profile-group">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--gold)", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "12px", color: "#000", border: "2px solid var(--gold)" }}>
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-h)", letterSpacing: "0.5px" }}>{user.displayName || user.email.split('@')[0]}</span>
                  {isAdmin && <span style={{ fontSize: "10px", color: "var(--gold)", textTransform: "uppercase", fontWeight: 700 }}>Admin</span>}
                </div>
                <ChevronDown size={14} style={{ color: "var(--muted)", marginLeft: "-4px" }} />
              </div>

              {/* Dropdown UI */}
              <div className="user-dropdown">
                <button onClick={handleLogout} className="dropdown-item logout">
                  <LogOut size={14} /> Logout Account
                </button>
              </div>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ fontFamily: "var(--font-h)", fontSize: "11px", letterSpacing: "1px" }}>
                Login
              </Link>
            </li>
          )}
        </ul>

        <button onClick={() => setOpen(!open)} className="flex lg:hidden flex-col gap-[5px] cursor-pointer p-1 bg-transparent border-none" aria-label="Menu">
          <span style={barStyle} />
          <span style={barStyle} />
          <span style={barStyle} />
        </button>
      </nav>

      {/* Ticker integrated in Navbar */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {doubledTicker.map((item, i) => (
            <span key={i} className="ticker-item" style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
              <img src="/logo.png" alt="" style={{ height: "16px", width: "auto", opacity: 0.8 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {open && (
        <div style={mobileMenuStyle}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              style={{ ...mobileLinkStyle, ...(pathname === l.to ? { color: "var(--gold)", background: "var(--gold-dim)" } : {}) }}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} style={{ ...mobileLinkStyle, color: "var(--gold)" }}>
              ⚙ Admin Panel
            </Link>
          )}
          {user ? (
            <>
              <div style={{ ...mobileLinkStyle, display: "flex", alignItems: "center", gap: "10px", color: "var(--muted)" }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--gold)" }} />
                  : <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: "11px", fontWeight: 700 }}>{(user.displayName || "U")[0]}</div>
                }
                <span style={{ fontSize: "13px" }}>{user.displayName || user.email}</span>
              </div>
              <button onClick={handleLogout} style={{ ...mobileLinkStyle, textAlign: "left", cursor: "pointer", border: "none", background: "none", color: "#ef4444", fontFamily: "var(--font-body)" }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} style={{ ...mobileLinkStyle, color: "var(--gold)" }}>
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

const headerStyle = {
  position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
  background: "rgba(8, 10, 15, 0.65)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 215, 0, 0.12)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
};

const navStyle = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "0 5%", height: "64px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
};
const logoStyle = {
  fontFamily: "var(--font-h)", fontSize: "18px", fontWeight: 700,
  color: "var(--gold)", letterSpacing: "2px", textDecoration: "none",
  display: "flex", alignItems: "center", gap: "6px",
};
const linksStyle = { display: "flex", alignItems: "center", gap: "4px", listStyle: "none" };
const linkStyle = {
  color: "var(--muted)", textDecoration: "none", fontSize: "16px",
  fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase",
  padding: "8px 12px", borderRadius: "8px", transition: "all .2s",
};
const activeLinkStyle = { color: "var(--gold)", background: "var(--gold-dim)" };
const hamburgerStyle = {
  display: "none", flexDirection: "column", gap: "5px", cursor: "pointer",
  padding: "4px", background: "none", border: "none",
};
const barStyle = { display: "block", width: "24px", height: "2px", background: "var(--gold)", borderRadius: "2px" };
const mobileMenuStyle = {
  position: "fixed", top: "64px", left: 0, right: 0, zIndex: 998,
  background: "rgba(8,10,15,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
  padding: "16px", borderBottom: "1px solid rgba(255,215,0,0.18)",
  display: "flex", flexDirection: "column", gap: "4px",
};
const mobileLinkStyle = {
  color: "var(--muted)", textDecoration: "none", fontSize: "14px",
  fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase",
  padding: "12px 16px", borderRadius: "8px", display: "block",
};
