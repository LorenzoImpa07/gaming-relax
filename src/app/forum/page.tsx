"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { ForumCategory, ForumChannel } from "@/lib/forum";

export default function ForumPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [channels, setChannels] = useState<ForumChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catSnap, chSnap] = await Promise.all([
          getDocs(query(collection(db, "forum_categories"), orderBy("order"))),
          getDocs(query(collection(db, "forum_channels"), orderBy("order"))),
        ]);
        setCategories(catSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumCategory)));
        setChannels(chSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumChannel)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="relative min-h-[70vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-violet-950/20 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Forum</h1>
            <p className="mt-2 text-zinc-400">Community, supporto, partner e candidature.</p>
          </div>
          {!user && (
            <p className="text-sm text-zinc-500">
              <Link href="/login?next=/forum" className="text-violet-400 hover:underline">Accedi</Link>{" "}
              per aprire discussioni e rispondere.
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-6">
            {loading && <p className="text-sm text-zinc-500">Caricamento forum...</p>}
            {!loading && categories.length === 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
                Nessuna categoria ancora. L&apos;admin pu\u00f2 crearle da Dashboard \u2192 Forum.
              </div>
            )}
            {categories.map((cat) => {
              const catChannels = channels.filter((c) => c.categoryId === cat.id);
              return (
                <motion.section
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 shadow-xl shadow-black/40"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/60 px-5 py-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <h2 className="font-semibold text-white">{cat.name}</h2>
                  </div>
                  {catChannels.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-zinc-600">Nessun canale in questa categoria.</p>
                  ) : (
                    <ul>
                      {catChannels.map((ch) => (
                        <li key={ch.id} className="border-b border-zinc-800/80 last:border-0">
                          {ch.type === "link" && ch.externalUrl ? (
                            <a href={ch.externalUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-zinc-900/80 sm:flex-row sm:items-center sm:justify-between">
                              <ChannelInfo channel={ch} />
                            </a>
                          ) : (
                            <Link href={`/forum/${ch.id}`} className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-zinc-900/80 sm:flex-row sm:items-center sm:justify-between">
                              <ChannelInfo channel={ch} />
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              );
            })}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Sei connesso</p>
              {user ? (
                <>
                  <p className="font-semibold text-white">{user.displayName || user.email}</p>
                  <p className="mt-1 text-sm text-zinc-500">Entra in una sezione per leggere o aprire una conversazione.</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-400">Non sei loggato.</p>
                  <Link href="/login?next=/forum" className="mt-3 inline-block text-sm text-violet-400 hover:underline">Accedi ora \u2192</Link>
                </>
              )}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Statistiche forum</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-zinc-500">Categorie</dt><dd className="text-white">{categories.length}</dd></div>
                <div className="flex justify-between"><dt className="text-zinc-500">Canali</dt><dd className="text-white">{channels.length}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ChannelInfo({ channel }: { channel: ForumChannel }) {
  return (
    <>
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-xl leading-none mt-0.5">{channel.icon || "\ud83d\udcac"}</span>
        <div className="min-w-0">
          <p className="font-medium text-white flex items-center gap-2">
            {channel.name}
            {channel.type === "link" && <span className="text-xs text-zinc-500">\u2197</span>}
            {channel.staffOnly && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">Solo staff</span>
            )}
          </p>
          {channel.description && (
            <p className="mt-0.5 text-sm text-zinc-500 line-clamp-2">{channel.description}</p>
          )}
        </div>
      </div>
      {channel.type === "discussion" && (
        <div className="shrink-0 text-right text-xs text-zinc-500 sm:pl-4">
          <p>{channel.threadCount ?? 0} Discussioni</p>
          <p>{channel.messageCount ?? 0} Messaggi</p>
        </div>
      )}
    </>
  );
}
