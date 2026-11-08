"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2 } from "lucide-react";

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

const STATUS_OPTIONS = [
  {
    id: "pending",
    label: "In attesa",
    active: "bg-amber-500/20 border-amber-500/50 text-amber-300",
    idle: "border-zinc-700 text-zinc-400 hover:border-amber-500/40 hover:text-amber-200",
    badge: "text-amber-300",
  },
  {
    id: "confirmed",
    label: "Confermato",
    active: "bg-sky-500/20 border-sky-500/50 text-sky-300",
    idle: "border-zinc-700 text-zinc-400 hover:border-sky-500/40 hover:text-sky-200",
    badge: "text-sky-300",
  },
  {
    id: "completed",
    label: "Completato",
    active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
    idle: "border-zinc-700 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-200",
    badge: "text-emerald-300",
  },
  {
    id: "cancelled",
    label: "Annullato",
    active: "bg-red-500/20 border-red-500/50 text-red-300",
    idle: "border-zinc-700 text-zinc-400 hover:border-red-500/40 hover:text-red-200",
    badge: "text-red-300",
  },
] as const;

function statusMeta(status?: string) {
  return STATUS_OPTIONS.find((s) => s.id === status) || STATUS_OPTIONS[0];
}

export default function AdminOrdiniPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
    } catch (e) {
      console.error(e);
      try {
        const snap = await getDocs(collection(db, "orders"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
        list.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() || 0;
          const tb = b.createdAt?.toMillis?.() || 0;
          return tb - ta;
        });
        setOrders(list);
      } catch (e2) {
        console.error(e2);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await updateDoc(doc(db, "orders", id), { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (e) {
      console.error(e);
      alert("Impossibile aggiornare lo stato.");
    } finally {
      setBusyId(null);
    }
  };

  const removeOrder = async (id: string) => {
    if (
      !confirm(
        "Eliminare definitivamente questo ordine? L'azione non si può annullare."
      )
    ) {
      return;
    }
    setBusyId(id);
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.error(e);
      alert("Impossibile eliminare l'ordine.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm text-zinc-500">Caricamento ordini...</p>;

  if (orders.length === 0) {
    return <p className="text-sm text-zinc-500">Nessun ordine ancora.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const current = statusMeta(order.status);
        return (
          <div
            key={order.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-medium text-white">
                  {order.customer?.nome} {order.customer?.cognome}
                </p>
                <p className="text-sm text-zinc-400">{order.customer?.email}</p>
                {order.customer?.telefono && (
                  <p className="text-sm text-zinc-500">{order.customer.telefono}</p>
                )}
              </div>
              <div className="flex items-start gap-3 sm:text-right">
                <div>
                  <p className="text-lg font-semibold text-white">
                    €{(order.total || 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">{order.paymentMethod || "—"}</p>
                </div>
                <button
                  type="button"
                  disabled={busyId === order.id}
                  onClick={() => removeOrder(order.id)}
                  className="rounded-lg border border-red-500/30 p-2 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  title="Elimina ordine"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ul className="mb-4 space-y-1 text-sm text-zinc-400">
              {(order.items || []).map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} — €
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs text-zinc-500">
                Stato:{" "}
                <span className={`font-medium ${current.badge}`}>{current.label}</span>
              </span>
              {STATUS_OPTIONS.map((s) => {
                const isActive = (order.status || "pending") === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={busyId === order.id}
                    onClick={() => setStatus(order.id, s.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
                      isActive ? s.active : s.idle
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
