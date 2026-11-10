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
  Bot,
  Globe,
  Zap,
  Cpu,
  Braces,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";
import { TrustBar } from "@/components/TrustBar";
import { PortfolioTeaser } from "@/components/PortfolioTeaser";

const IMG = {
  hero: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=90",
  code: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=90",
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
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 top-0 bg-gradient-to-r from-violet-100 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
        >
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{WORDS[0]}</span>
    </span>
  );
}

export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const { scrollYProgress: page } = useScroll({ target: root, offset: ["start start", "end end"] });
  const { scrollYProgress: heroP } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const bar = useSpring(page, { stiffness: 100, damping: 30 });
  const heroOp = useTransform(heroP, [0, 0.5], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 80]);

  return (
    <div ref={root} className="relative bg-[#08051a] text-white">
      <motion.div
        className="fixed left-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
        style={{ scaleX: bar }}
      />

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={IMG.hero} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-[#0a0618]/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12082a]/40 via-transparent to-[#08051a]" />
        </div>

        <motion.div
          style={{ opacity: heroOp, y: heroY }}
          className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6"
        >
          <p className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[11px] text-violet-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Studio · shipping in production
          </p>
          <h1 className="text-[2.75rem] font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Costruiamo
            <br />
            <WordCycle />
            <br />
            <span className="text-white/75">che restano.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-zinc-200/90 sm:text-lg">
            Siti, app, bot Discord e automazioni. TypeScript end-to-end, UI precisa, deploy
            reale — non solo mockup.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-900"
            >
              Esplora Custom
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-medium text-white"
            >
              Store bot
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-medium text-white"
            >
              Portfolio
            </Link>
          </div>
        </motion.div>
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

      <TrustBar />

      <section className="relative bg-gradient-to-b from-[#100a24] via-[#120c28] to-[#0c1028] px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-violet-300">
            Capabilities
          </p>
          <h2 className="mb-12 text-3xl font-semibold tracking-tight sm:text-5xl">
            Quattro linee.
            <span className="mt-1 block text-zinc-400">Uno standard alto.</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Globe,
                title: "Siti & Web App",
                text: "Landing, corporate, dashboard, SaaS.",
                href: "/custom",
              },
              {
                icon: Bot,
                title: "Bot Discord",
                text: "Economia, ticket, ranking, pannelli.",
                href: "/store",
              },
              {
                icon: Zap,
                title: "Automazioni",
                text: "API, webhook, pipeline.",
                href: "/custom",
              },
              {
                icon: Cpu,
                title: "Software custom",
                text: "Tool e gestionali su misura.",
                href: "/custom",
              },
            ].map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group rounded-3xl border border-white/12 bg-white/[0.05] p-7 transition hover:border-violet-500/40"
              >
                <c.icon className="mb-4 h-6 w-6 text-violet-300" />
                <h3 className="text-xl font-semibold text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{c.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PortfolioTeaser />

      <section className="relative overflow-hidden px-4 py-28 sm:px-6">
        <div className="absolute inset-0">
          <Image src={IMG.neon} alt="" fill className="object-cover opacity-30" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e20]/95 via-[#140a2a]/80 to-[#08051a]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl font-light sm:text-5xl">
            Il progetto <span className="italic text-violet-100/85">parte da qui.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-zinc-300/85">
            Scope, tempi e prezzo chiari. Senza giri di parole.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/preventivo"
              className="rounded-full bg-white px-9 py-4 text-sm font-semibold text-zinc-900"
            >
              Preventivo guidato
            </Link>
            <Link
              href="/custom"
              className="rounded-full border border-white/30 bg-white/10 px-9 py-4 text-sm text-white"
            >
              Catalogo Custom
            </Link>
          </div>
        </div>
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
