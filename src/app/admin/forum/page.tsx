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
import type { ForumCategory, ForumChannel } from "@/lib/forum";

const emptyCat = { name: "", order: 0 };
const emptyCh = {
  categoryId: "",
  name: "",
  description: "",
  icon: "\ud83d\udcac",
  type: "discussion" as "discussion" | "link",
  externalUrl: "",
  staffOnly: false,
  order: 0,
};

export default function AdminForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [channels, setChannels] = useState<ForumChannel[]>([]);
  const [catForm, setCatForm] = useState(emptyCat);
  const [chForm, setChForm] = useState(emptyCh);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [cSnap, chSnap] = await Promise.all([
        getDocs(query(collection(db, "forum_categories"), orderBy("order"))),
        getDocs(query(collection(db, "forum_channels"), orderBy("order"))),
      ]);
      setCategories(cSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumCategory)));
      setChannels(chSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumChannel)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "forum_categories"), {
      name: catForm.name,
      order: Number(catForm.order) || categories.length,
    });
    setCatForm(emptyCat);
    load();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Eliminare categoria?")) return;
    await deleteDoc(doc(db, "forum_categories", id));
    load();
  };

  const addChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chForm.categoryId) {
      alert("Seleziona una categoria");
      return;
    }
    await addDoc(collection(db, "forum_channels"), {
      categoryId: chForm.categoryId,
      name: chForm.name,
      description: chForm.description,
      icon: chForm.icon || "\ud83d\udcac",
      type: chForm.type,
      externalUrl: chForm.type === "link" ? chForm.externalUrl : null,
      staffOnly: chForm.staffOnly,
      order: Number(chForm.order) || channels.length,
      threadCount: 0,
      messageCount: 0,
    });
    setChForm({ ...emptyCh, categoryId: chForm.categoryId });
    load();
  };

  const deleteChannel = async (id: string) => {
    if (!confirm("Eliminare questo canale?")) return;
    await deleteDoc(doc(db, "forum_channels", id));
    load();
  };

  const toggleStaff = async (ch: ForumChannel) => {
    await updateDoc(doc(db, "forum_channels", ch.id), { staffOnly: !ch.staffOnly });
    load();
  };

  const field = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="space-y-10">
      <p className="text-sm text-zinc-400">
        Crea categorie e canali. Ogni canale pu\u00f2 essere una discussione (tutti o solo staff) oppure un link esterno.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-white mb-3">Categorie</h2>
          <form onSubmit={addCategory} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 mb-4">
            <input required placeholder="Nome categoria" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className={field} />
            <input type="number" placeholder="Ordine" value={catForm.order} onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })} className={field} />
            <button type="submit" className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">Aggiungi categoria</button>
          </form>
          {loading && <p className="text-xs text-zinc-500">...</p>}
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
                <span className="text-sm text-white">{c.order}. {c.name}</span>
                <button onClick={() => deleteCategory(c.id)} className="text-xs text-red-400">Elimina</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-white mb-3">Canali</h2>
          <form onSubmit={addChannel} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 mb-4">
            <select required value={chForm.categoryId} onChange={(e) => setChForm({ ...chForm, categoryId: e.target.value })} className={field}>
              <option value="">\u2014 Categoria \u2014</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <input placeholder="Icona" value={chForm.icon} onChange={(e) => setChForm({ ...chForm, icon: e.target.value })} className={field} />
              <input required placeholder="Nome canale" value={chForm.name} onChange={(e) => setChForm({ ...chForm, name: e.target.value })} className={field} />
            </div>
            <textarea placeholder="Descrizione" value={chForm.description} onChange={(e) => setChForm({ ...chForm, description: e.target.value })} className={field} rows={2} />
            <select value={chForm.type} onChange={(e) => setChForm({ ...chForm, type: e.target.value as "discussion" | "link" })} className={field}>
              <option value="discussion">Discussione (chat interna)</option>
              <option value="link">Link esterno</option>
            </select>
            {chForm.type === "link" && (
              <input required placeholder="URL esterno (https://...)" value={chForm.externalUrl} onChange={(e) => setChForm({ ...chForm, externalUrl: e.target.value })} className={field} />
            )}
            {chForm.type === "discussion" && (
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input type="checkbox" checked={chForm.staffOnly} onChange={(e) => setChForm({ ...chForm, staffOnly: e.target.checked })} />
                Solo staff pu\u00f2 scrivere
              </label>
            )}
            <button type="submit" className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">Aggiungi canale</button>
          </form>

          <ul className="space-y-2">
            {channels.map((ch) => {
              const cat = categories.find((c) => c.id === ch.categoryId);
              return (
                <li key={ch.id} className="rounded-xl border border-zinc-800 px-3 py-2 flex justify-between gap-2">
                  <div>
                    <p className="text-sm text-white">{ch.icon} {ch.name} <span className="text-zinc-500">({cat?.name || "?"})</span></p>
                    <p className="text-xs text-zinc-500">
                      {ch.type === "link" ? `Link \u2192 ${ch.externalUrl}` : "Discussione"}
                      {ch.staffOnly ? " \u00b7 Solo staff" : " \u00b7 Tutti"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {ch.type === "discussion" && (
                      <button onClick={() => toggleStaff(ch)} className="text-xs text-amber-400">{ch.staffOnly ? "Apri a tutti" : "Solo staff"}</button>
                    )}
                    <button onClick={() => deleteChannel(ch.id)} className="text-xs text-red-400">Elimina</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
