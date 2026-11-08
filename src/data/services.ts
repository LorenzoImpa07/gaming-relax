export type ServicePlan = {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
};

export type Service = {
  id: string;
  name: string;
  description: string;
  /** Descrizione lunga per la pagina dettaglio */
  details?: string;
  price: number;
  category: "bot" | "web" | "software" | "automation" | "support";
  features: string[];
  popular?: boolean;
  /** Disponibile allo store (default true) */
  available?: boolean;
  /** Sconto percentuale sul prezzo di listino */
  discountPercent?: number;
  /** Piani / abbonamenti selezionabili nel dettaglio */
  plans?: ServicePlan[];
};

export const services: Service[] = [
  {
    id: "bot-basic",
    name: "Bot Discord Base",
    description:
      "Bot personalizzato con comandi base, moderazione e log. Ideale per community medie.",
    details:
      "Ideale per server Discord di medie dimensioni. Include setup iniziale, personalizzazione comandi e formazione base sull'utilizzo.",
    price: 149,
    category: "bot",
    available: true,
    features: ["Comandi custom", "Moderazione base", "Log eventi", "Supporto 15 giorni"],
  },
  {
    id: "bot-pro",
    name: "Bot Discord Pro",
    description:
      "Bot completo con economia, ticket system, dashboard web e integrazioni avanzate.",
    details:
      "La soluzione completa per community che vogliono crescita e gestione avanzata. Include dashboard web per moderatori e analisi.",
    price: 349,
    category: "bot",
    popular: true,
    available: true,
    features: [
      "Tutto del piano Base",
      "Economia & ranking",
      "Ticket system",
      "Dashboard web",
      "Supporto 45 giorni",
    ],
  },
  {
    id: "web-app",
    name: "Applicazione Web",
    description: "Sviluppo di applicazione web moderna (dashboard, gestionale, tool interno).",
    details:
      "Sviluppo full-stack con design responsive, autenticazione utenti, database e deploy in produzione.",
    price: 799,
    category: "web",
    available: true,
    features: [
      "Design responsive",
      "Autenticazione",
      "Database",
      "Deploy incluso",
      "Supporto 30 giorni",
    ],
  },
  {
    id: "software-custom",
    name: "Software Custom",
    description: "Software o tool desktop/script su misura per le tue esigenze specifiche.",
    details:
      "Analisi requisiti, sviluppo, documentazione e formazione. Ideale per automazioni desktop e tool interni.",
    price: 499,
    category: "software",
    available: true,
    features: ["Analisi requisiti", "Sviluppo su misura", "Documentazione", "Formazione base"],
  },
  {
    id: "automation",
    name: "Automazioni & Integrazioni",
    description: "Automazioni tra Discord, database, API esterne, Google Sheets e altri servizi.",
    details: "Colleghiamo i tuoi servizi preferiti con flussi automatici e webhook.",
    price: 299,
    category: "automation",
    available: true,
    features: ["Webhook", "API", "Integrazioni", "Monitoraggio"],
  },
  {
    id: "support",
    name: "Supporto & Manutenzione",
    description: "Piano mensile di supporto tecnico e aggiornamenti per i tuoi progetti.",
    details: "Priorità nelle risposte, aggiornamenti di sicurezza e piccole modifiche incluse.",
    price: 99,
    category: "support",
    available: true,
    features: ["Supporto prioritario", "Aggiornamenti", "Piccole modifiche", "Report mensile"],
  },
];
