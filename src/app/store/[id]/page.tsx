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
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, "site_services", id));
        if (snap.exists()) {
          setService(normalize(snap.data() as Record<string, unknown>, snap.id));
          return;
        }
        const local = staticServices.find((s) => s.id === id);
        if (local) { setService(local); return; }
        const all = await getDocs(collection(db, "site_services"));
        const found = all.docs.find((d) => d.id === id);
        if (found) setService(normalize(found.data() as Record<string, unknown>, found.id));
      } catch {
        const local = staticServices.find((s) => s.id === id);
        if (local) setService(local);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-24 text-sm text-zinc-500">Caricamento...</div>;
  if (!service) return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-zinc-400">Servizio non trovato.</p>
      <Link href="/store" className="mt-4 inline-block text-violet-400 hover:underline">\u2190 Torna allo Store</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/store" className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Store
      </Link>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        {service.popular && (
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-semibold text-white">Pi\u00f9 richiesto</span>
        )}
        <h1 className="text-3xl font-bold text-white">{service.name}</h1>
        <p className="mt-3 text-zinc-400 leading-relaxed">{service.description}</p>
        <div className="mt-6 flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">\u20ac{service.price}</span>
          <span className="text-zinc-500">una tantum</span>
        </div>
        {service.details && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-2">Dettagli</h2>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{service.details}</p>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">Cosa include</h2>
          <ul className="space-y-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-zinc-300">
                <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />{f}
              </li>
            ))}
          </ul>
        </div>
        <button disabled={service.available === false} onClick={() => addItem(service)} className="mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-40">
          <ShoppingCart className="h-4 w-4" />
          {service.available === false ? "Esaurito" : "Aggiungi al carrello"}
        </button>
      </div>
    </div>
  );
}
