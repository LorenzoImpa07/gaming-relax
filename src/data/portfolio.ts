export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  category: "web" | "bot" | "software" | "automation";
  summary: string;
  challenge: string;
  solution: string;
  stack: string[];
  results: string[];
  year: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "dashboard-community",
    title: "Dashboard community & ranking",
    client: "Community gaming (IT)",
    category: "software",
    summary:
      "Pannello web collegato a bot Discord: ranking, economia, moderazione e report in tempo reale.",
    challenge:
      "Gestire migliaia di membri con fogli di calcolo e comandi sparsi non scalava. Serviva un unico posto per staff e metriche.",
    solution:
      "Web app Next.js + Firebase con auth a ruoli, sync eventi Discord, grafici e export. Deploy su Vercel con ambienti separati.",
    stack: ["TypeScript", "Next.js", "Firebase", "Discord API", "Vercel"],
    results: [
      "Staff riduce tempo moderazione del ~40%",
      "Ranking e economia centralizzati",
      "Consegna in produzione in 5 settimane",
    ],
    year: "2025",
  },
  {
    id: "landing-saas",
    title: "Landing ad alta conversione",
    client: "Prodotto digitale B2C",
    category: "web",
    summary:
      "Landing page con copy, animazioni e form lead, pensata per campagne ads.",
    challenge:
      "La vecchia pagina non convertiva e non era ottimizzata mobile/SEO. Serve un funnel chiaro in pochi giorni.",
    solution:
      "Design system dark, sezioni beneficio/prova sociale/CTA, form validato, tracking eventi e deploy edge.",
    stack: ["Next.js", "Tailwind", "Framer Motion", "Vercel"],
    results: [
      "Tempo di caricamento sotto i 2s su mobile",
      "Form lead integrato e notifica email",
      "Live in 10 giorni lavorativi",
    ],
    year: "2025",
  },
  {
    id: "bot-ticket-economia",
    title: "Suite bot Discord Pro",
    client: "Server community 8k+",
    category: "bot",
    summary:
      "Bot con ticket, economia, ranking e pannello moderatori — pensato per carico reale.",
    challenge:
      "Bot legacy instabile, senza logging e senza controlli per lo staff non tecnico.",
    solution:
      "Architettura modulare Node/TS, persistenza, comandi slash, ticket multi-coda e dashboard web leggera.",
    stack: ["TypeScript", "discord.js", "Node.js", "PostgreSQL"],
    results: [
      "Uptime stabile post-migrazione",
      "Ticket gestiti senza canali caos",
      "Documentazione e handoff allo staff",
    ],
    year: "2024",
  },
];
