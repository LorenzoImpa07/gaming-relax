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
  ArrowUpRight,
  Bot,
  Globe,
  Zap,
  Cpu,
  Sparkles,
  Check,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";

const IMG = {
  a: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=85",
  b: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=85",
  c: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=85",
  d: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=85",
};

const services = [
  { icon: Globe, title: "Siti & Web App", desc: "Landing, corporate, dashboard e SaaS. Performance e conversione.", href: "/custom" },
  { icon: Bot, title: "Bot Discord", desc: "Economia, ticket, moderazione e pannelli. Per community che crescono.", href: "/store" },
  { icon: Zap, title: "Automazioni", desc: "Workflow e integrazioni API. Meno lavoro ripetitivo, più affidabilità.", href: "/custom" },
  { icon: Cpu, title: "Software custom", desc: "Tool e gestionali su misura. Dal prototipo alla produzione.", href: "/custom" },
];

export function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLDivElement>(null);

  const { scrollYProgress: page } = useScroll({ target: root, offset: ["start start", "end end"] });
  const { scrollYProgress: heroP } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const { scrollYProgress: storyP } = useScroll({ target: story, offset: ["start end", "end start"] });

  const bar = useSpring(page, { stiffness: 80, damping: 28 });
  const heroOp = useTransform(heroP, [0, 0.6], [1, 0]);
  const heroY = useTransform(heroP, [0, 1], [0, 100]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.08]);
  const s1 = useTransform(storyP, [0.05, 0.18, 0.28, 0.38], [0, 1, 1, 0]);
  const s2 = useTransform(storyP, [0.25, 0.38, 0.48, 0.58], [0, 1, 1, 0]);
  const s3 = useTransform(storyP, [0.45, 0.58, 0.7, 0.82], [0, 1, 1, 0.15]);
  const imgScale = useTransform(storyP, [0, 1], [1.15, 1]);

  return (
    <div ref={root} className="relative bg-[#050508] text-white">
      <motion.div className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300" style={{ scaleX: bar }} />

      <section ref={hero} className="relative min-h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image src={IMG.a} alt="" fill priority className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/40 via-[#050508]/70 to-[#050508]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.35),transparent_55%)]" />
        </motion.div>

        <motion.div style={{ opacity: heroOp, y: heroY }} className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-violet-200/90 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            Software studio · Italia
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }} className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Progetti digitali
            <br />
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">fatti bene.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.22 }} className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300/90 sm:text-lg">
            Siti web, applicazioni, bot Discord e automazioni. Design chiaro, codice solido, tempi reali — senza fuffa.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.36 }} className="mt-10 flex flex-wrap gap-3">
            <Link href="/custom" className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-white/10 transition hover:scale-[1.03]">
              Scopri Custom
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/store" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10">
              Store servizi
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-16 flex flex-wrap gap-8 border-t border-white/10 pt-8 text-sm text-zinc-400">
            {[["TypeScript", "stack tipizzato"], ["Next.js", "web moderni"], ["24/7", "assistente automatico"]].map(([k, v]) => (
              <div key={k}>
                <p className="text-lg font-semibold text-white">{k}</p>
                <p className="text-xs text-zinc-500">{v}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section ref={story} className="relative h-[200svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={IMG.b} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/50" />
          </motion.div>
          <div className="relative z-10 flex h-full items-center justify-center px-6">
            <div className="relative h-40 w-full max-w-3xl text-center sm:h-48">
              <motion.h2 style={{ opacity: s1 }} className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-light leading-tight sm:text-5xl">
                Idee chiare.<br /><span className="italic text-white/75">Codice pulito.</span>
              </motion.h2>
              <motion.h2 style={{ opacity: s2 }} className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-light leading-tight sm:text-5xl">
                UI curata.<br /><span className="italic text-violet-200/90">Risultati misurabili.</span>
              </motion.h2>
              <motion.h2 style={{ opacity: s3 }} className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-light leading-tight sm:text-5xl">
                Dal brief<br /><span className="italic text-cyan-100/90">al prodotto online.</span>
              </motion.h2>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 px-4 py-24 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-violet-400">Cosa costruiamo</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Quattro linee di lavoro.
              <span className="block font-normal text-zinc-400">Un solo standard di qualità.</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.06, duration: 0.55 }}>
                <Link href={s.href} className="group flex h-full flex-col rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-7 transition hover:border-violet-500/40 hover:from-violet-500/10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-300 transition group-hover:border-violet-400/40 group-hover:bg-violet-500/20">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-violet-300">
                    Esplora <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[480px]">
            <Image src={IMG.c} alt="" fill className="object-cover" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050508]/40 lg:bg-gradient-to-l" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-20">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/90">Metodo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Brief → architettura → build → ship</h2>
            <ul className="mt-8 space-y-4">
              {["Scope e priorità chiari prima di scrivere una riga", "UI e backend progettati insieme, non a strati separati", "Consegna in produzione, non solo demo", "Supporto e evolutive se ti servono"].map((t) => (
                <li key={t} className="flex gap-3 text-sm text-zinc-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/chi-siamo" className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200">
              Chi siamo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/5 px-4 py-28 sm:px-6">
        <div className="absolute inset-0">
          <Image src={IMG.d} alt="" fill className="object-cover opacity-30" sizes="100vw" />
          <div className="absolute inset-0 bg-[#050508]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,92,246,0.25),transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-light sm:text-5xl">
            Il tuo prossimo progetto<br /><span className="italic text-white/80">parte da qui.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-zinc-400">
            Guardati i prodotti Custom o raccontaci cosa ti serve. Risposte chiare, preventivi reali.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/custom" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:scale-[1.03]">
              Vai a Custom <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contatti" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/10">
              Contatti
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-[#07070c]">
        <TeamSection />
      </div>
      <div className="border-t border-white/5 bg-[#07070c]">
        <Partners />
      </div>
      <div className="h-16" />
    </div>
  );
}
