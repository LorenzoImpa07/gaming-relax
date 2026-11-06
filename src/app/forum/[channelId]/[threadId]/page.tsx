"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import type { ForumChannel, ForumPost, ForumThread } from "@/lib/forum";
import { ArrowLeft } from "lucide-react";

export default function ThreadPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const threadId = params.threadId as string;
  const { user } = useAuth();
  const [channel, setChannel] = useState<ForumChannel | null>(null);
  const [thread, setThread] = useState<ForumThread | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isStaff = isAdminEmail(user?.email);
  const canPost = !!user && (!channel?.staffOnly || isStaff);

  const load = async () => {
    setLoading(true);
    try {
      const [chDoc, thDoc, pSnap] = await Promise.all([
        getDoc(doc(db, "forum_channels", channelId)),
        getDoc(doc(db, "forum_threads", threadId)),
        getDocs(query(collection(db, "forum_posts"), where("threadId", "==", threadId), orderBy("createdAt", "asc"))),
      ]);
      if (chDoc.exists()) setChannel({ id: chDoc.id, ...chDoc.data() } as ForumChannel);
      if (thDoc.exists()) setThread({ id: thDoc.id, ...thDoc.data() } as ForumThread);
      setPosts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumPost)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, threadId]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canPost || !reply.trim()) return;
    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "forum_posts"), {
        threadId,
        channelId,
        content: reply.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || "Utente",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "forum_threads", threadId), {
        replyCount: increment(1),
        lastActivity: serverTimestamp(),
      });
      await updateDoc(doc(db, "forum_channels", channelId), {
        messageCount: increment(1),
      });
      setReply("");
      load();
    } catch (err) {
      console.error(err);
      setError("Errore invio messaggio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-zinc-500">Caricamento...</div>;
  }

  if (!thread) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">
        Discussione non trovata.{" "}
        <Link href={`/forum/${channelId}`} className="text-violet-400">Torna al canale</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href={`/forum/${channelId}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        {channel?.name || "Canale"}
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">{thread.title}</h1>
      <div className="space-y-4 mb-10">
        {posts.map((p) => (
          <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs text-zinc-500 mb-2">{p.authorName}</p>
            <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{p.content}</p>
          </article>
        ))}
      </div>
      {canPost ? (
        <form onSubmit={sendReply} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <textarea required placeholder="Scrivi una risposta..." value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">{saving ? "Invio..." : "Rispondi"}</button>
        </form>
      ) : !user ? (
        <p className="text-sm text-zinc-500">
          <Link href={`/login?next=/forum/${channelId}/${threadId}`} className="text-violet-400 hover:underline">Accedi</Link> per rispondere.
        </p>
      ) : (
        <p className="text-sm text-amber-400">Solo lo staff pu\u00f2 scrivere in questo canale.</p>
      )}
    </div>
  );
}
