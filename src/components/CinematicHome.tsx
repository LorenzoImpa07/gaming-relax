"use client";

import { useEffect, useRef, useState } from "react";
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
  ArrowUpRight,
  Bot,
  Globe,
  Zap,
  Cpu,
  Terminal,
  Code2,
  Braces,
  GitBranch,
  Layers,
  Shield,
  Sparkles,
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
  "REST / GraphQL",
  "CI/CD",
];

function TypeLine() {
  const full =
    'await deploy({ env: "production", checks: "all" }) // → live';
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= full.length) {
      const t = setTimeout(() => setN(0), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((x) => x + 1), 28);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <span className="font-mono text-[11px] text-emerald-300/90 sm:text-xs">
      {full.slice(0, n)}
      <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-emerald-300 align-middle" />
    </span>
  );
}

function CodePanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0c12] shadow-[0_0_60px_rgba(139,92,246,0.15)]">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
        <span className="ml-2 font-mono text-[10px] text-zinc-500">
          gaming-relax · production
        </span>
        <span className="ml-auto rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
          main ✓
        </span>
      </div>
      <div className="space-y-1 p-4 font-mono text-[11px] leading-6 sm:text-xs sm:leading-7">
        <p>
          <span className="text-fuchsia-400">import</span>{" "}
          <span className="text-sky-300">{`{ ship }`}</span>{" "}
          <span className="text-fuchsia-400">from</span>{" "}
          <span className="text-emerald-300">"@gr/core"</span>
        </p>
        <p className="text-zinc-600">// typed · tested · deployable</p>
        <p>
          <span className="text-fuchsia-400">export async function</span>{" "}
          <span className="text-sky-300">launch</span>
          <span className="text-zinc-400">()</span> {"{"}
        </p>
        <p className="pl-4">
          <span className="text-fuchsia-400">const</span>{" "}
          <span className="text-violet-300">result</span> ={" "}
          <TypeLine />
        </p>
        <p className="pl-4">
          <span className="text-fuchsia-400">return</span>{" "}
          <span className="text-violet-300">result</span>
        </p>
        <p>{"}"}</p>
        <p className="pt-2 text-zinc-500">
          // uptime · auth · edge cases — handled
        </p>
      </div>
    </div>
  );
}

