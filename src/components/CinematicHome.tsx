"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  Globe,
  Zap,
  Cpu,
  Braces,
  Sparkles,
  Terminal,
  Rocket,
  Code2,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";
import { TrustBar } from "@/components/TrustBar";
import { PortfolioTeaser } from "@/components/PortfolioTeaser";
import { HeroSpotlight } from "@/components/ui/HeroSpotlight";

const IMG = {
  hero: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=90",
  neon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=90",
  code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=90",
};

const STACK = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Firebase",
  "Tailwind",
  "Framer Motion",
  "Discord API",
  "PostgreSQL",
  "Vercel",
  "GraphQL",
  "CI/CD",
];

const WORDS = ["Codice.", "Design.", "Prodotti.", "Risultati."];

function WordCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block h-[1.05em] min-w-[9ch] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ y: "120%", opacity: 0, filter: "blur(8px)", rotateX: 40 }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
          exit={{ y: "-120%", opacity: 0, filter: "blur(8px)", rotateX: -30 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{WORDS[0]}</span>
    </span>
  );
}

function FloatingParticles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + (i % 4),
        delay: (i % 8) * 0.4,
        dur: 6 + (i % 5),
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-violet-300/40"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            boxShadow: "0 0 8px rgba(167,139,250,0.5)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.85, 0.2] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function LiveTerminal() {
  const lines = [
    { t: "$ npm run ship --prod", c: "text-zinc-400" },
    { t: "→ compiling routes…", c: "text-zinc-500" },
    { t: "✓ 42 pages optimized", c: "text-emerald-400" },
    { t: "✓ edge deploy · 1.8s", c: "text-cyan-300" },
    { t: "↗ live · gaming-relax.app", c: "text-violet-300" },
  ];
  const [visible, setVisible] = useState(1);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible((v) => (v >= lines.length ? 1 : v + 1));
    }, 1100);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0a14]/90 shadow-[0_0_60px_rgba(124,58,237,0.25)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-[10px] text-zinc-500">deploy — zsh</span>
        <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          online
        </span>
      </div>
      <div className="space-y-1.5 px-4 py-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        {lines.slice(0, visible).map((l, i) => (
          <motion.p
            key={`${l.t}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className={l.c}
          >
            {l.t}
          </motion.p>
        ))}
        <span className="inline-block h-3.5 w-1.5 animate-pulse bg-violet-300 align-middle" />
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-10 h-24 w-24 rounded-full bg-cyan-400/15 blur-3xl" />
    </div>
  );
}

function MagneticButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16 });
  const sy = useSpring(y, { stiffness: 180, damping: 16 });

  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          x.set((e.clientX - r.left - r.width / 2) * 0.25);
          y.set((e.clientY - r.top - r.height / 2) * 0.25);
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className={
          variant === "primary"
            ? "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-900 shadow-[0_0_50px_rgba(167,139,250,0.45)] transition"
            : "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-medium text-white backdrop-blur-md transition hover:border-violet-300/50 hover:bg-violet-500/20"
        }
      >
        {variant === "primary" && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-200/70 to-transparent transition duration-700 group-hover:translate-x-full" />
        )}
        {children}
      </Link>
    </motion.div>
  );
}

function GlowCard({
  icon: Icon,
  title,
  text,
  href,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  href: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={href}
        className="card-lift group relative block overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-7 backdrop-blur-sm"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/0 blur-2xl transition duration-500 group-hover:bg-violet-500/25" />
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/15 text-violet-200 transition group-hover:scale-110 group-hover:border-violet-300/50 group-hover:shadow-[0_0_24px_rgba(167,139,250,0.4)]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-violet-300 opacity-0 transition group-hover:opacity-100">
          Apri <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </motion.div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    let f = 0;
    const steps = 40;
    const id = setInterval(() => {
      f += 1;
      setN(Math.round((to * f) / steps));
      if (f >= steps) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [on, to]);
  return (
    <span ref={ref} className="font-mono">
      {n}
      {suffix}
    </span>
  );
}

export function CinematicHome() {
  const hero = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const heroOp = useTransform(heroP, [0, 0.55], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 90]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.1]);

  return (
    <div className="relative bg-[#07041a] text-white">
      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image src={IMG.hero} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#09061a]/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12082a]/50 via-transparent to-[#07041a]" />
        </motion.div>

        <FloatingParticles />
        <HeroSpotlight />

        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />

        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-1/4 h-[280px] w-[280px] rounded-full bg-cyan-500/15 blur-[90px]" />

        <motion.div
          style={{ opacity: heroOp, y: heroY }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] text-violet-100 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Studio · shipping in production
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.85rem] font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl"
              >
                Costruiamo
                <br />
                <WordCycle />
                <br />
                <span className="text-white/70">che restano.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-7 max-w-md text-base leading-relaxed text-zinc-200/90 sm:text-lg"
              >
                Siti, app, bot Discord e automazioni. TypeScript end-to-end, UI
                precisa, deploy reale — non solo mockup.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <MagneticButton href="/custom">
                  Esplora Custom
                  <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
                </MagneticButton>
                <MagneticButton href="/store" variant="ghost">
                  Store
                </MagneticButton>
                <MagneticButton href="/portfolio" variant="ghost">
                  Portfolio
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-14 flex flex-wrap gap-10 border-t border-white/15 pt-8"
              >
                {[
                  { k: <CountUp to={40} suffix="+" />, v: "Progetti" },
                  { k: <CountUp to={24} suffix="/7" />, v: "Assistenza" },
                  { k: "100%", v: "Type-safe" },
                ].map((m, i) => (
                  <div key={i}>
                    <p className="text-2xl font-semibold text-white">{m.k}</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">{m.v}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/10 to-cyan-400/20 blur-2xl" />
              <LiveTerminal />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-3 hidden rounded-xl border border-white/15 bg-zinc-950/90 px-3 py-2 font-mono text-[10px] text-cyan-200 shadow-xl backdrop-blur sm:block"
              >
                <Code2 className="mb-1 h-3.5 w-3.5 text-cyan-400" />
                next build · ok
              </motion.div>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-2 -top-3 hidden rounded-xl border border-white/15 bg-zinc-950/90 px-3 py-2 font-mono text-[10px] text-violet-200 shadow-xl backdrop-blur sm:block"
              >
                <Rocket className="mb-1 h-3.5 w-3.5 text-violet-400" />
                edge · live
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500"
          >
            scroll
            <span className="h-8 w-px bg-gradient-to-b from-violet-400/80 to-transparent" />
          </motion.div>
        </div>
      </section>

      <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#0c0820] via-[#160c30] to-[#0a1428] py-4">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12">
          {[...STACK, ...STACK].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-2.5 font-mono text-sm text-violet-200/55"
            >
              <Braces className="h-3.5 w-3.5 text-violet-400" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <TrustBar />

      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-violet-300"
          >
            Capabilities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            Quattro linee.
            <span className="mt-1 block text-zinc-400">Uno standard alto.</span>
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <GlowCard icon={Globe} title="Siti & Web App" text="Landing, corporate, dashboard, SaaS — performanti e curate." href="/custom" delay={0} />
            <GlowCard icon={Bot} title="Bot Discord" text="Economia, ticket, ranking, pannelli admin su misura." href="/store" delay={0.08} />
            <GlowCard icon={Zap} title="Automazioni" text="API, webhook, pipeline e integrazioni senza frizione." href="/custom" delay={0.16} />
            <GlowCard icon={Cpu} title="Software custom" text="Tool e gestionali pensati sul tuo flusso reale." href="/custom" delay={0.24} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">Engineering</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Codice che si vede.
              <span className="mt-1 block text-zinc-400">Anche quando non lo leggi.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400">
              Architetture pulite, componenti riutilizzabili, deploy automatici.
              L'esperienza utente e la qualità del codice viaggiano insieme.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              {["TypeScript strict · zero any inutili", "UI motion con Framer · 60fps", "CI/CD su Vercel · preview per PR"].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-violet-600/20 to-cyan-500/10 blur-xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/12 shadow-2xl">
              <Image src={IMG.code} alt="Code" width={900} height={600} className="h-auto w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07041a] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-[11px] text-emerald-300 backdrop-blur">
                <Terminal className="mb-1 inline h-3.5 w-3.5 text-emerald-400" /> git push origin main · pipeline green
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <PortfolioTeaser />

      <section className="relative overflow-hidden px-4 py-28 sm:px-6">
        <div className="absolute inset-0">
          <Image src={IMG.neon} alt="" fill className="object-cover opacity-35" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07041a]/95 via-[#120a2a]/75 to-[#07041a]" />
        </div>
        <FloatingParticles />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-4xl font-light sm:text-5xl">
            Il progetto{" "}
            <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text italic text-transparent">parte da qui.</span>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-md text-zinc-300/85">Scope, tempi e prezzo chiari. Senza giri di parole.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton href="/preventivo">Preventivo guidato</MagneticButton>
            <MagneticButton href="/custom" variant="ghost">Catalogo Custom</MagneticButton>
          </div>
        </div>
      </section>

      <div className="bg-[#07041a]">
        <TeamSection />
      </div>
      <div className="border-t border-white/5 bg-[#07041a]">
        <Partners />
      </div>
      <div className="h-16 bg-[#07041a]" />
    </div>
  );
}
