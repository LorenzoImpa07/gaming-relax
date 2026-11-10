/**
 * Assistente autonomo Gaming Relax — risponde dal contesto del sito,
 * senza dipendere da Q&A preimpostate in dashboard.
 */

export type SupportLink = { label: string; href: string };
export type SupportReply = { text: string; links?: SupportLink[] };

function n(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function has(input: string, ...words: string[]) {
  const t = n(input);
  return words.some((w) => {
    const k = n(w);
    if (!k) return false;
    if (t.includes(k)) return true;
    return t.split(" ").some((tok) => tok === k || (k.length >= 4 && tok.includes(k)));
  });
}

type Intent =
  | "greeting"
  | "thanks"
  | "who"
  | "services"
  | "store"
  | "custom"
  | "pricing"
  | "timeline"
  | "order"
  | "payment"
  | "gift"
  | "preventivo"
  | "contact"
  | "hours"
  | "forum"
  | "portfolio"
  | "tech"
  | "bot_discord"
  | "website"
  | "account"
  | "fallback";

function detectIntent(raw: string): Intent {
  const t = n(raw);
  if (!t) return "greeting";

  if (has(t, "ciao", "salve", "buongiorno", "buonasera", "hey", "hola", "hi", "hello", "ehi", "buondi"))
    return "greeting";
  if (has(t, "grazie", "thanks", "thank you", "perfetto", "ok grazie", "chiaro", "super"))
    return "thanks";
  if (has(t, "chi siete", "chi sei", "team", "azienda", "studio", "gaming relax", "cosa fate", "di cosa vi occupate"))
    return "who";
  if (has(t, "orari", "quando rispondete", "disponibili", "h24", "weekend", "domenica", "sabato"))
    return "hours";
  if (has(t, "gift card", "gift", "buono", "voucher")) return "gift";
  if (has(t, "preventivo", "preventivi", "stima", "quanto mi costa", "preventivare"))
    return "preventivo";
  if (has(t, "paypal", "carta", "pagamento", "pagare", "bonifico", "metodi di pagamento", "stripe", "checkout"))
    return "payment";
  if (has(t, "carrello", "ordine", "ordinare", "acquistare", "comprare", "checkout"))
    return "order";
  if (has(t, "forum", "community", "discussione", "thread", "canale")) return "forum";
  if (has(t, "portfolio", "lavori", "progetti fatti", "case study", "esempi")) return "portfolio";
  if (has(t, "login", "registr", "account", "profilo", "password")) return "account";
  if (has(t, "contatt", "email", "scrivervi", "supporto", "assistenza", "aiuto umano"))
    return "contact";
  if (has(t, "tempo", "tempi", "consegna", "quanto tempo", "giorni", "settimane", "scadenza"))
    return "timeline";
  if (has(t, "prezzo", "prezzi", "costo", "costa", "tariff", "budget", "economico", "euro"))
    return "pricing";
  if (has(t, "bot discord", "bot", "discord", "moderation", "ticket bot", "economia bot"))
    return "bot_discord";
  if (has(t, "sito", "siti", "landing", "web app", "ecommerce", "e-commerce", "sito web"))
    return "website";
  if (has(t, "store", "abbonamento", "mensile", "piano store")) return "store";
  if (has(t, "custom", "su misura", "personalizzato", "applicazion", "software custom"))
    return "custom";
  if (has(t, "typescript", "next", "react", "tecnolog", "stack", "come sviluppate", "linguaggio"))
    return "tech";
  if (has(t, "servizi", "offrite", "cosa offrite", "catalogo", "prodotti", "soluzioni"))
    return "services";

  if (t.length < 12 && has(t, "bot", "sito", "app")) {
    if (has(t, "bot")) return "bot_discord";
    if (has(t, "sito", "app")) return "website";
  }
  return "fallback";
}

const KNOWLEDGE: Record<Intent, SupportReply> = {
  greeting: {
    text:
      "Ciao, sono l’assistente di Gaming Relax. Posso orientarti su Store, Custom, prezzi indicativi, tempi, ordini e contatti — in autonomia, senza aspettare lo staff. Dimmi pure cosa ti serve.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Store", href: "/store" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  thanks: {
    text: "Figurati. Se ti serve altro — un link, un chiarimento su prezzi o tempi — sono qui.",
    links: [{ label: "Home", href: "/" }],
  },
  who: {
    text:
      "Gaming Relax è uno studio di sviluppo: siti web, applicazioni, bot Discord e automazioni. Lavoriamo in TypeScript end-to-end, con UI curata e consegna in produzione reale, non solo prototipi.",
    links: [
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  services: {
    text:
      "Due linee principali:\n• Store — prodotti pronti (es. bot) in abbonamento mensile.\n• Custom — lavori fatti da noi (siti, app, software, bot su misura): li acquisti e restano tuoi.\nIn più: preventivo guidato, forum e assistenza.",
    links: [
      { label: "Store", href: "/store" },
      { label: "Custom", href: "/custom" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  store: {
    text:
      "Nello Store trovi soluzioni pronte, in particolare bot e servizi in abbonamento mensile: attivi il piano, lo gestisci dal profilo e lo interrompi quando non ti serve più.",
    links: [
      { label: "Vai allo Store", href: "/store" },
      { label: "Carrello", href: "/carrello" },
    ],
  },
  custom: {
    text:
      "Custom è il catalogo dei prodotti e progetti realizzati da noi — siti, app, software e molto altro. L’acquisto è permanente: lo paghi una volta e resta tuo, con dettagli, piani e descrizioni in pagina.",
    links: [
      { label: "Catalogo Custom", href: "/custom" },
      { label: "Preventivo su misura", href: "/preventivo" },
    ],
  },
  pricing: {
    text:
      "I prezzi variano per ambito:\n• Store: canoni mensili indicati su ogni scheda prodotto.\n• Custom: prezzo una tantum o piano indicato sul prodotto; per lavori fuori catalogo usiamo il preventivo guidato.\nIn checkout possono esserci sconti, gift card e IVA stimata.",
    links: [
      { label: "Store", href: "/store" },
      { label: "Custom", href: "/custom" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  timeline: {
    text:
      "I tempi dipendono dallo scope. Prodotti Store e Custom già in catalogo sono immediati dopo l’ordine e la conferma. Progetti su misura: dopo il preventivo definiamo milestone e data di consegna realistiche — niente stime a caso.",
    links: [
      { label: "Preventivo", href: "/preventivo" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  order: {
    text:
      "Per ordinare: scegli il prodotto in Store o Custom → aggiungi al carrello → checkout con i dati di fatturazione e il metodo di pagamento. Ricevi conferma e istruzioni; lo staff completa dove serve (es. attivazione bot).",
    links: [
      { label: "Store", href: "/store" },
      { label: "Carrello", href: "/carrello" },
    ],
  },
  payment: {
    text:
      "In checkout puoi usare i metodi attivi dalla dashboard (es. PayPal, carta di credito/debito, altri se configurati). Per la carta vengono richiesti numero, scadenza, CVC e nome — i dati non restano salvati in chiaro sul sito.",
    links: [
      { label: "Checkout", href: "/checkout" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  gift: {
    text:
      "Le gift card possono essere assegnate a un’email dallo staff. Nel profilo vedi saldo e storico (importo prima e dopo l’uso). In checkout puoi inserire il codice per scalare il totale.",
    links: [
      { label: "Il tuo profilo", href: "/profilo" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  preventivo: {
    text:
      "Il preventivo guidato ti fa indicare tipo di progetto, budget e tempi in pochi step. Lo staff risponde in modo chiaro, di solito entro 24 ore lavorative.",
    links: [
      { label: "Apri preventivo", href: "/preventivo" },
      { label: "Contatti", href: "/contatti" },
    ],
  },
  contact: {
    text:
      "Puoi scriverci dal form Contatti o via email a supportogamingrelax@gmail.com. Orari di supporto: Lun–Ven 10:00–19:00, Sabato 10:00–14:00, Domenica chiuso. Fuori orario restano form e questo assistente.",
    links: [
      { label: "Contatti", href: "/contatti" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  hours: {
    text:
      "Supporto umano: lunedì–venerdì 10:00–19:00, sabato 10:00–14:00, domenica chiuso. Questo assistente è disponibile anche fuori orario per orientarti su servizi e procedure.",
    links: [{ label: "Contatti", href: "/contatti" }],
  },
  forum: {
    text:
      "Il forum è lo spazio community del sito: canali e discussioni per utenti e staff. Alcune aree possono essere riservate in base ai ruoli.",
    links: [{ label: "Apri il forum", href: "/forum" }],
  },
  portfolio: {
    text:
      "Nel portfolio trovi esempi di lavori e progetti che mostrano approccio e qualità. Per un lavoro simile al tuo, il preventivo è il passo successivo.",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  tech: {
    text:
      "Stack tipico: TypeScript, Next.js, React, Node, Firebase, Tailwind, Framer Motion, API Discord dove serve. Deploy su infrastruttura moderna (es. Vercel) con attenzione a performance e manutenibilità.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Chi siamo", href: "/chi-siamo" },
    ],
  },
  bot_discord: {
    text:
      "Sviluppiamo bot Discord su misura e soluzioni già in Store (economia, ticket, ranking, pannelli). Store = abbonamento mensile; Custom/progetto dedicato = soluzione permanente concordata.",
    links: [
      { label: "Store bot", href: "/store" },
      { label: "Custom", href: "/custom" },
    ],
  },
  website: {
    text:
      "Realizziamo landing, siti corporate, web app e dashboard. In Custom trovi offerte e pacchetti; per un progetto da zero usa il preventivo guidato con obiettivi e budget.",
    links: [
      { label: "Custom", href: "/custom" },
      { label: "Preventivo", href: "/preventivo" },
    ],
  },
  account: {
    text:
      "Puoi registrarti o accedere per profilo, ordini e gift card collegate alla tua email. Login anche con Google se abilitato.",
    links: [
      { label: "Accedi", href: "/login" },
      { label: "Registrati", href: "/register" },
      { label: "Profilo", href: "/profilo" },
    ],
  },
  fallback: {
    text:
      "Non ho colto un dettaglio specifico, ma posso aiutarti su Store, Custom, prezzi, tempi, ordini, pagamenti e contatti. Prova a riformulare in una frase, oppure apri Contatti / Preventivo per lo staff.",
    links: [
      { label: "Contatti", href: "/contatti" },
      { label: "Preventivo", href: "/preventivo" },
      { label: "Custom", href: "/custom" },
    ],
  },
};

export function suggestionsForPath(pathname: string): string[] {
  if (pathname.startsWith("/store"))
    return ["Come funziona lo Store?", "Abbonamento mensile", "Come pago?"];
  if (pathname.startsWith("/custom"))
    return ["Cosa include Custom?", "È un acquisto permanente?", "Preventivo"];
  if (pathname.startsWith("/checkout") || pathname.startsWith("/carrello"))
    return ["Metodi di pagamento", "Gift card", "Tempi dopo l’ordine"];
  if (pathname.startsWith("/forum"))
    return ["Come funziona il forum?", "Contatti staff", "Cosa offrite?"];
  if (pathname.startsWith("/preventivo"))
    return ["Cosa serve per il preventivo?", "Tempi di risposta", "Custom"];
  return ["Cosa offrite?", "Bot Discord", "Quanto costa un sito?", "Come vi contatto?"];
}

export function welcomeForPath(pathname: string): string {
  if (pathname.startsWith("/store"))
    return "Sei nello Store. Posso spiegarti piani mensili, checkout e differenze con Custom — dimmi pure.";
  if (pathname.startsWith("/custom"))
    return "Sei su Custom (acquisti permanenti). Posso chiarire catalogo, prezzi e preventivo su misura.";
  if (pathname.startsWith("/checkout"))
    return "Sei al checkout. Posso aiutarti su metodi di pagamento, gift card e cosa succede dopo l’ordine.";
  return "Ciao, sono l’assistente di Gaming Relax. Rispondo in autonomia su servizi, prezzi, ordini e contatti. Come posso aiutarti?";
}

export function generateSupportReply(
  userMessage: string,
  opts?: {
    pathname?: string;
    customQa?: { keywords: string[]; answer: string; enabled?: boolean }[];
  }
): SupportReply {
  const intent = detectIntent(userMessage);
  let reply: SupportReply = { ...KNOWLEDGE[intent] };

  const custom = opts?.customQa;
  if (custom?.length) {
    const msg = n(userMessage);
    let best: { answer: string; score: number } | null = null;
    for (const item of custom) {
      if (item.enabled === false || !item.answer) continue;
      let score = 0;
      for (const kw of item.keywords || []) {
        const k = n(kw);
        if (!k) continue;
        if (msg.includes(k)) score += k.length >= 5 ? 10 : 6;
      }
      if (score >= 14 && (!best || score > best.score)) {
        best = { answer: item.answer, score };
      }
    }
    if (best) {
      reply = { text: best.answer, links: reply.links };
    }
  }

  if (intent === "fallback" && opts?.pathname) {
    const path = opts.pathname;
    if (path.startsWith("/store")) {
      reply = {
        text:
          "In questa sezione (Store) i prodotti sono in abbonamento mensile. Se mi dici se cerchi un bot, un prezzo o come ordinare, ti guido io.",
        links: [
          { label: "Store", href: "/store" },
          { label: "Contatti", href: "/contatti" },
        ],
      };
    } else if (path.startsWith("/custom")) {
      reply = {
        text:
          "Qui sei su Custom: acquisti permanenti di lavori nostri. Dimmi se ti serve un sito, un’app o un preventivo e ti indirizzo al punto giusto.",
        links: [
          { label: "Custom", href: "/custom" },
          { label: "Preventivo", href: "/preventivo" },
        ],
      };
    }
  }

  return reply;
}
