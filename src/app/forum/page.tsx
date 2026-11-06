"use client";

import { motion } from "framer-motion";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";

export default function ForumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
          <MessagesSquare className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Forum</h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Il forum della community sarà disponibile a breve.
          Nel frattempo unisciti al nostro Discord per discussioni, supporto e aggiornamenti.
        </p>
        <Link
          href="/contatti"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Contattaci
        </Link>
      </motion.div>
    </div>
  );
}
