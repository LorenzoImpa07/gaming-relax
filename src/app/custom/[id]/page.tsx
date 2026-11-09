"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ArrowLeft, Check, ShoppingCart } from "lucide-react";
import { customProducts, type CustomProduct } from "@/data/custom";
import type { ServicePlan } from "@/data/services";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";

function normalize(raw: Record<string, unknown>, id: string): CustomProduct {
  const features = raw.features;
  let feats: string[] = [];
  if (Array.isArray(features)) feats = features as string[];
  else if (typeof features === "string")
    feats = features.split("\n").map((s) => s.trim()).filter(Boolean);

  let plans: ServicePlan[] | undefined;
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
    permanent: !!raw.permanent,
    plans,
  };
}

export default function CustomDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { addItem } = useCart();
  const [product, setProduct] = useState<CustomProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "site_custom", id));
        if (!cancelled && snap.exists()) {
          const s = normalize(snap.data() as Record<string, unknown>, snap.id);
          setProduct(s);
          if (s.plans?.length) setSelectedPlanId(s.plans[0].id);
          setLoading(false);
          return;
        }
        const all = await getDocs(collection(db, "site_custom"));
        if (!cancelled && !all.empty) {
          const found = all.docs.find((d) => d.id === id);
          if (found) {
            const s = normalize(found.data() as Record<string, unknown>, found.id);
            setProduct(s);
            if (s.plans?.length) setSelectedPlanId(s.plans[0].id);
            setLoading(false);
            return;
          }
        }
        if (!cancelled) {
          const staticP = customProducts.find((p) => p.id === id) || null;
          setProduct(staticP);
          if (staticP?.plans?.length) setSelectedPlanId(staticP.plans[0].id);
        }
      } catch {
        if (!cancelled) {
          const staticP = customProducts.find((p) => p.id === id) || null;
          setProduct(staticP);
          if (staticP?.plans?.length) setSelectedPlanId(staticP.plans[0].id);
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
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-zinc-500">
        Caricamento…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-zinc-400">Prodotto non trovato.</p>
        <Link href="/custom" className="mt-4 inline-block text-violet-400 hover:underline">
          ← Torna a Custom
        </Link>
      </div>
    );
  }

  const selectedPlan = product.plans?.find((p) => p.id === selectedPlanId) || null;
  const price = selectedPlan ? selectedPlan.price : product.price;
  const displayFeatures =
    selectedPlan?.features && selectedPlan.features.length > 0
      ? selectedPlan.features
      : product.features;

  const handleAdd = () => {
    addItem(product, selectedPlan);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/custom" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Custom
      </Link>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40">
        <div className="border-b border-white/5 bg-gradient-to-r from-violet-600/15 to-transparent px-6 py-8 sm:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-violet-300/80">{product.category}</p>
          <h1 className="mt-2 font-serif text-3xl font-light text-white sm:text-4xl">{product.name}</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">{product.description}</p>
        </div>

        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {product.details && (
              <div>
                <h2 className="text-sm font-semibold text-white">Descrizione</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{product.details}</p>
              </div>
            )}
            <div>
              <h2 className="text-sm font-semibold text-white">Cosa include</h2>
              <ul className="mt-3 space-y-2">
                {displayFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-white/10 bg-[#0c0c14] p-5">
            {product.plans && product.plans.length > 0 && (
              <div className="mb-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Piani / abbonamenti</p>
                {product.plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selectedPlanId === plan.id
                        ? "border-violet-500/50 bg-violet-600/15"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white">{plan.name}</span>
                      <span className="text-sm font-semibold text-violet-300">€{plan.price}</span>
                    </div>
                    {plan.description && <p className="mt-1 text-xs text-zinc-500">{plan.description}</p>}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs text-zinc-500">Prezzo</p>
              <p className="text-3xl font-semibold text-white">€{price}</p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={product.available === false}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
              {added ? "Aggiunto!" : product.available === false ? "Non disponibile" : "Aggiungi al carrello"}
            </button>
            <Link href="/contatti" className="mt-3 block text-center text-xs text-zinc-500 hover:text-violet-300">
              Preferisci un preventivo su misura?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
