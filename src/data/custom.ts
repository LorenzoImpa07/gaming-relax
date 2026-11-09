import type { Service, ServicePlan } from "@/data/services";

/** Stesso shape dello Store per riuso carrello / piani */
export type CustomProduct = Service;

export const customProducts: CustomProduct[] = [
  {
    id: "custom-landing",
    name: "Landing Page Pro",
    description:
      "Landing ad alta conversione: copy, design, animazioni e form. Pronto per ads e lead.",
    details:
      "Analisi obiettivo, wireframe, UI su misura, sezioni hero/servizi/CTA, form contatti, SEO base e deploy. Perfetta per lanciare un prodotto o una campagna.",
    price: 590,
    category: "web",
    available: true,
    popular: true,
    features: [
      "Design responsive unico",
      "Animazioni scroll leggere",
      "Form contatti + validazione",
      "SEO tecnico base",
      "Deploy su Vercel incluso",
      "1 round di revisioni",
    ],
    plans: [
      {
        id: "lp-one",
        name: "Una tantum",
        price: 590,
        description: "Progetto completo, pagamento unico",
        features: ["Tutto incluso", "Consegna 7–12 giorni"],
      },
      {
        id: "lp-care",
        name: "Care mensile",
        price: 49,
        description: "Manutenzione, piccole modifiche, uptime",
        features: ["Aggiornamenti contenuti", "Supporto prioritario", "Report mensile"],
      },
    ],
  },
  {
    id: "custom-webapp",
    name: "Web App / Dashboard",
    description:
      "Applicazione web full-stack: auth, database, pannelli admin, API. Dal prototipo al deploy.",
    details:
      "Architettura Next.js + Firebase (o stack concordato), autenticazione, ruoli, CRUD, design system e documentazione. Ideale per gestionali, SaaS MVP e tool interni.",
    price: 1490,
    category: "software",
    available: true,
    features: [
      "Auth e ruoli utenti",
      "Database strutturato",
      "UI admin + area cliente",
      "API / integrazioni",
      "Deploy + monitoraggio base",
      "Documentazione consegna",
    ],
    plans: [
      {
        id: "wa-mvp",
        name: "MVP",
        price: 1490,
        description: "Funzionalità core in produzione",
        features: ["Scope definito", "Consegna 3–5 settimane"],
      },
      {
        id: "wa-scale",
        name: "Scale",
        price: 2890,
        description: "Funzionalità avanzate, multi-ruolo, analytics",
        features: ["Tutto MVP", "Report e metriche", "2 sprint post-lancio"],
      },
      {
        id: "wa-retainer",
        name: "Retainer mensile",
        price: 199,
        description: "Evolutive e supporto continuo",
        features: ["Ore sviluppo mensili", "Priorità bugfix", "Roadmap condivisa"],
      },
    ],
  },
  {
    id: "custom-ecommerce",
    name: "Sito E-commerce",
    description:
      "Negozio online moderno: catalogo, carrello, checkout, gestione ordini e pagamenti.",
    details:
      "Catalogo prodotti, varianti, sconti, checkout, integrazioni pagamento, area cliente e pannello ordini. Design brandizzato e performance orientate alla conversione.",
    price: 1290,
    category: "web",
    available: true,
    features: [
      "Catalogo e filtri",
      "Carrello e checkout",
      "Pagamenti online",
      "Pannello ordini",
      "Email transazionali",
      "Mobile-first",
    ],
    plans: [
      {
        id: "ec-start",
        name: "Starter",
        price: 1290,
        description: "Fino a ~50 prodotti, flusso completo",
      },
      {
        id: "ec-pro",
        name: "Pro",
        price: 2190,
        description: "Catalogo esteso, sconti, multi-metodo pagamento",
      },
    ],
  },
  {
    id: "custom-bot-suite",
    name: "Suite Bot Discord Premium",
    description:
      "Bot su misura con economia, ticket, dashboard web e integrazioni. Per community che scalano.",
    details:
      "Progettazione comandi, database, pannello moderatori, ticket, ranking ed eventuali webhook. Consegna con documentazione e training team.",
    price: 690,
    category: "bot",
    available: true,
    features: [
      "Comandi e moduli custom",
      "Economia / ranking",
      "Ticket system",
      "Dashboard web",
      "Log e moderazione",
      "Training staff",
    ],
    plans: [
      {
        id: "bot-build",
        name: "Build",
        price: 690,
        description: "Sviluppo completo una tantum",
      },
      {
        id: "bot-host",
        name: "Hosting + update / mese",
        price: 39,
        description: "Server, aggiornamenti e supporto",
      },
    ],
  },
  {
    id: "custom-automation",
    name: "Automazioni & Pipeline",
    description:
      "Colleghiamo tool, API, fogli di calcolo e bot: workflow che lavorano mentre dormi.",
    details:
      "Analisi processi, script e integrazioni (Discord, Google, Stripe, webhook custom), monitoring e alert. Riduci lavoro manuale ripetitivo.",
    price: 390,
    category: "automation",
    available: true,
    features: [
      "Fino a 5 integrazioni",
      "Script e webhook",
      "Error handling",
      "Monitoraggio base",
      "Documentazione flusso",
    ],
  },
  {
    id: "custom-brand-site",
    name: "Sito Corporate / Portfolio",
    description:
      "Sito istituzionale o portfolio multi-pagina: team, servizi, case study, blog opzionale.",
    details:
      "Architettura contenuti, design system, pagine principali, SEO e performance. Ideale per studi, team e professionisti che vogliono credibilità online.",
    price: 890,
    category: "web",
    available: true,
    features: [
      "Fino a 6–8 pagine",
      "Design system coerente",
      "Sezione team / portfolio",
      "Form e CTA",
      "SEO on-page",
      "Deploy e SSL",
    ],
  },
];

export type { ServicePlan };
