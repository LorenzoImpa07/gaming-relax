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
import type { SiteRole, ForumPermissions } from "@/lib/roles";
import {
  ROLE_COLOR_PRESETS,
  DEFAULT_PERMISSIONS,
  PERMISSION_LABELS,
  parsePermissions,
} from "@/lib/roles";

const empty = {
  name: "",
  color: "#a78bfa",
  emailsText: "",
  order: 0,
  permissions: { ...DEFAULT_PERMISSIONS } as ForumPermissions,
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
          permissions: parsePermissions(data.permissions),
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
      permissions: form.permissions,
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
      permissions: parsePermissions(row.permissions),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo ruolo?")) return;
    await deleteDoc(doc(db, "site_roles", id));
    load();
  };

  const togglePerm = (key: keyof ForumPermissions) => {
    setForm({
      ...form,
      permissions: { ...form.permissions, [key]: !form.permissions[key] },
    });
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-400">
        Crea ruoli, assegna email e scegli cosa possono fare nel forum. Chi non ha ruoli ottiene solo
        il badge Utente.
      </p>
      <div className="grid gap-8 xl:grid-cols-2">
        <form onSubmit={save} className="space-y-4 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5">
          <h2 className="font-semibold text-white">{editId ? "Modifica ruolo" : "Nuovo ruolo"}</h2>
          <input required placeholder="Nome ruolo (es. Staff Forum)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
          <div>
            <p className="mb-2 text-xs text-zinc-500">Colore badge</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {ROLE_COLOR_PRESETS.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })} title={c.label} className={`h-7 w-7 rounded-full border-2 ${form.color === c.value ? "scale-110 border-white" : "border-transparent"}`} style={{ backgroundColor: c.value }} />
              ))}
            </div>
            <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-9 w-full cursor-pointer rounded-lg bg-transparent" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Email dello staff (una per riga)</label>
            <textarea required placeholder={"staff@email.com\naltro@email.com"} value={form.emailsText} onChange={(e) => setForm({ ...form, emailsText: e.target.value })} className={field} rows={3} />
          </div>
          <input type="number" placeholder="Ordine" value={form.order || ""} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className={field} />

          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="mb-1 text-sm font-semibold text-white">Permessi forum</p>
            <p className="mb-3 text-[11px] text-zinc-500">Seleziona cosa può fare chi ha questo ruolo.</p>
            <div className="space-y-2">
              {PERMISSION_LABELS.map((p) => (
                <label key={p.key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/5 bg-black/20 px-3 py-2.5 hover:border-white/10">
                  <input type="checkbox" checked={!!form.permissions[p.key]} onChange={() => togglePerm(p.key)} className="mt-0.5 accent-violet-500" />
                  <span>
                    <span className="block text-sm text-zinc-200">{p.label}</span>
                    <span className="block text-[11px] text-zinc-500">{p.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => setForm({ ...form, permissions: Object.fromEntries(PERMISSION_LABELS.map((p) => [p.key, true])) as ForumPermissions })} className="text-[11px] text-violet-400 hover:underline">Seleziona tutto</button>
              <button type="button" onClick={() => setForm({ ...form, permissions: { ...DEFAULT_PERMISSIONS } })} className="text-[11px] text-zinc-500 hover:underline">Deseleziona tutto</button>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white">{editId ? "Salva" : "Aggiungi"}</button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
          {!loading && items.length === 0 && <p className="text-sm text-zinc-500">Nessun ruolo. Creane uno a sinistra.</p>}
          {items.map((row) => {
            const perms = parsePermissions(row.permissions);
            const activePerms = PERMISSION_LABELS.filter((p) => perms[p.key]);
            return (
              <div key={row.id} className="rounded-xl border border-white/10 bg-[#0c0c14]/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-flex rounded border px-2 py-0.5 text-[10px] font-bold uppercase" style={{ borderColor: row.color, color: row.color, backgroundColor: `${row.color}22` }}>{row.name}</span>
                    <p className="mt-2 text-xs text-zinc-500">{(row.emails || []).length} email · {activePerms.length} permessi</p>
                    {(row.emails || []).slice(0, 3).map((em) => (
                      <p key={em} className="truncate text-xs text-zinc-400">{em}</p>
                    ))}
                    {activePerms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {activePerms.map((p) => (
                          <span key={p.key} className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">{p.label}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" onClick={() => startEdit(row)} className="text-xs text-violet-400">Modifica</button>
                    <button type="button" onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
