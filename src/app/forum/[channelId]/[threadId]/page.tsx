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
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import type { ForumChannel, ForumThread, ForumPost } from "@/lib/forum";
import { ArrowLeft } from "lucide-react";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (typeof v === "object" && v !== null && "toMillis" in v) {
    try {
      return (v as { toMillis: () => number }).toMillis();
    } catch {
      return 0;
    }
  }
  if (typeof v === "object" && v !== null && "seconds" in v) {
    return Number((v as { seconds: number }).seconds) * 1000;
  }
  return 0;
}

export default function ThreadPage() {
  const params = useParams();
  const channelId = decodeURIComponent(String(params.channelId || ""));
  const threadId = decodeURIComponent(String(params.threadId || ""));
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
    setError("");
    try {
      const [chDoc, thDoc] = await Promise.all([
        getDoc(doc(db, "forum_channels", channelId)),
        getDoc(doc(db, "forum_threads", threadId)),
      ]);

      if (chDoc.exists()) setChannel({ id: chDoc.id, ...chDoc.data() } as ForumChannel);
      else setChannel(null);

      if (thDoc.exists()) {
        setThread({ id: thDoc.id, ...thDoc.data() } as ForumThread);
      } else {
        setThread(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        const pSnap = await getDocs(
          query(collection(db, "forum_posts"), where("threadId", "==", threadId))
        );
        const list = pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumPost));
        list.sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt));
        setPosts(list);
      } catch (pe) {
        console.error("posts query", pe);
        setPosts([]);
      }
    } catch (e) {
      console.error(e);
      setError("Errore nel caricamento della discussione.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId && threadId) load();
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
      try {
        await updateDoc(doc(db, "forum_threads", threadId), {
          replyCount: increment(1),
          lastActivity: serverTimestamp(),
        });
        await updateDoc(doc(db, "forum_channels", channelId), {
          messageCount: increment(1),
        });
      } catch {
        /* contatori non critici */
      }
      setReply("");
      await load();
    } catch (err) {
      console.error(err);
      setError("Errore invio messaggio. Verifica di essere loggato.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-zinc-500">Caricamento...</div>
    );
  }

  if (!thread) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">
        Discussione non trovata.{" "}
        <Link href={`/forum/${encodeURIComponent(channelId)}`} className="text-violet-400">
          Torna al canale
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href={`/forum/${encodeURIComponent(channelId)}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {channel?.name || "Canale"}
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">{thread.title}</h1>
      <p className="mb-8 text-xs text-zinc-500">di {thread.authorName}</p>

      <div className="mb-10 space-y-4">
        {posts.length === 0 && (
          <p className="text-sm text-zinc-500">Nessun messaggio in questa discussione.</p>
        )}
        {posts.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <p className="mb-2 text-xs text-zinc-500">{p.authorName}</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{p.content}</p>
          </article>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {canPost ? (
        <form
          onSubmit={sendReply}
          className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
        >
          <textarea
            required
            placeholder="Scrivi una risposta..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {saving ? "Invio..." : "Rispondi"}
          </button>
        </form>
      ) : !user ? (
        <p className="text-sm text-zinc-500">
          <Link
            href={`/login?next=/forum/${encodeURIComponent(channelId)}/${threadId}`}
            className="text-violet-400 hover:underline"
          >
            Accedi
          </Link>{" "}
          per rispondere.
        </p>
      ) : (
        <p className="text-sm text-amber-400">Solo lo staff può scrivere in questo canale.</p>
      )}
    </div>
  );
}
