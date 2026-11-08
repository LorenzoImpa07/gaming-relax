"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Megaphone } from "lucide-react";
import { db } from "@/lib/firebase";

type News = {
  id: string;
  title: string;
  date: string;
  text: string;
  image?: string;
};

export default function NovitaDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [item, setItem] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "site_news", id));
        if (cancelled) return;
        if (!snap.exists()) {
          setNotFound(true);
          setItem(null);
        } else {
          setItem({ id: snap.id, ...snap.data() } as News);
          setNotFound(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="px-4 py-24 text-center text-sm text-zinc-500">Caricamento...</p>;
  }

  if (notFound || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-zinc-400">Annuncio non trovato.</p>
        <Link href="/novita" className="mt-4 inline-block text-violet-400 hover:underline">
          Torna alle novità
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/novita"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Tutte le novità
      </Link>

      {item.image ? (
        <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="max-h-[28rem] w-full object-cover" />
        </div>
      ) : (
        <div className="mb-8 flex h-40 items-center justify-center rounded-2xl border border-zinc-800 bg-violet-500/10 text-violet-400">
          <Megaphone className="h-10 w-10" />
        </div>
      )}

      <p className="text-sm text-zinc-500">{item.date}</p>
      <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{item.title}</h1>
      <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-zinc-300">
        {item.text}
      </div>
    </article>
  );
}
