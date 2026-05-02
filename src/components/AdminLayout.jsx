import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", icon: "📊", label: "Dashboard" },
  { to: "/admin/stock", icon: "🎮", label: "Manage Stock" },
  { to: "/admin/orders", icon: "📋", label: "Orders" },
  { to: "/admin/reviews", icon: "⭐", label: "Reviews" },
];

export default function AdminLayout({ children, title }) {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          ⚙️ <span>MADDY</span> ADMIN
        </div>
        {navItems.map(item => (
          <Link key={item.to} to={item.to}
            className={`admin-nav-item ${pathname === item.to ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ padding:"16px 24px", borderTop:"1px solid var(--border-gold)" }}>
          <div style={{ fontSize:"12px", color:"var(--muted)", marginBottom:"8px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {user?.displayName || user?.phoneNumber || "Admin"}
          </div>
          <button onClick={handleLogout} className="btn btn-red btn-sm" style={{ width:"100%", justifyContent:"center" }}>Logout</button>
        </div>
        <div style={{ padding:"12px 24px 0" }}>
          <Link to="/" className="admin-nav-item" style={{ padding:"10px 0", fontSize:"12px" }}>← Back to Website</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
