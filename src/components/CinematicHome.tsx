"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Code2,
  Bot,
  Zap,
  Rocket,
  ChevronDown,
  MessageSquare,
  Shield,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";

const VIDEOS = {
  code: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  abstract:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  neon: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
};

function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-400"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-[10px] uppercase tracking-[0.3em]">Scorri</span>
      <ChevronDown className="h-5 w-5 text-violet-400" />
    </motion.div>
  );
}

export function CinematicHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: pageProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: servicesProgress } = useScroll({
    target: servicesRef,
    offset: ["start end", "end start"],
  });

  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -80]);

  const storyOpacity = useTransform(storyProgress, [0, 0.2, 0.5, 0.8], [0, 1, 1, 0.3]);
  const storyScale = useTransform(storyProgress, [0, 0.5, 1], [0.92, 1, 1.05]);
  const storyX = useTransform(storyProgress, [0, 1], [-40, 40]);

  const s1Opacity = useTransform(servicesProgress, [0, 0.15, 0.35, 0.5], [0, 1, 1, 0]);
  const s2Opacity = useTransform(servicesProgress, [0.25, 0.4, 0.6, 0.75], [0, 1, 1, 0]);
  const s3Opacity = useTransform(servicesProgress, [0.5, 0.65, 0.85, 1], [0, 1, 1, 1]);
  const s1Y = useTransform(servicesProgress, [0, 0.35], [60, 0]);
  const s2Y = useTransform(servicesProgress, [0.25, 0.6], [60, 0]);
  const s3Y = useTransform(servicesProgress, [0.5, 0.85], [60, 0]);

  const progressBar = useSpring(pageProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative bg-[#050508]">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
        style={{ scaleX: progressBar }}
      />

      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src={VIDEOS.neon}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#07070c]/55 to-[#050508]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(34,211,238,0.12),transparent_45%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroTitleY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-violet-200 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            Gaming Relax · 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Codice che{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              vive
            </span>
            <br />
            e scale con te
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-6 max-w-xl text-base text-zinc-300/90 sm:text-lg"
          >
            Bot Discord, applicazioni e automazioni. Design cinematografico, consegne concrete.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/contatti"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(139,92,246,0.45)] transition-transform hover:scale-105"
            >
              Inizia un progetto
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/10"
            >
              Vedi i servizi
            </Link>
          </motion.div>
        </motion.div>

        <ScrollHint />
      </section>

      {/* STORY */}
      <section ref={storyRef} className="relative h-[140vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ opacity: storyOpacity, scale: storyScale }} className="absolute inset-0">
            <video
              className="h-full w-full object-cover"
              src={VIDEOS.code}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-[#050508]/80" />
          </motion.div>

          <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-20">
            <motion.div style={{ x: storyX }} className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
                Il metodo
              </p>
              <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Dalla brief
                <br />
                <span className="text-violet-300">al deploy</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:text-lg">
                Ascoltiamo, progettiamo, sviluppiamo e rilasciamo. Niente slide inutili: codice che
                gira, dashboard che contano, bot che non dormono.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Discord.js", "Next.js", "Firebase", "API", "Automazioni"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 backdrop-blur"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES STACK */}
      <section ref={servicesRef} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#050508]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,rgba(34,211,238,0.1),transparent_50%)]" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-6 sm:grid-cols-3">
            {[
              {
                opacity: s1Opacity,
                y: s1Y,
                icon: Bot,
                title: "Bot Discord",
                text: "Moderazione, economia, ticket, dashboard. Stabili e scalabili.",
              },
              {
                opacity: s2Opacity,
                y: s2Y,
                icon: Code2,
                title: "Web & Software",
                text: "App custom, gestionali, tool interni. Dal prototipo alla produzione.",
              },
              {
                opacity: s3Opacity,
                y: s3Y,
                icon: Zap,
                title: "Automazioni",
                text: "Integrazioni API, webhook, script che tolgono lavoro ripetitivo.",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                style={{ opacity: card.opacity, y: card.y }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl box-glow-hover"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-cyan-500/20 text-violet-300">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO CTA */}
      <section className="relative h-[90vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEOS.abstract}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <Rocket className="mx-auto mb-6 h-10 w-10 text-cyan-300" />
            <h2 className="max-w-3xl text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Pronto a far{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                scalare
              </span>{" "}
              il tuo progetto?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-zinc-300">
              Store, forum, dashboard e supporto: tutto in un unico ecosistema.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition hover:scale-105"
              >
                Apri lo store
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur"
              >
                <MessageSquare className="h-4 w-4" />
                Parliamone
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-zinc-950/80 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          {[
            { icon: Shield, title: "Codice solido", text: "Architetture pensate per durare." },
            { icon: Zap, title: "Consegne rapide", text: "Iterazioni corte, feedback continui." },
            { icon: Rocket, title: "Supporto reale", text: "Dopo il rilascio non spariamo." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <f.icon className="mx-auto mb-3 h-7 w-7 text-violet-400" />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{f.text}</p>
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
            <h2 className="text-3xl font-bold text-white sm:text-5xl text-glow">Progetti</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Alcuni esempi del tipo di lavoro che portiamo online.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Bot Moderazione Avanzata",
                tag: "Discord",
                img: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=900&q=80",
              },
              {
                title: "Gestionale Web",
                tag: "Next.js",
                img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
              },
              {
                title: "Automazioni Community",
                tag: "API",
                img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&q=80",
              },
              {
                title: "Bot Economia & Giochi",
                tag: "Discord",
                img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&q=80",
              },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-violet-200 backdrop-blur">
                    {p.tag}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />
      <Partners />

      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white sm:text-5xl"
          >
            Hai un'idea?
          </motion.h2>
          <p className="mt-4 text-lg text-zinc-400">La trasformiamo in software che funziona.</p>
          <Link
            href="/contatti"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-10 py-4 text-base font-semibold text-white btn-glow"
          >
            <MessageSquare className="h-5 w-5" />
            Scrivici ora
          </Link>
        </div>
      </section>
    </div>
  );
}
