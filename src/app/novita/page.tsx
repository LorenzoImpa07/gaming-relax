"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type News = { id: string; title: string; date: string; text: string };

const fallback: News[] = [
  {
    id: "1",
    title: "Nuovi pacchetti Bot Discord Pro",
    date: "Novembre 2026",
    text: "Abbiamo aggiornato il piano Pro con dashboard web e ticket system migliorato.",
  },
];

export default function NovitaPage() {
  const [news, setNews] = useState<News[]>(fallback);

  useEffect(() => {
    getDocs(collection(db, "site_news"))
      .then((snap) => {
        if (!snap.empty) {
          setNews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as News)));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Novità & aggiornamenti</h1>
        <p className="mt-4 text-zinc-400">Annunci, nuovi servizi e aggiornamenti dello staff.</p>
      </motion.div>

      <div className="space-y-4">
        {news.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">{item.date}</p>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
