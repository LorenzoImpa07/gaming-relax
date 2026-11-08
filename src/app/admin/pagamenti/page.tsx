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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreditCard, Link2 } from "lucide-react";

type PayMethod = {
  id: string;
  name: string;
  description: string;
  link: string;
  requiresCard: boolean;
  active: boolean;
  order: number;
};

const empty = {
  name: "",
  description: "",
  link: "",
  requiresCard: false,
  active: true,
  order: 0,
};

export default function AdminPagamentiPage() {
  const [items, setItems] = useState<PayMethod[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_payment_methods"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PayMethod));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      requiresCard: !!form.requiresCard,
      active: !!form.active,
      order: Number(form.order) || 0,
      updatedAt: serverTimestamp(),
    };
    try {
      if (editId) await updateDoc(doc(db, "site_payment_methods", editId), payload);
      else
        await addDoc(collection(db, "site_payment_methods"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      console.error(err);
      setError("Salvataggio fallito.");
    }
  };

  const startEdit = (row: PayMethod) => {
    setEditId(row.id);
    setForm({
      name: row.name || "",
      description: row.description || "",
      link: row.link || "",
      requiresCard: !!row.requiresCard,
      active: row.active !== false,
      order: row.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Rimuovere questo metodo? Sparirà dal checkout.")) return;
    await deleteDoc(doc(db, "site_payment_methods", id));
    load();
  };

  const toggleActive = async (row: PayMethod) => {
    await updateDoc(doc(db, "site_payment_methods", row.id), { active: !row.active });
    load();
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="font-semibold text-white">
          {editId ? "Modifica metodo" : "Nuovo metodo di pagamento"}
        </h2>
        <p className="text-xs text-zinc-500">
          I metodi attivi compaiono in automatico nel carrello e al checkout. Se li disattivi o
          elimini, spariscono subito dal sito.
        </p>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <input
          required
          placeholder="Nome (es. PayPal, Carta, Bonifico)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={field}
        />
        <input
          placeholder="Descrizione breve"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={field}
        />
        <div>
          <label className="mb-1 flex items-center gap-1 text-xs text-zinc-500">
            <Link2 className="h-3 w-3" />
            Link / collegamento (opzionale)
          </label>
          <input
            placeholder="https://paypal.me/... o link Stripe"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className={field}
          />
        </div>
        <input
          type="number"
          placeholder="Ordine visualizzazione"
          value={form.order || ""}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          className={field}
        />
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.requiresCard}
            onChange={(e) => setForm({ ...form, requiresCard: e.target.checked })}
            className="accent-fuchsia-500"
          />
          Richiede dati carta al checkout
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="accent-fuchsia-500"
          />
          Attivo (visibile su carrello e checkout)
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white"
          >
            {editId ? "Salva" : "Aggiungi"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(empty);
              }}
              className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300"
            >
              Annulla
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nessun metodo. Aggiungine uno: comparirà subito al checkout.
          </p>
        )}
        {items.map((row) => (
          <div
            key={row.id}
            className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">
                {row.name}{" "}
                {!row.active && <span className="text-xs text-zinc-500">(disattivo)</span>}
              </p>
              {row.description && <p className="text-xs text-zinc-400">{row.description}</p>}
              {row.link && (
                <a
                  href={row.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-xs text-violet-400 hover:underline"
                >
                  {row.link}
                </a>
              )}
              <div className="mt-2 flex flex-wrap gap-3">
                <button type="button" onClick={() => toggleActive(row)} className="text-xs text-zinc-400">
                  {row.active ? "Disattiva" : "Attiva"}
                </button>
                <button type="button" onClick={() => startEdit(row)} className="text-xs text-violet-400">
                  Modifica
                </button>
                <button type="button" onClick={() => remove(row.id)} className="text-xs text-red-400">
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
