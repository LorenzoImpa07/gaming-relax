"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type News = {
  id: string;
  title: string;
  date: string;
  text: string;
  image?: string;
};

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
    const unsub = onSnapshot(
      collection(db, "site_news"),
      (snap) => {
        if (snap.empty) return;
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as News));
        setNews(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Novità & aggiornamenti</h1>
        <p className="mt-4 text-zinc-400">
          Annunci, nuovi servizi e aggiornamenti dello staff. Clicca per i dettagli.
        </p>
      </motion.div>

      <div className="space-y-4">
        {news.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={`/novita/${item.id}`}
              className="group flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-violet-500/40 hover:bg-zinc-900/70 sm:p-5"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 sm:h-24 sm:w-24">
                  <Megaphone className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-zinc-500">{item.date}</p>
                <h2 className="mt-1 text-lg font-semibold text-white group-hover:text-violet-200">
                  {item.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400">{item.text}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-400">
                  Leggi di più
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
