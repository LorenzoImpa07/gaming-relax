"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { Gift, Trash2, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

type GiftCard = {
  id: string;
  code: string;
  amount: number;
  balance: number;
  assignedEmail: string;
  active: boolean;
  note?: string;
  createdAt?: { toDate?: () => Date };
  history?: {
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    at?: unknown;
    orderId?: string;
  }[];
};

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "GR-";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default function AdminGiftCardPage() {
  const [items, setItems] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    email: "",
    amount: 50,
    code: "",
    note: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "gift_cards"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GiftCard)));
    } catch (e) {
      console.error(e);
      try {
        const snap = await getDocs(collection(db, "gift_cards"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GiftCard)));
      } catch (e2) {
        console.error(e2);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    const amount = Number(form.amount);
    if (!email || !email.includes("@") || amount <= 0) return;
    setSaving(true);
    try {
      const code = (form.code.trim() || genCode()).toUpperCase();
      await addDoc(collection(db, "gift_cards"), {
        code,
        amount,
        balance: amount,
        assignedEmail: email,
        active: true,
        note: form.note.trim() || "",
        createdAt: serverTimestamp(),
        history: [
          {
            type: "created",
            amount,
            balanceBefore: 0,
            balanceAfter: amount,
            at: new Date().toISOString(),
          },
        ],
      });
      setForm({ email: "", amount: 50, code: "", note: "" });
      await load();
    } catch (err) {
      console.error(err);
      alert("Errore creazione gift card");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (g: GiftCard) => {
    await updateDoc(doc(db, "gift_cards", g.id), { active: !g.active });
    setItems((prev) =>
      prev.map((x) => (x.id === g.id ? { ...x, active: !g.active } : x))
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa gift card?")) return;
    await deleteDoc(doc(db, "gift_cards", id));
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-[#0c0c16] to-fuchsia-950/30 p-6">
        <div className="relative">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
            Credito
          </p>
          <h2 className="text-2xl font-bold text-white">Gift card</h2>
          <p className="mt-2 max-w-lg text-sm text-zinc-400">
            Crea una gift card e assegnala a un&apos;email. L&apos;utente la vede nel profilo e
            può usarla al checkout. Saldo e storico prima/dopo uso sono tracciati.
          </p>
        </div>
      </div>

      <form
        onSubmit={create}
        className="grid gap-4 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-zinc-500">Email destinatario *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="cliente@email.com"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Importo € *</label>
          <input
            type="number"
            min={1}
            step={1}
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Codice (opzionale)</label>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="Auto se vuoto"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs text-zinc-500">Nota interna</label>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Es. premio contest, rimborso…"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
            Crea e assegna
          </button>
        </div>
      </form>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Caricamento…
        </p>
      )}

      <div className="space-y-3">
        {items.map((g) => {
          const date =
            g.createdAt && typeof g.createdAt.toDate === "function"
              ? g.createdAt.toDate().toLocaleString("it-IT")
              : "—";
          return (
            <div
              key={g.id}
              className={cn(
                "rounded-2xl border p-4",
                g.active ? "border-white/10 bg-[#0c0c14]/80" : "border-zinc-800/50 bg-zinc-900/30 opacity-70"
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-violet-200">{g.code}</p>
                  <p className="mt-1 text-sm text-zinc-400">{g.assignedEmail}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Valore €{Number(g.amount).toFixed(2)} · Saldo{" "}
                    <span className="text-emerald-300">€{Number(g.balance).toFixed(2)}</span>
                    {" · "}
                    {date}
                  </p>
                  {g.note && <p className="mt-1 text-xs text-zinc-600">{g.note}</p>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggle(g)}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-300"
                  >
                    {g.active ? "Disattiva" : "Attiva"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(g.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/20 px-3 py-1 text-[11px] text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                    Elimina
                  </button>
                </div>
              </div>
              {g.history && g.history.length > 0 && (
                <div className="mt-3 border-t border-white/5 pt-3">
                  <p className="mb-1.5 text-[10px] uppercase tracking-wider text-zinc-600">
                    Storico
                  </p>
                  <ul className="space-y-1 text-xs text-zinc-400">
                    {g.history.slice().reverse().map((h, i) => (
                      <li key={i}>
                        {h.type}: €{Number(h.amount).toFixed(2)} · prima €
                        {Number(h.balanceBefore).toFixed(2)} → dopo €
                        {Number(h.balanceAfter).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
        {!loading && items.length === 0 && (
          <p className="text-center text-sm text-zinc-500">Nessuna gift card ancora.</p>
        )}
      </div>
    </div>
  );
}
