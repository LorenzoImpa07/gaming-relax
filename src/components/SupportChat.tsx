"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  generateSupportReply,
  suggestionsForPath,
  welcomeForPath,
} from "@/lib/supportBrain";

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
  links?: { label: string; href: string }[];
};

function shouldHide(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  return HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function SupportChat() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [qa, setQa] = useState<QA[]>([]);
  const [botEnabled, setBotEnabled] = useState(true);
  const [typing, setTyping] = useState(false);
  const [ready, setReady] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openedForPath = useRef<string>("");

  const hide = shouldHide(pathname);
  const suggestions = useMemo(() => suggestionsForPath(pathname), [pathname]);
  const welcome = useMemo(() => welcomeForPath(pathname), [pathname]);

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
        }
        setQa(
          qaSnap.docs.map((docSnap) => {
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
          })
        );
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
      if (prev.length > 0 && openedForPath.current === pathname) return prev;
      openedForPath.current = pathname;
      return [{ id: `welcome-${pathname}`, role: "bot", text: welcome }];
    });
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open, welcome, pathname]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, typing]);

  const replyTo = useCallback(
    (text: string) => {
      if (!text.trim() || typing) return;
      const userMsg: Msg = {
        id: `u-${Date.now()}`,
        role: "user",
        text: text.trim(),
      };
      setMsgs((m) => [...m, userMsg]);
      setInput("");
      setTyping(true);

      const resolved = generateSupportReply(text, {
        pathname,
        customQa: qa,
      });
      const delay = 350 + Math.min(800, resolved.text.length * 2.5);

      setTimeout(() => {
        setMsgs((m) => [
          ...m,
          {
            id: `b-${Date.now()}`,
            role: "bot",
            text: resolved.text,
            links: resolved.links,
          },
        ]);
        setTyping(false);
      }, delay);
    },
    [typing, qa, pathname]
  );

  const send = useCallback(() => {
    replyTo(input);
  }, [input, replyTo]);

  if (hide || !botEnabled || !ready) return null;

  const showSuggestions = msgs.length <= 1 && !typing;

  return (
    <div className="fixed bottom-5 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="flex h-[min(540px,72vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a12]/98 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-violet-600/25 via-fuchsia-600/15 to-transparent px-4 py-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a12] bg-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Assistente GR</p>
              <p className="flex items-center gap-1 text-[11px] text-violet-200/80">
                <Sparkles className="h-3 w-3" />
                Autonomo · contesto sito · 24/7
              </p>
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
                      : "rounded-bl-md border border-white/10 bg-zinc-900/90 text-zinc-200"
                  )}
                >
                  <span className="whitespace-pre-wrap">{m.text}</span>
                  {m.role === "bot" && m.links && m.links.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-medium text-violet-200 transition hover:bg-violet-500/25"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600/30 text-violet-300">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900/90 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => replyTo(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-violet-100"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-white/10 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Scrivi in linguaggio naturale…"
                className="flex-1 rounded-full border border-zinc-700 bg-zinc-950/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 disabled:opacity-40"
                aria-label="Invia"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-zinc-600">
              Risposte automatiche dal contesto del sito · non sostituisce lo staff
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition",
          open
            ? "bg-zinc-800 text-white hover:bg-zinc-700"
            : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-violet-500/40 hover:scale-105"
        )}
        aria-label={open ? "Chiudi assistente" : "Apri assistente"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
