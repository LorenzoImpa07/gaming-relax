"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/firebase";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M6.6 14.3l-.5.4-2.2 1.7C5.6 19.2 8.6 21 12 21c2.7 0 4.9-.9 6.5-2.4l-3.1-2.4c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1z" />
      <path fill="#4A90E2" d="M3.9 7.6C3.3 8.8 3 10.1 3 11.5s.3 2.7.9 3.9c0 .1 2.7-2.1 2.7-2.1-.2-.5-.3-1.1-.3-1.7 0-.6.1-1.2.3-1.7L3.9 7.6z" />
      <path fill="#FBBC05" d="M12 6.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.4 14.7 2.5 12 2.5 8.6 2.5 5.6 4.3 4 7.2l2.7 2.1C7.2 8.2 9.4 6.5 12 6.5z" />
    </svg>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const goAfter = (mail?: string | null) => {
    if (isAdminEmail(mail || "")) router.push("/admin");
    else router.push(next || "/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      goAfter(email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore accesso";
      if (
        message.includes("user-not-found") ||
        message.includes("wrong-password") ||
        message.includes("invalid-credential")
      ) {
        setError("Email o password non corretti");
      } else {
        setError("Errore durante l'accesso. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      goAfter(auth.currentUser?.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore Google";
      if (message.includes("popup-closed")) setError("Accesso Google annullato");
      else if (message.includes("unauthorized-domain")) {
        setError(
          "Dominio non autorizzato. In Firebase → Authentication → Authorized domains aggiungi il dominio del sito (es. gaming-relax-programmazione.vercel.app)."
        );
      } else setError("Errore accesso con Google. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8 backdrop-blur box-glow"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white text-glow">Accedi</h1>
          <p className="mt-2 text-sm text-zinc-400">Email e password, oppure Google</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                placeholder="email@esempio.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none"
                placeholder="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white btn-glow disabled:opacity-60"
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-900/60 px-3 text-zinc-500">oppure</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-700 bg-zinc-950 py-3 text-sm font-medium text-white hover:border-violet-500/50 disabled:opacity-60"
        >
          <GoogleIcon />
          Continua con Google
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Non hai un account?{" "}
          <Link href="/register" className="text-violet-400 hover:underline">
            Registrati
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-zinc-500">Caricamento...</div>}>
      <LoginForm />
    </Suspense>
  );
}
