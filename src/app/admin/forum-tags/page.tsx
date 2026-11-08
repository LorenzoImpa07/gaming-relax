"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ForumThreadTag } from "@/lib/forum";
import { DEFAULT_THREAD_TAG_SUGGESTIONS } from "@/lib/forum";

export default function AdminForumTagsPage() {
  const [tags, setTags] = useState<ForumThreadTag[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#22c55e");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "forum_thread_tags"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumThreadTag));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setTags(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addDoc(collection(db, "forum_thread_tags"), {
      name: name.trim(),
      color: color || "#22c55e",
      order: tags.length,
    });
    setName("");
    load();
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Tag per le discussioni (Chiuso, Risolto, Guida…). Solo lo staff può applicarli nel forum.{" "}
        <Link href="/admin/forum" className="text-violet-400 hover:underline">
          ← Forum
        </Link>
      </p>

      <form onSubmit={add} className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <h2 className="font-semibold text-white">Nuovo tag</h2>
        <input
          required
          placeholder="Nome (es. Risolto)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg bg-transparent"
          />
          <div className="flex flex-wrap gap-1">
            {DEFAULT_THREAD_TAG_SUGGESTIONS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  setName(s.name);
                  setColor(s.color);
                }}
                className="rounded px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: s.color,
                  color: s.color === "#facc15" ? "#18181b" : "#fff",
                }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white">
          Aggiungi
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {!loading && tags.length === 0 && (
          <p className="text-sm text-zinc-500">Nessun tag. Usa i suggerimenti sopra.</p>
        )}
        {tags.map((tg) => (
          <div
            key={tg.id}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5"
          >
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
              style={{
                backgroundColor: tg.color,
                color:
                  tg.color?.toLowerCase() === "#facc15" || tg.color?.toLowerCase() === "#fbbf24"
                    ? "#18181b"
                    : "#fff",
              }}
            >
              {tg.name}
            </span>
            <button
              type="button"
              onClick={async () => {
                if (!confirm("Eliminare?")) return;
                await deleteDoc(doc(db, "forum_thread_tags", tg.id));
                load();
              }}
              className="text-xs text-red-400"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
