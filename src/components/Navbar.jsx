import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Settings } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/buy", label: "Buy" },
  { to: "/sell", label: "Sell" },
  { to: "/recovery", label: "Recovery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/connectwithus", label: "Connect" },
];

const tickerItems = [
  "⚡ Safe & Verified Accounts",
  "🏆 2000+ Happy Buyers",
  "💰 ₹60 Lakhs+ Worth Sold",
  "🔒 Secure Single Logins",
  "📱 UPI · Bank · USDT · Cash",
  "⭐ Trusted Since 2019",
  "🎮 Budget to Premium Range",
  "🛡️ Face-to-Face Deals Available",
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
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid var(--gold)", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-h)", fontWeight: 700, fontSize: "11px", color: "#000", border: "2px solid var(--gold)" }}>
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </div>
              )}
              <button onClick={handleLogout} className="btn btn-sm" style={{ fontFamily: "var(--font-h)", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "11px", padding: "5px 12px" }}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ fontFamily: "var(--font-h)", fontSize: "11px", letterSpacing: "1px" }}>
                Login
              </Link>
            </li>
          )}

          <li>
            <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" className="btn btn-green btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </a>
          </li>
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
            <span key={i} className="ticker-item">{item}</span>
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
          <a href="https://wa.me/+919025391516" target="_blank" rel="noreferrer" style={{ ...mobileLinkStyle, color: "var(--green)" }}>
            WhatsApp Us
          </a>
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
  color: "var(--muted)", textDecoration: "none", fontSize: "12px",
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
