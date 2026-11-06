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
import { CATEGORY_COLOR_PRESETS } from "@/lib/forum";

const emptyCat = { name: "", order: 0, color: "#34d399" };
const emptyCh = {
  categoryId: "",
  name: "",
  description: "",
  icon: "\u{1F4AC}",
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
      color: catForm.color || "#34d399",
    });
    setCatForm(emptyCat);
    load();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Eliminare categoria?")) return;
    await deleteDoc(doc(db, "forum_categories", id));
    load();
  };

  const updateCategoryColor = async (id: string, color: string) => {
    await updateDoc(doc(db, "forum_categories", id), { color });
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
      icon: chForm.icon || "\u{1F4AC}",
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
        Crea categorie e canali. Ogni canale puo essere una discussione (tutti o solo staff) oppure un link esterno.
        Puoi scegliere il colore di ogni categoria.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-violet-300 mb-3">Categorie</h2>
          <form onSubmit={addCategory} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 mb-4">
            <input
              required
              placeholder="Nome categoria"
              value={catForm.name}
              onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
              className={field}
            />
            <input
              type="number"
              placeholder="Ordine"
              value={catForm.order}
              onChange={(e) => setCatForm({ ...catForm, order: Number(e.target.value) })}
              className={field}
            />
            <div>
              <p className="text-xs text-zinc-500 mb-2">Colore categoria</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {CATEGORY_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    title={preset.label}
                    onClick={() => setCatForm({ ...catForm, color: preset.value })}
                    className={`h-7 w-7 rounded-full border-2 ${
                      catForm.color === preset.value ? "border-white scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={catForm.color || "#34d399"}
                onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-950"
              />
            </div>
            <button type="submit" className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">
              Aggiungi categoria
            </button>
          </form>
          {loading && <p className="text-xs text-zinc-500">...</p>}
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: cat.color || "#34d399" }}
                  />
                  <span className="text-sm text-white truncate">
                    {cat.order}. {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="color"
                    value={cat.color || "#34d399"}
                    onChange={(e) => updateCategoryColor(cat.id, e.target.value)}
                    title="Cambia colore"
                    className="h-7 w-8 cursor-pointer rounded border border-zinc-600 bg-transparent"
                  />
                  <button onClick={() => deleteCategory(cat.id)} className="text-xs text-red-400">
                    Elimina
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-violet-300 mb-3">Canali</h2>
          <form onSubmit={addChannel} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3 mb-4">
            <select
              required
              value={chForm.categoryId}
              onChange={(e) => setChForm({ ...chForm, categoryId: e.target.value })}
              className={field}
            >
              <option value="">-- Categoria --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-[80px_1fr] gap-2">
              <input
                placeholder="Icona"
                value={chForm.icon}
                onChange={(e) => setChForm({ ...chForm, icon: e.target.value })}
                className={field}
              />
              <input
                required
                placeholder="Nome canale"
                value={chForm.name}
                onChange={(e) => setChForm({ ...chForm, name: e.target.value })}
                className={field}
              />
            </div>
            <textarea
              placeholder="Descrizione"
              value={chForm.description}
              onChange={(e) => setChForm({ ...chForm, description: e.target.value })}
              className={field}
              rows={2}
            />
            <select
              value={chForm.type}
              onChange={(e) => setChForm({ ...chForm, type: e.target.value as "discussion" | "link" })}
              className={field}
            >
              <option value="discussion">Discussione (chat interna)</option>
              <option value="link">Link esterno</option>
            </select>
            {chForm.type === "link" && (
              <input
                required
                placeholder="URL esterno (https://...)"
                value={chForm.externalUrl}
                onChange={(e) => setChForm({ ...chForm, externalUrl: e.target.value })}
                className={field}
              />
            )}
            {chForm.type === "discussion" && (
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={chForm.staffOnly}
                  onChange={(e) => setChForm({ ...chForm, staffOnly: e.target.checked })}
                />
                Solo staff puo scrivere
              </label>
            )}
            <button type="submit" className="rounded-full bg-violet-600 px-4 py-2 text-sm text-white">
              Aggiungi canale
            </button>
          </form>

          <ul className="space-y-2">
            {channels.map((ch) => {
              const cat = categories.find((c) => c.id === ch.categoryId);
              return (
                <li
                  key={ch.id}
                  className="rounded-xl border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 flex justify-between gap-2"
                >
                  <div>
                    <p className="text-sm text-white">
                      {ch.icon} {ch.name}{" "}
                      <span className="text-zinc-500">({cat?.name || "?"})</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {ch.type === "link" ? `Link: ${ch.externalUrl}` : "Discussione"}
                      {ch.staffOnly ? " - Solo staff" : " - Tutti"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {ch.type === "discussion" && (
                      <button onClick={() => toggleStaff(ch)} className="text-xs text-amber-400">
                        {ch.staffOnly ? "Apri a tutti" : "Solo staff"}
                      </button>
                    )}
                    <button onClick={() => deleteChannel(ch.id)} className="text-xs text-red-400">
                      Elimina
                    </button>
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
