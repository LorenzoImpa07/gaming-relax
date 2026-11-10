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
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

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

/** Knowledge base integrata — risponde senza Q&A da dashboard */
const BUILTIN: {
  id: string;
  keywords: string[];
  answer: string;
  links?: { label: string; href: string }[];
}[] = [
  {
    id: "saluto",
    keywords: [
      "ciao",
      "salve",
      "buongiorno",
      "buonasera",
      "hey",
      "hola",
      "hi",
      "hello",
      "ehi",
    ],
    answer:
      "Ciao! Sono l’assistente di Gaming Relax. Posso aiutarti su siti web, app, bot Discord, prezzi orientativi, tempi di consegna e come ordinare. Dimmi pure cosa ti serve.",
    links: [
      { label: "Catalogo Custom", href: "/custom" },
      { label: "Store bot", href: "/store" },
    ],
  },
  {
    id: "chi-siamo",
    keywords: [
      "chi siete",
      "chi sei",
      "team",
      "azienda",
      "studio",
      "gaming relax",
      "cosa fate",
      "di cosa vi occupate",
    ],
    answer:
      "Siamo Gaming Relax: uno studio che progetta e sviluppa siti web, applicazioni, bot Discord e automazioni. Lavoriamo in TypeScript end-to-end, con UI curata e consegna in produzione — non solo demo.",
    links: [
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Team", href: "/team" },
    ],
  },
  {
    id: "servizi",
    keywords: [
      "servizi",
      "cosa offrite",
      "offrite",
      "lavori",
      "prestazioni",
      "soluzioni",
    ],
    answer:
      "Offriamo quattro linee principali:\n• Siti & web app (landing, corporate, dashboard, SaaS)\n• Bot Discord (economia, ticket, ranking, pannelli)\n• Automazioni (API, webhook, pipeline)\n• Software custom su misura\n\nPuoi vedere i prodotti fatti da noi in Custom e i bot pronti nello Store.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Store", href: "/store" },
    ],
  },
  {
    id: "custom",
    keywords: [
      "custom",
      "su misura",
      "personalizzato",
      "applicazioni",
      "applicazione",
      "software",
      "gestionale",
      "dashboard",
      "saas",
    ],
    answer:
      "Nella sezione Custom trovi prodotti e pacchetti sviluppati da noi: applicazioni, siti, piani e abbonamenti con descrizioni e prezzi. Se ti serve qualcosa di specifico, puoi richiedere un progetto su misura dalla pagina Contatti.",
    links: [
      { label: "Vai a Custom", href: "/custom" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  {
    id: "sito-web",
    keywords: [
      "sito",
      "siti",
      "sito web",
      "website",
      "landing",
      "pagina web",
      "ecommerce",
      "e-commerce",
      "negozio online",
    ],
    answer:
      "Realizziamo siti web moderni (landing, corporate, e-commerce, web app) con stack aggiornato, SEO di base e attenzione a performance e mobile. Per vedere esempi e pacchetti apri Custom; per un preventivo usa Contatti.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Richiedi info", href: "/contatti" },
    ],
  },
  {
    id: "bot-discord",
    keywords: [
      "bot",
      "discord",
      "bot discord",
      "moderazione",
      "ticket",
      "economia",
      "ranking",
      "server discord",
    ],
    answer:
      "Sviluppiamo e vendiamo bot Discord: economia, ticket, ranking, pannelli moderatori e molto altro. Nello Store trovi i prodotti pronti; per un bot su misura puoi contattarci o guardare Custom.",
    links: [
      { label: "Store bot", href: "/store" },
      { label: "Custom", href: "/custom" },
    ],
  },
  {
    id: "prezzi",
    keywords: [
      "prezzo",
      "prezzi",
      "costo",
      "costi",
      "quanto costa",
      "preventivo",
      "tariffe",
      "listino",
      "budget",
      "euro",
      "pagamento",
    ],
    answer:
      "I prezzi dipendono da scope e complessità. Nello Store e in Custom trovi prezzi e piani già pubblicati. Per un progetto su misura inviamo un preventivo chiaro (scope, tempi, prezzo) dopo una breve chiacchierata — senza giri di parole.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Store", href: "/store" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  {
    id: "tempi",
    keywords: [
      "tempi",
      "tempo",
      "quanto tempo",
      "consegna",
      "scadenza",
      "settimane",
      "giorni",
      "durata",
      "quando e pronto",
      "deadline",
    ],
    answer:
      "I tempi variano con la complessità: un sito semplice o un bot standard può richiedere da pochi giorni a qualche settimana; progetti più grandi vengono suddivisi in milestone. Nel preventivo indichiamo sempre una stima realistica.",
    links: [{ label: "Contatti", href: "/contatti" }],
  },
  {
    id: "ordini",
    keywords: [
      "ordine",
      "ordini",
      "acquistare",
      "comprare",
      "carrello",
      "checkout",
      "come ordino",
      "come compro",
    ],
    answer:
      "Per i prodotti in Store o Custom: aggiungi al carrello e completa il checkout. Dopo l’ordine ricevi conferma e istruzioni. Per progetti su misura parti da Contatti: definiamo scope e poi procediamo con il pagamento concordato.",
    links: [
      { label: "Store", href: "/store" },
      { label: "Carrello", href: "/carrello" },
    ],
  },
  {
    id: "pagamenti",
    keywords: [
      "paga",
      "pagare",
      "metodi di pagamento",
      "carta",
      "paypal",
      "bonifico",
      "stripe",
    ],
    answer:
      "I metodi di pagamento disponibili sono quelli configurati in fase di checkout (indicati nella procedura d’acquisto). Se hai un problema con un pagamento già avviato, scrivici da Contatti o all’email di supporto con il riferimento ordine.",
    links: [{ label: "Contatti", href: "/contatti" }],
  },
  {
    id: "contatti",
    keywords: [
      "contatto",
      "contatti",
      "email",
      "mail",
      "supporto",
      "aiuto umano",
      "parlare con qualcuno",
      "assistenza",
      "scrivervi",
      "messaggio",
    ],
    answer:
      "Puoi scriverci dalla pagina Contatti oppure a supportogamingrelax@gmail.com. Di solito rispondiamo entro 24 ore lavorative. Per urgenze legate a un ordine, indica sempre il riferimento o l’email usata all’acquisto.",
    links: [{ label: "Vai a Contatti", href: "/contatti" }],
  },
  {
    id: "forum",
    keywords: ["forum", "community", "discussione", "canale", "thread"],
    answer:
      "Abbiamo un forum interno con categorie e canali (discussioni e link). Accedi dalla voce Forum nel menu: puoi leggere e, se sei registrato con i permessi giusti, aprire discussioni.",
    links: [{ label: "Apri forum", href: "/forum" }],
  },
  {
    id: "account",
    keywords: [
      "account",
      "registrazione",
      "registrarmi",
      "login",
      "accedere",
      "password",
      "profilo",
    ],
    answer:
      "Puoi creare un account dalla pagina di registrazione e accedere da Login. Dal profilo gestisci i tuoi dati. Se non ricordi la password, usa il recupero disponibile nella schermata di accesso (se attivo) oppure contattaci.",
    links: [
      { label: "Login", href: "/login" },
      { label: "Registrati", href: "/register" },
    ],
  },
  {
    id: "automazioni",
    keywords: [
      "automazione",
      "automazioni",
      "webhook",
      "api",
      "integrazione",
      "pipeline",
    ],
    answer:
      "Progettiamo automazioni e integrazioni API/webhook per ridurre lavoro ripetitivo e collegare i tuoi strumenti. Raccontaci il flusso che vuoi automatizzare e ti proponiamo un approccio chiaro.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  {
    id: "tecnologie",
    keywords: [
      "tecnologie",
      "stack",
      "typescript",
      "next",
      "react",
      "firebase",
      "linguaggio",
      "framework",
    ],
    answer:
      "Lavoriamo principalmente con TypeScript, Next.js, React, Node, Firebase e tool moderni di deploy (es. Vercel). Scegliamo lo stack in base al progetto, con priorità a manutenibilità e performance.",
  },
  {
    id: "recensioni",
    keywords: ["recensione", "recensioni", "opinioni", "feedback", "testimonianze"],
    answer:
      "Nella sezione Recensioni del sito puoi leggere i feedback pubblicati. Se hai completato un ordine e vuoi lasciare una recensione, segui le indicazioni sul sito o contattaci.",
    links: [{ label: "Recensioni", href: "/recensioni" }],
  },
  {
    id: "orari",
    keywords: ["orari", "quando rispondete", "disponibili", "h24", "weekend"],
    answer:
      "Questo assistente è disponibile 24/7 per le domande più comuni. Il team umano risponde di solito entro 24 ore lavorative tramite Contatti o email di supporto.",
    links: [{ label: "Contatti", href: "/contatti" }],
  },
  {
    id: "grazie",
    keywords: ["grazie", "thanks", "ok grazie", "perfetto", "chiaro"],
    answer:
      "Prego! Se ti serve altro sono qui. Per un preventivo o un dubbio specifico sul tuo progetto, la pagina Contatti è il canale migliore.",
    links: [{ label: "Contatti", href: "/contatti" }],
  },
];

const DEFAULT_WELCOME =
  "Ciao! Sono l’assistente di Gaming Relax. Posso aiutarti su servizi, Custom, Store, prezzi e tempi — senza attendere. Scrivi pure o scegli un suggerimento.";

const DEFAULT_FALLBACK =
  "Non ho una risposta precisa su questo punto, ma il team può aiutarti. Scrivici da Contatti o a supportogamingrelax@gmail.com: di solito rispondiamo entro 24 ore.";

const SUGGESTIONS = [
  "Cosa offrite?",
  "Bot Discord",
  "Quanto costa un sito?",
  "Come vi contatto?",
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(input: string, keywords: string[]): number {
  const n = normalize(input);
  if (!n) return 0;
  const tokens = n.split(" ").filter((t) => t.length > 1);
  let score = 0;
  for (const kw of keywords) {
    const k = normalize(kw);
    if (!k) continue;
    if (n === k) score += 20;
    else if (n.includes(k)) score += k.length >= 5 ? 12 : k.length >= 3 ? 8 : 4;
    else if (k.includes(n) && n.length >= 4) score += 5;
    else {
      for (const t of tokens) {
        if (t === k) score += 6;
        else if (k.includes(t) && t.length >= 4) score += 3;
        else if (t.includes(k) && k.length >= 4) score += 3;
      }
    }
  }
  return score;
}

function matchCustom(input: string, items: QA[]): { answer: string; score: number } | null {
  let best: { answer: string; score: number } | null = null;
  for (const item of items) {
    if (!item.enabled || !item.keywords?.length) continue;
    const score = scoreMatch(input, item.keywords);
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: item.answer, score };
    }
  }
  return best;
}

