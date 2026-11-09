"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Globe,
  Zap,
  Cpu,
  Terminal,
  Braces,
  GitBranch,
  Layers,
  Shield,
  Sparkles,
  Play,
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
  "TypeScript", "Next.js", "React", "Node.js", "Firebase", "Tailwind",
  "Framer Motion", "Discord API", "PostgreSQL", "Vercel", "GraphQL", "CI/CD",
];

const FLOAT_SNIPPETS = [
  "const ok = true", "await ship()", "type Result = Ok", "export default",
  "npm run build", "git push origin", "useEffect(() =>", "framer-motion",
];

const WORDS = ["Codice.", "Design.", "Deploy.", "Crescita."];

function TypeLine() {
  const lines = [
    'await deploy({ env: "production" })',
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
      }, 1800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((x) => x + 1), 22);
    return () => clearTimeout(t);
  }, [n, full.length, li]);
  return (
    <span className="font-mono text-[11px] text-emerald-300 sm:text-xs">
      {full.slice(0, n)}
      <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-emerald-300 align-middle" />
    </span>
  );
}

function FloatingCode() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {FLOAT_SNIPPETS.map((s, i) => (
        <motion.span
          key={s}
          className="absolute font-mono text-[10px] text-violet-300/50 sm:text-xs"
          style={{ left: `${8 + (i * 12) % 80}%`, top: `${10 + (i * 17) % 75}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        >
          {s}
        </motion.span>
      ))}
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(500px circle at ${glowX}% ${glowY}%, rgba(139,92,246,0.22), transparent 45%)`;
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 10);
        rx.set((0.5 - py) * 8);
        glowX.set(px * 100);
        glowY.set(py * 100);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: bg }}
      />
      {children}
    </motion.div>
  );
}

function CodePanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080a10]/95 shadow-[0_0_80px_rgba(139,92,246,0.2)] backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 font-mono text-[10px] text-zinc-500">launch.ts · production</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          online
        </span>
      </div>
      <div className="space-y-1.5 p-5 font-mono text-[11px] leading-7 sm:text-xs">
        <p>
          <span className="text-fuchsia-400">import</span>{" "}
          <span className="text-sky-300">{`{ ship }`}</span>{" "}
          <span className="text-fuchsia-400">from</span>{" "}
          <span className="text-emerald-300">"@gr/core"</span>
        </p>
        <p className="text-zinc-600">// typed · tested · measured</p>
        <p>
          <span className="text-fuchsia-400">export async function</span>{" "}
          <span className="text-amber-300">launch</span>
          <span className="text-zinc-400">()</span> {"{"}
        </p>
        <p className="pl-4">
          <span className="text-fuchsia-400">const</span>{" "}
          <span className="text-violet-300">result</span> = <TypeLine />
        </p>
        <p className="pl-4">
          <span className="text-fuchsia-400">return</span>{" "}
          <span className="text-violet-300">result</span>
        </p>
        <p>{"}"}</p>
        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
          {["lint ✓", "types ✓", "tests ✓", "deploy ✓"].map((b) => (
            <span key={b} className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function WordCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -28, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const CAPABILITIES = [
  { icon: Globe, title: "Web & App", text: "Siti, dashboard, SaaS. Next.js, design system, SEO.", href: "/custom", tag: "full-stack" },
  { icon: Bot, title: "Bot Discord", text: "Economia, ticket, ranking, pannelli moderatori.", href: "/store", tag: "realtime" },
  { icon: Zap, title: "Automazioni", text: "API, webhook, pipeline. Meno click, più affidabilità.", href: "/custom", tag: "ops" },
  { icon: Cpu, title: "Software custom", text: "Tool e gestionali su misura. Documentati, manutenibili.", href: "/custom", tag: "bespoke" },
];

export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress: page } = useScroll({ target: root, offset: ["start start", "end end"] });
  const { scrollYProgress: heroP } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const { scrollYProgress: storyP } = useScroll({ target: story, offset: ["start end", "end start"] });

  const bar = useSpring(page, { stiffness: 100, damping: 28 });
  const heroOp = useTransform(heroP, [0, 0.5], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 120]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.15]);
  const blobOp = useTransform(heroP, [0, 0.6], [1, 0]);
  const line1 = useTransform(storyP, [0.06, 0.18, 0.28, 0.38], [0, 1, 1, 0]);
  const line2 = useTransform(storyP, [0.26, 0.38, 0.48, 0.58], [0, 1, 1, 0]);
  const line3 = useTransform(storyP, [0.46, 0.58, 0.72, 0.88], [0, 1, 1, 0.15]);
  const storyScale = useTransform(storyP, [0, 1], [1.25, 1]);
  const codeX = useTransform(storyP, [0, 1], [50, -30]);
  const codeRot = useTransform(storyP, [0, 1], [4, -2]);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(139,92,246,0.12), transparent 40%)`;

  return (
    <div
      ref={root}
      className="relative overflow-x-hidden bg-[#020205] text-white"
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
    >
      <motion.div className="pointer-events-none fixed inset-0 z-[1] hidden lg:block" style={{ background: spotlight }} />
      <motion.div className="fixed left-0 top-0 z-[80] h-[2.5px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_12px_rgba(167,139,250,0.8)]" style={{ scaleX: bar }} />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]" />
      </div>

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image src={IMG.hero} alt="" fill priority className="object-cover opacity-[0.22]" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020205]/40 via-[#020205]/80 to-[#020205]" />
        </motion.div>
        <FloatingCode />
        <motion.div style={{ opacity: blobOp }} className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-violet-600/35 blur-[140px]" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute bottom-10 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/15 blur-[100px]" />

        <motion.div style={{ opacity: heroOp, y: heroY }} className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-violet-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              live · shipping daily
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }} className="text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              Costruiamo<br /><WordCycle /><br />
              <span className="text-white/85">senza compromessi.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }} className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
              Siti, app, bot e automazioni. TypeScript end-to-end, UI curata, deploy in produzione. Software che si vede — e regge.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-wrap gap-3">
              <Link href="/custom" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-[0_0_50px_rgba(255,255,255,0.2)] transition hover:scale-[1.04]">
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-violet-200/50 to-transparent transition duration-700 group-hover:translate-x-[100%]" />
                Esplora Custom
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/store" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-violet-400/50 hover:bg-violet-500/15">
                <Play className="h-3.5 w-3.5 fill-current text-violet-300" />
                Store
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-14 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 sm:max-w-md">
              {[{ k: "TS", v: "Type-safe" }, { k: "∞", v: "Iterazioni" }, { k: "24/7", v: "Assistente" }].map((m) => (
                <div key={m.k}>
                  <p className="font-mono text-2xl font-semibold tracking-tight text-white">{m.k}</p>
                  <p className="text-[11px] text-zinc-500">{m.v}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="relative hidden lg:block" style={{ perspective: 1400 }}>
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-violet-600/30 via-fuchsia-500/15 to-cyan-400/20 blur-3xl" />
            <TiltCard className="group"><CodePanel /></TiltCard>
          </motion.div>
        </motion.div>
        <motion.div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/35">scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      <div className="relative z-10 overflow-hidden border-y border-white/5 bg-zinc-950/90 py-4">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12">
          {[...STACK, ...STACK].map((t, i) => (
            <span key={`${t}-${i}`} className="inline-flex items-center gap-2.5 font-mono text-sm text-zinc-500">
              <Braces className="h-3.5 w-3.5 text-violet-400/80" />{t}
            </span>
          ))}
        </div>
      </div>

      <section ref={story} className="relative z-10 h-[240svh]">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <motion.div style={{ scale: storyScale }} className="absolute inset-0">
            <Image src={IMG.code} alt="" fill className="object-cover opacity-35" sizes="100vw" />
            <div className="absolute inset-0 bg-[#020205]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(109,40,217,0.35),transparent_55%)]" />
          </motion.div>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[240px] sm:min-h-[300px]">
              <motion.h2 style={{ opacity: line1 }} className="absolute inset-0 flex flex-col justify-center font-serif text-3xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
                Codice leggibile.<span className="mt-2 italic text-white/65">Decisioni esplicite.</span>
              </motion.h2>
              <motion.h2 style={{ opacity: line2 }} className="absolute inset-0 flex flex-col justify-center font-serif text-3xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
                UI non è<span className="mt-2 italic text-violet-200/90">un dopo pensiero.</span>
              </motion.h2>
              <motion.h2 style={{ opacity: line3 }} className="absolute inset-0 flex flex-col justify-center font-serif text-3xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
                Deploy, non demo.<span className="mt-2 italic text-cyan-200/90">In produzione.</span>
              </motion.h2>
            </div>
            <motion.div style={{ x: codeX, rotate: codeRot }} className="hidden lg:block">
              <div className="rounded-2xl border border-white/12 bg-black/60 p-6 font-mono text-xs leading-7 shadow-2xl backdrop-blur-xl">
                <p className="mb-2 text-zinc-600">// principles.ts</p>
                <p><span className="text-fuchsia-400">export const</span> <span className="text-sky-300">craft</span> = [</p>
                <p className="pl-4 text-emerald-300">"type everything",</p>
                <p className="pl-4 text-emerald-300">"ship small & often",</p>
                <p className="pl-4 text-emerald-300">"own the prod box",</p>
                <p className="pl-4 text-emerald-300">"design with code"</p>
                <p>];</p>
                <p className="mt-4 text-zinc-600">// no magic. just skill.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-violet-400">capabilities</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Quattro linee.<span className="block text-zinc-500">Uno standard alto.</span>
            </h2>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.08, duration: 0.55 }}>
                <Link href={c.href} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent p-8 transition duration-500 hover:border-violet-500/50 hover:shadow-[0_25px_80px_rgba(139,92,246,0.18)]">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/0 blur-3xl transition duration-500 group-hover:bg-violet-600/25" />
                  <div className="relative flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300 transition group-hover:scale-110 group-hover:border-violet-400/50 group-hover:bg-violet-500/25">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-zinc-500">{c.tag}</span>
                  </div>
                  <h3 className="relative mt-6 text-2xl font-semibold">{c.title}</h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{c.text}</p>
                  <span className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300">
                    Apri <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5 bg-[#06060a] px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-400/90">pipeline</p>
          <h2 className="mb-12 text-3xl font-semibold sm:text-4xl">Brief → ship</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {[["01", "Discovery", "Metriche, vincoli, priorità."], ["02", "Architecture", "Stack, dati, auth, edge."], ["03", "Build", "Tipizzato, testato, UI fina."], ["04", "Ship & care", "Prod, monitor, evolutive."]].map(([n, t, d], i) => (
              <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-black/50 p-6 transition hover:border-violet-500/40">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-transparent opacity-0 transition group-hover:from-violet-600/15 group-hover:opacity-100" />
                <p className="relative font-mono text-sm text-violet-400">{n}</p>
                <h3 className="relative mt-3 text-lg font-medium">{t}</h3>
                <p className="relative mt-2 text-sm text-zinc-400">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[{ icon: Shield, title: "Produzione vera", text: "Auth, ruoli, edge case. Non solo demo." }, { icon: GitBranch, title: "Codice che dura", text: "TypeScript, struttura chiara, riuso." }, { icon: Layers, title: "Design + code", text: "Nati insieme. Niente mock impossibili." }].map((t) => (
              <div key={t.title} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6">
                <t.icon className="h-5 w-5 text-cyan-300" />
                <h3 className="mt-4 font-medium">{t.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/5">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative min-h-[380px] lg:min-h-[560px]">
            <Image src={IMG.desk} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#020205]/40 lg:to-[#020205]" />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="absolute bottom-8 left-6 right-6 rounded-2xl border border-white/15 bg-black/60 p-4 font-mono text-[11px] shadow-2xl backdrop-blur-xl sm:text-xs">
              <p className="text-zinc-500">$ gr ship --env production</p>
              <p className="text-emerald-400">✓ build · ✓ tests · ✓ live in 42s</p>
              <p className="text-zinc-600">commit abc123 · main</p>
            </motion.div>
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:py-24">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 font-mono text-[10px] text-cyan-300">
              <Terminal className="h-3 w-3" /> craft over noise
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ogni riga<br /><span className="text-zinc-400">ha un motivo.</span></h2>
            <p className="mt-5 max-w-md text-zinc-400">Non template. Architetture, interfacce e flussi pensati per il carico reale — poi online.</p>
            <ul className="mt-8 space-y-3.5 text-sm text-zinc-300">
              {["Stack tipizzato end-to-end", "UI responsive e accessibile", "Deploy e monitoraggio", "Comunicazione diretta"].map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300"><Sparkles className="h-3 w-3" /></span>
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/chi-siamo" className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-violet-300 transition hover:gap-3 hover:text-violet-200">
              Il team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-t border-white/5 px-4 py-32 sm:px-6">
        <div className="absolute inset-0">
          <Image src={IMG.neon} alt="" fill className="object-cover opacity-20" sizes="100vw" />
          <div className="absolute inset-0 bg-[#020205]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(139,92,246,0.4),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-mono text-[11px] uppercase tracking-[0.4em] text-violet-300/80">next commit</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5 font-serif text-4xl font-light sm:text-6xl">
            Il progetto<br /><span className="italic text-white/70">parte da qui.</span>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-md text-zinc-400">Scope, tempi, prezzo. Chiari. Subito.</p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/custom" className="group inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-semibold text-zinc-900 shadow-[0_0_60px_rgba(255,255,255,0.15)] transition hover:scale-[1.04]">
              Catalogo Custom <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/contatti" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-9 py-4 text-sm font-medium text-white transition hover:bg-white/10">Scrivici</Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-[#06060a]"><TeamSection /></div>
      <div className="relative z-10 border-t border-white/5 bg-[#06060a]"><Partners /></div>
      <div className="h-20" />
    </div>
  );
}
