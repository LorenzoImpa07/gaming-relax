"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Star, ChevronDown, Check, X, Clock, Trash2 } from "lucide-react";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  status?: string;
  createdAt?: Timestamp;
};

type Tab = "pending" | "approved" | "rejected";

const tabs: { id: Tab; label: string; color: string }[] = [
  { id: "pending", label: "In attesa", color: "text-amber-300 border-amber-500/40 bg-amber-500/10" },
  { id: "approved", label: "Approvate", color: "text-green-300 border-green-500/40 bg-green-500/10" },
  { id: "rejected", label: "Rifiutate", color: "text-red-300 border-red-500/40 bg-red-500/10" },
];

function normalizeStatus(s?: string): Tab {
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  return "pending";
}

export default function AdminRecensioniPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Record<Tab, boolean>>({
    pending: true,
    approved: false,
    rejected: false,
  });

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const grouped = useMemo(() => {
    const g: Record<Tab, Review[]> = { pending: [], approved: [], rejected: [] };
    for (const r of reviews) g[normalizeStatus(r.status)].push(r);
    return g;
  }, [reviews]);

  const setStatus = async (id: string, status: Tab) => {
    await updateDoc(doc(db, "reviews", id), { status });
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare definitivamente questa recensione?")) return;
    await deleteDoc(doc(db, "reviews", id));
  };

  if (loading) return <p className="text-sm text-zinc-500">Caricamento recensioni...</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Le recensioni <strong className="text-green-300">approvate</strong> compaiono subito sul
        sito pubblico. Quelle in attesa e rifiutate restano solo in dashboard.
      </p>

      {tabs.map((tab) => {
        const list = grouped[tab.id];
        const isOpen = open[tab.id];
        return (
          <div key={tab.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [tab.id]: !o[tab.id] }))}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-zinc-900/60"
            >
              <div className="flex items-center gap-3">
                {tab.id === "pending" && <Clock className="h-4 w-4 text-amber-400" />}
                {tab.id === "approved" && <Check className="h-4 w-4 text-green-400" />}
                {tab.id === "rejected" && <X className="h-4 w-4 text-red-400" />}
                <span className="font-medium text-white">{tab.label}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${tab.color}`}>{list.length}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-zinc-800 px-4 py-4">
                {list.length === 0 && (
                  <p className="text-sm text-zinc-500">Nessuna recensione in questa sezione.</p>
                )}
                {list.map((r) => (
                  <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-white">{r.name}</p>
                        <div className="mt-1 flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < r.rating
                                  ? "fill-violet-400 text-violet-300 star-glow"
                                  : "text-zinc-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] ${tab.color}`}>{tab.label}</span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-zinc-300">{r.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {tab.id !== "approved" && (
                        <button type="button" onClick={() => setStatus(r.id, "approved")} className="inline-flex items-center gap-1 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-300 hover:bg-green-500/20">
                          <Check className="h-3.5 w-3.5" /> Approva
                        </button>
                      )}
                      {tab.id !== "rejected" && (
                        <button type="button" onClick={() => setStatus(r.id, "rejected")} className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20">
                          <X className="h-3.5 w-3.5" /> Rifiuta
                        </button>
                      )}
                      {tab.id !== "pending" && (
                        <button type="button" onClick={() => setStatus(r.id, "pending")} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/20">
                          <Clock className="h-3.5 w-3.5" /> In attesa
                        </button>
                      )}
                      <button type="button" onClick={() => remove(r.id)} className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-300">
                        <Trash2 className="h-3.5 w-3.5" /> Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
