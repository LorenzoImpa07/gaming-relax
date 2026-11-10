"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumCategory, ForumChannel, ForumThreadTag } from "@/lib/forum";
import { DEFAULT_THREAD_TAG_SUGGESTIONS } from "@/lib/forum";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MessageSquare,
  Hash,
  Tag,
} from "lucide-react";

const emptyCat = { name: "", order: 0, color: "#a78bfa" };
const emptyCh = {
  categoryId: "",
  name: "",
  description: "",
  icon: "💬",
  type: "discussion" as "discussion" | "link",
  externalUrl: "",
  staffOnly: false,
  privateReply: false,
  order: 0,
  tags: "",
};

type CatForm = typeof emptyCat;
type ChForm = typeof emptyCh;

export default function AdminForumPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [channels, setChannels] = useState<ForumChannel[]>([]);
  const [threadTags, setThreadTags] = useState<ForumThreadTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [catForm, setCatForm] = useState<CatForm>(emptyCat);
  const [chForm, setChForm] = useState<ChForm>(emptyCh);
  const [tagForm, setTagForm] = useState({ name: "", color: "#22c55e", order: 0 });

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingChId, setEditingChId] = useState<string | null>(null);
  const [editCat, setEditCat] = useState<CatForm>(emptyCat);
  const [editCh, setEditCh] = useState<ChForm>(emptyCh);

  const load = async () => {
    setLoading(true);
    try {
      const [cSnap, chSnap, tagSnap] = await Promise.all([
        getDocs(query(collection(db, "forum_categories"), orderBy("order"))),
        getDocs(query(collection(db, "forum_channels"), orderBy("order"))),
        getDocs(collection(db, "forum_thread_tags")),
      ]);
      setCategories(cSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumCategory)));
      setChannels(chSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumChannel)));
      const tags = tagSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumThreadTag));
      tags.sort((a, b) => (a.order || 0) - (b.order || 0));
      setThreadTags(tags);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none";

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "forum_categories"), {
        name: catForm.name.trim(),
        order: Number(catForm.order) || categories.length,
        color: catForm.color || "#a78bfa",
      });
      setCatForm(emptyCat);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const saveCat = async () => {
    if (!editingCatId || !editCat.name.trim()) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_categories", editingCatId), {
        name: editCat.name.trim(),
        order: Number(editCat.order) || 0,
        color: editCat.color || "#a78bfa",
      });
      setEditingCatId(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const deleteCategory = async (id: string) => {
    const linked = channels.filter((c) => c.categoryId === id);
    if (!confirm(linked.length ? `Eliminare categoria e ${linked.length} canali?` : "Eliminare categoria?"))
      return;
    setBusy(true);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "forum_categories", id));
      linked.forEach((ch) => batch.delete(doc(db, "forum_channels", ch.id)));
      await batch.commit();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const addChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chForm.categoryId || !chForm.name.trim()) {
      alert("Seleziona categoria e nome");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "forum_channels"), {
        categoryId: chForm.categoryId,
        name: chForm.name.trim(),
        description: chForm.description.trim(),
        icon: chForm.icon || "💬",
        type: chForm.type,
        externalUrl: chForm.type === "link" ? chForm.externalUrl.trim() : null,
        staffOnly: chForm.staffOnly,
        privateReply: !!chForm.privateReply,
        order: Number(chForm.order) || channels.length,
        tags: chForm.tags.split(/[,;]+/).map((s) => s.trim()).filter(Boolean),
        threadCount: 0,
        messageCount: 0,
      });
      setChForm({ ...emptyCh, categoryId: chForm.categoryId });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const startEditCh = (ch: ForumChannel) => {
    setEditingChId(ch.id);
    setEditCh({
      categoryId: ch.categoryId,
      name: ch.name,
      description: ch.description || "",
      icon: ch.icon || "💬",
      type: ch.type || "discussion",
      externalUrl: ch.externalUrl || "",
      staffOnly: !!ch.staffOnly,
      privateReply: !!ch.privateReply,
      order: ch.order ?? 0,
      tags: Array.isArray(ch.tags) ? ch.tags.join(", ") : "",
    });
  };

  const saveCh = async () => {
    if (!editingChId || !editCh.name.trim() || !editCh.categoryId) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_channels", editingChId), {
        categoryId: editCh.categoryId,
        name: editCh.name.trim(),
        description: editCh.description.trim(),
        icon: editCh.icon || "💬",
        type: editCh.type,
        externalUrl: editCh.type === "link" ? editCh.externalUrl.trim() : null,
        staffOnly: editCh.staffOnly,
        privateReply: !!editCh.privateReply,
        order: Number(editCh.order) || 0,
        tags: editCh.tags.split(/[,;]+/).map((s) => s.trim()).filter(Boolean),
      });
      setEditingChId(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const deleteChannel = async (id: string) => {
    if (!confirm("Eliminare questo canale?")) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "forum_channels", id));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const addTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagForm.name.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "forum_thread_tags"), {
        name: tagForm.name.trim(),
        color: tagForm.color || "#22c55e",
        order: Number(tagForm.order) || threadTags.length,
      });
      setTagForm({ name: "", color: "#22c55e", order: 0 });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const deleteTag = async (id: string) => {
    if (!confirm("Eliminare questo tag?")) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "forum_thread_tags", id));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const channelsByCat = (catId: string) =>
    channels.filter((c) => c.categoryId === catId).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-[#0c0c16] to-fuchsia-950/30 p-6">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
          Forum · CMS
        </p>
        <h2 className="text-2xl font-bold text-white">Struttura forum</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Categorie, canali e tag. Per le discussioni private attiva la spunta sul canale e il
          permesso "Risposte private" in{" "}
          <Link href="/admin/ruoli" className="text-violet-300 hover:underline">
            Ruoli
          </Link>
          .
        </p>
      </div>

      {loading && <p className="text-sm text-zinc-500">Caricamento…</p>}

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Hash className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Categorie</h3>
        </div>
        <form onSubmit={addCategory} className="mb-4 flex flex-wrap gap-2">
          <input
            required
            placeholder="Nome categoria"
            value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            className={`${field} max-w-xs`}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            <Plus className="mr-1 inline h-4 w-4" />
            Aggiungi
          </button>
        </form>
        <ul className="space-y-2">
          {[...categories]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((cat) => (
              <li key={cat.id} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2">
                {editingCatId === cat.id ? (
                  <div className="flex flex-1 flex-wrap gap-2">
                    <input
                      value={editCat.name}
                      onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                      className={field}
                    />
                    <button type="button" onClick={saveCat} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white">
                      Salva
                    </button>
                    <button type="button" onClick={() => setEditingCatId(null)} className="text-xs text-zinc-400">
                      Annulla
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-white">{cat.name}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => { setEditingCatId(cat.id); setEditCat({ name: cat.name, order: cat.order ?? 0, color: cat.color || "#a78bfa" }); }} className="p-1.5 text-zinc-400 hover:text-white">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => deleteCategory(cat.id)} className="p-1.5 text-zinc-400 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Canali</h3>
        </div>
        <form onSubmit={addChannel} className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
          <select
            required
            value={chForm.categoryId}
            onChange={(e) => setChForm({ ...chForm, categoryId: e.target.value })}
            className={field}
          >
            <option value="">Categoria…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="grid gap-2 sm:grid-cols-[80px_1fr]">
            <input
              value={chForm.icon}
              onChange={(e) => setChForm({ ...chForm, icon: e.target.value })}
              className={field}
              placeholder="Icona"
            />
            <input
              required
              value={chForm.name}
              onChange={(e) => setChForm({ ...chForm, name: e.target.value })}
              className={field}
              placeholder="Nome canale"
            />
          </div>
          <input
            value={chForm.description}
            onChange={(e) => setChForm({ ...chForm, description: e.target.value })}
            className={field}
            placeholder="Descrizione"
          />
          <select
            value={chForm.type}
            onChange={(e) =>
              setChForm({ ...chForm, type: e.target.value as "discussion" | "link" })
            }
            className={field}
          >
            <option value="discussion">Discussione</option>
            <option value="link">Link esterno</option>
          </select>
          {chForm.type === "link" && (
            <input
              value={chForm.externalUrl}
              onChange={(e) => setChForm({ ...chForm, externalUrl: e.target.value })}
              className={field}
              placeholder="URL"
            />
          )}
          {chForm.type === "discussion" && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={chForm.staffOnly}
                  onChange={(e) => setChForm({ ...chForm, staffOnly: e.target.checked })}
                />
                Solo staff può scrivere
              </label>
              <label className="flex items-start gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={chForm.privateReply}
                  onChange={(e) => setChForm({ ...chForm, privateReply: e.target.checked })}
                  className="mt-0.5"
                />
                <span>
                  Discussioni a <strong className="text-violet-300">risposta privata</strong>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    Solo l'autore e chi ha il permesso "Risposte private" nei Ruoli può leggere i thread
                  </span>
                </span>
              </label>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm text-white disabled:opacity-50"
          >
            Aggiungi canale
          </button>
        </form>

        {[...categories]
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((cat) => (
            <div key={cat.id} className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                {cat.name}
              </p>
              <ul className="space-y-2">
                {channelsByCat(cat.id).map((ch) => (
                  <li key={ch.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    {editingChId === ch.id ? (
                      <div className="space-y-2">
                        <input
                          value={editCh.name}
                          onChange={(e) => setEditCh({ ...editCh, name: e.target.value })}
                          className={field}
                        />
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            checked={editCh.staffOnly}
                            onChange={(e) => setEditCh({ ...editCh, staffOnly: e.target.checked })}
                          />
                          Solo staff
                        </label>
                        <label className="flex items-center gap-2 text-sm text-zinc-300">
                          <input
                            type="checkbox"
                            checked={!!editCh.privateReply}
                            onChange={(e) =>
                              setEditCh({ ...editCh, privateReply: e.target.checked })
                            }
                          />
                          Risposta privata
                        </label>
                        <div className="flex gap-2">
                          <button type="button" onClick={saveCh} className="rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white">
                            Salva
                          </button>
                          <button type="button" onClick={() => setEditingChId(null)} className="text-xs text-zinc-400">
                            Annulla
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            <span className="mr-1.5">{ch.icon}</span>
                            {ch.name}
                          </p>
                          <p className="mt-0.5 flex flex-wrap gap-2 text-[11px] text-zinc-500">
                            {ch.type === "link" ? "link" : "discussione"}
                            {ch.staffOnly && (
                              <span className="text-amber-400">solo staff</span>
                            )}
                            {ch.privateReply && (
                              <span className="text-violet-400">risposta privata</span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => startEditCh(ch)} className="p-1.5 text-zinc-400 hover:text-white">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => deleteChannel(ch.id)} className="p-1.5 text-zinc-400 hover:text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Tag discussioni</h3>
        </div>
        <form onSubmit={addTag} className="mb-4 flex flex-wrap gap-2">
          <input
            required
            placeholder="Nome tag"
            value={tagForm.name}
            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
            className={`${field} max-w-xs`}
          />
          <input
            type="color"
            value={tagForm.color}
            onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <button type="submit" disabled={busy} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white">
            Aggiungi
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {threadTags.map((tg) => (
            <span
              key={tg.id}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold uppercase text-white"
              style={{ backgroundColor: tg.color }}
            >
              {tg.name}
              <button type="button" onClick={() => deleteTag(tg.id)} className="opacity-70 hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {threadTags.length === 0 && (
            <p className="text-xs text-zinc-500">
              Suggeriti: {DEFAULT_THREAD_TAG_SUGGESTIONS.map((s) => s.name).join(", ")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
