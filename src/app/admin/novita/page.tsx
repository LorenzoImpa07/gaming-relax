"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type News = { id: string; title: string; date: string; text: string };

const empty = { title: "", date: "", text: "" };

export default function AdminNovitaPage() {
  const [items, setItems] = useState<News[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_news"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as News)));
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
    const payload = { title: form.title, date: form.date, text: form.text, updatedAt: serverTimestamp() };
    if (editId) await updateDoc(doc(db, "site_news", editId), payload);
    else await addDoc(collection(db, "site_news"), { ...payload, createdAt: serverTimestamp() });
    setForm(empty);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare?")) return;
    await deleteDoc(doc(db, "site_news", id));
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white">{editId ? "Modifica novità" : "Nuova novità"}</h2>
        <input required placeholder="Titolo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <input required placeholder="Data (es. Novembre 2026)" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea required placeholder="Testo" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" rows={4} />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white">{editId ? "Salva" : "Pubblica"}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
          )}
        </div>
      </form>
      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {items.map((row) => (
          <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-xs text-zinc-500">{row.date}</p>
                <p className="font-medium text-white">{row.title}</p>
                <p className="text-sm text-zinc-400 mt-1">{row.text}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setEditId(row.id); setForm({ title: row.title, date: row.date, text: row.text }); }} className="text-xs text-violet-400">Modifica</button>
                <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
