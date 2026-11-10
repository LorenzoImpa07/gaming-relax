"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { customProducts, type CustomProduct } from "@/data/custom";
import { db } from "@/lib/firebase";
import { EmptyState } from "@/components/ui/EmptyState";

function normalize(raw: Record<string, unknown>, id: string): CustomProduct {
  const features = raw.features;
  let feats: string[] = [];
  if (Array.isArray(features)) feats = features as string[];
  else if (typeof features === "string")
    feats = features.split("\n").map((s) => s.trim()).filter(Boolean);

  let plans = undefined;
  if (Array.isArray(raw.plans)) {
    plans = (raw.plans as Record<string, unknown>[])
      .map((p, i) => ({
        id: String(p.id || `plan-${i}`),
        name: String(p.name || `Piano ${i + 1}`),
        price: Number(p.price) || 0,
        description: p.description ? String(p.description) : undefined,
        features: Array.isArray(p.features)
          ? (p.features as string[])
          : typeof p.features === "string"
            ? p.features.split("\n").map((s) => s.trim()).filter(Boolean)
            : undefined,
      }))
      .sort((a, b) => a.price - b.price);
    if (plans.length === 0) plans = undefined;
  }

  return {
    id,
    name: String(raw.name || "Prodotto"),
    description: String(raw.description || ""),
    details: raw.details ? String(raw.details) : undefined,
    price: Number(raw.price) || 0,
    category: (raw.category as CustomProduct["category"]) || "web",
    features: feats,
    popular: !!raw.popular,
    available: raw.available === undefined ? true : !!raw.available,
    discountPercent: Number(raw.discountPercent) || 0,
    permanent: true,
    plans,
  };
}

const CATEGORIES = [
  { id: "all", label: "Tutti" },
  { id: "web", label: "Siti & Web" },
  { id: "software", label: "App & Software" },
  { id: "bot", label: "Discord" },
  { id: "automation", label: "Automazioni" },
];

export default function CustomPage() {
  const [list, setList] = useState<CustomProduct[]>(customProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAvailable, setShowAvailable] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_custom"),
      (snap) => {
        if (snap.empty) return;
        setList(
          snap.docs.map((d) => normalize(d.data() as Record<string, unknown>, d.id))
        );
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      if (showAvailable && s.available === false) return false;
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      return true;
    });
  }, [list, selectedCategory, showAvailable]);

  return (
    <div className="relative min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(139,92,246,0.25),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300">
              <Sparkles className="h-3 w-3" />
              Custom by Gaming Relax
            </p>
            <h1 className="font-serif text-4xl font-light tracking-tight text-white sm:text-5xl">
              Prodotti e progetti
              <br />
              <span className="italic text-white/80">fatti da noi.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
              Acquisto permanente: lo compri ed è tuo. Siti, app, bot e automazioni con piani
              chiari. Care mensile solo se ti serve manutenzione o evolutive.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit space-y-6 rounded-2xl border border-white/10 bg-zinc-900/50 p-5 lg:sticky lg:top-24">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">Categoria</p>
              <div className="flex flex-col gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      selectedCategory === c.id
                        ? "bg-violet-600/20 text-violet-200 border border-violet-500/30"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={showAvailable} onChange={(e) => setShowAvailable(e.target.checked)} className="accent-violet-500" />
              Solo disponibili
            </label>
            <Link href="/preventivo" className="block rounded-xl border border-dashed border-white/15 px-3 py-3 text-center text-xs text-zinc-400 transition hover:border-violet-500/40 hover:text-violet-200">
              Serve qualcosa di unico?
              <span className="mt-1 block font-medium text-violet-300">Preventivo guidato →</span>
            </Link>
          </aside>

          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((p, i) => {
              const fromPrice =
                p.plans && p.plans.length
                  ? Math.min(...p.plans.map((x) => x.price), p.price)
                  : p.price;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={`/custom/${p.id}`}
                    className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 card-shine"
                  >
                    {p.popular && (
                      <span className="absolute right-4 top-4 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Popolare
                      </span>
                    )}
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400/80">{p.category}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white group-hover:text-violet-100">{p.name}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{p.description}</p>
                    <ul className="mt-4 space-y-1.5">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-end justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-emerald-500/80">
                          Acquisto permanente
                        </p>
                        <p className="text-2xl font-semibold text-white">da €{fromPrice}</p>
                        <p className="text-[11px] text-zinc-500">Una tantum · tuo per sempre</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-violet-300 opacity-80 transition group-hover:opacity-100">
                        Dettagli
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  variant="store"
                  title="Nessun prodotto in questa categoria"
                  description="Torna presto: stiamo aggiungendo nuovi progetti custom."
                  codeHint="// site_custom.filter(cat).length === 0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
