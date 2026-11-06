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
import { Star } from "lucide-react";

type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  status?: string;
  createdAt?: Timestamp;
};

export default function AdminRecensioniPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
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
    await updateDoc(doc(db, "reviews", id), { status });
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa recensione?")) return;
    await deleteDoc(doc(db, "reviews", id));
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) return <p className="text-zinc-500 text-sm">Caricamento...</p>;
  if (reviews.length === 0) return <p className="text-zinc-500 text-sm">Nessuna recensione.</p>;

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-medium text-white">{r.name}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < r.rating ? "fill-violet-400 text-violet-400" : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span
              className={`text-xs rounded-full px-2 py-0.5 ${
                r.status === "approved"
                  ? "bg-green-500/20 text-green-300"
                  : r.status === "rejected"
                  ? "bg-red-500/20 text-red-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {r.status || "pending"}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-4">{r.text}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatus(r.id, "approved")} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-green-500 hover:text-green-300">Approva</button>
            <button onClick={() => setStatus(r.id, "rejected")} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-amber-500">Rifiuta</button>
            <button onClick={() => remove(r.id)} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-red-400 hover:border-red-500">Elimina</button>
          </div>
        </div>
      ))}
    </div>
  );
}
