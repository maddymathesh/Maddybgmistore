import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from 'sonner';
import { useTransactionStore } from "../store/useTransactionStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdminClaim, setIsAdminClaim] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_UID_1 = import.meta.env.VITE_ADMIN_UID;
  const ADMIN_UID_2 = import.meta.env.VITE_ADMIN_UID_2;

  // 1. Core Auth State Observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      let isDbAdmin = false;
      if (u) {
        try {
          // Check custom claim first
          const idTokenResult = await u.getIdTokenResult(true);
          if (idTokenResult.claims.admin) {
            isDbAdmin = true;
          }
        } catch (e) {
          // Ignore
        }
        
        // Check Firestore "admins" collection by user's email
        if (!isDbAdmin && u.email) {
          try {
            const docRef = doc(db, "admins", u.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              isDbAdmin = true;
            }
          } catch (e) {
            console.error("Firestore admin check error:", e);
          }
        }
      }
      setIsAdminClaim(isDbAdmin);
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // 2. Active Session Inactivity Auto-Logout Monitor (15-Minute Timeout)
  useEffect(() => {
    if (!user) return;

    let timeoutId;
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const handleAutoLogout = async () => {
      try {
        // Force-wipe the transaction store auth credentials
        useTransactionStore.getState().logout();
        
        // Terminate main Firebase session
        await signOut(auth);
        
        toast.error("Session expired due to inactivity. Please sign in again.", {
          id: "session-expiry-toast", // Fixed ID to prevent popup aggregation
          style: {
            background: "#ef4444",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
          duration: 5000,
        });
      } catch (e) {
        console.error("Security session auto-logout failed:", e);
      }
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleAutoLogout, INACTIVITY_TIMEOUT);
    };

    // User interactions to monitor for active states
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    // Initialize state
    resetTimer();

    // Attach passive listeners to DOM
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  const logout = () => {
    // Force-wipe transaction store authenticated state
    useTransactionStore.getState().logout();
    return signOut(auth);
  };

  const resendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent! Please check your inbox.", {
          style: {
            background: "#3b82f6",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        toast.error(error.message || "Failed to send verification email.");
      }
    }
  };

  const isAdmin = user && (user.uid === ADMIN_UID_1 || user.uid === ADMIN_UID_2 || isAdminClaim);

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin, resendVerification }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
