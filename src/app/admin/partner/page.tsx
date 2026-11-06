"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/upload";
import { Upload } from "lucide-react";

type Partner = { id: string; name: string; href: string; image: string };
const empty = { name: "", href: "", image: "" };

export default function AdminPartnerPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    setProgress(0);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      const url = await uploadImage(file, "partners", (p) => setProgress(p.percent));
      setForm((f) => ({ ...f, image: url }));
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Errore upload");
      setPreview(null);
      setProgress(0);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.image) {
      setError("Seleziona un'immagine dal dispositivo");
      return;
    }
    const payload = { name: form.name, href: form.href.trim() || "#", image: form.image };
    if (editId) await updateDoc(doc(db, "site_partners", editId), payload);
    else await addDoc(collection(db, "site_partners"), payload);
    setForm(empty);
    setEditId(null);
    setPreview(null);
    load();
  };

  const startEdit = (row: Partner) => {
    setEditId(row.id);
    setForm({ name: row.name, href: row.href, image: row.image });
    setPreview(row.image);
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo partner?")) return;
    await deleteDoc(doc(db, "site_partners", id));
    load();
  };

  const field = "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white mb-2">{editId ? "Modifica partner" : "Nuovo partner"}</h2>
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
        <input placeholder="Link (https://...)" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className={field} />
        <div>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-600 bg-zinc-950/50 px-4 py-6 text-center hover:border-violet-500/50">
            <Upload className="h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-400">
              {uploading ? `Caricamento ${progress}%` : "JPG, PNG, WebP — max 5MB"}
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
          </label>
          {uploading && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {(preview || form.image) && (
            <div className="mt-3 relative h-20 w-20 overflow-hidden rounded-xl border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview || form.image} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400 whitespace-pre-wrap">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={uploading} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">
            {editId ? "Salva" : "Aggiungi"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); setPreview(null); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">
              Annulla
            </button>
          )}
        </div>
      </form>
      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {items.map((row) => (
          <div key={row.id} className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-900">
              {row.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{row.name}</p>
              <p className="text-xs text-zinc-500 truncate">{row.href}</p>
            </div>
            <button onClick={() => startEdit(row)} className="text-xs text-violet-400">Modifica</button>
            <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
          </div>
        ))}
      </div>
    </div>
  );
}
