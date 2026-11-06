"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Code = {
  id: string;
  code: string;
  percent: number;
  active: boolean;
  note?: string;
};

const empty = { code: "", percent: 10, active: true, note: "" };

export default function AdminScontiPage() {
  const [items, setItems] = useState<Code[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "discount_codes"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Code)));
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
    const payload = {
      code: form.code.trim().toUpperCase(),
      percent: Number(form.percent),
      active: form.active,
      note: form.note || "",
      updatedAt: serverTimestamp(),
    };
    if (editId) {
      await updateDoc(doc(db, "discount_codes", editId), payload);
    } else {
      await addDoc(collection(db, "discount_codes"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    setForm(empty);
    setEditId(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo codice?")) return;
    await deleteDoc(doc(db, "discount_codes", id));
    load();
  };

  const toggle = async (row: Code) => {
    await updateDoc(doc(db, "discount_codes", row.id), { active: !row.active });
    load();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
        <h2 className="font-semibold text-white">{editId ? "Modifica codice" : "Nuovo codice sconto"}</h2>
        <input
          required
          placeholder="Codice (es. WELCOME10)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white uppercase"
        />
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Percentuale sconto</label>
          <input
            type="number"
            required
            min={1}
            max={100}
            value={form.percent}
            onChange={(e) => setForm({ ...form, percent: Number(e.target.value) })}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <input
          placeholder="Nota interna (opzionale)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Attivo
        </label>
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white">{editId ? "Salva" : "Crea codice"}</button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento...</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">Nessun codice. Creane uno (es. CREATOR15 → 15% di sconto).</p>
        )}
        {items.map((row) => (
          <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex justify-between gap-3">
            <div>
              <p className="font-mono font-semibold text-white">{row.code}</p>
              <p className="text-sm text-zinc-400">−{row.percent}%</p>
              {row.note && <p className="text-xs text-zinc-600 mt-1">{row.note}</p>}
              <p className={`text-xs mt-1 ${row.active ? "text-green-400" : "text-zinc-500"}`}>{row.active ? "Attivo" : "Disattivato"}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button onClick={() => { setEditId(row.id); setForm({ code: row.code, percent: row.percent, active: row.active, note: row.note || "" }); }} className="text-xs text-violet-400">Modifica</button>
              <button onClick={() => toggle(row)} className="text-xs text-zinc-400">{row.active ? "Disattiva" : "Attiva"}</button>
              <button onClick={() => remove(row.id)} className="text-xs text-red-400">Elimina</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
