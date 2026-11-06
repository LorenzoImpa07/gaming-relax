"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { services as staticServices, type Service } from "@/data/services";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";

const EUR = "\u20AC";

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
  };
}

export default function StorePage() {
  const { addItem } = useCart();
  const [list, setList] = useState<Service[]>(staticServices);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showSoldOut, setShowSoldOut] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    getDocs(collection(db, "site_services"))
      .then((snap) => {
        if (snap.empty) return;
        const fromDb = snap.docs.map((d) => normalize(d.data() as Record<string, unknown>, d.id));
        setList(fromDb);
        const prices = fromDb.map((s) => s.price);
        if (prices.length) setMaxPrice(Math.max(...prices, 100));
      })
      .catch(() => {});
  }, []);

  const priceCeiling = useMemo(() => Math.max(...list.map((s) => s.price), 100), [list]);
  const filtered = useMemo(() => {
    return list.filter((s) => {
      const avail = s.available !== false;
      if (avail && !showAvailable) return false;
      if (!avail && !showSoldOut) return false;
      if (s.price > maxPrice) return false;
      return true;
    });
  }, [list, showAvailable, showSoldOut, maxPrice]);

  const countAvailable = list.filter((s) => s.available !== false).length;
  const countSoldOut = list.filter((s) => s.available === false).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Store Servizi</h1>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
          {"Scegli il pacchetto pi\u00f9 adatto. Prezzi trasparenti e supporto incluso."}
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-6 sticky top-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400 mb-3">
              {"Disponibilit\u00e0"}
            </p>
            <label className="flex items-center gap-2 text-sm text-zinc-300 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailable}
                onChange={(e) => setShowAvailable(e.target.checked)}
                className="accent-fuchsia-500"
              />
              Disponibile ({countAvailable})
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showSoldOut}
                onChange={(e) => setShowSoldOut(e.target.checked)}
                className="accent-fuchsia-500"
              />
              Esaurito ({countSoldOut})
            </label>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400 mb-3">Prezzo</p>
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>{EUR}0</span>
              <span>
                {EUR}
                {maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={priceCeiling}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-fuchsia-500"
            />
          </div>
        </aside>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 && (
            <p className="text-sm text-zinc-500 col-span-full">Nessun servizio con questi filtri.</p>
          )}
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                service.popular
                  ? "border-violet-500/50 bg-violet-500/5"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-semibold text-white">
                  {"Pi\u00f9 richiesto"}
                </span>
              )}
              {service.available === false && (
                <span className="absolute top-3 right-3 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                  Esaurito
                </span>
              )}
              <Link href={`/store/${service.id}`} className="group">
                <h3 className="text-xl font-semibold text-white group-hover:text-violet-300">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 line-clamp-3">{service.description}</p>
              </Link>
              <div className="mt-4 mb-5">
                {service.discountPercent && service.discountPercent > 0 ? (
                  <>
                    <span className="text-lg text-zinc-500 line-through mr-2">
                      {EUR}
                      {service.price}
                    </span>
                    <span className="text-3xl font-bold text-white">
                      {EUR}
                      {Math.round(service.price * (1 - service.discountPercent / 100) * 100) / 100}
                    </span>
                    <span className="ml-2 text-xs text-green-400">-{service.discountPercent}%</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {EUR}
                    {service.price}
                  </span>
                )}
                <span className="text-zinc-500 text-sm ml-1">una tantum</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {service.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  href={`/store/${service.id}`}
                  className="text-center text-sm text-violet-400 hover:underline"
                >
                  Vedi dettagli
                </Link>
                <button
                  disabled={service.available === false}
                  onClick={() => addItem(service)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Aggiungi al carrello
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
