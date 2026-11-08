"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Check, ShoppingCart, ArrowLeft } from "lucide-react";
import { services as staticServices, type Service, type ServicePlan } from "@/data/services";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";

function normalize(raw: Record<string, unknown>, id: string): Service {
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
    name: String(raw.name || "Servizio"),
    description: String(raw.description || ""),
    details: raw.details ? String(raw.details) : undefined,
    price: Number(raw.price) || 0,
    category: (raw.category as Service["category"]) || "bot",
    features: feats,
    popular: !!raw.popular,
    available: raw.available === undefined ? true : !!raw.available,
    discountPercent: Number(raw.discountPercent) || 0,
    plans,
  };
}

export default function ServiceDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { addItem } = useCart();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "site_services", id));
        if (!cancelled && snap.exists()) {
          const s = normalize(snap.data() as Record<string, unknown>, snap.id);
          setService(s);
          if (s.plans?.length) setSelectedPlanId(s.plans[0].id);
          setLoading(false);
          return;
        }
        const all = await getDocs(collection(db, "site_services"));
        if (!cancelled && !all.empty) {
          const found = all.docs.find((d) => d.id === id);
          if (found) {
            const s = normalize(found.data() as Record<string, unknown>, found.id);
            setService(s);
            if (s.plans?.length) setSelectedPlanId(s.plans[0].id);
            setLoading(false);
            return;
          }
        }
        const staticOne = staticServices.find((s) => s.id === id) || null;
        if (!cancelled) {
          setService(staticOne);
          if (staticOne?.plans?.length) setSelectedPlanId(staticOne.plans[0].id);
        }
      } catch {
        if (!cancelled) setService(staticServices.find((s) => s.id === id) || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const plans = useMemo(() => {
    if (!service?.plans?.length) return [];
    return [...service.plans].sort((a, b) => a.price - b.price);
  }, [service]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || null;
  const displayPrice = selectedPlan ? selectedPlan.price : service?.price || 0;
  const disc = service?.discountPercent || 0;
  const finalPrice =
    disc > 0 ? Math.round(displayPrice * (1 - disc / 100) * 100) / 100 : displayPrice;
  const featuresToShow =
    selectedPlan?.features && selectedPlan.features.length > 0
      ? selectedPlan.features
      : service?.features || [];

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

  const onAdd = () => {
    addItem(service, selectedPlan);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/store"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Store
      </Link>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 box-glow sm:p-8">
        {service.popular && (
          <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-semibold text-white">
            Più richiesto
          </span>
        )}
        <h1 className="text-3xl font-bold text-white">{service.name}</h1>
        <p className="mt-3 leading-relaxed text-zinc-400">{service.description}</p>

        {plans.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Scegli un piano
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {plans.map((plan) => {
                const active = selectedPlanId === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-violet-500 bg-violet-500/15 shadow-[0_0_24px_rgba(139,92,246,0.2)]"
                        : "border-zinc-700 bg-zinc-950/50 hover:border-zinc-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-white">{plan.name}</span>
                      <span className="text-lg font-bold text-violet-300">€{plan.price}</span>
                    </div>
                    {plan.description && (
                      <p className="mt-1 text-xs text-zinc-400">{plan.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-baseline gap-2">
          {disc > 0 ? (
            <>
              <span className="text-xl text-zinc-500 line-through">€{displayPrice}</span>
              <span className="text-4xl font-bold text-white">€{finalPrice}</span>
              <span className="text-sm text-green-400">-{disc}%</span>
            </>
          ) : (
            <span className="text-4xl font-bold text-white">€{displayPrice}</span>
          )}
          <span className="text-zinc-500">{selectedPlan ? selectedPlan.name : "al mese"}</span>
        </div>

        {service.details && (
          <div className="mt-8">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Dettagli
            </h2>
            <p className="whitespace-pre-wrap leading-relaxed text-zinc-300">{service.details}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Cosa include{selectedPlan ? ` — ${selectedPlan.name}` : ""}
          </h2>
          <ul className="space-y-2">
            {featuresToShow.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          disabled={service.available === false}
          onClick={onAdd}
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white btn-glow disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          <ShoppingCart className="h-4 w-4" />
          {service.available === false
            ? "Esaurito"
            : added
              ? "Aggiunto!"
              : selectedPlan
                ? `Aggiungi ${selectedPlan.name} — €${finalPrice}`
                : "Aggiungi al carrello"}
        </button>
      </div>
    </div>
  );
}
