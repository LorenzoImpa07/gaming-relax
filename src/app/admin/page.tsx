"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ShoppingBag,
  Star,
  MessageSquare,
  Package,
  ArrowUpRight,
  Activity,
  Sparkles,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    orders: 0,
    reviewsPending: 0,
    messages: 0,
    services: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const [ordersSnap, reviewsSnap, messagesSnap, servicesSnap] = await Promise.all([
          getCountFromServer(collection(db, "orders")),
          getCountFromServer(
            query(collection(db, "reviews"), where("status", "==", "pending"))
          ),
          getCountFromServer(collection(db, "messages")),
          getCountFromServer(collection(db, "site_services")),
        ]);
        setStats({
          orders: ordersSnap.data().count,
          reviewsPending: reviewsSnap.data().count,
          messages: messagesSnap.data().count,
          services: servicesSnap.data().count,
        });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const cards = [
    {
      label: "Ordini totali",
      value: stats.orders,
      href: "/admin/ordini",
      icon: ShoppingBag,
      accent: "from-violet-500/20 to-transparent",
      iconColor: "text-violet-300",
      ring: "group-hover:border-violet-500/40",
    },
    {
      label: "Recensioni in attesa",
      value: stats.reviewsPending,
      href: "/admin/recensioni",
      icon: Star,
      accent: "from-amber-500/20 to-transparent",
      iconColor: "text-amber-300",
      ring: "group-hover:border-amber-500/40",
    },
    {
      label: "Messaggi",
      value: stats.messages,
      href: "/admin/messaggi",
      icon: MessageSquare,
      accent: "from-cyan-500/20 to-transparent",
      iconColor: "text-cyan-300",
      ring: "group-hover:border-cyan-500/40",
    },
    {
      label: "Servizi in catalogo",
      value: stats.services,
      href: "/admin/servizi",
      icon: Package,
      accent: "from-fuchsia-500/20 to-transparent",
      iconColor: "text-fuchsia-300",
      ring: "group-hover:border-fuchsia-500/40",
    },
  ];

  const quick = [
    { href: "/admin/servizi", label: "Gestisci servizi" },
    { href: "/admin/pagamenti", label: "Metodi di pagamento" },
    { href: "/admin/novita", label: "Pubblica novità" },
    { href: "/admin/forum", label: "Configura forum" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-[#0c0c14] to-fuchsia-950/30 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-200">
              <Sparkles className="h-3 w-3" />
              Pannello di controllo
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bentornato in Dashboard
            </h2>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Monitora ordini, moderare recensioni e aggiorna catalogo, team e pagamenti in un unico
              posto.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-zinc-400">
            <Activity className="h-4 w-4 text-emerald-400" />
            Dati in tempo reale da Firestore
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/80 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-950/30 ${c.ring}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent} opacity-80`}
            />
            <div className="relative flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 ${c.iconColor}`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-white" />
            </div>
            <p className="relative mt-6 text-3xl font-bold tracking-tight text-white">{c.value}</p>
            <p className="relative mt-1 text-sm text-zinc-400">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0c0c14]/60 p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Azioni rapide</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-white"
            >
              {q.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
