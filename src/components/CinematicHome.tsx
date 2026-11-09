"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Globe,
  Zap,
  Cpu,
  Braces,
  Shield,
  GitBranch,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";

const IMG = {
  hero: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=90",
  code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=90",
  desk: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=90",
  neon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=90",
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
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2300);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block h-[1.05em] min-w-[8ch] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bg-gradient-to-r from-violet-100 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{WORDS[0]}</span>
    </span>
  );
}

function TypeDeploy() {
  const lines = [
    'await ship({ env: "prod" })',
    "→ live · 42s · zero downtime",
  ];
  const [li, setLi] = useState(0);
  const [n, setN] = useState(0);
  const full = lines[li];
  useEffect(() => {
    if (n >= full.length) {
      const t = setTimeout(() => {
        setLi((x) => (x + 1) % lines.length);
        setN(0);
      }, 1600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((x) => x + 1), 28);
    return () => clearTimeout(t);
  }, [n, full.length, li]);
  return (
    <span className="font-mono text-emerald-300">
      {full.slice(0, n)}
      <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-emerald-300 align-middle" />
    </span>
  );
}

function MeshBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-violet-600/40 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 top-1/3 h-[60%] w-[60%] rounded-full bg-fuchsia-500/25 blur-[110px]"
        animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[50%] w-[50%] rounded-full bg-cyan-500/20 blur-[100px]"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);

  const { scrollYProgress: page } = useScroll({
    target: root,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: heroP } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: storyP } = useScroll({
    target: story,
    offset: ["start end", "end start"],
  });

  const bar = useSpring(page, { stiffness: 100, damping: 30 });
  const heroOp = useTransform(heroP, [0, 0.5], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 100]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.12]);
  const s1 = useTransform(storyP, [0.05, 0.18, 0.28, 0.38], [0, 1, 1, 0]);
  const s2 = useTransform(storyP, [0.25, 0.38, 0.48, 0.58], [0, 1, 1, 0]);
  const s3 = useTransform(storyP, [0.45, 0.58, 0.72, 0.88], [0, 1, 1, 0.15]);
  const imgScale = useTransform(storyP, [0, 1], [1.25, 1]);
  const codeY = useTransform(storyP, [0, 1], [40, -40]);

  return (
    <div ref={root} className="relative bg-[#08051a] text-white">
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_16px_rgba(167,139,250,0.9)]"
        style={{ scaleX: bar }}
      />

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src={IMG.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0a0618]/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12082a]/40 via-transparent to-[#08051a]" />
        </motion.div>
        <MeshBg />

        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

        <motion.div
          style={{ opacity: heroOp, y: heroY }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
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
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[2.75rem] font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
              >
                Costruiamo
                <br />
                <WordCycle />
                <br />
                <span className="text-white/75">che restano.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-7 max-w-md text-base leading-relaxed text-zinc-200/90 sm:text-lg"
              >
                Siti, app, bot Discord e automazioni. TypeScript end-to-end,
                UI precisa, deploy reale — non solo mockup.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-10 flex flex-wrap gap-3"
              >
                <Link
                  href="/custom"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-900 shadow-[0_0_40px_rgba(167,139,250,0.35)] transition hover:scale-[1.04]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-violet-200/60 to-transparent transition duration-700 group-hover:translate-x-full" />
                  Esplora Custom
                  <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-medium text-white backdrop-blur-md transition hover:border-violet-300/50 hover:bg-violet-500/20"
                >
                  Store bot
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-14 flex flex-wrap gap-8 border-t border-white/15 pt-8"
              >
                {[
                  { k: "TS", v: "Type-safe" },
                  { k: "24/7", v: "Assistente" },
                  { k: "∞", v: "Iterazioni" },
                ].map((m) => (
                  <div key={m.k}>
                    <p className="font-mono text-2xl font-semibold text-white">{m.k}</p>
                    <p className="text-[11px] text-zinc-400">{m.v}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.25, duration: 1 }}
              className="relative hidden lg:block"
              style={{ perspective: 1200 }}
            >
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-500/40 via-fuchsia-500/20 to-cyan-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-black/40 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-white/45">
                    launch.ts · production
                  </span>
                  <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    online
                  </span>
                </div>
                <div className="space-y-1.5 p-5 font-mono text-xs leading-7">
                  <p>
                    <span className="text-fuchsia-300">export async function</span>{" "}
                    <span className="text-amber-200">launch</span>() {"{"}
                  </p>
                  <p className="pl-3">
                    <span className="text-fuchsia-300">const</span> r = <TypeDeploy />
                  </p>
                  <p className="pl-3">
                    <span className="text-fuchsia-300">return</span> r
                  </p>
                  <p>{"}"}</p>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
                    {["lint ✓", "types ✓", "tests ✓", "deploy ✓"].map((b) => (
                      <span
                        key={b}
                        className="rounded-md border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0c0820] to-transparent" />
      </section>

      <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#0c0820] via-[#140c2c] to-[#0a1428] py-4">
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

      <section ref={story} className="relative h-[220svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={IMG.code} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-[#0a0618]/65" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.4),transparent_55%)]" />
          </motion.div>

          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[220px] sm:min-h-[280px]">
              <motion.h2
                style={{ opacity: s1 }}
                className="absolute inset-0 flex flex-col justify-center font-serif text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl"
              >
                Codice leggibile.
                <span className="mt-2 italic text-violet-200/85">Decisioni chiare.</span>
              </motion.h2>
              <motion.h2
                style={{ opacity: s2 }}
                className="absolute inset-0 flex flex-col justify-center font-serif text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl"
              >
                UI non è
                <span className="mt-2 italic text-fuchsia-200/90">un dopo pensiero.</span>
              </motion.h2>
              <motion.h2
                style={{ opacity: s3 }}
                className="absolute inset-0 flex flex-col justify-center font-serif text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl"
              >
                Deploy, non demo.
                <span className="mt-2 italic text-cyan-200/90">In produzione.</span>
              </motion.h2>
            </div>

            <motion.div style={{ y: codeY }} className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-black/50 p-6 font-mono text-xs leading-7 shadow-2xl backdrop-blur-xl">
                <p className="mb-2 text-white/40">// principles.ts</p>
                <p>
                  <span className="text-fuchsia-300">export const</span>{" "}
                  <span className="text-sky-200">craft</span> = [
                </p>
                <p className="pl-4 text-emerald-300">"type everything",</p>
                <p className="pl-4 text-emerald-300">"ship small & often",</p>
                <p className="pl-4 text-emerald-300">"own the prod box",</p>
                <p className="pl-4 text-emerald-300">"design with code"</p>
                <p>];</p>
                <p className="mt-4 text-white/35">// no magic. just skill.</p>
              </div>
            </motion.div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#100a24] to-transparent" />
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#100a24] via-[#120c28] to-[#0c1028] px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-violet-300">
                Capabilities
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Quattro linee.
                <span className="mt-1 block text-zinc-400">Uno standard alto.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-zinc-400">
              Stesso livello su web, bot, automazioni e software custom.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Globe,
                title: "Siti & Web App",
                text: "Landing, corporate, dashboard, SaaS. Performance, SEO, conversione.",
                href: "/custom",
                tag: "full-stack",
              },
              {
                icon: Bot,
                title: "Bot Discord",
                text: "Economia, ticket, ranking, pannelli. Per community che scalano.",
                href: "/store",
                tag: "realtime",
              },
              {
                icon: Zap,
                title: "Automazioni",
                text: "API, webhook, pipeline. Meno click ripetuti, più affidabilità.",
                href: "/custom",
                tag: "ops",
              },
              {
                icon: Cpu,
                title: "Software custom",
                text: "Tool e gestionali su misura. Documentati, manutenibili.",
                href: "/custom",
                tag: "bespoke",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={c.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.09] to-transparent p-7 transition duration-500 hover:border-violet-400/45 hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)]"
                >
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-600/0 blur-3xl transition duration-500 group-hover:bg-violet-600/30" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-violet-200 transition group-hover:scale-110 group-hover:border-violet-400/50 group-hover:bg-violet-500/25">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-zinc-500">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="relative mt-5 text-2xl font-semibold">{c.title}</h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-300/85">
                    {c.text}
                  </p>
                  <span className="relative mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300">
                    Apri
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#0c1028] to-[#0a0e20]">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[520px]">
            <Image src={IMG.desk} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0c1028]/30 to-[#0c1028] max-lg:bg-gradient-to-t max-lg:from-[#0c1028] max-lg:via-[#0c1028]/40 max-lg:to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-black/55 p-4 font-mono text-[11px] shadow-2xl backdrop-blur-xl sm:text-xs">
              <p className="text-zinc-400">$ gr ship --env production</p>
              <p className="text-emerald-300">✓ build · ✓ tests · ✓ live in 42s</p>
              <p className="text-zinc-500">commit · main</p>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:py-24">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] text-cyan-300">
              <Terminal className="h-3 w-3" />
              craft over noise
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Brief → architettura
              <br />
              <span className="text-zinc-400">→ build → ship</span>
            </h2>
            <ul className="mt-8 space-y-3.5 text-sm text-zinc-300">
              {[
                "Scope chiaro prima di scrivere codice",
                "UI e backend progettati insieme",
                "Consegna in produzione, non solo demo",
                "Supporto e evolutive quando servono",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/25 text-violet-300">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: "Produzione" },
                { icon: GitBranch, label: "Manutenibile" },
                { icon: Layers, label: "Design+code" },
              ].map((x) => (
                <div
                  key={x.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <x.icon className="mx-auto h-4 w-4 text-cyan-300" />
                  <p className="mt-2 text-[11px] text-zinc-400">{x.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/chi-siamo"
              className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-violet-300 transition hover:gap-3"
            >
              Il team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-32 sm:px-6">
        <div className="absolute inset-0">
          <Image
            src={IMG.neon}
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e20]/95 via-[#140a2a]/80 to-[#08051a]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(139,92,246,0.45),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-violet-300/90">
            Next commit
          </p>
          <h2 className="mt-5 font-serif text-4xl font-light sm:text-6xl">
            Il progetto
            <br />
            <span className="italic text-violet-100/85">parte da qui.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-zinc-300/85">
            Scope, tempi e prezzo chiari. Senza giri di parole.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/custom"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-semibold text-zinc-900 shadow-[0_0_50px_rgba(255,255,255,0.2)] transition hover:scale-[1.04]"
            >
              Catalogo Custom
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-9 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
            >
              Scrivici
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#08051a] to-transparent" />
      </section>

      <div className="bg-[#08051a]">
        <TeamSection />
      </div>
      <div className="border-t border-white/5 bg-[#08051a]">
        <Partners />
      </div>
      <div className="h-16 bg-[#08051a]" />
    </div>
  );
}
