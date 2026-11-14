"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Bot, Zap, MessageSquare, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";

const pillars = [
  {
    icon: Bot,
    title: "Bot Discord",
    text: "Moderazione, economia, ticket e integrazioni stabili 24/7.",
  },
  {
    icon: Code2,
    title: "Software & Web",
    text: "Applicazioni custom, gestionali e tool su misura.",
  },
  {
    icon: Zap,
    title: "Automazioni",
    text: "API, webhook e script che tolgono lavoro ripetitivo.",
  },
];

export default function ChiSiamoPage() {
  return (
    <div className="pb-20">
      <PageHero
        align="center"
        eyebrow="Studio"
        title="Chi siamo"
        description="Gaming Relax è uno studio di programmazione italiano. Progettiamo e sviluppiamo software, bot Discord e automazioni pensate per funzionare nel mondo reale."
      />

      <div className="page-shell py-12 sm:py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {pillars.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="surface card-lift p-6 text-center"
            >
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                <item.icon className="h-6 w-6" />
              </span>
              <h2 className="font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="surface-glow mt-12 p-8 text-center sm:p-10"
        >
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-200">
            Lavoriamo con clienti e community che vogliono prodotti chiari, codice manutenibile
            e supporto dopo il rilascio. Niente slide inutili: dal brief al deploy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contatti"
              className="btn-press inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3 text-sm font-semibold text-white"
            >
              <MessageSquare className="h-4 w-4" />
              Parliamone
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-violet-400/40 hover:bg-violet-500/10"
            >
              Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
