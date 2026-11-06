"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Message = {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  read?: boolean;
  createdAt?: Timestamp;
};

export default function AdminMessaggiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    await updateDoc(doc(db, "messages", id), { read: true });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminare questo messaggio?")) return;
    await deleteDoc(doc(db, "messages", id));
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) return <p className="text-zinc-500 text-sm">Caricamento...</p>;
  if (messages.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        Nessun messaggio. I contatti dal form vengono salvati in Firestore (collection messages).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border p-5 ${
            m.read ? "border-zinc-800 bg-zinc-900/30" : "border-violet-500/30 bg-violet-500/5"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
            <div>
              <p className="font-medium text-white">{m.name || "Senza nome"}</p>
              <p className="text-sm text-zinc-400">{m.email}</p>
            </div>
            {!m.read && <span className="text-xs text-violet-300 self-start">Nuovo</span>}
          </div>
          {m.subject && <p className="text-sm text-zinc-300 mb-1">{m.subject}</p>}
          <p className="text-sm text-zinc-400 whitespace-pre-wrap mb-4">{m.message}</p>
          <div className="flex gap-2">
            {!m.read && (
              <button onClick={() => markRead(m.id)} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:border-violet-500">
                Segna come letto
              </button>
            )}
            <button onClick={() => remove(m.id)} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-red-400 hover:border-red-500">
              Elimina
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
