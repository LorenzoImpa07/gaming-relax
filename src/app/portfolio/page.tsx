"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import { caseStudies } from "@/data/portfolio";

const catLabel: Record<string, string> = {
  web: "Web",
  bot: "Bot Discord",
  software: "Software",
  automation: "Automazioni",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(139,92,246,0.28),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-400">
            Portfolio
          </p>
          <h1 className="max-w-2xl font-serif text-4xl font-light tracking-tight text-white sm:text-5xl">
            Progetti che
            <span className="italic text-white/80"> shippiamo</span> in produzione.
          </h1>
          <p className="mt-5 max-w-xl text-base text-zinc-400">
            Casi reali (o anonimizzati): problema, stack, soluzione e risultato. Così vedi come
            lavoriamo — non solo cosa vendiamo.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
        {caseStudies.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-950/90"
          >
            <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
              <div className="relative flex min-h-[200px] flex-col justify-between border-b border-white/5 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.25),transparent_60%)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-300">
                      {catLabel[c.category] || c.category}
                    </span>
                    <span className="text-[11px] text-zinc-500">{c.year}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{c.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500">{c.client}</p>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">{c.summary}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-1.5">
                  {c.stack.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-zinc-400"
                    >
                      <Code2 className="h-3 w-3 text-violet-400" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6 p-6 sm:p-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Sfida
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{c.challenge}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Soluzione
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-300">{c.solution}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Risultati
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {c.results.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-zinc-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        <div className="rounded-3xl border border-violet-500/25 bg-violet-500/10 p-8 text-center sm:p-10">
          <h3 className="text-xl font-semibold text-white">Il prossimo progetto può essere il tuo</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Scope, tempi e prezzo chiari. Preventivo guidato in pochi minuti.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/preventivo"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900"
            >
              Preventivo guidato
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white"
            >
              Catalogo Custom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
