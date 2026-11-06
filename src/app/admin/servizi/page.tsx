"use client";

import { useEffect, useState } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const EUR = "\u20AC";

type ServiceRow = {
  id: string;
  name: string;
  description: string;
  details?: string;
  price: number;
  category: string;
  features: string;
  popular?: boolean;
  available?: boolean;
  discountPercent?: number;
};

const empty = {
  name: "",
  description: "",
  details: "",
  price: 0,
  category: "bot",
  features: "",
  popular: false,
  available: true,
  discountPercent: 0,
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
      details: form.details,
      price: Number(form.price),
      category: form.category,
      features: form.features,
      popular: !!form.popular,
      available: !!form.available,
      discountPercent: Math.min(100, Math.max(0, Number(form.discountPercent) || 0)),
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
      details: row.details || "",
      price: row.price,
      category: row.category,
      features:
        typeof row.features === "string"
          ? row.features
          : (row.features as unknown as string[])?.join("\n") || "",
      popular: !!row.popular,
      available: row.available !== false,
      discountPercent: row.discountPercent || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo servizio?")) return;
    await deleteDoc(doc(db, "site_services", id));
    load();
  };

  const field = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white mb-2">{editId ? "Modifica servizio" : "Nuovo servizio"}</h2>
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
        <textarea required placeholder="Descrizione breve" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} rows={2} />
        <textarea placeholder="Descrizione lunga (pagina dettaglio)" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className={field} rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Prezzo ({EUR})</label>
            <input type="number" required min={0} step={1} value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={field} />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Sconto %</label>
            <input type="number" min={0} max={100} value={form.discountPercent || ""} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} className={field} />
          </div>
        </div>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={field}>
          <option value="bot">bot</option>
          <option value="web">web</option>
          <option value="software">software</option>
          <option value="automation">automation</option>
          <option value="support">support</option>
        </select>
        <textarea placeholder="Feature (una per riga)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={field} rows={4} />
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
          In evidenza
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
          Disponibile (se disattivo = Esaurito)
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
        {items.map((row) => {
          const disc = row.discountPercent || 0;
          const final = disc > 0 ? Math.round(row.price * (1 - disc / 100) * 100) / 100 : row.price;
          return (
            <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {row.name}{" — "}
                    {disc > 0 ? (
                      <>
                        <span className="text-zinc-500 line-through mr-1">{EUR}{row.price}</span>
                        <span className="text-fuchsia-400">{EUR}{final}</span>
                        <span className="text-xs text-green-400 ml-1">-{disc}%</span>
                      </>
                    ) : (
                      <span>{EUR}{row.price}</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {row.category}
                    {row.popular ? " \u00b7 popular" : ""}
                    {row.available === false ? " \u00b7 ESAURITO" : " \u00b7 disponibile"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(row)} className="text-xs text-violet-400">Modifica</button>
                  <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
