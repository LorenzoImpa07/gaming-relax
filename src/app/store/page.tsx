"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHero } from "@/components/ui/PageHero";
import { Check, ShoppingCart } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { services as staticServices, type Service } from "@/data/services";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";

function normalize(raw: Record<string, unknown>, id: string): Service {
  const features = raw.features;
  let feats: string[] = [];
  if (Array.isArray(features)) feats = features as string[];
  else if (typeof features === "string")
    feats = features.split("\n").map((s) => s.trim()).filter(Boolean);

  return {
    id,
    name: String(raw.name || "Servizio"),
    description: String(raw.description || ""),
    details: raw.details ? String(raw.details) : undefined,
    price: Number(raw.price) || 0,
    category: (raw.category as Service["category"]) || "bot",
    features: feats,
    popular: !!raw.popular,
    available: raw.available === undefined ? true : !!raw.available,
    discountPercent: Number(raw.discountPercent) || 0,
    permanent: false,
  };
}

export default function StorePage() {
  const { addItem } = useCart();
  const [list, setList] = useState<Service[]>(staticServices);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSoldOut, setShowSoldOut] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_services"),
      (snap) => {
        if (snap.empty) return;
        const fromDb = snap.docs.map((d) =>
          normalize(d.data() as Record<string, unknown>, d.id)
        );
        setList(fromDb);
        const prices = fromDb.map((s) => s.price);
        if (prices.length) setMaxPrice(Math.max(...prices, 100));
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const priceCeiling = useMemo(
    () => Math.max(...list.map((s) => s.price), 100),
    [list]
  );

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const avail = s.available !== false;
      if (avail && !showAvailable) return false;
      if (!avail && !showSoldOut) return false;
      if (s.price > maxPrice) return false;
      if (selectedCategory !== "all" && s.category !== selectedCategory) return false;
      return true;
    });
  }, [list, showAvailable, showSoldOut, maxPrice, selectedCategory]);

  const countAvailable = list.filter((s) => s.available !== false).length;
  const countSoldOut = list.filter((s) => s.available === false).length;

  const categories = [
    { id: "all", label: "Tutti" },
    { id: "bot", label: "Discord" },
    { id: "web", label: "Web" },
    { id: "software", label: "Software" },
    { id: "automation", label: "Automazioni" },
    { id: "support", label: "Supporto" },
  ];

  return (
    <div className="pb-20">
      <PageHero
        eyebrow="Abbonamenti mensili"
        title={
          <>
            Store
            <span className="mt-1 block text-zinc-400">prodotti pronti, rinnovo chiaro.</span>
          </>
        }
        description="Bot, web e automazioni in abbonamento. Attivi il piano, lo gestisci dal profilo e lo interrompi quando non ti serve più."
      />

      <div className="page-shell relative isolate grid gap-8 py-12 lg:grid-cols-[240px_1fr] lg:py-16">
        <aside className="surface-strong relative z-20 h-fit space-y-6 p-5 lg:sticky lg:top-24">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
              Disponibilità
            </p>
            <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={showAvailable} onChange={(e) => setShowAvailable(e.target.checked)} className="accent-fuchsia-500" />
              Disponibile ({countAvailable})
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input type="checkbox" checked={showSoldOut} onChange={(e) => setShowSoldOut(e.target.checked)} className="accent-fuchsia-500" />
              Esaurito ({countSoldOut})
            </label>
          </div>

          <div className="soft-divider pt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Tipo prodotto</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => setSelectedCategory(c.id)}
                  className={`chip transition ${selectedCategory === c.id ? "chip-active" : "hover:border-zinc-500"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="soft-divider pt-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">Prezzo max</p>
            <div className="mb-2 flex justify-between text-sm text-zinc-400">
              <span>€0</span>
              <span className="font-medium text-white">€{maxPrice}</span>
            </div>
            <input type="range" min={0} max={priceCeiling} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-fuchsia-500" />
          </div>
        </aside>

        <div className="relative z-0 grid gap-6 overflow-visible sm:grid-cols-2 sm:gap-7 xl:grid-cols-3">
          {filtered.length === 0 && (
            <div className="col-span-full">
              <EmptyState variant="store" title="Nessun servizio con questi filtri" description="Prova a cambiare categoria o togli i filtri attivi." codeHint="// filter returned [] — reset e riprova" />
            </div>
          )}
          {filtered.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`card-lift card-shine relative flex flex-col overflow-hidden p-6 ${service.popular ? "surface-glow" : "surface"}`}>
              <div className="mb-3 flex min-h-[1.5rem] items-center justify-between gap-2">
                {service.popular ? (
                  <span className="inline-flex shrink-0 items-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.45)]">Più richiesto</span>
                ) : (<span />)}
                {service.available === false && <span className="chip text-zinc-400">Esaurito</span>}
              </div>
              <Link href={`/store/${service.id}`} className="group">
                <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-violet-200">{service.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">{service.description}</p>
              </Link>
              <div className="mb-5 mt-4">
                {service.discountPercent && service.discountPercent > 0 ? (
                  <>
                    <span className="mr-2 text-lg text-zinc-500 line-through">€{service.price}</span>
                    <span className="price-tag">€{Math.round(service.price * (1 - service.discountPercent / 100) * 100) / 100}</span>
                    <span className="ml-2 text-xs text-emerald-400">-{service.discountPercent}%</span>
                  </>
                ) : (
                  <span className="price-tag">€{service.price}</span>
                )}
                <span className="ml-1 text-sm text-zinc-500">/ mese</span>
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {service.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2">
                <Link href={`/store/${service.id}`} className="link-underline text-center text-sm text-violet-300">Vedi dettagli</Link>
                <button disabled={service.available === false} onClick={() => addItem(service)}
                  className="btn-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">
                  <ShoppingCart className="h-4 w-4" />Aggiungi al carrello
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
