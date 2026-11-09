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
  Bot,
  Radio,
  CreditCard,
  Users,
  Megaphone,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    orders: 0,
    reviewsPending: 0,
    messages: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
      accent: "from-violet-500/25 via-violet-500/5 to-transparent",
      iconBg: "bg-violet-500/15 text-violet-300 border-violet-500/25",
      ring: "hover:border-violet-500/40 hover:shadow-violet-950/40",
    },
    {
      label: "Recensioni in attesa",
      value: stats.reviewsPending,
      href: "/admin/recensioni",
      icon: Star,
      accent: "from-amber-500/25 via-amber-500/5 to-transparent",
      iconBg: "bg-amber-500/15 text-amber-300 border-amber-500/25",
      ring: "hover:border-amber-500/40 hover:shadow-amber-950/30",
    },
    {
      label: "Messaggi",
      value: stats.messages,
      href: "/admin/messaggi",
      icon: MessageSquare,
      accent: "from-cyan-500/25 via-cyan-500/5 to-transparent",
      iconBg: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
      ring: "hover:border-cyan-500/40 hover:shadow-cyan-950/30",
    },
    {
      label: "Servizi in catalogo",
      value: stats.services,
      href: "/admin/servizi",
      icon: Package,
      accent: "from-fuchsia-500/25 via-fuchsia-500/5 to-transparent",
      iconBg: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
      ring: "hover:border-fuchsia-500/40 hover:shadow-fuchsia-950/30",
    },
  ];

  const quick = [
    { href: "/admin/custom", label: "Prodotti Custom", icon: Package },
    { href: "/admin/banner", label: "Banner home", icon: Radio },
    { href: "/admin/supporto", label: "Assistente chat", icon: Bot },
    { href: "/admin/pagamenti", label: "Pagamenti", icon: CreditCard },
    { href: "/admin/team", label: "Team", icon: Users },
    { href: "/admin/novita", label: "Novità", icon: Megaphone },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/50 via-[#0c0c16] to-fuchsia-950/40 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-[11px] font-medium text-violet-200">
              <Sparkles className="h-3 w-3" />
              Pannello di controllo
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bentornato in Dashboard
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              Monitora ordini, moderare recensioni e aggiorna catalogo, team e pagamenti
              da un unico posto.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200/90">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>
              Sistema online · dati Firestore
              {loading ? " · sync…" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/90 p-5 shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-xl ${c.ring}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`}
            />
            <div className="relative flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${c.iconBg}`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-white" />
            </div>
            <p className="relative mt-5 text-3xl font-semibold tracking-tight text-white">
              {loading ? "—" : c.value}
            </p>
            <p className="relative mt-1 text-sm text-zinc-400">{c.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Accesso rapido</h3>
          <p className="text-xs text-zinc-500">Sezioni usate spesso</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition hover:border-violet-500/35 hover:bg-violet-500/10"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-300 transition group-hover:border-violet-400/40 group-hover:bg-violet-500/20">
                <q.icon className="h-4 w-4" />
              </div>
              <span className="flex-1 text-sm font-medium text-zinc-300 group-hover:text-white">
                {q.label}
              </span>
              <ArrowUpRight className="h-4 w-4 text-zinc-600 transition group-hover:text-violet-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
