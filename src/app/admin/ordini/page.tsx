"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Order = {
  id: string;
  total: number;
  paymentMethod?: string;
  status?: string;
  customer?: {
    nome?: string;
    cognome?: string;
    email?: string;
    telefono?: string;
  };
  items?: { name: string; quantity: number; price: number }[];
  createdAt?: Timestamp;
};

export default function AdminOrdiniPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (loading) return <p className="text-zinc-500 text-sm">Caricamento ordini...</p>;
  if (orders.length === 0) return <p className="text-zinc-500 text-sm">Nessun ordine ancora.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div>
              <p className="font-medium text-white">
                {order.customer?.nome} {order.customer?.cognome}
              </p>
              <p className="text-sm text-zinc-400">{order.customer?.email}</p>
              {order.customer?.telefono && (
                <p className="text-sm text-zinc-500">{order.customer.telefono}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-white">€{(order.total || 0).toFixed(2)}</p>
              <p className="text-xs text-zinc-500">{order.paymentMethod || "—"}</p>
            </div>
          </div>
          <ul className="text-sm text-zinc-400 mb-4 space-y-1">
            {(order.items || []).map((item, i) => (
              <li key={i}>
                {item.name} × {item.quantity} — €{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 mr-2">
              Stato: <span className="text-zinc-300">{order.status || "pending"}</span>
            </span>
            {["pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(order.id, s)}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-violet-500 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
