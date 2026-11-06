"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  collection, doc, getDoc, getDocs, addDoc, query, where, orderBy,
  serverTimestamp, updateDoc, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import type { ForumChannel, ForumThread } from "@/lib/forum";
import { ArrowLeft, Plus } from "lucide-react";

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const { user } = useAuth();
  const router = useRouter();
  const [channel, setChannel] = useState<ForumChannel | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isStaff = isAdminEmail(user?.email);
  const canPost = !!user && (!channel?.staffOnly || isStaff);

  const load = async () => {
    setLoading(true);
    try {
      const chDoc = await getDoc(doc(db, "forum_channels", channelId));
      if (!chDoc.exists()) { setChannel(null); setLoading(false); return; }
      const ch = { id: chDoc.id, ...chDoc.data() } as ForumChannel;
      setChannel(ch);
      if (ch.type === "link" && ch.externalUrl) {
        window.location.href = ch.externalUrl;
        return;
      }
      const tSnap = await getDocs(query(collection(db, "forum_threads"), where("channelId", "==", channelId), orderBy("createdAt", "desc")));
      setThreads(tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumThread)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [channelId]);

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canPost) return;
    setError(""); setSaving(true);
    try {
      const threadRef = await addDoc(collection(db, "forum_threads"), {
        channelId, title: title.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || "Utente",
        authorEmail: user.email,
        replyCount: 0, createdAt: serverTimestamp(), lastActivity: serverTimestamp(),
      });
      await addDoc(collection(db, "forum_posts"), {
        threadId: threadRef.id, channelId, content: body.trim(),
        authorId: user.uid, authorName: user.displayName || user.email || "Utente",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "forum_channels", channelId), {
        threadCount: increment(1), messageCount: increment(1),
      });
      setTitle(""); setBody(""); setShowNew(false);
      router.push(`/forum/${channelId}/${threadRef.id}`);
    } catch (err) {
      console.error(err);
      setError("Errore creazione discussione.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16 text-zinc-500 text-sm">Caricamento...</div>;
  if (!channel) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-zinc-400">Canale non trovato.</p>
      <Link href="/forum" className="mt-4 inline-block text-violet-400 hover:underline">\u2190 Torna al forum</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/forum" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Forum
      </Link>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{channel.icon || "\ud83d\udcac"}</span>{channel.name}
          </h1>
          {channel.description && <p className="mt-2 text-sm text-zinc-400">{channel.description}</p>}
          {channel.staffOnly && <p className="mt-2 text-xs text-amber-400">Solo lo staff pu\u00f2 scrivere qui.</p>}
        </div>
        {canPost ? (
          <button onClick={() => setShowNew((v) => !v)} className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white">
            <Plus className="h-4 w-4" /> Nuova discussione
          </button>
        ) : !user ? (
          <Link href={`/login?next=/forum/${channelId}`} className="text-sm text-violet-400 hover:underline">Accedi per scrivere</Link>
        ) : null}
      </div>

      {showNew && canPost && (
        <form onSubmit={createThread} className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
          <input required placeholder="Titolo discussione" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white" />
          <textarea required placeholder="Messaggio iniziale..." value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">{saving ? "Pubblicazione..." : "Pubblica"}</button>
        </form>
      )}

      {threads.length === 0 ? (
        <p className="text-sm text-zinc-500">Nessuna discussione ancora.</p>
      ) : (
        <ul className="space-y-2">
          {threads.map((t) => (
            <li key={t.id}>
              <Link href={`/forum/${channelId}/${t.id}`} className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 hover:border-violet-500/40">
                <p className="font-medium text-white">{t.title}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.authorName} \u00b7 {t.replyCount ?? 0} risposte</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
