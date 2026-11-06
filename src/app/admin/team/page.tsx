"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImage } from "@/lib/upload";
import { Upload } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      setPreview(URL.createObjectURL(file));
      const url = await uploadImage(file, "team");
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Errore upload");
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
    setPreview(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare?")) return;
    await deleteDoc(doc(db, "site_team", id));
    load();
  };

  const imgSrc = preview || form.image;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white">{editId ? "Modifica membro" : "Nuovo membro"}</h2>

        <div>
          <label className="block text-xs text-zinc-500 mb-2">Foto profilo</label>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full border border-zinc-700 bg-zinc-950 overflow-hidden flex items-center justify-center">
              {imgSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-zinc-600" />
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFile}
                className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-sm file:text-white"
              />
              <p className="text-xs text-zinc-600 mt-1">{uploading ? "Caricamento..." : "Opzionale — max 5MB"}</p>
            </div>
          </div>
        </div>

        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <input required placeholder="Ruolo" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea required placeholder="Descrizione" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" rows={3} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={uploading} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">{editId ? "Salva" : "Aggiungi"}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); setPreview(null); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {items.map((row) => (
          <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                {row.image && (row.image.startsWith("http") || row.image.startsWith("/")) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-medium text-white">{row.name}</p>
                <p className="text-xs text-violet-400">{row.role}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setEditId(row.id);
                  setForm({ name: row.name, role: row.role, description: row.description, image: row.image || "" });
                  setPreview(row.image || null);
                }}
                className="text-xs text-violet-400"
              >
                Modifica
              </button>
              <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
