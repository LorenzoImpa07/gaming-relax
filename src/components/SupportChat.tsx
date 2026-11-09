"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

/** Pagine Link utili dove NON mostrare la chat (Chi siamo esclusa = sì chat) */
const HIDDEN_PATHS = ["/faq", "/termini", "/privacy", "/cookie"];

type QA = {
  id: string;
  keywords: string[];
  answer: string;
  enabled: boolean;
};

type Msg = {
  id: string;
  role: "bot" | "user";
  text: string;
};

const DEFAULT_WELCOME =
  "Ciao! Sono l’assistente automatico di Gaming Relax. Scrivi pure la tua domanda (prezzi, tempi, bot Discord, siti web…) e ti rispondo subito.";
const DEFAULT_FALLBACK =
  "Non ho trovato una risposta precisa. Puoi contattarci dalla pagina Contatti oppure scriverci a supportogamingrelax@gmail.com — ti rispondiamo entro 24h.";

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchAnswer(input: string, items: QA[]): string | null {
  const n = normalize(input);
  if (!n) return null;

  let best: { score: number; answer: string } | null = null;

  for (const item of items) {
    if (!item.enabled || !item.keywords?.length) continue;
    let score = 0;
    for (const kw of item.keywords) {
      const k = normalize(kw);
      if (!k) continue;
      if (n === k) score += 10;
      else if (n.includes(k)) score += k.length >= 4 ? 5 : 3;
      else if (k.includes(n) && n.length >= 4) score += 2;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: item.answer };
    }
  }

  return best?.answer ?? null;
}

function shouldHide(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  return HIDDEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function SupportChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [qa, setQa] = useState<QA[]>([]);
  const [welcome, setWelcome] = useState(DEFAULT_WELCOME);
  const [fallback, setFallback] = useState(DEFAULT_FALLBACK);
  const [botEnabled, setBotEnabled] = useState(true);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hide = shouldHide(pathname || "/");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [settingsSnap, qaSnap] = await Promise.all([
          getDoc(doc(db, "site_settings", "support_bot")),
          getDocs(query(collection(db, "support_qa"), orderBy("order", "asc"))),
        ]);

        if (cancelled) return;

        if (settingsSnap.exists()) {
          const d = settingsSnap.data();
          if (typeof d.enabled === "boolean") setBotEnabled(d.enabled);
          if (d.welcome) setWelcome(String(d.welcome));
          if (d.fallback) setFallback(String(d.fallback));
        }

        const rows: QA[] = qaSnap.docs.map((docSnap) => {
          const d = docSnap.data();
          const keywords = Array.isArray(d.keywords)
            ? d.keywords.map((k: unknown) => String(k))
            : String(d.keywords || "")
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean);
          return {
            id: docSnap.id,
            keywords,
            answer: String(d.answer || ""),
            enabled: d.enabled !== false,
          };
        });
        setQa(rows);
      } catch (e) {
        console.error("SupportChat load:", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setMsgs((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: "welcome",
          role: "bot",
          text: welcome,
        },
      ];
    });
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open, welcome]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, typing]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || typing) return;

    const userMsg: Msg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const answer = matchAnswer(text, qa) || fallback;

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: answer,
        },
      ]);
      setTyping(false);
    }, 450 + Math.min(800, answer.length * 4));
  }, [input, typing, qa, fallback]);

  if (hide || !botEnabled || !ready) return null;

  return (
    <div className="fixed bottom-5 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex h-[min(520px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c14]/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Assistente GR</p>
              <p className="text-[11px] text-violet-200/70">Risposte automatiche · 24/7</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Chiudi chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {m.role === "bot" && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-violet-300">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-bl-md border border-white/10 bg-zinc-900/80 text-zinc-200"
                  )}
                >
                  {m.text}
                  {m.role === "bot" && m.text === fallback && (
                    <p className="mt-2">
                      <Link
                        href="/contatti"
                        className="font-medium text-violet-300 underline-offset-2 hover:underline"
                      >
                        Vai a Contatti →
                      </Link>
                    </p>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-zinc-300">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-violet-300">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900/80 px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/80 px-2 py-1.5 focus-within:border-violet-500/50">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Scrivi la tua domanda…"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-40"
                aria-label="Invia"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-zinc-600">
              Risposte automatiche · non sostituisce il supporto umano
            </p>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105",
          open
            ? "bg-zinc-800 text-white border border-white/15"
            : "bg-violet-600 text-white shadow-violet-500/40 hover:bg-violet-500"
        )}
        aria-label={open ? "Chiudi assistente" : "Apri assistente"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
