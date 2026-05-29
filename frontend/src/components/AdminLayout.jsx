import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { toast } from 'sonner';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay Backdrop on Mobile */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-logo" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            ⚙️ <span>MADDY</span> ADMIN
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "4px"
            }}
            className="mobile-only-close-btn"
          >
            <X size={18} />
          </button>
        </div>
        {navItems.map(item => (
          <Link 
            key={item.to} 
            to={item.to}
            onClick={() => setIsSidebarOpen(false)}
            className={`admin-nav-item ${pathname === item.to ? "active" : ""}`}
          >
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

      {/* Main Content Area */}
      <main className="admin-main">
        <div className="admin-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="mobile-sidebar-toggle" 
              aria-label="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-title">{title}</h1>
          </div>
        </div>
        {children}
      </main>

      {/* Scoped close button rule */}
      <style>{`
        .mobile-only-close-btn {
          display: none !important;
        }
        @media (max-width: 1024px) {
          .mobile-only-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
