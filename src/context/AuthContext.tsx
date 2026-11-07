"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationCode: (
    email: string,
    purpose: "register" | "login"
  ) => Promise<{ devCode?: string }>;
  verifyCode: (email: string, code: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const ensureUserDoc = async (
    uid: string,
    data: { name?: string | null; email?: string | null; provider?: string }
  ) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        name: data.name || "",
        email: data.email || "",
        provider: data.provider || "email",
        emailVerifiedByCode: data.provider === "google",
        createdAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        ref,
        {
          emailVerifiedByCode: true,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  };

  const sendVerificationCode = async (
    email: string,
    purpose: "register" | "login"
  ) => {
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore invio codice");
    return { devCode: data.devCode as string | undefined };
  };

  const verifyCode = async (email: string, code: string) => {
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Codice non valido");
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      await ensureUserDoc(auth.currentUser.uid, {
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
        provider: "email",
      });
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      provider: "email",
      emailVerifiedByCode: true,
      createdAt: serverTimestamp(),
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    await ensureUserDoc(cred.user.uid, {
      name: cred.user.displayName,
      email: cred.user.email,
      provider: "google",
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        sendVerificationCode,
        verifyCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
