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
import { Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";

type PlanRow = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string;
};

type Row = {
  id: string;
  name: string;
  description: string;
  details?: string;
  price: number;
  category: string;
  features: string;
  popular?: boolean;
  available?: boolean;
  permanent?: boolean;
  plans?: PlanRow[];
};

const emptyPlan = (): PlanRow => ({
  id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  price: 0,
  description: "",
  features: "",
});

const empty = {
  name: "",
  description: "",
  details: "",
  price: 0,
  category: "web",
  features: "",
  popular: false,
  available: true,
  permanent: false,
  plans: [] as PlanRow[],
};

export default function AdminCustomPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "site_custom"));
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          const features = Array.isArray(data.features)
            ? data.features.join("\n")
            : String(data.features || "");
          const plans: PlanRow[] = Array.isArray(data.plans)
            ? data.plans.map((p: Record<string, unknown>, i: number) => ({
                id: String(p.id || `plan-${i}`),
                name: String(p.name || ""),
                price: Number(p.price) || 0,
                description: String(p.description || ""),
                features: Array.isArray(p.features)
                  ? (p.features as string[]).join("\n")
                  : String(p.features || ""),
              }))
            : [];
          return {
            id: d.id,
            name: String(data.name || ""),
            description: String(data.description || ""),
            details: data.details ? String(data.details) : "",
            price: Number(data.price) || 0,
            category: String(data.category || "web"),
            features,
            popular: !!data.popular,
            available: data.available !== false,
            permanent: !!data.permanent,
            plans,
          };
        })
      );
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
      name: form.name.trim(),
      description: form.description.trim(),
      details: form.details.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      popular: form.popular,
      available: form.available,
      permanent: form.permanent,
      plans: form.plans
        .filter((p) => p.name.trim())
        .map((p) => ({
          id: p.id,
          name: p.name.trim(),
          price: Number(p.price) || 0,
          description: p.description.trim() || undefined,
          features: p.features.split("\n").map((s) => s.trim()).filter(Boolean),
        })),
      updatedAt: new Date().toISOString(),
    };
    if (editId) await updateDoc(doc(db, "site_custom", editId), payload);
    else await addDoc(collection(db, "site_custom"), payload);
    setEditId(null);
    setForm(empty);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo prodotto Custom?")) return;
    await deleteDoc(doc(db, "site_custom", id));
    await load();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-white">Custom — prodotti</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Catalogo pagina /custom. Se Firestore è vuoto, il sito usa i prodotti di default.
        </p>
      </div>

      <form onSubmit={save} className="space-y-3 rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5">
        <input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea required placeholder="Descrizione breve" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <textarea placeholder="Dettagli lunghi" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <div className="grid gap-3 sm:grid-cols-3">
          <input type="number" placeholder="Prezzo base" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white">
            <option value="web">Web</option>
            <option value="software">Software</option>
            <option value="bot">Discord</option>
            <option value="automation">Automazioni</option>
            <option value="support">Supporto</option>
          </select>
          <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="accent-violet-500" />Popolare</label>
            <label className="flex items-center gap-1.5"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-violet-500" />Disponibile</label>
          </div>
        </div>
        <textarea placeholder="Feature (una per riga)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
        <div className="space-y-2 rounded-xl border border-white/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400">Piani / abbonamenti</p>
            <button type="button" onClick={() => setForm({ ...form, plans: [...form.plans, emptyPlan()] })} className="text-xs text-violet-300 hover:underline">+ Piano</button>
          </div>
          {form.plans.map((p, idx) => (
            <div key={p.id} className="space-y-1 rounded-lg border border-zinc-800 p-2">
              <div className="flex gap-2">
                <input placeholder="Nome piano" value={p.name} onChange={(e) => { const plans = [...form.plans]; plans[idx] = { ...p, name: e.target.value }; setForm({ ...form, plans }); }} className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white" />
                <input type="number" placeholder="€" value={p.price || ""} onChange={(e) => { const plans = [...form.plans]; plans[idx] = { ...p, price: Number(e.target.value) }; setForm({ ...form, plans }); }} className="w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white" />
                <button type="button" onClick={() => setForm({ ...form, plans: form.plans.filter((_, i) => i !== idx) })} className="text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
              <input placeholder="Descrizione piano" value={p.description} onChange={(e) => { const plans = [...form.plans]; plans[idx] = { ...p, description: e.target.value }; setForm({ ...form, plans }); }} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white" />
              <textarea placeholder="Feature piano (una per riga)" value={p.features} onChange={(e) => { const plans = [...form.plans]; plans[idx] = { ...p, features: e.target.value }; setForm({ ...form, plans }); }} rows={2} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-xs text-white" />
            </div>
          ))}
        </div>
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />{editId ? "Salva" : "Aggiungi"}</button>
        {editId && (<button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="ml-2 rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">Annulla</button>)}
      </form>

      <div className="space-y-3">
        {loading && <p className="text-sm text-zinc-500">Caricamento…</p>}
        {!loading && items.length === 0 && (<p className="text-sm text-zinc-500">Nessun prodotto in Firestore — il sito usa i default statici.</p>)}
        {items.map((row) => (
          <div key={row.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div>
              <p className="font-medium text-white">{row.name}</p>
              <p className="text-xs text-zinc-500">{row.category} · €{row.price} · {row.plans?.length || 0} piani</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setEditId(row.id); setForm({ name: row.name, description: row.description, details: row.details || "", price: row.price, category: row.category, features: row.features, popular: !!row.popular, available: row.available !== false, permanent: !!row.permanent, plans: row.plans || [] }); }} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300">Modifica</button>
              <button type="button" onClick={() => remove(row.id)} className="rounded-lg border border-red-500/30 p-1.5 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
