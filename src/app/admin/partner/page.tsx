"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Partner = { id: string; name: string; href: string; image: string };

const empty = { name: "", href: "", image: "" };

export default function AdminPartnerPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_partners"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Partner)));
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
    const payload = { name: form.name, href: form.href, image: form.image };
    if (editId) await updateDoc(doc(db, "site_partners", editId), payload);
    else await addDoc(collection(db, "site_partners"), payload);
    setForm(empty);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare?")) return;
    await deleteDoc(doc(db, "site_partners", id));
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white">{editId ? "Modifica partner" : "Nuovo partner"}</h2>
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <input required placeholder="Link ufficiale (https://...)" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <input required placeholder="URL immagine logo" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white">{editId ? "Salva" : "Aggiungi"}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
          )}
        </div>
      </form>
      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {items.map((row) => (
          <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex justify-between gap-2">
            <div>
              <p className="font-medium text-white">{row.name}</p>
              <p className="text-xs text-zinc-500 truncate max-w-xs">{row.href}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditId(row.id); setForm({ name: row.name, href: row.href, image: row.image }); }} className="text-xs text-violet-400">Modifica</button>
              <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
