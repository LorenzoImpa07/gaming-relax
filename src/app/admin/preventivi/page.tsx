"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FileText,
  Trash2,
  Mail,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuoteStatus = "new" | "in_progress" | "closed";

type QuoteRequest = {
  id: string;
  name?: string;
  email?: string;
  projectType?: string;
  projectTypeLabel?: string;
  budget?: string;
  budgetLabel?: string;
  timeline?: string;
  timelineLabel?: string;
  message?: string;
  status?: QuoteStatus;
  read?: boolean;
  createdAt?: Timestamp;
  notes?: string;
};

const STATUS_META: Record<QuoteStatus, { label: string; className: string }> = {
  new: {
    label: "Nuova",
    className: "border-violet-500/40 bg-violet-500/15 text-violet-200",
  },
  in_progress: {
    label: "In corso",
    className: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  },
  closed: {
    label: "Chiusa",
    className: "border-zinc-500/40 bg-zinc-500/15 text-zinc-300",
  },
};

export default function AdminPreventiviPage() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | QuoteStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "quote_requests"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuoteRequest)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: QuoteStatus) => {
    setBusyId(id);
    try {
      await updateDoc(doc(db, "quote_requests", id), {
        status,
        read: true,
        updatedAt: serverTimestamp(),
      });
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status, read: true } : x))
      );
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questa richiesta di preventivo?")) return;
    setBusyId(id);
    try {
      await deleteDoc(doc(db, "quote_requests", id));
      setItems((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const filtered =
    filter === "all" ? items : items.filter((x) => (x.status || "new") === filter);

  const counts = {
    all: items.length,
    new: items.filter((x) => (x.status || "new") === "new").length,
    in_progress: items.filter((x) => x.status === "in_progress").length,
    closed: items.filter((x) => x.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/40 via-[#0c0c16] to-fuchsia-950/30 p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-300/80">
              Lead · CRM
            </p>
            <h2 className="text-2xl font-bold text-white">Preventivi guidati</h2>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Richieste dal form a step sul sito. Aggiorna lo stato: Nuova → In corso → Chiusa.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-zinc-400">
            <FileText className="h-4 w-4 text-violet-300" />
            {counts.new} nuove · {counts.in_progress} in corso
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "Tutte"],
            ["new", "Nuove"],
            ["in_progress", "In corso"],
            ["closed", "Chiuse"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
              filter === id
                ? "border-violet-500/50 bg-violet-500/20 text-violet-100"
                : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
            )}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Caricamento…
        </p>
      )}

      {!loading && filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-sm text-zinc-500">
          Nessuna richiesta{filter !== "all" ? " in questo filtro" : ""}. Arriveranno da{" "}
          <code className="text-zinc-400">/preventivo</code>.
        </p>
      )}

      <div className="space-y-4">
        {filtered.map((m) => {
          const st = (m.status || "new") as QuoteStatus;
          const meta = STATUS_META[st];
          const date =
            m.createdAt && typeof m.createdAt.toDate === "function"
              ? m.createdAt.toDate().toLocaleString("it-IT")
              : "—";

          return (
            <div
              key={m.id}
              className={cn(
                "rounded-2xl border p-5 transition",
                st === "new"
                  ? "border-violet-500/30 bg-violet-500/5"
                  : "border-white/10 bg-[#0c0c14]/80"
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white">{m.name || "Senza nome"}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        meta.className
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-violet-300"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {m.email}
                  </a>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-600">
                    <Clock className="h-3 w-3" />
                    {date}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {st !== "new" && (
                    <button
                      type="button"
                      disabled={busyId === m.id}
                      onClick={() => setStatus(m.id, "new")}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white"
                    >
                      <Circle className="h-3 w-3" />
                      Nuova
                    </button>
                  )}
                  {st !== "in_progress" && (
                    <button
                      type="button"
                      disabled={busyId === m.id}
                      onClick={() => setStatus(m.id, "in_progress")}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 px-2.5 py-1 text-[11px] text-amber-200/90 hover:bg-amber-500/10"
                    >
                      <Loader2 className="h-3 w-3" />
                      In corso
                    </button>
                  )}
                  {st !== "closed" && (
                    <button
                      type="button"
                      disabled={busyId === m.id}
                      onClick={() => setStatus(m.id, "closed")}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 px-2.5 py-1 text-[11px] text-emerald-200/90 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Chiudi
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() => remove(m.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/20 px-2.5 py-1 text-[11px] text-red-300/90 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" />
                    Elimina
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl border border-white/5 bg-black/20 p-3 text-xs sm:grid-cols-3">
                <div>
                  <p className="text-zinc-600">Tipo</p>
                  <p className="text-zinc-200">{m.projectTypeLabel || m.projectType || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Budget</p>
                  <p className="text-zinc-200">{m.budgetLabel || m.budget || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-600">Tempi</p>
                  <p className="text-zinc-200">{m.timelineLabel || m.timeline || "—"}</p>
                </div>
              </div>

              {m.message && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-400">
                  {m.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
