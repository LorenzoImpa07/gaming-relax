"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Check, ShoppingCart, ArrowLeft } from "lucide-react";
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
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { addItem } = useCart();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const ref = doc(db, "site_services", id);
        const snap = await getDoc(ref);
        if (!cancelled && snap.exists()) {
          setService(normalize(snap.data() as Record<string, unknown>, snap.id));
          setLoading(false);
          return;
        }
        const all = await getDocs(collection(db, "site_services"));
        if (!cancelled && !all.empty) {
          const found = all.docs.find((d) => d.id === id);
          if (found) {
            setService(normalize(found.data() as Record<string, unknown>, found.id));
            setLoading(false);
            return;
          }
        }
        const staticOne = staticServices.find((s) => s.id === id) || null;
        if (!cancelled) setService(staticOne);
      } catch {
        if (!cancelled) {
          setService(staticServices.find((s) => s.id === id) || null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="px-4 py-24 text-center text-sm text-zinc-500">Caricamento...</p>;
  }
  if (!service) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-zinc-400">Servizio non trovato.</p>
        <Link href="/store" className="mt-4 inline-block text-violet-400 hover:underline">
          Torna allo store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/store"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Store
      </Link>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 box-glow">
        {service.popular && (
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-semibold text-white">
            Più richiesto
          </span>
        )}
        <h1 className="text-3xl font-bold text-white">{service.name}</h1>
        <p className="mt-3 leading-relaxed text-zinc-400">{service.description}</p>

        <div className="mt-6 flex flex-wrap items-baseline gap-2">
          {service.discountPercent && service.discountPercent > 0 ? (
            <>
              <span className="text-xl text-zinc-500 line-through">€{service.price}</span>
              <span className="text-4xl font-bold text-white">
                €{Math.round(service.price * (1 - service.discountPercent / 100) * 100) / 100}
              </span>
              <span className="text-sm text-green-400">-{service.discountPercent}%</span>
            </>
          ) : (
            <span className="text-4xl font-bold text-white">€{service.price}</span>
          )}
          <span className="text-zinc-500">una tantum</span>
        </div>

        {service.details && (
          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Dettagli
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
              {service.details}
            </p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Cosa include
          </h2>
          <ul className="space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled={service.available === false}
          onClick={() => addItem(service)}
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white btn-glow disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          {service.available === false ? "Esaurito" : "Aggiungi al carrello"}
        </button>
      </div>
    </div>
  );
}