function matchBuiltin(input: string): {
  answer: string;
  score: number;
  links?: { label: string; href: string }[];
} | null {
  let best: {
    answer: string;
    score: number;
    links?: { label: string; href: string }[];
  } | null = null;
  for (const item of BUILTIN) {
    const score = scoreMatch(input, item.keywords);
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: item.answer, score, links: item.links };
    }
  }
  return best;
}

function resolveAnswer(
  input: string,
  qa: QA[],
  fallback: string
): { text: string; links?: { label: string; href: string }[] } {
  const custom = matchCustom(input, qa);
  const builtin = matchBuiltin(input);

  if (custom && custom.score >= 6 && (!builtin || custom.score >= builtin.score)) {
    return { text: custom.answer };
  }
  if (builtin && builtin.score >= 4) {
    return { text: builtin.answer, links: builtin.links };
  }
  if (custom && custom.score >= 3) {
    return { text: custom.answer };
  }
  if (builtin) {
    return { text: builtin.answer, links: builtin.links };
  }
  return {
    text: fallback,
    links: [{ label: "Contatti", href: "/contatti" }],
  };
}

function shouldHide(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  return HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
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
      if (prev.length > 0) return prev;
      return [{ id: "welcome", role: "bot", text: welcome }];
    });
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [open, welcome]);

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

      const resolved = resolveAnswer(text, qa, fallback);
      const delay = 400 + Math.min(900, resolved.text.length * 3);

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
    [typing, qa, fallback]
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
                Online · risposte automatiche 24/7
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
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-zinc-900/90 px-4 py-3">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-3 py-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => replyTo(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 transition hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

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
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                disabled={typing}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-40"
                aria-label="Invia"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition hover:scale-105",
          open
            ? "bg-zinc-800 text-white"
            : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-violet-600/40"
        )}
        aria-label={open ? "Chiudi assistente" : "Apri assistente"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
