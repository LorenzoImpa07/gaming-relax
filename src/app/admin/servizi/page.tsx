"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type ServiceRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  features: string;
  popular?: boolean;
};

const empty = {
  name: "",
  description: "",
  price: 0,
  category: "bot",
  features: "",
  popular: false,
};

export default function AdminServiziPage() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "site_services"), orderBy("price")));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceRow)));
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
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      features: form.features,
      popular: !!form.popular,
    };
    if (editId) await updateDoc(doc(db, "site_services", editId), payload);
    else await addDoc(collection(db, "site_services"), payload);
    setForm(empty);
    setEditId(null);
    load();
  };

  const startEdit = (row: ServiceRow) => {
    setEditId(row.id);
    setForm({
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      features:
        typeof row.features === "string"
          ? row.features
          : (row.features as unknown as string[])?.join("\n") || "",
      popular: row.popular,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo servizio?")) return;
    await deleteDoc(doc(db, "site_services", id));
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white mb-2">{editId ? "Modifica servizio" : "Nuovo servizio"}</h2>
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea required placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" required placeholder="Prezzo" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white">
            <option value="bot">bot</option>
            <option value="web">web</option>
            <option value="software">software</option>
            <option value="automation">automation</option>
            <option value="support">support</option>
          </select>
        </div>
        <textarea placeholder="Feature (una per riga)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" rows={4} />
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
          In evidenza
        </label>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white">{editId ? "Salva" : "Aggiungi"}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">Nessun servizio in Firestore. Aggiungine uno dalla form a sinistra.</p>
        )}
        {items.map((row) => (
          <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-medium text-white">{row.name} — €{row.price}</p>
                <p className="text-xs text-zinc-500">{row.category}{row.popular ? " · popular" : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(row)} className="text-xs text-violet-400">Modifica</button>
                <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
