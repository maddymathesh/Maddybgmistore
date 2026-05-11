import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

// Detect Android/iOS WebView — these environments block window.open()
// so signInWithPopup silently falls back to redirect, losing session state.
function isWebView() {
  const ua = navigator.userAgent || "";
  return (
    /wv/.test(ua) ||                                        // Android WebView flag
    /Android.*Version\/[\d.]+.*Chrome/.test(ua) ||          // Old Android WebView
    ua.includes("CPH2609") ||                               // Specific device fallback
    (window.Android !== undefined) ||                       // Android JS bridge present
    (!window.chrome && /Android/.test(ua))                  // Chrome missing = WebView
  );
}

export default function Login() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/readystocks";

  // On mount: handle the result coming back from signInWithRedirect
  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          toast.success("Logged in successfully!");
        }
      })
      .catch((error) => {
        if (error.code !== "auth/no-current-user") {
          console.error(error);
          toast.error(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Redirect once Firebase auth state resolves
  useEffect(() => {
    if (user) navigate(isAdmin ? "/admin" : from, { replace: true });
  }, [user, isAdmin, navigate, from]);

  const googleLogin = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    if (isWebView()) {
      // WebView: popup is blocked — use redirect flow instead
      signInWithRedirect(auth, provider).catch((error) => {
        console.error(error);
        toast.error(error.message);
        setLoading(false);
      });
    } else {
      // Normal browser: use popup as before
      signInWithPopup(auth, provider)
        .then(() => toast.success("Logged in successfully!"))
        .catch((error) => {
          console.error(error);
          toast.error(error.message);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <img src="/logo.png" alt="Maddy BGMI Store" style={{ height: "60px", width: "auto" }} />
        </Link>

        <div style={{ background: "var(--card)", border: "1px solid var(--border-gold)", borderRadius: "20px", padding: "40px 32px" }}>

          {/* Lock icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={24} style={{ color: "var(--gold)" }} />
            </div>
          </div>

          <h2 style={{ fontFamily: "var(--font-h)", fontSize: "26px", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>
            Sign In to <span style={{ color: "var(--gold)" }}>Continue</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", textAlign: "center", marginBottom: "28px", lineHeight: 1.6 }}>
            Login to view account prices and details.<br />
            Admins will be redirected to the dashboard.
          </p>

          {/* Google Sign In */}
          <button
            onClick={googleLogin}
            disabled={loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              gap: "12px", padding: "14px 20px", borderRadius: "12px",
              background: "#fff", border: "none",
              color: "#111", fontFamily: "var(--font-h)", fontWeight: 700,
              fontSize: "14px", letterSpacing: "0.5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1, transition: "all .2s",
              boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.35)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "1px" }}>SECURE LOGIN</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Info */}
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              ["🛡️", "Admin accounts get full dashboard access"],
              ["👤", "Users can view prices & buy accounts"],
              ["🔒", "Your data is safe with Firebase Auth"],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--muted)" }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "12px", marginTop: "20px" }}>
          <Link to="/" style={{ color: "var(--gold)" }}>← Back to Store</Link>
        </p>
      </div>
    </div>
  );
}
