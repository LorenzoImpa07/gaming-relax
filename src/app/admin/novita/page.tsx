"use client";

import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Upload, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/upload";

type News = {
  id: string;
  title: string;
  date: string;
  text: string;
  image?: string;
};

const empty = { title: "", date: "", text: "", image: "" };

export default function AdminNovitaPage() {
  const [items, setItems] = useState<News[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file, "news", (p) => setProgress(p.percent));
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const payload = {
      title: form.title.trim(),
      date: form.date.trim(),
      text: form.text.trim(),
      image: form.image || "",
      updatedAt: serverTimestamp(),
    };
    try {
      if (editId) await updateDoc(doc(db, "site_news", editId), payload);
      else
        await addDoc(collection(db, "site_news"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      console.error(err);
      setError("Salvataggio fallito. Controlla le regole Firestore.");
    }
  };

  const startEdit = (row: News) => {
    setEditId(row.id);
    setForm({
      title: row.title || "",
      date: row.date || "",
      text: row.text || "",
      image: row.image || "",
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa novità?")) return;
    await deleteDoc(doc(db, "site_news", id));
    load();
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="font-semibold text-white">
          {editId ? "Modifica novità" : "Nuova novità"}
        </h2>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}
        <input
          required
          placeholder="Titolo"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={field}
        />
        <input
          required
          placeholder="Data (es. Novembre 2026)"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={field}
        />
        <textarea
          required
          placeholder="Testo completo dell'annuncio"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className={field}
          rows={6}
        />

        <div>
          <p className="mb-2 text-xs text-zinc-500">Foto (opzionale)</p>
          <div className="flex items-start gap-3">
            {form.image ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-600 text-zinc-500 hover:border-violet-500 hover:text-violet-300"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[10px]">{uploading ? `${progress}%` : "Upload"}</span>
              </button>
            )}
            <div className="text-xs text-zinc-500">
              <p>JPG, PNG, WebP — max 5MB</p>
              <p className="mt-1">Compressa automaticamente (piano free).</p>
              {form.image && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="mt-2 text-violet-400 hover:underline"
                >
                  Cambia foto
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {editId ? "Salva" : "Pubblica"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setForm(empty);
              }}
              className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300"
            >
              Annulla
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">Nessuna novità ancora.</p>
        )}
        {items.map((row) => (
          <div
            key={row.id}
            className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
          >
            {row.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xs text-zinc-600">
                no foto
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{row.title}</p>
              <p className="text-xs text-zinc-500">{row.date}</p>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{row.text}</p>
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => startEdit(row)} className="text-xs text-violet-400">
                  Modifica
                </button>
                <button type="button" onClick={() => remove(row.id)} className="text-xs text-red-400">
                  Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
