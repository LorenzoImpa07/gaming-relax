"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
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

type ServiceRow = {
  id: string;
  name: string;
  description: string;
  details?: string;
  price: number;
  category: string;
  features: string;
  popular?: boolean;
  available?: boolean;
  discountPercent?: number;
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
  category: "bot",
  features: "",
  popular: false,
  available: true,
  discountPercent: 0,
  plans: [] as PlanRow[],
};

function parsePlans(raw: unknown): PlanRow[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p: Record<string, unknown>, i: number) => ({
    id: String(p.id || `plan-${i}`),
    name: String(p.name || ""),
    price: Number(p.price) || 0,
    description: String(p.description || ""),
    features: Array.isArray(p.features)
      ? (p.features as string[]).join("\n")
      : String(p.features || ""),
  }));
}

export default function AdminServiziPage() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "site_services"), orderBy("price")));
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            features:
              typeof data.features === "string"
                ? data.features
                : Array.isArray(data.features)
                  ? data.features.join("\n")
                  : "",
            plans: parsePlans(data.plans),
          } as ServiceRow;
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
    const plans = (form.plans || [])
      .filter((p) => p.name.trim())
      .map((p) => ({
        id: p.id || `p-${Date.now()}`,
        name: p.name.trim(),
        price: Number(p.price) || 0,
        description: p.description?.trim() || "",
        features: p.features
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      }))
      .sort((a, b) => a.price - b.price);

    const payload = {
      name: form.name,
      description: form.description,
      details: form.details,
      price: Number(form.price),
      category: form.category,
      features: form.features,
      popular: !!form.popular,
      available: !!form.available,
      discountPercent: Math.min(100, Math.max(0, Number(form.discountPercent) || 0)),
      plans,
    };
    if (editId) await updateDoc(doc(db, "site_services", editId), payload);
    else await addDoc(collection(db, "site_services"), payload);
    setForm(empty);
    setEditId(null);
    load();
  };

  const startEdit = (row: ServiceRow) => {
    setEditId(row.id);
    setForm({
      name: row.name,
      description: row.description,
      details: row.details || "",
      price: row.price,
      category: row.category,
      features:
        typeof row.features === "string"
          ? row.features
          : (row.features as unknown as string[])?.join("\n") || "",
      popular: !!row.popular,
      available: row.available !== false,
      discountPercent: row.discountPercent || 0,
      plans: parsePlans(row.plans),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo servizio?")) return;
    await deleteDoc(doc(db, "site_services", id));
    load();
  };

  const updatePlan = (idx: number, patch: Partial<PlanRow>) => {
    const plans = [...(form.plans || [])];
    plans[idx] = { ...plans[idx], ...patch };
    setForm({ ...form, plans });
  };

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="mb-2 font-semibold text-white">
          {editId ? "Modifica servizio" : "Nuovo servizio"}
        </h2>
        <input
          required
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={field}
        />
        <textarea
          required
          placeholder="Descrizione breve"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={field}
          rows={2}
        />
        <textarea
          placeholder="Descrizione lunga (pagina dettaglio)"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          className={field}
          rows={3}
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">
              Prezzo base (€) — se non usi piani
            </label>
            <input
              type="number"
              required
              min={0}
              step={1}
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className={field}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Sconto %</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.discountPercent || ""}
              onChange={(e) =>
                setForm({ ...form, discountPercent: Number(e.target.value) })
              }
              className={field}
            />
          </div>
        </div>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={field}
        >
          <option value="bot">bot</option>
          <option value="web">web</option>
          <option value="software">software</option>
          <option value="automation">automation</option>
          <option value="support">support</option>
        </select>
        <textarea
          placeholder="Feature base (una per riga)"
          value={form.features}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
          className={field}
          rows={3}
        />

        <div className="rounded-xl border border-zinc-700/80 bg-zinc-950/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Piani / abbonamenti</p>
              <p className="text-[11px] text-zinc-500">
                Dal più economico al più costoso. Visibili nel dettaglio prodotto.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, plans: [...(form.plans || []), emptyPlan()] })
              }
              className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 px-3 py-1 text-xs text-violet-300 hover:bg-violet-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              Aggiungi piano
            </button>
          </div>
          <div className="space-y-4">
            {(form.plans || []).map((plan, idx) => (
              <div
                key={plan.id}
                className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-zinc-400">Piano {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        plans: form.plans.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  placeholder="Nome piano (es. Base, Pro, Premium)"
                  value={plan.name}
                  onChange={(e) => updatePlan(idx, { name: e.target.value })}
                  className={field}
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Prezzo €"
                  value={plan.price || ""}
                  onChange={(e) => updatePlan(idx, { price: Number(e.target.value) })}
                  className={field}
                />
                <input
                  placeholder="Descrizione breve del piano"
                  value={plan.description}
                  onChange={(e) => updatePlan(idx, { description: e.target.value })}
                  className={field}
                />
                <textarea
                  placeholder="Feature del piano (una per riga)"
                  value={plan.features}
                  onChange={(e) => updatePlan(idx, { features: e.target.value })}
                  className={field}
                  rows={2}
                />
              </div>
            ))}
            {(form.plans || []).length === 0 && (
              <p className="text-xs text-zinc-600">
                Nessun piano: nello store si usa solo il prezzo base.
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={!!form.popular}
            onChange={(e) => setForm({ ...form, popular: e.target.checked })}
            className="accent-fuchsia-500"
          />
          Più richiesto (badge nello store)
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="accent-fuchsia-500"
          />
          Disponibile (se disattivo = Esaurito)
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white"
          >
            {editId ? "Salva" : "Aggiungi"}
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
          <p className="text-sm text-zinc-500">Nessun servizio in Firestore.</p>
        )}
        {items.map((row) => {
          const disc = row.discountPercent || 0;
          const final =
            disc > 0 ? Math.round(row.price * (1 - disc / 100) * 100) / 100 : row.price;
          const planCount = Array.isArray(row.plans) ? row.plans.length : 0;
          return (
            <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-white">
                    {row.name} — {disc > 0 ? (
                      <>
                        <span className="mr-1 text-zinc-500 line-through">€{row.price}</span>
                        <span className="text-fuchsia-400">€{final}</span>
                      </>
                    ) : (
                      <>€{row.price}</>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {row.category}
                    {row.popular ? " · Più richiesto" : ""}
                    {row.available === false ? " · ESAURITO" : " · disponibile"}
                    {planCount > 0 ? ` · ${planCount} piani` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateDoc(doc(db, "site_services", row.id), {
                        popular: !row.popular,
                      });
                      load();
                    }}
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      row.popular
                        ? "border-fuchsia-500/50 text-fuchsia-300"
                        : "border-zinc-600 text-zinc-400"
                    }`}
                  >
                    {row.popular ? "Più richiesto ✓" : "Segna più richiesto"}
                  </button>
                  <button onClick={() => startEdit(row)} className="text-xs text-violet-400">
                    Modifica
                  </button>
                  <button onClick={() => remove(row.id)} className="text-xs text-red-400">
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