const CAPABILITIES = [
  {
    icon: Globe,
    title: "Web & App",
    text: "Siti, dashboard, SaaS MVP. Next.js, design system, SEO.",
    href: "/custom",
    tag: "full-stack",
  },
  {
    icon: Bot,
    title: "Bot Discord",
    text: "Economia, ticket, ranking, pannelli moderatori.",
    href: "/store",
    tag: "realtime",
  },
  {
    icon: Zap,
    title: "Automazioni",
    text: "API, webhook, pipeline. Meno click, più affidabilità.",
    href: "/custom",
    tag: "ops",
  },
  {
    icon: Cpu,
    title: "Software custom",
    text: "Tool interni e gestionali. Su misura, documentati.",
    href: "/custom",
    tag: "bespoke",
  },
];

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

  const bar = useSpring(page, { stiffness: 90, damping: 30 });
  const heroOp = useTransform(heroP, [0, 0.55], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.12]);
  const glow = useTransform(heroP, [0, 0.5], [0.45, 0.1]);

  const line1 = useTransform(storyP, [0.08, 0.2, 0.32, 0.42], [0, 1, 1, 0]);
  const line2 = useTransform(storyP, [0.28, 0.4, 0.52, 0.62], [0, 1, 1, 0]);
  const line3 = useTransform(storyP, [0.48, 0.6, 0.75, 0.88], [0, 1, 1, 0.2]);
  const storyScale = useTransform(storyP, [0, 1], [1.2, 1]);
  const codeX = useTransform(storyP, [0, 1], [40, -20]);

  return (
    <div ref={root} className="relative overflow-x-hidden bg-[#030306] text-white">
      <motion.div
        className="fixed left-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
        style={{ scaleX: bar }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
      </div>

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src={IMG.hero}
            alt=""
            fill
            priority
            className="object-cover opacity-[0.28]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030306]/50 via-[#030306]/75 to-[#030306]" />
        </motion.div>
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] rounded-full bg-violet-600/30 blur-[130px]"
        />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-[110px]" />

        <motion.div
          style={{ opacity: heroOp, y: heroY }}
          className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 font-mono text-[11px] text-violet-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              status: shipping · team IT
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              Costruiamo software
              <br />
              <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                che si vede
              </span>
              <br />
              <span className="text-white/90">e funziona.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg"
            >
              Siti, app, bot Discord e automazioni. TypeScript, design system,
              deploy in produzione. Non slide — prodotti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/custom"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.15)] transition hover:scale-[1.03]"
              >
                <span className="relative">Esplora Custom</span>
                <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:border-violet-400/40 hover:bg-violet-500/10"
              >
                <Code2 className="h-4 w-4 text-violet-300" />
                Store
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-14 flex flex-wrap gap-6 border-t border-white/10 pt-8"
            >
              {[
                { k: "TS", v: "Type-safe" },
                { k: "100%", v: "Client-owned" },
                { k: "24/7", v: "Assistente" },
              ].map((m) => (
                <div key={m.k}>
                  <p className="font-mono text-xl font-semibold text-white sm:text-2xl">
                    {m.k}
                  </p>
                  <p className="text-xs text-zinc-500">{m.v}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-600/25 via-fuchsia-500/10 to-cyan-500/15 blur-2xl" />
            <CodePanel />
            <div className="mt-4 flex gap-2">
              {["lint", "typecheck", "deploy"].map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-zinc-400"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="relative z-10 overflow-hidden border-y border-white/5 bg-zinc-950/80 py-3.5">
        <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10">
          {[...STACK, ...STACK].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-2 font-mono text-sm text-zinc-500"
            >
              <Braces className="h-3.5 w-3.5 text-violet-400/70" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <section ref={story} className="relative z-10 h-[220svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <motion.div style={{ scale: storyScale }} className="absolute inset-0">
            <Image src={IMG.code} alt="" fill className="object-cover opacity-40" sizes="100vw" />
            <div className="absolute inset-0 bg-[#030306]/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.25),transparent_60%)]" />
          </motion.div>

          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[220px] sm:min-h-[280px]">
              <motion.p
                style={{ opacity: line1 }}
                className="absolute inset-0 flex items-center font-serif text-3xl font-light leading-[1.15] sm:text-4xl lg:text-5xl"
              >
                Codice leggibile.
                <br />
                <span className="italic text-white/70">Decisioni esplicite.</span>
              </motion.p>
              <motion.p
                style={{ opacity: line2 }}
                className="absolute inset-0 flex items-center font-serif text-3xl font-light leading-[1.15] sm:text-4xl lg:text-5xl"
              >
                UI non è
                <br />
                <span className="italic text-violet-200/90">un dopo pensiero.</span>
              </motion.p>
              <motion.p
                style={{ opacity: line3 }}
                className="absolute inset-0 flex items-center font-serif text-3xl font-light leading-[1.15] sm:text-4xl lg:text-5xl"
              >
                Deploy, non demo.
                <br />
                <span className="italic text-cyan-200/85">In produzione.</span>
              </motion.p>
            </div>

            <motion.div style={{ x: codeX }} className="hidden lg:block">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-5 font-mono text-xs leading-7 backdrop-blur-md">
                <p className="text-zinc-600">// engineering.principles.ts</p>
                <p>
                  <span className="text-fuchsia-400">export const</span>{" "}
                  <span className="text-sky-300">principles</span> = [
                </p>
                <p className="pl-3 text-emerald-300">"type what matters",</p>
                <p className="pl-3 text-emerald-300">"ship small, often",</p>
                <p className="pl-3 text-emerald-300">"own production",</p>
                <p className="pl-3 text-emerald-300">"measure before optimise"</p>
                <p>];</p>
                <p className="mt-3 text-zinc-600">// no magic. just craft.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5 px-4 py-24 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-violet-400">
                capabilities
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Cosa sappiamo fare
                <span className="block text-zinc-500">— e lo facciamo bene</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-zinc-500">
              Stesso standard su ogni linea: chiarezza, performance, ownership.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
              >
                <Link
                  href={c.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-7 transition hover:border-violet-500/45 hover:shadow-[0_20px_60px_rgba(139,92,246,0.12)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300 transition group-hover:border-violet-400/40 group-hover:bg-violet-500/20">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] text-zinc-500">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                    {c.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-violet-300">
                    Apri
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5 bg-[#07070c] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-400/90">
              pipeline
            </p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Dal brief al deploy</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              ["01", "Discovery", "Obiettivi, vincoli, metriche. Niente feature inutili."],
              ["02", "Architecture", "Stack, dati, auth, deploy — documentati."],
              ["03", "Build", "Iterazioni corte, tipizzazione, UI curata."],
              ["04", "Ship & care", "Produzione, monitor, evolutive."],
            ].map(([n, t, d]) => (
              <div
                key={n}
                className="rounded-2xl border border-white/8 bg-black/40 p-5 transition hover:border-violet-500/30"
              >
                <p className="font-mono text-sm text-violet-400">{n}</p>
                <h3 className="mt-3 text-lg font-medium">{t}</h3>
                <p className="mt-2 text-sm text-zinc-400">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Produzione, non prototipi",
                text: "Auth, ruoli, edge case. Quello che usi ogni giorno.",
              },
              {
                icon: GitBranch,
                title: "Codice manutenibile",
                text: "Struttura chiara, TypeScript, componenti riusabili.",
              },
              {
                icon: Layers,
                title: "Design + engineering",
                text: "UI e logica nate insieme. Niente mock impossibili.",
              },
            ].map((t) => (
              <div
                key={t.title}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <t.icon className="h-5 w-5 text-cyan-300/90" />
                <h3 className="mt-4 font-medium">{t.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[520px]">
            <Image src={IMG.desk} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-transparent to-transparent lg:bg-gradient-to-r" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-[11px] backdrop-blur-md sm:text-xs">
              <p className="text-zinc-500">$ gr ship --env production</p>
              <p className="text-emerald-400">✓ build · ✓ tests · ✓ live in 42s</p>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-20">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] text-cyan-300">
              <Terminal className="h-3 w-3" />
              craft
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ogni riga ha un motivo.
            </h2>
            <p className="mt-4 text-zinc-400">
              Non vendiamo template. Progettiamo stack, interfacce e flussi che
              reggono il carico reale — poi li mettiamo online.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-300">
              {[
                "Architetture leggibili e tipizzate",
                "UI responsive e accessibile",
                "Deploy e monitoraggio inclusi",
                "Comunicazione diretta, zero intermediari inutili",
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  {x}
                </li>
              ))}
            </ul>
            <Link
              href="/chi-siamo"
              className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
            >
              Il team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/5 px-4 py-28 sm:px-6">
        <div className="absolute inset-0">
          <Image src={IMG.neon} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-[#030306]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(139,92,246,0.3),transparent_55%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-violet-300/80">
            next commit
          </p>
          <h2 className="mt-4 font-serif text-3xl font-light sm:text-5xl">
            Il tuo prossimo progetto
            <br />
            <span className="italic text-white/75">parte da una conversazione.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-400">
            Scope, tempi e prezzo chiari. Senza giri di parole.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-[0_0_40px_rgba(255,255,255,0.12)] transition hover:scale-[1.03]"
            >
              Catalogo Custom
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Scrivici
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[#07070c]">
        <TeamSection />
      </div>
      <div className="relative z-10 border-t border-white/5 bg-[#07070c]">
        <Partners />
      </div>
      <div className="h-16" />
    </div>
  );
}
