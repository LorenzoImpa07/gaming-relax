"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import type { ForumChannel, ForumThread } from "@/lib/forum";
import type { SiteRole } from "@/lib/roles";
import { can, parsePermissions } from "@/lib/roles";
import { ArrowLeft, Plus, MessageSquare } from "lucide-react";
import { ThreadStatusBadge } from "@/components/forum/ThreadStatusBadge";

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

export default function ChannelPage() {
  const params = useParams();
  const channelId = decodeURIComponent(String(params.channelId || ""));
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
  const [allRoles, setAllRoles] = useState<SiteRole[]>([]);

  const isGlobalAdmin = isAdminEmail(user?.email);
  const canWriteStaff = can(allRoles, user?.email, "writeStaffChannels", isGlobalAdmin);
  const canPost = !!user && (!channel?.staffOnly || canWriteStaff || isGlobalAdmin);

  const load = async () => {
    setLoading(true);
    try {
      let roles: SiteRole[] = [];
      try {
        const rolesSnap = await getDocs(collection(db, "site_roles"));
        roles = rolesSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: String(data.name || ""),
            color: String(data.color || "#a78bfa"),
            emails: Array.isArray(data.emails) ? data.emails.map(String) : [],
            order: Number(data.order) || 0,
            permissions: parsePermissions(data.permissions),
          } as SiteRole;
        });
        setAllRoles(roles);
      } catch {}

      const chDoc = await getDoc(doc(db, "forum_channels", channelId));
      if (!chDoc.exists()) {
        setChannel(null);
        setThreads([]);
        setLoading(false);
        return;
      }
      const ch = { id: chDoc.id, ...chDoc.data() } as ForumChannel;
      setChannel(ch);

      if (ch.type === "link" && ch.externalUrl) {
        window.location.href = ch.externalUrl;
        return;
      }

      const tSnap = await getDocs(
        query(collection(db, "forum_threads"), where("channelId", "==", channelId))
      );
      let list = tSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumThread));
      list.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

      if (ch.privateReply) {
        const uid = user?.uid;
        const allowStaff =
          isGlobalAdmin || can(roles, user?.email, "readPrivateThreads", isGlobalAdmin);
        list = list.filter((t) => allowStaff || (uid && t.authorId === uid));
      }

      setThreads(list);
    } catch (e) {
      console.error(e);
      setError("Impossibile caricare le discussioni.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, user?.uid]);

  const createThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canPost) return;
    setError("");
    setSaving(true);
    try {
      const threadRef = await addDoc(collection(db, "forum_threads"), {
        channelId,
        title: title.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || "Utente",
        authorEmail: user.email || "",
        replyCount: 0,
        privateReply: !!channel?.privateReply,
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
      });
      await addDoc(collection(db, "forum_posts"), {
        threadId: threadRef.id,
        channelId,
        content: body.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || "Utente",
        authorEmail: user.email || "",
        authorPhotoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      try {
        await updateDoc(doc(db, "forum_channels", channelId), {
          threadCount: increment(1),
          messageCount: increment(1),
        });
      } catch {}
      setTitle("");
      setBody("");
      setShowNew(false);
      await new Promise((r) => setTimeout(r, 300));
      router.push(`/forum/${encodeURIComponent(channelId)}/${threadRef.id}`);
    } catch (err) {
      console.error(err);
      setError("Errore creazione discussione.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-zinc-500">Caricamento...</div>
    );
  }

  if (!channel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">
        Canale non trovato.{" "}
        <Link href="/forum" className="text-violet-400 hover:underline">
          Torna al forum
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/forum" className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Forum
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{channel.name}</h1>
          {channel.description && (
            <p className="mt-1 text-sm text-zinc-400">{channel.description}</p>
          )}
        </div>
        {canPost && (
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Nuova discussione
          </button>
        )}
      </div>

      {showNew && canPost && (
        <form onSubmit={createThread} className="mb-8 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <input required placeholder="Titolo discussione" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white" />
          <textarea required placeholder="Primo messaggio..." value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">
              {saving ? "Creazione..." : "Pubblica"}
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-zinc-600 px-5 py-2 text-sm text-zinc-300">
              Annulla
            </button>
          </div>
        </form>
      )}

      {!user && (
        <p className="mb-6 text-sm text-zinc-500">
          <Link href={`/login?next=/forum/${channelId}`} className="text-violet-400 hover:underline">Accedi</Link>{" "}per aprire una discussione.
        </p>
      )}

      {error && !showNew && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="space-y-2">
        {threads.length === 0 && (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
            Nessuna discussione ancora. Sii il primo ad aprirne una!
          </p>
        )}
        {threads.map((t) => (
          <Link
            key={t.id}
            href={`/forum/${encodeURIComponent(channelId)}/${t.id}`}
            className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition hover:border-violet-500/40"
          >
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-medium text-white">
                <ThreadStatusBadge name={t.statusTagName} color={t.statusTagColor} />
                <span>{t.title}</span>
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {t.authorName}
                {typeof t.replyCount === "number" ? ` · ${t.replyCount} risposte` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
