"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShoppingBag, Star, MessageSquare } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ orders: 0, reviewsPending: 0, messages: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [ordersSnap, reviewsSnap, messagesSnap] = await Promise.all([
          getCountFromServer(collection(db, "orders")),
          getCountFromServer(query(collection(db, "reviews"), where("status", "==", "pending"))),
          getCountFromServer(collection(db, "messages")),
        ]);
        setStats({
          orders: ordersSnap.data().count,
          reviewsPending: reviewsSnap.data().count,
          messages: messagesSnap.data().count,
        });
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const cards = [
    { label: "Ordini totali", value: stats.orders, href: "/admin/ordini", icon: ShoppingBag },
    { label: "Recensioni in attesa", value: stats.reviewsPending, href: "/admin/recensioni", icon: Star },
    { label: "Messaggi", value: stats.messages, href: "/admin/messaggi", icon: MessageSquare },
  ];

  return (
    <div>
      <p className="text-zinc-400 text-sm mb-6">
        Panoramica rapida. Usa i tab sopra per gestire ordini, recensioni, messaggi e contenuti.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-violet-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <c.icon className="h-5 w-5 text-violet-400" />
              <span className="text-2xl font-bold text-white">{c.value}</span>
            </div>
            <p className="text-sm text-zinc-400">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
