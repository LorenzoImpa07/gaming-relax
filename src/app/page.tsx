"use client";

import Link from "next/link";
import { Partners } from "@/components/Partners";
import { TeamSection } from "@/components/TeamSection";
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
      "Bot custom per moderazione, economia, ticket system, integrazioni API, dashboard e automatismi avanzati.",
  },
  {
    icon: Code2,
    title: "Applicazioni Web & Software",
    description:
      "Sviluppo di applicazioni web moderne, dashboard, tool interni e software gestionali su misura.",
  },
  {
    icon: Smartphone,
    title: "App & Soluzioni Multi-piattaforma",
    description:
      "Applicazioni desktop e mobile, tool cross-platform e integrazioni tra sistemi.",
  },
  {
    icon: Zap,
    title: "Automazioni & Integrazioni",
    description:
      "Automazioni di processi, collegamenti tra servizi e script personalizzati.",
  },
  {
    icon: Shield,
    title: "Manutenzione & Supporto",
    description:
      "Monitoraggio, aggiornamenti di sicurezza, bugfix e supporto continuativo.",
  },
  {
    icon: Rocket,
    title: "Consulenza Tecnica",
    description:
      "Analisi dello stack, architettura, performance e scelte tecnologiche.",
  },
];

const projects = [
  {
    title: "Bot Moderazione Avanzata",
    category: "Discord Bot",
    description:
      "Sistema completo di moderazione con log, auto-mod, ruoli temporanei, ticket e dashboard web.",
    tags: ["Discord.js", "Node.js", "MongoDB", "Dashboard"],
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80",
  },
  {
    title: "Piattaforma Gestionale Interna",
    category: "Web App",
    description:
      "Applicazione web per gestione ordini, clienti e reportistica con autenticazione e ruoli.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Auth"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    title: "Tool di Automazione Community",
    category: "Automation",
    description:
      "Automazioni tra Discord, Google Sheets e notifiche per eventi e iscrizioni.",
    tags: ["Node.js", "API", "Webhook", "Cron"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  },
  {
    title: "Bot Economia & Giochi",
    category: "Discord Bot",
    description:
      "Bot di economia, ranking, minigiochi e shop virtuale con leaderboard.",
    tags: ["Discord.js", "SQLite", "Canvas", "Economy"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-950/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              Disponibili per nuovi progetti
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-glow">
              Sviluppiamo{" "}
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                software
              </span>{" "}
              e bot che funzionano davvero
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Da bot Discord professionali ad applicazioni web complete. Codice pulito, consegne
              puntuali e soluzioni pensate per durare.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contatti"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-base font-semibold text-white btn-glow transition-all hover:scale-105"
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

      <section id="servizi" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeIn} className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Cosa facciamo</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
              Un team compatto che copre lo sviluppo end-to-end: dall'idea al deploy.
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
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all card-shine box-glow-hover hover:border-violet-500/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 text-violet-400">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{service.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="progetti" className="bg-zinc-950/50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeIn} className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Progetti recenti</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-400">Alcuni esempi di lavori realizzati.</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-medium uppercase tracking-wider text-violet-300">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-400">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      <section className="overflow-hidden py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
              "https://images.unsplash.com/photo-1498050108023-c8199c3246c7?w=600&q=80",
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800"
              >
                <Image
                  src={src}
                  alt={`Workspace ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="chi-siamo" className="bg-zinc-950/50 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Chi siamo</h2>
              <p className="mt-6 leading-relaxed text-zinc-400">
                Siamo un team di sviluppatori appassionati di codice e di soluzioni pratiche.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Comunicazione chiara e trasparente",
                  "Codice pulito e documentato",
                  "Tempi di consegna rispettati",
                  "Supporto anche dopo il rilascio",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-72 overflow-hidden rounded-2xl border border-zinc-800"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
                alt="Team al lavoro"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Partners />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Hai un'idea o un problema da risolvere?
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Raccontaci di cosa hai bisogno. Ti rispondiamo rapidamente.
            </p>
            <Link
              href="/contatti"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-4 text-base font-semibold text-white btn-glow"
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
