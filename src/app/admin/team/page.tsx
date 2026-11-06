"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Member = {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
};

const empty = { name: "", role: "", description: "", image: "" };

export default function AdminTeamPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_team"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Member)));
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
      role: form.role,
      description: form.description,
      image: form.image || null,
    };
    if (editId) await updateDoc(doc(db, "site_team", editId), payload);
    else await addDoc(collection(db, "site_team"), payload);
    setForm(empty);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare?")) return;
    await deleteDoc(doc(db, "site_team", id));
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white">{editId ? "Modifica membro" : "Nuovo membro"}</h2>
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <input required placeholder="Ruolo" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea required placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" rows={3} />
        <input placeholder="URL foto (opzionale)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
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
              <p className="text-xs text-violet-400">{row.role}</p>
              <p className="text-sm text-zinc-500 mt-1">{row.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditId(row.id); setForm({ name: row.name, role: row.role, description: row.description, image: row.image || "" }); }} className="text-xs text-violet-400">Modifica</button>
              <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
