"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, ShieldCheck, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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

function ageFromBirthDate(iso: string): number {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    birthDate: "",
  });
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "code">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const { register, loginWithGoogle, sendVerificationCode, verifyCode } = useAuth();
  const router = useRouter();

  const goAfter = (mail: string) => {
    if (isAdminEmail(mail)) router.push("/admin");
    else router.push("/");
  };

  const maxBirth = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 14);
    return d.toISOString().slice(0, 10);
  })();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (form.password !== form.confirm) {
      setError("Le password non coincidono");
      return;
    }
    if (form.password.length < 6) {
      setError("La password deve avere almeno 6 caratteri");
      return;
    }
    if (!form.birthDate) {
      setError("Inserisci la data di nascita");
      return;
    }
    if (ageFromBirthDate(form.birthDate) < 14) {
      setError("Devi avere almeno 14 anni per registrarti");
      return;
    }
    setLoading(true);
    try {
      const result = await sendVerificationCode(form.email, "register");
      setStep("code");
      setInfo(
        result.devCode
          ? `Modalita sviluppo — codice: ${result.devCode}`
          : `Ti abbiamo inviato un codice a ${form.email}`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Errore invio codice");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyCode(form.email, code);
      await register(form.name, form.email, form.password);
      if (auth.currentUser) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          { birthDate: form.birthDate, emailVerifiedByCode: true, updatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      goAfter(form.email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore registrazione";
      if (message.includes("email-already-in-use")) {
        setError("Questa email e gia registrata");
        setStep("form");
      } else if (message.includes("weak-password")) {
        setError("Password troppo debole");
        setStep("form");
      } else setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      goAfter(auth.currentUser?.email || "");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Errore Google";
      if (message.includes("popup-closed")) setError("Registrazione Google annullata");
      else if (message.includes("unauthorized-domain"))
        setError("Dominio non autorizzato. Aggiungi il dominio Vercel in Firebase Authorized domains.");
      else setError("Errore registrazione con Google. Riprova.");
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
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white text-glow">Crea account</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {step === "form" ? "Compila i dati e verifica la tua email" : "Inserisci il codice ricevuto via email"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}
        {info && (
          <div className="mb-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">{info}</div>
        )}

        {step === "form" ? (
          <form onSubmit={handleForm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none" placeholder="Il tuo nome" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none" placeholder="email@esempio.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Data di nascita</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input type="date" required max={maxBirth} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <p className="mt-1 text-xs text-zinc-500">Eta minima: 14 anni.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none" placeholder="Min. 6 caratteri" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Conferma password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-violet-500 focus:outline-none" placeholder="Ripeti password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white btn-glow disabled:opacity-60">
              {loading ? "Invio codice..." : "Continua — verifica email"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Codice a 6 cifre</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 text-center text-lg tracking-[0.4em] text-white focus:border-violet-500 focus:outline-none" placeholder="000000" />
              </div>
            </div>
            <button type="submit" disabled={loading || code.length !== 6} className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white btn-glow disabled:opacity-60">
              {loading ? "Creazione account..." : "Verifica e registra"}
            </button>
            <button type="button" onClick={() => { setStep("form"); setCode(""); setInfo(""); }} className="w-full text-sm text-zinc-400 hover:text-white">
              Torna indietro
            </button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-zinc-900/60 px-3 text-zinc-500">oppure</span></div>
        </div>

        <button type="button" onClick={handleGoogle} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-full border border-zinc-700 bg-zinc-950 py-3 text-sm font-medium text-white hover:border-violet-500/50 disabled:opacity-60">
          <GoogleIcon />
          Continua con Google
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Hai gia un account?{" "}
          <Link href="/login" className="text-violet-400 hover:underline">Accedi</Link>
        </p>
      </motion.div>
    </div>
  );
}
