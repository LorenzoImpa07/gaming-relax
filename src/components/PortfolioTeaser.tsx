"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PortfolioTeaser() {
  return (
    <section className="relative bg-gradient-to-b from-[#0c1028] to-[#0a0e20] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-violet-300">
              Portfolio
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Lavori che parlano
              <span className="font-light italic text-white/70"> da soli.</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition-all hover:gap-3"
          >
            Vedi tutti i casi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Dashboard community",
              d: "Ranking, economia e moderazione in un pannello web collegato a Discord.",
              s: "Next.js · Firebase · Discord API",
            },
            {
              t: "Landing ad alta conversione",
              d: "Copy, motion e form lead per campagne ads — live in pochi giorni.",
              s: "Next.js · Tailwind · Vercel",
            },
            {
              t: "Suite bot Discord Pro",
              d: "Ticket, economia e uptime per community che scalano.",
              s: "TypeScript · discord.js · PostgreSQL",
            },
          ].map((x) => (
            <Link
              key={x.t}
              href="/portfolio"
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-violet-100">
                {x.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{x.d}</p>
              <p className="mt-4 font-mono text-[10px] text-zinc-500">{x.s}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
