import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Settings, LogOut, ChevronDown } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  {
    label: "Accounts",
    subLinks: [
      { to: "/buy", label: "Buy" },
      { to: "/sell", label: "Sell" },
      { to: "/exchange", label: "Exchange" },
    ],
  },
  {
    label: "In-Game Services",
    subLinks: [
      { to: "/services/uc", label: "UC Purchase" },
      { to: "/services/xsuit", label: "X-Suit Gift" },
      { to: "/services/supercar", label: "Supercar Gift" },
    ],
  },
  { to: "/recovery", label: "Recovery" },
  {
    label: "Customer Stories",
    subLinks: [
      { to: "/reviews", label: "Buyer Reviews" },
      { to: "/proofs", label: "Proof & Feedback" },
    ],
  },
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
  const [mobileExpanded, setMobileExpanded] = useState({});
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const doubledTicker = [...tickerItems, ...tickerItems];

  const toggleMobileExpanded = (label) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>
          <img src="/logo.png" alt="Maddy BGMI Store" className="logo-img" />
        </Link>

        <ul className="hidden lg:flex items-center gap-1 list-none">
          {navLinks.map((l) => (
            <li key={l.label || l.to} className="nav-item-group">
              {l.subLinks ? (
                <div style={linkStyle} className="dropdown-trigger">
                  {l.label} <ChevronDown size={14} style={{ marginLeft: "4px" }} />
                  <div className="nav-dropdown">
                    {l.subLinks.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        className="dropdown-item"
                        style={pathname === sub.to ? { color: "var(--gold)" } : {}}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={l.to}
                  style={{
                    ...linkStyle,
                    ...(pathname === l.to ? activeLinkStyle : {}),
                  }}
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link
                to="/admin"
                style={{
                  ...linkStyle,
                  color: "var(--gold)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Settings size={13} /> Admin
              </Link>
            </li>
          )}

          {user ? (
            <li className="user-profile-group">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "2px solid var(--gold)",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,var(--gold),var(--orange))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-h)",
                      fontWeight: 700,
                      fontSize: "12px",
                      color: "#000",
                      border: "2px solid var(--gold)",
                    }}
                  >
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#fff",
                      fontFamily: "var(--font-h)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {user.displayName || user.email.split("@")[0]}
                  </span>
                  {isAdmin && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        fontWeight: 700,
                      }}
                    >
                      Admin
                    </span>
                  )}
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
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
                style={{ fontFamily: "var(--font-h)", fontSize: "11px", letterSpacing: "1px" }}
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="flex lg:hidden flex-col gap-[5px] cursor-pointer p-1 bg-transparent border-none"
          aria-label="Menu"
        >
          <span style={barStyle} />
          <span style={barStyle} />
          <span style={barStyle} />
        </button>
      </nav>

      {/* Ticker integrated in Navbar */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {doubledTicker.map((item, i) => (
            <span
              key={i}
              className="ticker-item"
              style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}
            >
              <img src="/logo.png" alt="" className="logo-ticker" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {open && (
        <div style={mobileMenuStyle}>
          {navLinks.map((l) => (
            <div key={l.label || l.to}>
              {l.subLinks ? (
                <>
                  <div
                    onClick={() => toggleMobileExpanded(l.label)}
                    style={{ ...mobileLinkStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  >
                    {l.label}
                    <ChevronDown size={16} style={{ transform: mobileExpanded[l.label] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </div>
                  {mobileExpanded[l.label] && (
                    <div style={{ paddingLeft: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "0 0 8px 8px" }}>
                      {l.subLinks.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setOpen(false)}
                          style={{
                            ...mobileLinkStyle,
                            fontSize: "13px",
                            padding: "10px 16px",
                            ...(pathname === sub.to ? { color: "var(--gold)" } : {}),
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{
                    ...mobileLinkStyle,
                    ...(pathname === l.to
                      ? { color: "var(--gold)", background: "var(--gold-dim)" }
                      : {}),
                  }}
                >
                  {l.label}
                </Link>
              )}
            </div>
          ))}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              style={{ ...mobileLinkStyle, color: "var(--gold)" }}
            >
              ⚙ Admin Panel
            </Link>
          )}
          {user ? (
            <>
              <div
                style={{
                  ...mobileLinkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "var(--muted)",
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "1px solid var(--gold)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--gold)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {(user.displayName || "U")[0]}
                  </div>
                )}
                <span style={{ fontSize: "13px" }}>{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  ...mobileLinkStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                  color: "#ef4444",
                  fontFamily: "var(--font-body)",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              style={{ ...mobileLinkStyle, color: "var(--gold)" }}
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  background: "rgba(8, 10, 15, 0.65)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 215, 0, 0.12)",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
};

const navStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 5%",
  height: "64px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
};
const logoStyle = {
  fontFamily: "var(--font-h)",
  fontSize: "18px",
  fontWeight: 700,
  color: "var(--gold)",
  letterSpacing: "2px",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};
const linkStyle = {
  color: "var(--muted)",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: 600,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  padding: "8px 12px",
  borderRadius: "8px",
  transition: "all .2s",
  display: "inline-flex",
  alignItems: "center",
  cursor: "pointer",
};
const activeLinkStyle = { color: "var(--gold)", background: "var(--gold-dim)" };
const barStyle = {
  display: "block",
  width: "24px",
  height: "2px",
  background: "var(--gold)",
  borderRadius: "2px",
};
const mobileMenuStyle = {
  position: "fixed",
  top: "64px",
  left: 0,
  right: 0,
  zIndex: 998,
  background: "rgba(8,10,15,0.98)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  padding: "16px",
  borderBottom: "1px solid rgba(255,215,0,0.18)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  maxHeight: "calc(100vh - 64px)",
  overflowY: "auto",
};
const mobileLinkStyle = {
  color: "var(--muted)",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  padding: "12px 16px",
  borderRadius: "8px",
  display: "block",
};
