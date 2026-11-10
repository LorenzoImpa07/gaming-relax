"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Globe,
  Bot,
  Zap,
  Cpu,
  HelpCircle,
  Mail,
} from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { id: "sito", label: "Sito web / Web app", desc: "Landing, corporate, e-commerce, dashboard", icon: Globe },
  { id: "bot", label: "Bot Discord", desc: "Economia, ticket, ranking, pannelli", icon: Bot },
  { id: "automazione", label: "Automazioni / API", desc: "Webhook, integrazioni, pipeline", icon: Zap },
  { id: "software", label: "Software custom", desc: "Tool interni, gestionali, SaaS", icon: Cpu },
  { id: "altro", label: "Altro / non so ancora", desc: "Raccontaci l'idea, ti guidiamo noi", icon: HelpCircle },
];

const BUDGETS = [
  { id: "sotto-500", label: "Sotto 500 €" },
  { id: "500-1500", label: "500 – 1.500 €" },
  { id: "1500-5000", label: "1.500 – 5.000 €" },
  { id: "oltre-5000", label: "Oltre 5.000 €" },
  { id: "da-definire", label: "Da definire insieme" },
];

const TIMELINES = [
  { id: "urgente", label: "Urgente (entro 2 settimane)" },
  { id: "1-mese", label: "Entro 1 mese" },
  { id: "1-3-mesi", label: "1 – 3 mesi" },
  { id: "flessibile", label: "Flessibile / quando serve" },
];

const STEPS = ["Tipo", "Budget", "Tempi", "Dettagli"];

type FormState = {
  projectType: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  message: string;
};

const initial: FormState = {
  projectType: "",
  budget: "",
  timeline: "",
  name: "",
  email: "",
  message: "",
};

export default function PreventivoPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const canNext =
    (step === 0 && !!form.projectType) ||
    (step === 1 && !!form.budget) ||
    (step === 2 && !!form.timeline) ||
    (step === 3 &&
      form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.message.trim().length >= 10);

  const submit = async () => {
    if (!canNext || status === "sending") return;
    setStatus("sending");
    try {
      const typeLabel =
        PROJECT_TYPES.find((p) => p.id === form.projectType)?.label || form.projectType;
      const budgetLabel = BUDGETS.find((b) => b.id === form.budget)?.label || form.budget;
      const timelineLabel =
        TIMELINES.find((t) => t.id === form.timeline)?.label || form.timeline;

      await addDoc(collection(db, "quote_requests"), {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        projectType: form.projectType,
        projectTypeLabel: typeLabel,
        budget: form.budget,
        budgetLabel,
        timeline: form.timeline,
        timelineLabel,
        message: form.message.trim(),
        status: "new",
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStatus("success");
      setForm(initial);
      setStep(0);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Richiesta inviata</h1>
        <p className="mt-3 text-zinc-400">
          Grazie. Abbiamo ricevuto il preventivo guidato. Ti rispondiamo di solito entro 24 ore
          lavorative con scope, tempi e prezzo chiari.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900">
            Torna alla home
          </Link>
          <Link href="/custom" className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white">
            Vedi Custom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-400">
          Preventivo guidato
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Raccontaci il progetto
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          Quattro passaggi. Scope, budget e tempi chiari — così ti rispondiamo in modo preciso,
          senza giri di parole.
        </p>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition",
                  i < step
                    ? "bg-violet-600 text-white"
                    : i === step
                      ? "bg-white text-zinc-900"
                      : "bg-white/10 text-zinc-500"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("hidden text-[10px] sm:block", i === step ? "text-white" : "text-zinc-600")}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0c0c14]/80 p-5 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Che tipo di progetto?</h2>
                <p className="text-sm text-zinc-500">Scegli l'opzione più vicina.</p>
                <div className="mt-4 grid gap-2">
                  {PROJECT_TYPES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, projectType: p.id })}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition",
                        form.projectType === p.id
                          ? "border-violet-500/60 bg-violet-500/15"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          form.projectType === p.id
                            ? "bg-violet-500/30 text-violet-200"
                            : "bg-white/5 text-zinc-400"
                        )}
                      >
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{p.label}</p>
                        <p className="text-xs text-zinc-500">{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Budget orientativo</h2>
                <p className="text-sm text-zinc-500">
                  Non è un impegno: ci serve per proporti un piano realistico.
                </p>
                <div className="mt-4 grid gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setForm({ ...form, budget: b.id })}
                      className={cn(
                        "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition",
                        form.budget === b.id
                          ? "border-violet-500/60 bg-violet-500/15 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20"
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">Quando ti serve?</h2>
                <p className="text-sm text-zinc-500">Tempi desiderati di consegna.</p>
                <div className="mt-4 grid gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm({ ...form, timeline: t.id })}
                      className={cn(
                        "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition",
                        form.timeline === t.id
                          ? "border-violet-500/60 bg-violet-500/15 text-white"
                          : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">I tuoi dettagli</h2>
                <p className="text-sm text-zinc-500">
                  Come ricontattarti e una breve descrizione del progetto.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-500">Nome</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                      placeholder="Come ti chiami"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs text-zinc-500">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                      placeholder="tua@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-zinc-500">Descrizione progetto</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                    placeholder="Obiettivi, funzionalità essenziali, riferimenti o esempi…"
                    required
                  />
                  <p className="mt-1 text-[11px] text-zinc-600">Minimo 10 caratteri</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-zinc-400">
                  <p className="mb-2 font-medium text-zinc-300">Riepilogo</p>
                  <ul className="space-y-1">
                    <li>
                      Tipo:{" "}
                      <span className="text-white">
                        {PROJECT_TYPES.find((p) => p.id === form.projectType)?.label}
                      </span>
                    </li>
                    <li>
                      Budget:{" "}
                      <span className="text-white">{BUDGETS.find((b) => b.id === form.budget)?.label}</span>
                    </li>
                    <li>
                      Tempi:{" "}
                      <span className="text-white">
                        {TIMELINES.find((t) => t.id === form.timeline)?.label}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {status === "error" && (
          <p className="mt-4 text-sm text-red-400">
            Errore invio. Riprova o scrivici a supportogamingrelax@gmail.com
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-300 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext && setStep((s) => s + 1)}
              disabled={!canNext}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 disabled:opacity-40"
            >
              Continua
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canNext || status === "sending"}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {status === "sending" ? "Invio…" : "Invia richiesta"}
              <Mail className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        Preferisci scrivere liberamente?{" "}
        <Link href="/contatti" className="text-violet-400 hover:underline">
          Vai a Contatti
        </Link>
      </p>
    </div>
  );
}
