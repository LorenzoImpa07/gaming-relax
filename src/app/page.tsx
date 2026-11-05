"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  Code2,
  Smartphone,
  Zap,
  Shield,
  Rocket,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  User,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const services = [
  {
    icon: Bot,
    title: "Bot Discord Professionali",
    description:
      "Bot custom per moderazione, economia, ticket system, integrazioni API, dashboard e automatismi avanzati. Stabili, scalabili e facili da gestire.",
  },
  {
    icon: Code2,
    title: "Applicazioni Web & Software",
    description:
      "Sviluppo di applicazioni web moderne, dashboard, tool interni e software gestionali su misura. Dal prototipo alla messa in produzione.",
  },
  {
    icon: Smartphone,
    title: "App & Soluzioni Multi-piattaforma",
    description:
      "Applicazioni desktop e mobile, tool cross-platform e integrazioni tra sistemi. Tecnologia scelta in base alle reali esigenze del progetto.",
  },
  {
    icon: Zap,
    title: "Automazioni & Integrazioni",
    description:
      "Automazioni di processi, collegamenti tra servizi (Discord, database, API esterne, webhook) e script personalizzati che fanno risparmiare tempo.",
  },
  {
    icon: Shield,
    title: "Manutenzione & Supporto",
    description:
      "Monitoraggio, aggiornamenti di sicurezza, bugfix e supporto continuativo. Il software non deve solo nascere, deve restare affidabile.",
  },
  {
    icon: Rocket,
    title: "Consulenza Tecnica",
    description:
      "Analisi dello stack, architettura, performance e scelte tecnologiche. Ti aiutiamo a prendere decisioni tecniche sensate prima di scrivere codice.",
  },
];

const projects = [
  {
    title: "Bot Moderazione Avanzata",
    category: "Discord Bot",
    description:
      "Sistema completo di moderazione con log, auto-mod, ruoli temporanei, ticket e dashboard web di gestione.",
    tags: ["Discord.js", "Node.js", "MongoDB", "Dashboard"],
  },
  {
    title: "Piattaforma Gestionale Interna",
    category: "Web App",
    description:
      "Applicazione web per gestione ordini, clienti e reportistica con autenticazione e ruoli multipli.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
  },
  {
    title: "Tool di Automazione Community",
    category: "Automation",
    description:
      "Sistema di automazioni tra Discord, Google Sheets e notifiche per gestire eventi e iscrizioni in modo automatico.",
    tags: ["Node.js", "API", "Webhook", "Cron"],
  },
  {
    title: "Bot Economia & Giochi",
    category: "Discord Bot",
    description:
      "Bot completo di economia, ranking, minigiochi e shop virtuale con persistenza dati e leaderboard.",
    tags: ["Discord.js", "SQLite", "Canvas", "Economy"],
  },
];

const team = [
  {
    name: "Lorenzo",
    role: "Full-Stack Developer",
    description:
      "Appassionato di sviluppo software e bot Discord. Si occupa di architettura, backend e integrazioni.",
    image: null,
  },
  {
    name: "Il tuo socio",
    role: "Developer / Designer",
    description:
      "Inserisci qui una breve descrizione del tuo amico/socio e del suo ruolo nel team.",
    image: null,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
              </span>
              Disponibili per nuovi progetti
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Sviluppiamo{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                software
              </span>{" "}
              e bot che funzionano davvero
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
              Da bot Discord professionali ad applicazioni web complete.
              Codice pulito, consegne puntuali e soluzioni pensate per durare.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contatti"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
              >
                Parliamone
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#progetti"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-3.5 text-base font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-white"
              >
                Guarda i progetti
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Servizi */}
      <section id="servizi" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Cosa facciamo
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Un team compatto che copre lo sviluppo end-to-end:
              dall&apos;idea al deploy, passando per design, logica e manutenzione.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-violet-500/40 hover:bg-zinc-900/70"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 text-violet-400 group-hover:from-violet-600/30 group-hover:to-cyan-500/30 transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progetti */}
      <section id="progetti" className="py-24 sm:py-32 bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Progetti recenti
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Alcuni esempi di lavori realizzati.
              Ogni progetto è unico e costruito sulle esigenze reali del cliente.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-violet-400">
                    {project.category}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-zinc-400 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Il Team
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Siamo in due, appassionati di codice e di soluzioni concrete.
              Ecco chi c&apos;è dietro Gaming Relax.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8 text-center hover:border-violet-500/30 transition-colors"
              >
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-zinc-700 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="h-12 w-12 text-zinc-500" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-violet-400">{member.role}</p>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chi siamo */}
      <section id="chi-siamo" className="py-24 sm:py-32 bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Chi siamo
              </h2>
              <p className="mt-6 text-zinc-400 leading-relaxed">
                Siamo un team di due sviluppatori appassionati di codice e di soluzioni
                pratiche. Lavoriamo principalmente su applicazioni custom, bot Discord
                e tool che risolvono problemi concreti.
              </p>
              <p className="mt-4 text-zinc-400 leading-relaxed">
                Crediamo in un approccio diretto: ascoltiamo le esigenze, proponiamo
                la soluzione più adatta (senza over-engineering) e consegniamo codice
                mantenibile e documentato.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Comunicazione chiara e trasparente",
                  "Codice pulito e documentato",
                  "Tempi di consegna rispettati",
                  "Supporto anche dopo il rilascio",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">2</div>
                    <div className="mt-1 text-sm text-zinc-400">Sviluppatori</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="mt-1 text-sm text-zinc-400">Remoto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">End-to-end</div>
                    <div className="mt-1 text-sm text-zinc-400">Dal concept al deploy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">IT</div>
                    <div className="mt-1 text-sm text-zinc-400">Team italiano</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Hai un&apos;idea o un problema da risolvere?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Raccontaci di cosa hai bisogno. Ti rispondiamo rapidamente con un&apos;analisi
              chiara e senza impegno.
            </p>
            <Link
              href="/contatti"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
            >
              <MessageSquare className="h-5 w-5" />
              Scrivici ora
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
