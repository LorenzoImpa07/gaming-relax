"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  collection, doc, getDoc, getDocs, addDoc, query, where,
  serverTimestamp, updateDoc, deleteDoc, increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import type { ForumChannel, ForumThread, ForumPost, ForumThreadTag } from "@/lib/forum";
import type { SiteRole } from "@/lib/roles";
import { can, parsePermissions } from "@/lib/roles";
import { AuthorChip } from "@/components/forum/AuthorChip";
import { ThreadStatusBadge } from "@/components/forum/ThreadStatusBadge";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

function toMillis(v: unknown): number {
  if (!v) return 0;
  if (typeof v === "object" && v !== null && "toMillis" in v) {
    try { return (v as { toMillis: () => number }).toMillis(); } catch { return 0; }
  }
  if (typeof v === "object" && v !== null && "seconds" in v) {
    return Number((v as { seconds: number }).seconds) * 1000;
  }
  return 0;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
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
  const [allRoles, setAllRoles] = useState<SiteRole[]>([]);
  const [threadTags, setThreadTags] = useState<ForumThreadTag[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  const isGlobalAdmin = isAdminEmail(user?.email);
  const canWriteStaff = can(allRoles, user?.email, "writeStaffChannels", isGlobalAdmin);
  const canPost = !!user && (!channel?.staffOnly || canWriteStaff || isGlobalAdmin);
  const canDeleteMsg = can(allRoles, user?.email, "deleteMessage", isGlobalAdmin);
  const canEditMsg = can(allRoles, user?.email, "editMessage", isGlobalAdmin);
  const canDeleteThr = can(allRoles, user?.email, "deleteThread", isGlobalAdmin);
  const canSetTag =
    isGlobalAdmin ||
    can(allRoles, user?.email, "editThread", false) ||
    can(allRoles, user?.email, "writeStaffChannels", false) ||
    can(allRoles, user?.email, "manageForum", false);

  const load = async () => {
    setLoading(true);
    setError("");
    setAccessDenied(false);
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
      try {
        const tagSnap = await getDocs(collection(db, "forum_thread_tags"));
        const tags = tagSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumThreadTag));
        tags.sort((a, b) => (a.order || 0) - (b.order || 0));
        setThreadTags(tags);
      } catch {}

      const [chDoc, thDoc] = await Promise.all([
        getDoc(doc(db, "forum_channels", channelId)),
        getDoc(doc(db, "forum_threads", threadId)),
      ]);
      const ch = chDoc.exists() ? ({ id: chDoc.id, ...chDoc.data() } as ForumChannel) : null;
      setChannel(ch);

      if (!thDoc.exists()) {
        setThread(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      const thr = { id: thDoc.id, ...thDoc.data() } as ForumThread;
      const isPrivate = !!ch?.privateReply || !!thr.privateReply;
      if (isPrivate) {
        const isAuthor = !!user?.uid && thr.authorId === user.uid;
        const staffOk =
          isGlobalAdmin || can(roles, user?.email, "readPrivateThreads", isGlobalAdmin);
        if (!isAuthor && !staffOk) {
          setAccessDenied(true);
          setThread(null);
          setPosts([]);
          setLoading(false);
          return;
        }
      }
      setThread(thr);

      try {
        const pSnap = await getDocs(query(collection(db, "forum_posts"), where("threadId", "==", threadId)));
        const list = pSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ForumPost));
        list.sort((a, b) => toMillis(a.createdAt) - toMillis(b.createdAt));
        setPosts(list);
      } catch { setPosts([]); }
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
  }, [channelId, threadId, user?.uid]);

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canPost || !reply.trim()) return;
    setSaving(true); setError("");
    try {
      await addDoc(collection(db, "forum_posts"), {
        threadId, channelId, content: reply.trim(),
        authorId: user.uid,
        authorName: user.displayName || user.email || "Utente",
        authorEmail: user.email || "",
        createdAt: serverTimestamp(),
      });
      try {
        await updateDoc(doc(db, "forum_threads", threadId), { replyCount: increment(1), lastActivity: serverTimestamp() });
        await updateDoc(doc(db, "forum_channels", channelId), { messageCount: increment(1) });
      } catch {}
      setReply("");
      await load();
    } catch { setError("Errore invio messaggio."); }
    finally { setSaving(false); }
  };

  const removePost = async (post: ForumPost) => {
    const isOwn = user && post.authorId === user.uid;
    if (!isOwn && !canDeleteMsg) return;
    if (!confirm("Eliminare questo messaggio?")) return;
    try { await deleteDoc(doc(db, "forum_posts", post.id)); await load(); }
    catch { setError("Impossibile eliminare il messaggio."); }
  };

  const saveEditPost = async (postId: string) => {
    if (!editText.trim()) return;
    try {
      await updateDoc(doc(db, "forum_posts", postId), { content: editText.trim(), editedAt: serverTimestamp() });
      setEditingId(null); setEditText(""); await load();
    } catch { setError("Impossibile modificare il messaggio."); }
  };

  const removeThread = async () => {
    if (!canDeleteThr) return;
    if (!confirm("Eliminare tutta la discussione e i messaggi?")) return;
    try {
      const pSnap = await getDocs(query(collection(db, "forum_posts"), where("threadId", "==", threadId)));
      await Promise.all(pSnap.docs.map((d) => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "forum_threads", threadId));
      router.push(`/forum/${encodeURIComponent(channelId)}`);
    } catch { setError("Impossibile eliminare la discussione."); }
  };

  const applyTag = async (tg: ForumThreadTag | null) => {
    if (!canSetTag) return;
    try {
      await updateDoc(doc(db, "forum_threads", threadId), {
        statusTagId: tg?.id || null,
        statusTagName: tg?.name || null,
        statusTagColor: tg?.color || null,
      });
      await load();
    } catch { setError("Impossibile aggiornare il tag."); }
  };

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-zinc-500">Caricamento...</div>;

  if (accessDenied) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-white">Discussione privata</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Questa discussione ha risposta privata. Solo l'autore e lo staff con permesso
          dedicato possono leggerla.
        </p>
        <Link
          href={`/forum/${encodeURIComponent(channelId)}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-violet-300 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna al canale
        </Link>
      </div>
    );
  }

  if (!thread) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-400">
      Discussione non trovata.{" "}
      <Link href={`/forum/${encodeURIComponent(channelId)}`} className="text-violet-400">Torna al canale</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/forum/${encodeURIComponent(channelId)}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />{channel?.name || "Canale"}
        </Link>
        {canDeleteThr && (
          <button type="button" onClick={removeThread} className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300">
            <Trash2 className="h-3.5 w-3.5" />Elimina discussione
          </button>
        )}
      </div>

      <h1 className="mb-2 flex flex-wrap items-center gap-2 text-2xl font-bold text-white">
        <ThreadStatusBadge name={thread.statusTagName} color={thread.statusTagColor} />
        <span>{thread.title}</span>
      </h1>

      {(channel?.privateReply || thread.privateReply) && (
        <p className="mb-4 text-xs text-violet-300">Discussione a risposta privata</p>
      )}

      {canSetTag && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Tag staff:</span>
          <button type="button" onClick={() => applyTag(null)} className={`rounded-full border px-2.5 py-1 text-[11px] ${!thread.statusTagId ? "border-violet-500 text-violet-300" : "border-zinc-700 text-zinc-400"}`}>Nessuno</button>
          {threadTags.map((tg) => (
            <button
              key={tg.id}
              type="button"
              onClick={() => applyTag(tg)}
              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${thread.statusTagId === tg.id ? "ring-2 ring-white/40" : ""}`}
              style={{
                backgroundColor: tg.color,
                color: tg.color?.toLowerCase() === "#facc15" || tg.color?.toLowerCase() === "#fbbf24" ? "#18181b" : "#fff",
              }}
            >
              {tg.name}
            </button>
          ))}
        </div>
      )}

      <div className="mb-8">
        <AuthorChip authorId={thread.authorId} authorName={thread.authorName} authorEmail={thread.authorEmail} allRoles={allRoles} />
      </div>

      <div className="mb-10 space-y-4">
        {posts.length === 0 && <p className="text-sm text-zinc-500">Nessun messaggio in questa discussione.</p>}
        {posts.map((p) => {
          const isOwn = !!user && p.authorId === user.uid;
          const showDelete = isOwn || canDeleteMsg;
          const showEdit = isOwn || canEditMsg;
          return (
            <article key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <AuthorChip authorId={p.authorId} authorName={p.authorName} authorEmail={p.authorEmail} allRoles={allRoles} />
                <div className="flex gap-1">
                  {showEdit && (
                    <button type="button" onClick={() => { setEditingId(p.id); setEditText(p.content); }} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-violet-300" title="Modifica">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {showDelete && (
                    <button type="button" onClick={() => removePost(p)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400" title="Elimina">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {editingId === p.id ? (
                <div className="space-y-2">
                  <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => saveEditPost(p.id)} className="rounded-full bg-violet-600 px-3 py-1 text-xs text-white">Salva</button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-zinc-600 px-3 py-1 text-xs text-zinc-300">Annulla</button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{p.content}</p>
              )}
            </article>
          );
        })}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {canPost ? (
        <form onSubmit={sendReply} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <textarea required placeholder="Scrivi una risposta..." value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white" />
          <button type="submit" disabled={saving} className="rounded-full bg-violet-600 px-5 py-2 text-sm text-white disabled:opacity-50">{saving ? "Invio..." : "Rispondi"}</button>
        </form>
      ) : !user ? (
        <p className="text-sm text-zinc-500">
          <Link href={`/login?next=/forum/${encodeURIComponent(channelId)}/${threadId}`} className="text-violet-400 hover:underline">Accedi</Link>{" "}per rispondere.
        </p>
      ) : (
        <p className="text-sm text-amber-400">Solo lo staff può scrivere in questo canale.</p>
      )}
    </div>
  );
}
