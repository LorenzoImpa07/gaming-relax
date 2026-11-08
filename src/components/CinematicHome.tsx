"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Bot,
  Zap,
  Rocket,
  ChevronDown,
  MessageSquare,
  Shield,
  Terminal,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";

const SCENES = {
  hero: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=85",
  codeClose: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=85",
  laptopDark: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=85",
  desk: "https://images.unsplash.com/photo-1498050108023-c8199c3246c7?w=1920&q=85",
  neonCity: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85",
  terminal: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920&q=85",
  teamWork: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=85",
  server: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=85",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1920&q=85",
  dual: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&q=85",
};

function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-300"
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">Scorri</span>
      <ChevronDown className="h-5 w-5 text-violet-300" />
    </motion.div>
  );
}

function FullBleed({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="absolute inset-0">
      <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-[#050508]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,8,0.75)_100%)]" />
    </div>
  );
}

export function CinematicHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: pageProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: s2 } = useScroll({
    target: scene2Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: s3 } = useScroll({
    target: scene3Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: s4 } = useScroll({
    target: scene4Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: servicesProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.2]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 100]);
  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -60]);

  const s2Opacity = useTransform(s2, [0.1, 0.3, 0.7, 0.9], [0.35, 1, 1, 0.45]);
  const s2Scale = useTransform(s2, [0, 0.5, 1], [1.08, 1, 1.04]);
  const s2TextY = useTransform(s2, [0.2, 0.5], [40, 0]);

  const s3Opacity = useTransform(s3, [0.1, 0.3, 0.7, 0.9], [0.35, 1, 1, 0.45]);
  const s3Scale = useTransform(s3, [0, 0.5, 1], [1.1, 1, 1.03]);

  const s4Opacity = useTransform(s4, [0.1, 0.3, 0.7, 0.9], [0.35, 1, 1, 0.5]);
  const s4Scale = useTransform(s4, [0, 0.5, 1], [1.06, 1, 1.05]);

  // Opacità minima alta: su mobile le card non devono sparire
  const c1 = useTransform(servicesProgress, [0, 0.12, 0.35, 0.55], [0.7, 1, 1, 0.95]);
  const c2 = useTransform(servicesProgress, [0.15, 0.3, 0.5, 0.7], [0.7, 1, 1, 0.95]);
  const c3 = useTransform(servicesProgress, [0.35, 0.5, 0.7, 1], [0.7, 1, 1, 1]);
  const y1 = useTransform(servicesProgress, [0, 0.3], [24, 0]);
  const y2 = useTransform(servicesProgress, [0.15, 0.45], [24, 0]);
  const y3 = useTransform(servicesProgress, [0.35, 0.65], [24, 0]);

  const progressBar = useSpring(pageProgress, { stiffness: 90, damping: 28 });

  return (
    <div ref={containerRef} className="relative bg-[#050508]">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
        style={{ scaleX: progressBar }}
      />

      <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0">
          <FullBleed src={SCENES.dual} alt="Codice sullo schermo" priority />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.28),transparent_50%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroTitleY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-violet-100 backdrop-blur-md"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-300" />
            Gaming Relax · Software Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Costruiamo
            <br />
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              software
            </span>{" "}
            che resta
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3 }}
            className="mt-6 max-w-lg text-base text-zinc-200/90 sm:text-lg"
          >
            Bot Discord, applicazioni web e automazioni. Codice pulito, interfacce chiare, risultati
            reali.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              href="/contatti"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.15)] transition hover:scale-105"
            >
              Inizia un progetto
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10"
            >
              Servizi
            </Link>
          </motion.div>
        </motion.div>
        <ScrollHint />
      </section>

      <section ref={scene2Ref} className="relative h-[160vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ opacity: s2Opacity, scale: s2Scale }} className="absolute inset-0">
            <FullBleed src={SCENES.codeClose} alt="Dettaglio codice sorgente" />
          </motion.div>
          <div className="relative z-10 flex h-full items-end px-6 pb-20 sm:items-center sm:px-14 sm:pb-0 lg:px-24">
            <motion.div style={{ y: s2TextY }} className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300">
                01 — Craft
              </p>
              <h2 className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
                Ogni riga
                <br />
                ha un motivo
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-200 sm:text-lg">
                Non generiamo codice a caso. Architettura, test e chiarezza: cosi i progetti restano
                manutenibili mesi dopo il deploy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={scene3Ref} className="relative h-[160vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ opacity: s3Opacity, scale: s3Scale }} className="absolute inset-0">
            <FullBleed src={SCENES.laptopDark} alt="Laptop in ambiente scuro" />
          </motion.div>
          <div className="relative z-10 flex h-full items-center justify-end px-6 sm:px-14 lg:px-24">
            <div className="max-w-lg text-right">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-violet-300">
                02 — Product
              </p>
              <h2 className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
                Dal brief
                <br />
                al prodotto
              </h2>
              <p className="mt-5 text-base leading-relaxed text-zinc-200 sm:text-lg">
                Bot, dashboard, API e automazioni. Un unico team che parla la lingua del prodotto e
                quella del codice.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                {["Discord.js", "Next.js", "TypeScript", "Firebase"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={scene4Ref} className="relative h-[150vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ opacity: s4Opacity, scale: s4Scale }} className="absolute inset-0">
            <FullBleed src={SCENES.neonCity} alt="Circuiti e tecnologia" />
          </motion.div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-300">
              03 — Scale
            </p>
            <h2 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Pensato per{" "}
              <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
                crescere
              </span>
            </h2>
            <p className="mt-5 max-w-md text-base text-zinc-200 sm:text-lg">
              Sistemi che reggono utenti reali, non demo. Monitoraggio, sicurezza e supporto dopo il
              rilascio.
            </p>
          </div>
        </div>
      </section>

      <section ref={servicesRef} className="relative h-[160vh] sm:h-[200vh]">
        <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-16">
          <div className="absolute inset-0">
            <FullBleed src={SCENES.desk} alt="Setup da sviluppatori" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-5 px-4 sm:grid-cols-3 sm:gap-6 sm:px-6">
            {[
              {
                o: c1,
                y: y1,
                icon: Bot,
                title: "Bot Discord",
                text: "Moderazione, economia, ticket, integrazioni. Stabili 24/7.",
              },
              {
                o: c2,
                y: y2,
                icon: Code2,
                title: "Web & Software",
                text: "App, gestionali e tool su misura. UI moderne, backend solidi.",
              },
              {
                o: c3,
                y: y3,
                icon: Zap,
                title: "Automazioni",
                text: "API, webhook e script che eliminano lavoro ripetitivo.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                style={{ opacity: card.o, y: card.y }}
                className="rounded-3xl border border-violet-500/25 bg-zinc-950/90 p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/30 text-violet-100 sm:mb-5">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white sm:text-2xl">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200 sm:mt-3">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[SCENES.keyboard, SCENES.terminal, SCENES.server, SCENES.desk].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative aspect-[4/5] overflow-hidden md:aspect-square"
            >
              <Image
                src={src}
                alt={`Tech ${i + 1}`}
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/25 transition hover:bg-black/10" />
            </motion.div>
          ))}
        </div>
      </section>

      <section id="progetti" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-5xl">Progetti</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Esempi del tipo di lavoro che rilasciamo.
            </p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { title: "Bot Moderazione", tag: "Discord", img: SCENES.terminal },
              { title: "Dashboard Web", tag: "Next.js", img: SCENES.laptopDark },
              { title: "Automazioni API", tag: "Backend", img: SCENES.server },
              { title: "Bot Economia", tag: "Discord", img: SCENES.dual },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10"
              >
                <div className="relative h-64 sm:h-72">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-wider text-violet-200 backdrop-blur">
                    {p.tag}
                  </span>
                  <h3 className="absolute bottom-5 left-5 text-xl font-semibold text-white">
                    {p.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-[85vh] overflow-hidden">
        <FullBleed src={SCENES.teamWork} alt="Team al lavoro" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Rocket className="mx-auto mb-5 h-9 w-9 text-cyan-300" />
            <h2 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">
              Hai un'idea da far diventare prodotto?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-200">
              Parliamone. Ti rispondiamo con un piano chiaro, non con una presentazione vuota.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition hover:scale-105"
              >
                <MessageSquare className="h-4 w-4" />
                Contattaci
              </Link>
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm text-white backdrop-blur"
              >
                Vedi lo store
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/5 py-14">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          {[
            { icon: Shield, t: "Codice solido", d: "Architetture pensate per durare." },
            { icon: Zap, t: "Consegne rapide", d: "Iterazioni corte, feedback continui." },
            { icon: Code2, t: "Stack moderno", d: "Next.js, TypeScript, Firebase e Discord." },
          ].map((item) => (
            <div key={item.t} className="text-center">
              <item.icon className="mx-auto mb-3 h-7 w-7 text-violet-300" />
              <h3 className="font-semibold text-white">{item.t}</h3>
              <p className="mt-1 text-sm text-zinc-400">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <TeamSection />
      <Partners />
    </div>
  );
}
