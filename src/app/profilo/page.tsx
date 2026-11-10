"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { uploadImage } from "@/lib/upload";

type ProfileForm = {
  nickname: string;
  nome: string;
  cognome: string;
  birthDate: string;
  bio: string;
  photoURL: string;
};

type GiftCardRow = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  active: boolean;
  history?: {
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
  }[];
};

export default function ProfiloPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProfileForm>({
    nickname: "",
    nome: "",
    cognome: "",
    birthDate: "",
    bio: "",
    photoURL: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [giftCards, setGiftCards] = useState<GiftCardRow[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/profilo");
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};
        setForm({
          nickname: (data.nickname as string) || user.displayName || "",
          nome: (data.nome as string) || "",
          cognome: (data.cognome as string) || "",
          birthDate: (data.birthDate as string) || "",
          bio: (data.bio as string) || "",
          photoURL: (data.photoURL as string) || user.photoURL || "",
        });

        try {
          const gq = query(
            collection(db, "gift_cards"),
            where("assignedEmail", "==", (user.email || "").toLowerCase())
          );
          const gsnap = await getDocs(gq);
          setGiftCards(
            gsnap.docs.map((d) => {
              const gd = d.data();
              return {
                id: d.id,
                code: String(gd.code || ""),
                amount: Number(gd.amount) || 0,
                balance: Number(gd.balance) || 0,
                active: gd.active !== false,
                history: Array.isArray(gd.history) ? gd.history : [],
              };
            })
          );
        } catch (ge) {
          console.error("gift cards", ge);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user, loading, router]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setProgress(0);
    setError("");
    try {
      const url = await uploadImage(file, "profiles", (p) => setProgress(p.percent));
      setForm((f) => ({ ...f, photoURL: url }));
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore upload");
      setProgress(0);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          nickname: form.nickname,
          nome: form.nome,
          cognome: form.cognome,
          birthDate: form.birthDate,
          bio: form.bio,
          photoURL: form.photoURL || null,
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.nickname || form.nome || user.displayName,
          photoURL: form.photoURL || null,
        });
      }
      setMessage("Profilo salvato!");
    } catch (err) {
      console.error(err);
      setError("Errore salvataggio profilo");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-zinc-500">
        Caricamento...
      </div>
    );
  }

  const field =
    "w-full border-0 border-b border-zinc-700 bg-transparent px-0 py-2 text-white placeholder-zinc-600 focus:border-fuchsia-500 focus:outline-none";

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">Il mio profilo</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Nickname, dati personali, foto e bio. Visibili nel forum e nel menu.
        </p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <div className="flex justify-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.photoURL || "/logo.png"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Nickname</label>
          <input
            required
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            className={field}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Nome</label>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className={field}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Cognome</label>
          <input
            value={form.cognome}
            onChange={(e) => setForm({ ...form, cognome: e.target.value })}
            className={field}
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Data di nascita</label>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            className={field}
          />
          <p className="mt-1 text-xs text-zinc-600">Età minima richiesta: 14 anni.</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Foto profilo</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="mt-2 block w-full text-sm text-zinc-400 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-white"
          />
          {uploading && (
            <div className="mt-2">
              <p className="mb-1 text-xs text-zinc-500">Caricamento {progress}%</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-fuchsia-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-zinc-500">Bio (opzionale)</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className={`${field} resize-none`}
          />
        </div>

        {error && <p className="whitespace-pre-wrap text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-400">{message}</p>}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-500 py-3.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Salvataggio..." : "Salva profilo"}
        </button>
      </form>

      <div className="mt-12 border-t border-zinc-800 pt-10">
        <h2 className="text-lg font-semibold text-white">Le tue gift card</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Credito assegnato alla tua email. Saldo e storico prima / dopo ogni uso.
        </p>
        {giftCards.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">Nessuna gift card su questo account.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {giftCards.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-sm font-semibold text-violet-300">{g.code}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      g.active && g.balance > 0
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {g.active && g.balance > 0 ? "Attiva" : "Esaurita / off"}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                      Valore iniziale
                    </p>
                    <p className="text-white">€{g.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                      Saldo attuale
                    </p>
                    <p className="font-semibold text-emerald-300">€{g.balance.toFixed(2)}</p>
                  </div>
                </div>
                {g.history && g.history.length > 0 && (
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-600">
                      Storico (prima → dopo)
                    </p>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {[...g.history].reverse().map((h, i) => (
                        <li key={i}>
                          <span className="text-zinc-500">{h.type}</span>
                          {" · "}€{Number(h.amount).toFixed(2)}
                          {" · "}
                          <span className="text-zinc-300">
                            €{Number(h.balanceBefore).toFixed(2)} → €
                            {Number(h.balanceAfter).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-3 text-[11px] text-zinc-600">
                  Usa il codice al checkout per applicare il credito.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
