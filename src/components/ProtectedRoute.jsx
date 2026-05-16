import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
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
