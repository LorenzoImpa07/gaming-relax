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
];

const WORDS = ["Codice.", "Design.", "Prodotti.", "Risultati."];

function WordCycle() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block h-[1.1em] min-w-[7ch] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{WORDS[0]}</span>
    </span>
  );
}

function TypeDeploy() {
  const full = 'await ship({ env: "prod" }) → live';
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= full.length) {
      const t = setTimeout(() => setN(0), 2000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((x) => x + 1), 30);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <span className="font-mono text-emerald-300">
      {full.slice(0, n)}
      <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-emerald-300 align-middle" />
    </span>
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

  const bar = useSpring(page, { stiffness: 90, damping: 28 });
  const heroOp = useTransform(heroP, [0, 0.55], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 80]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.1]);

  const s1 = useTransform(storyP, [0.08, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const s2 = useTransform(storyP, [0.28, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const s3 = useTransform(storyP, [0.48, 0.6, 0.75, 0.9], [0, 1, 1, 0.2]);
  const imgScale = useTransform(storyP, [0, 1], [1.2, 1]);

  return (
    <div ref={root} className="relative bg-[#0a0614] text-white">
      <motion.div
        className="fixed left-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e]/85 via-[#0f0a1a]/75 to-[#0a1628]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(139,92,246,0.35),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(34,211,238,0.12),transparent_45%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOp, y: heroY }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[11px] text-violet-100 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Software studio · Italia
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                Costruiamo
                <br />
                <WordCycle />
                <br />
                <span className="text-white/80">che contano.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 max-w-lg text-base leading-relaxed text-zinc-200/90 sm:text-lg"
              >
                Siti web, applicazioni, bot Discord e automazioni. Design chiaro,
                codice solido, online in produzione.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Link
                  href="/custom"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-violet-500/20 transition hover:scale-[1.03]"
                >
                  Vedi Custom
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Store
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="relative hidden lg:block"
            >
              <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-violet-900/40 backdrop-blur-xl">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[10px] text-white/50">ship.ts</span>
                </div>
                <div className="space-y-1 p-5 font-mono text-xs leading-7">
                  <p>
                    <span className="text-fuchsia-300">export async</span>{" "}
                    <span className="text-sky-200">function</span>{" "}
                    <span className="text-amber-200">launch</span>() {"{"}
                  </p>
                  <p className="pl-3">
                    <span className="text-fuchsia-300">const</span> r = <TypeDeploy />
                  </p>
                  <p className="pl-3">
                    <span className="text-fuchsia-300">return</span> r
                  </p>
                  <p>{"}"}</p>
                  <p className="pt-2 text-white/40">// typed · tested · live</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a0f2e] to-transparent" />
      </section>

      <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#1a0f2e] via-[#140c24] to-[#0f1a2e] py-4">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-10">
          {[...STACK, ...STACK].map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-2 font-mono text-sm text-violet-200/60"
            >
              <Braces className="h-3.5 w-3.5 text-violet-400" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <section ref={story} className="relative h-[200svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={IMG.code} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e]/80 via-[#0f0a1a]/70 to-[#0a1628]/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25),transparent_60%)]" />
          </motion.div>
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="relative h-48 w-full max-w-3xl text-center sm:h-56">
              <motion.h2
                style={{ opacity: s1 }}
                className="absolute inset-0 flex flex-col items-center justify-center font-serif text-3xl font-light sm:text-5xl"
              >
                Idee chiare.
                <span className="mt-2 italic text-violet-200/80">Codice pulito.</span>
              </motion.h2>
              <motion.h2
                style={{ opacity: s2 }}
                className="absolute inset-0 flex flex-col items-center justify-center font-serif text-3xl font-light sm:text-5xl"
              >
                UI curata.
                <span className="mt-2 italic text-fuchsia-200/80">Risultati reali.</span>
              </motion.h2>
              <motion.h2
                style={{ opacity: s3 }}
                className="absolute inset-0 flex flex-col items-center justify-center font-serif text-3xl font-light sm:text-5xl"
              >
                Dal brief
                <span className="mt-2 italic text-cyan-200/80">al prodotto online.</span>
              </motion.h2>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#120a22] to-transparent" />
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#120a22] via-[#140c28] to-[#0e1228] px-4 py-24 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-violet-300">
              Cosa facciamo
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Quattro linee di lavoro.
              <span className="mt-1 block text-lg font-normal text-violet-200/50 sm:text-xl">
                Un solo standard di qualità.
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Globe,
                title: "Siti & Web App",
                text: "Landing, corporate, dashboard, SaaS. Performance e conversione.",
                href: "/custom",
              },
              {
                icon: Bot,
                title: "Bot Discord",
                text: "Economia, ticket, moderazione, pannelli. Per community che crescono.",
                href: "/store",
              },
              {
                icon: Zap,
                title: "Automazioni",
                text: "API, webhook, pipeline. Meno lavoro ripetitivo, più affidabilità.",
                href: "/custom",
              },
              {
                icon: Cpu,
                title: "Software custom",
                text: "Tool interni e gestionali. Su misura, documentati, manutenibili.",
                href: "/custom",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={c.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition hover:border-violet-400/40 hover:bg-violet-500/10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200 transition group-hover:bg-violet-500/30">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-300/80">{c.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-300">
                    Esplora
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#0e1228] to-[#0c1020]">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[480px]">
            <Image src={IMG.desk} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0e1228]/40 to-[#0e1228] max-lg:bg-gradient-to-t max-lg:from-[#0e1228] max-lg:via-transparent max-lg:to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/15 bg-[#0a0614]/70 p-3 font-mono text-[11px] backdrop-blur-md sm:text-xs">
              <p className="text-zinc-400">$ gr ship --env production</p>
              <p className="text-emerald-300">✓ build · ✓ tests · ✓ live</p>
            </div>
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-20">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">Metodo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Brief → architettura → build → ship
            </h2>
            <ul className="mt-8 space-y-3">
              {[
                "Scope chiaro prima di scrivere codice",
                "UI e backend progettati insieme",
                "Consegna in produzione, non solo demo",
                "Supporto e evolutive se ti servono",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-zinc-300">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
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
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c1020] via-[#1a0b2e] to-[#120a22] px-4 py-28 sm:px-6">
        <div className="pointer-events-none absolute inset-0">
          <Image src={IMG.neon} alt="" fill className="object-cover opacity-25" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c1020]/90 via-[#1a0b2e]/75 to-[#120a22]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,92,246,0.35),transparent_55%)]" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-violet-300/90">Inizia qui</p>
          <h2 className="mt-4 font-serif text-3xl font-light sm:text-5xl">
            Il tuo prossimo progetto
            <br />
            <span className="italic text-violet-200/80">parte da una chiacchierata.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-300/80">
            Scope, tempi e prezzo chiari. Senza giri di parole.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition hover:scale-[1.03]"
            >
              Catalogo Custom
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
            >
              Contatti
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0614] to-transparent" />
      </section>

      <div className="bg-[#0a0614]">
        <TeamSection />
      </div>
      <div className="border-t border-white/5 bg-[#0a0614]">
        <Partners />
      </div>
      <div className="h-16 bg-[#0a0614]" />
    </div>
  );
}
