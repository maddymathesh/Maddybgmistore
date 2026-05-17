import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdminClaim, setIsAdminClaim] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_UID_1 = import.meta.env.VITE_ADMIN_UID;
  const ADMIN_UID_2 = import.meta.env.VITE_ADMIN_UID_2;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      let isDbAdmin = false;
      if (u) {
        try {
          // 1. Check custom claim first
          const idTokenResult = await u.getIdTokenResult(true);
          if (idTokenResult.claims.admin) {
            isDbAdmin = true;
          }
        } catch (e) {
          // Ignore
        }
        
        // 2. Check Firestore "admins" collection by user's email
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

  const logout = () => signOut(auth);

  const isAdmin = user && (user.uid === ADMIN_UID_1 || user.uid === ADMIN_UID_2 || isAdminClaim);

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
