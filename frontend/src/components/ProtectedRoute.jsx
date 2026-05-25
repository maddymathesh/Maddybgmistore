import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, resendVerification } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // 1. Mandatory Email Verification Guard
  if (!user.emailVerified) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: "16px", fontFamily: "var(--font-h)", color: "var(--muted)", padding: "24px", background: "var(--bg)", textAlign: "center" }}>
        <div style={{ fontSize: "48px" }}>✉️</div>
        <div style={{ fontSize: "24px", color: "var(--gold)", fontWeight: "700" }}>Email Verification Required</div>
        <div style={{ fontSize: "14px", maxWidth: "420px", lineHeight: "1.6" }}>
          For security compliance, your email address (<strong>{user.email}</strong>) must be fully verified before accessing administrative modules or executing transactions.
        </div>
        <button onClick={resendVerification} className="btn btn-gold" style={{ marginTop: "8px", padding: "10px 24px", borderRadius: "8px" }}>
          Resend Verification Link
        </button>
        <a href="/" style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px", textDecoration: "underline" }}>← Return to Store</a>
      </div>
    );
  }

  // 2. Role-Based Admin Access Guard
  if (!isAdmin) return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:"16px",fontFamily:"var(--font-h)",color:"var(--muted)" }}>
      <div style={{ fontSize:"48px" }}>🚫</div>
      <div style={{ fontSize:"24px",color:"var(--red)" }}>Access Denied</div>
      <div style={{ fontSize:"14px" }}>You don't have admin privileges.</div>
      <a href="/" className="btn btn-gold" style={{ marginTop:"8px" }}>Go Home</a>
    </div>
  );

  return children;
}
