"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteRole } from "@/lib/roles";
import { ROLE_COLOR_PRESETS } from "@/lib/roles";

const empty = {
  name: "",
  color: "#a78bfa",
  emailsText: "",
  order: 0,
};

export default function AdminRuoliPage() {
  const [items, setItems] = useState<SiteRole[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_roles"));
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name || ""),
          color: String(data.color || "#a78bfa"),
          emails: Array.isArray(data.emails)
            ? data.emails.map(String)
            : typeof data.emails === "string"
              ? data.emails.split(",").map((s: string) => s.trim()).filter(Boolean)
              : [],
          order: Number(data.order) || 0,
        } as SiteRole;
      });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(list);
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
    const emails = form.emailsText
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const payload = {
      name: form.name.trim(),
      color: form.color || "#a78bfa",
      emails,
      order: Number(form.order) || 0,
    };
    if (editId) await updateDoc(doc(db, "site_roles", editId), payload);
    else await addDoc(collection(db, "site_roles"), payload);
    setForm(empty);
    setEditId(null);
    load();
  };

  const startEdit = (row: SiteRole) => {
    setEditId(row.id);
    setForm({
      name: row.name,
      color: row.color,
      emailsText: (row.emails || []).join("\n"),
      order: row.order || 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo ruolo?")) return;
    await deleteDoc(doc(db, "site_roles", id));
    load();
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Crea ruoli staff (es. Staff Forum, Bot) con colore e lista email. Chi non ha ruoli
        assegnati riceve automaticamente il badge Utente in bianco.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5">
          <h2 className="font-semibold text-white">{editId ? "Modifica ruolo" : "Nuovo ruolo"}</h2>
          <input required placeholder="Nome ruolo (es. Staff Forum)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          <div>
            <p className="mb-2 text-xs text-zinc-500">Colore badge</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {ROLE_COLOR_PRESETS.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })} title={c.label} className={`h-7 w-7 rounded-full border-2 ${form.color === c.value ? "border-white scale-110" : "border-transparent"}`} style={{ backgroundColor: c.value }} />
              ))}
            </div>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-9 w-full cursor-pointer rounded-lg bg-transparent" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Email dello staff (una per riga)</label>
            <textarea required placeholder={"staff@email.com\naltro@email.com"} value={form.emailsText} onChange={(e) => setForm({ ...form, emailsText: e.target.value })} className={field} rows={4} />
          </div>
          <input type="number" placeholder="Ordine" value={form.order || ""} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={field} />
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white">{editId ? "Salva" : "Aggiungi"}</button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
            )}
          </div>
        </form>
        <div className="space-y-3">
          {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
          {!loading && items.length === 0 && <p className="text-sm text-zinc-500">Nessun ruolo custom. Aggiungine uno.</p>}
          {items.map((row) => (
            <div key={row.id} className="rounded-xl border border-white/10 bg-[#0c0c14]/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase" style={{ borderColor: row.color, color: row.color, backgroundColor: `${row.color}22` }}>{row.name}</span>
                  <p className="mt-2 text-xs text-zinc-500">{(row.emails || []).length} email assegnate</p>
                  <ul className="mt-1 space-y-0.5">
                    {(row.emails || []).slice(0, 5).map((em) => (
                      <li key={em} className="truncate text-xs text-zinc-400">{em}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => startEdit(row)} className="text-xs text-violet-400">Modifica</button>
                  <button type="button" onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
