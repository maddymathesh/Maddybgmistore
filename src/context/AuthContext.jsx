import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_UID_1 = import.meta.env.VITE_ADMIN_UID;
  const ADMIN_UID_2 = import.meta.env.VITE_ADMIN_UID_2;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsub;
  }, []);

  const logout = () => signOut(auth);

  const isAdmin =
    user &&
    (user.uid === ADMIN_UID_1 || user.uid === ADMIN_UID_2);

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
