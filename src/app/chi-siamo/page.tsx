"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Bot, Zap, MessageSquare } from "lucide-react";

export default function ChiSiamoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl text-glow">Chi siamo</h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Gaming Relax è uno studio di programmazione italiano. Progettiamo e sviluppiamo software,
          bot Discord e automazioni pensate per funzionare nel mondo reale.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
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
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center"
          >
            <item.icon className="mx-auto mb-3 h-7 w-7 text-violet-400" />
            <h2 className="font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center"
      >
        <p className="leading-relaxed text-zinc-300">
          Lavoriamo con clienti e community che vogliono prodotti chiari, codice manutenibile e
          supporto dopo il rilascio. Niente slide inutili: dal brief al deploy.
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white btn-glow"
        >
          <MessageSquare className="h-4 w-4" />
          Parliamone
        </Link>
      </motion.div>
    </div>
  );
}
