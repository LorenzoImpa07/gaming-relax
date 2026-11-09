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
import { CATEGORY_COLOR_PRESETS, DEFAULT_THREAD_TAG_SUGGESTIONS } from "@/lib/forum";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Shield,
  Link2,
  MessageSquare,
  Hash,
  ArrowUp,
  ArrowDown,
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
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editCat, setEditCat] = useState<CatForm>(emptyCat);
  const [editCh, setEditCh] = useState<ChForm>(emptyCh);
  const [editTag, setEditTag] = useState({ name: "", color: "#22c55e", order: 0 });

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
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30";

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

  const startEditCat = (cat: ForumCategory) => {
    setEditingCatId(cat.id);
    setEditCat({
      name: cat.name,
      order: cat.order ?? 0,
      color: cat.color || "#a78bfa",
    });
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
    const msg =
      linked.length > 0
        ? `Eliminare questa categoria e i ${linked.length} canali collegati?`
        : "Eliminare questa categoria?";
    if (!confirm(msg)) return;
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

  const moveCat = async (cat: ForumCategory, dir: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_categories", cat.id), { order: swap.order ?? 0 });
      await updateDoc(doc(db, "forum_categories", swap.id), { order: cat.order ?? 0 });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const addChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chForm.categoryId || !chForm.name.trim()) {
      alert("Seleziona una categoria e un nome canale");
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
        order: Number(chForm.order) || channels.length,
        tags: chForm.tags
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter(Boolean),
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
        order: Number(editCh.order) || 0,
        tags: editCh.tags
          .split(/[,;]+/)
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setEditingChId(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const deleteChannel = async (id: string) => {
    if (
      !confirm(
        "Eliminare questo canale? Le discussioni già create restano in database ma non saranno più raggiungibili dal canale."
      )
    )
      return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "forum_channels", id));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const toggleStaff = async (ch: ForumChannel) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_channels", ch.id), { staffOnly: !ch.staffOnly });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const moveCh = async (ch: ForumChannel, dir: -1 | 1) => {
    const same = channels
      .filter((c) => c.categoryId === ch.categoryId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = same.findIndex((c) => c.id === ch.id);
    const swap = same[idx + dir];
    if (!swap) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_channels", ch.id), { order: swap.order ?? 0 });
      await updateDoc(doc(db, "forum_channels", swap.id), { order: ch.order ?? 0 });
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

  const startEditTag = (tg: ForumThreadTag) => {
    setEditingTagId(tg.id);
    setEditTag({
      name: tg.name,
      color: tg.color || "#22c55e",
      order: tg.order ?? 0,
    });
  };

  const saveTag = async () => {
    if (!editingTagId || !editTag.name.trim()) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, "forum_thread_tags", editingTagId), {
        name: editTag.name.trim(),
        color: editTag.color || "#22c55e",
        order: Number(editTag.order) || 0,
      });
      setEditingTagId(null);
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
    channels
      .filter((c) => c.categoryId === catId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-[#0c0c16] to-fuchsia-950/30 p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
            Forum · CMS
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white">Struttura forum</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Crea, modifica ed elimina categorie e canali. Ogni canale può essere una discussione
            interna o un link esterno.{" "}
            <Link href="/admin/ruoli" className="text-violet-300 underline-offset-2 hover:underline">
              Gestisci ruoli e permessi
            </Link>
            .
          </p>
        </div>
      </div>

      {loading && <p className="text-sm text-zinc-500">Caricamento struttura forum…</p>}

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Hash className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Categorie</h3>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-500">
            {categories.length}
          </span>
        </div>

        <form
          onSubmit={addCategory}
          className="mb-6 grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-[1fr_100px_auto]"
        >
          <input
            required
            placeholder="Nome nuova categoria"
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
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
          <div className="sm:col-span-3">
            <p className="mb-2 text-[11px] text-zinc-500">Colore</p>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_COLOR_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  title={p.label}
                  onClick={() => setCatForm({ ...catForm, color: p.value })}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    catForm.color === p.value ? "scale-110 border-white" : "border-transparent"
                  }`}
                  style={{ backgroundColor: p.value }}
                />
              ))}
              <input
                type="color"
                value={catForm.color}
                onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
              />
            </div>
          </div>
        </form>

        <ul className="space-y-2">
          {[...categories]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((cat) => (
              <li
                key={cat.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                {editingCatId === cat.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_90px]">
                      <input
                        value={editCat.name}
                        onChange={(e) => setEditCat({ ...editCat, name: e.target.value })}
                        className={field}
                      />
                      <input
                        type="number"
                        value={editCat.order}
                        onChange={(e) =>
                          setEditCat({ ...editCat, order: Number(e.target.value) })
                        }
                        className={field}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {CATEGORY_COLOR_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setEditCat({ ...editCat, color: p.value })}
                          className={`h-6 w-6 rounded-full border-2 ${
                            editCat.color === p.value ? "border-white" : "border-transparent"
                          }`}
                          style={{ backgroundColor: p.value }}
                        />
                      ))}
                      <input
                        type="color"
                        value={editCat.color}
                        onChange={(e) => setEditCat({ ...editCat, color: e.target.value })}
                        className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveCat}
                        disabled={busy}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Salva
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400"
                      >
                        <X className="h-3.5 w-3.5" />
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white/10"
                        style={{ backgroundColor: cat.color || "#a78bfa" }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{cat.name}</p>
                        <p className="text-[11px] text-zinc-500">
                          ordine {cat.order ?? 0} · {channelsByCat(cat.id).length} canali
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveCat(cat, -1)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
                        title="Su"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCat(cat, 1)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
                        title="Giù"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditCat(cat)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-violet-500/15 hover:text-violet-300"
                        title="Modifica"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-500/15 hover:text-red-300"
                        title="Elimina"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          {!loading && categories.length === 0 && (
            <p className="py-6 text-center text-sm text-zinc-500">
              Nessuna categoria. Creane una per iniziare.
            </p>
          )}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Canali</h3>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-zinc-500">
            {channels.length}
          </span>
        </div>

        <form
          onSubmit={addChannel}
          className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              required
              value={chForm.categoryId}
              onChange={(e) => setChForm({ ...chForm, categoryId: e.target.value })}
              className={field}
            >
              <option value="">— Categoria —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-[72px_1fr] gap-2">
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
          </div>
          <textarea
            placeholder="Descrizione (opzionale)"
            value={chForm.description}
            onChange={(e) => setChForm({ ...chForm, description: e.target.value })}
            className={field}
            rows={2}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={chForm.type}
              onChange={(e) =>
                setChForm({
                  ...chForm,
                  type: e.target.value as "discussion" | "link",
                })
              }
              className={field}
            >
              <option value="discussion">Discussione (chat interna)</option>
              <option value="link">Link esterno</option>
            </select>
            <input
              type="number"
              placeholder="Ordine"
              value={chForm.order}
              onChange={(e) => setChForm({ ...chForm, order: Number(e.target.value) })}
              className={field}
            />
          </div>
          {chForm.type === "link" && (
            <input
              required
              placeholder="URL esterno (https://…)"
              value={chForm.externalUrl}
              onChange={(e) => setChForm({ ...chForm, externalUrl: e.target.value })}
              className={field}
            />
          )}
          <input
            placeholder="Tag canale (STAFF, NEWS…) separati da virgola"
            value={chForm.tags}
            onChange={(e) => setChForm({ ...chForm, tags: e.target.value })}
            className={field}
          />
          {chForm.type === "discussion" && (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={chForm.staffOnly}
                onChange={(e) => setChForm({ ...chForm, staffOnly: e.target.checked })}
                className="rounded border-white/20"
              />
              Solo staff può scrivere
            </label>
          )}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Aggiungi canale
          </button>
        </form>

        <div className="space-y-6">
          {[...categories]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((cat) => {
              const list = channelsByCat(cat.id);
              return (
                <div key={cat.id}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || "#a78bfa" }}
                    />
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {cat.name}
                    </p>
                  </div>
                  {list.length === 0 ? (
                    <p className="mb-4 pl-4 text-xs text-zinc-600">
                      Nessun canale in questa categoria
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {list.map((ch) => (
                        <li
                          key={ch.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          {editingChId === ch.id ? (
                            <div className="space-y-3">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <select
                                  value={editCh.categoryId}
                                  onChange={(e) =>
                                    setEditCh({ ...editCh, categoryId: e.target.value })
                                  }
                                  className={field}
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="grid grid-cols-[72px_1fr] gap-2">
                                  <input
                                    value={editCh.icon}
                                    onChange={(e) =>
                                      setEditCh({ ...editCh, icon: e.target.value })
                                    }
                                    className={field}
                                  />
                                  <input
                                    value={editCh.name}
                                    onChange={(e) =>
                                      setEditCh({ ...editCh, name: e.target.value })
                                    }
                                    className={field}
                                  />
                                </div>
                              </div>
                              <textarea
                                value={editCh.description}
                                onChange={(e) =>
                                  setEditCh({ ...editCh, description: e.target.value })
                                }
                                className={field}
                                rows={2}
                              />
                              <div className="grid gap-2 sm:grid-cols-2">
                                <select
                                  value={editCh.type}
                                  onChange={(e) =>
                                    setEditCh({
                                      ...editCh,
                                      type: e.target.value as "discussion" | "link",
                                    })
                                  }
                                  className={field}
                                >
                                  <option value="discussion">Discussione</option>
                                  <option value="link">Link esterno</option>
                                </select>
                                <input
                                  type="number"
                                  value={editCh.order}
                                  onChange={(e) =>
                                    setEditCh({
                                      ...editCh,
                                      order: Number(e.target.value),
                                    })
                                  }
                                  className={field}
                                />
                              </div>
                              {editCh.type === "link" && (
                                <input
                                  value={editCh.externalUrl}
                                  onChange={(e) =>
                                    setEditCh({ ...editCh, externalUrl: e.target.value })
                                  }
                                  placeholder="URL"
                                  className={field}
                                />
                              )}
                              <input
                                value={editCh.tags}
                                onChange={(e) =>
                                  setEditCh({ ...editCh, tags: e.target.value })
                                }
                                placeholder="Tag separati da virgola"
                                className={field}
                              />
                              {editCh.type === "discussion" && (
                                <label className="flex items-center gap-2 text-sm text-zinc-300">
                                  <input
                                    type="checkbox"
                                    checked={editCh.staffOnly}
                                    onChange={(e) =>
                                      setEditCh({
                                        ...editCh,
                                        staffOnly: e.target.checked,
                                      })
                                    }
                                  />
                                  Solo staff
                                </label>
                              )}
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={saveCh}
                                  disabled={busy}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Salva
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingChId(null)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-400"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Annulla
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white">
                                  <span className="mr-1.5">{ch.icon}</span>
                                  {ch.name}
                                </p>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-500">
                                  {ch.type === "link" ? (
                                    <span className="inline-flex items-center gap-1 text-sky-400/80">
                                      <Link2 className="h-3 w-3" />
                                      link
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      discussione
                                    </span>
                                  )}
                                  {ch.staffOnly && (
                                    <span className="inline-flex items-center gap-1 text-amber-400/90">
                                      <Shield className="h-3 w-3" />
                                      solo staff
                                    </span>
                                  )}
                                  <span>ordine {ch.order ?? 0}</span>
                                  {Array.isArray(ch.tags) && ch.tags.length > 0 && (
                                    <span>{ch.tags.join(", ")}</span>
                                  )}
                                </p>
                                {ch.description && (
                                  <p className="mt-1 line-clamp-1 text-xs text-zinc-600">
                                    {ch.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveCh(ch, -1)}
                                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveCh(ch, 1)}
                                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                {ch.type === "discussion" && (
                                  <button
                                    type="button"
                                    onClick={() => toggleStaff(ch)}
                                    className="rounded-lg p-1.5 text-amber-400/80 hover:bg-amber-500/10"
                                    title={ch.staffOnly ? "Apri a tutti" : "Solo staff"}
                                  >
                                    <Shield className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => startEditCh(ch)}
                                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-violet-500/15 hover:text-violet-300"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteChannel(ch.id)}
                                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-500/15 hover:text-red-300"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          {!loading && channels.length === 0 && categories.length > 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              Nessun canale. Aggiungine uno sopra.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5 sm:p-6">
        <div className="mb-2 flex items-center gap-2">
          <Tag className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Tag discussioni</h3>
        </div>
        <p className="mb-5 text-xs text-zinc-500">
          Badge tipo Chiuso, Risolto, Guida… applicabili dallo staff alle discussioni.
        </p>

        <form onSubmit={addTag} className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            required
            placeholder="Nome tag (es. Risolto)"
            value={tagForm.name}
            onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
            className={field}
          />
          <input
            type="color"
            value={tagForm.color}
            onChange={(e) => setTagForm({ ...tagForm, color: e.target.value })}
            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {DEFAULT_THREAD_TAG_SUGGESTIONS.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setTagForm({ ...tagForm, name: s.name, color: s.color })}
              className="rounded-md px-2 py-0.5 text-[10px] font-bold"
              style={{
                backgroundColor: s.color,
                color: s.color === "#facc15" ? "#18181b" : "#fff",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        <ul className="flex flex-wrap gap-2">
          {threadTags.map((tg) =>
            editingTagId === tg.id ? (
              <li
                key={tg.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-black/40 p-2"
              >
                <input
                  value={editTag.name}
                  onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
                  className="w-28 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                />
                <input
                  type="color"
                  value={editTag.color}
                  onChange={(e) => setEditTag({ ...editTag, color: e.target.value })}
                  className="h-7 w-8 cursor-pointer rounded border-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={saveTag}
                  className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] text-white"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTagId(null)}
                  className="rounded-lg px-2 py-1 text-[10px] text-zinc-400"
                >
                  Annulla
                </button>
              </li>
            ) : (
              <li
                key={tg.id}
                className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-1.5"
              >
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: tg.color || "#22c55e" }}
                >
                  {tg.name}
                </span>
                <button
                  type="button"
                  onClick={() => startEditTag(tg)}
                  className="rounded p-1 text-zinc-500 opacity-70 hover:text-violet-300 group-hover:opacity-100"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTag(tg.id)}
                  className="rounded p-1 text-zinc-500 opacity-70 hover:text-red-300 group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            )
          )}
        </ul>
        {!loading && threadTags.length === 0 && (
          <p className="mt-3 text-xs text-zinc-600">Nessun tag ancora.</p>
        )}
      </section>
    </div>
  );
}
