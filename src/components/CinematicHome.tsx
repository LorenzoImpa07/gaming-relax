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
  Bot,
  Zap,
  MessageSquare,
  Globe,
  Cpu,
  ChevronDown,
  Code2,
} from "lucide-react";
import { TeamSection } from "@/components/TeamSection";
import { Partners } from "@/components/Partners";

const IMG = {
  hero: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=90",
  code: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1920&q=90",
  dual: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1920&q=90",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1920&q=90",
  server: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=90",
  desk: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&q=90",
  neon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=90",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=90",
  terminal: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1920&q=90",
  abstract: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=90",
};

function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.45em] text-white/45">
        Scorri
      </span>
      <ChevronDown className="h-4 w-4 text-white/55" />
    </motion.div>
  );
}

function SceneImage({
  src,
  alt,
  priority,
  scale,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  scale?: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div style={scale ? { scale } : undefined} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.55)_100%)]" />
    </motion.div>
  );
}

function SceneQuote({
  line1,
  line2,
  opacity,
  y,
}: {
  line1: string;
  line2?: string;
  opacity: ReturnType<typeof useTransform<number, number>>;
  y?: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.div
      style={{ opacity, y }}
      className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
    >
      <div className="mb-6 h-px w-12 bg-white/35" />
      <h2 className="max-w-3xl font-serif text-[2rem] font-light leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {line1}
        {line2 && (
          <>
            <br />
            <span className="italic text-white/90">{line2}</span>
          </>
        )}
      </h2>
      <div className="mt-6 h-px w-12 bg-white/35" />
    </motion.div>
  );
}

export function CinematicHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress: pageProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress: p1 } = useScroll({
    target: s1Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: p2 } = useScroll({
    target: s2Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: p3 } = useScroll({
    target: s3Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: p4 } = useScroll({
    target: s4Ref,
    offset: ["start end", "end start"],
  });

  const heroOpacity = useTransform(heroP, [0, 0.65], [1, 0]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.12]);
  const heroY = useTransform(heroP, [0, 1], [0, 60]);

  const s1Op = useTransform(p1, [0.12, 0.32, 0.68, 0.88], [0, 1, 1, 0]);
  const s1Sc = useTransform(p1, [0, 0.5, 1], [1.1, 1, 1.04]);
  const s1Y = useTransform(p1, [0.18, 0.4], [28, 0]);

  const s2Op = useTransform(p2, [0.12, 0.32, 0.68, 0.88], [0, 1, 1, 0]);
  const s2Sc = useTransform(p2, [0, 0.5, 1], [1.1, 1, 1.04]);
  const s2Y = useTransform(p2, [0.18, 0.4], [28, 0]);

  const s3Op = useTransform(p3, [0.12, 0.32, 0.68, 0.88], [0, 1, 1, 0]);
  const s3Sc = useTransform(p3, [0, 0.5, 1], [1.08, 1, 1.03]);
  const s3Y = useTransform(p3, [0.18, 0.4], [24, 0]);

  const s4Op = useTransform(p4, [0.12, 0.32, 0.68, 0.9], [0, 1, 1, 0.2]);
  const s4Sc = useTransform(p4, [0, 0.5, 1], [1.08, 1, 1.03]);
  const s4Y = useTransform(p4, [0.18, 0.4], [24, 0]);

  const progressBar = useSpring(pageProgress, { stiffness: 90, damping: 28 });

  const products = [
    {
      title: "Bot Discord",
      subtitle: "Economia, moderazione, ticket",
      icon: Bot,
      img: IMG.neon,
      href: "/store",
    },
    {
      title: "Siti & Web App",
      subtitle: "Design, performance, conversione",
      icon: Globe,
      img: IMG.dual,
      href: "/store",
    },
    {
      title: "Automazioni",
      subtitle: "Workflow che lavorano per te",
      icon: Zap,
      img: IMG.server,
      href: "/store",
    },
    {
      title: "Software custom",
      subtitle: "Dal prototipo al prodotto",
      icon: Cpu,
      img: IMG.terminal,
      href: "/store",
    },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#050508]">
      <motion.div
        className="fixed left-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300"
        style={{ scaleX: progressBar }}
      />

      <Link
        href="/contatti"
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition hover:scale-[1.03] hover:shadow-[0_12px_48px_rgba(139,92,246,0.35)] sm:bottom-8"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white">
          <MessageSquare className="h-3 w-3" />
        </span>
        Richiedi preventivo
      </Link>

      <section ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <motion.div style={{ scale: heroScale, y: heroY }} className="absolute inset-0">
          <SceneImage src={IMG.hero} alt="Laptop e codice" priority />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(139,92,246,0.28),transparent_55%)]" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-7 text-[11px] font-medium uppercase tracking-[0.4em] text-white/55"
          >
            Gaming Relax · Software Studio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl font-serif text-4xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Basta software
            <br />
            <span className="italic text-white/90">noioso.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28 }}
            className="mt-7 max-w-md text-base font-light leading-relaxed text-white/65 sm:text-lg"
          >
            Bot Discord, siti web e applicazioni custom.
            <br className="hidden sm:block" />
            Design chiaro, codice solido, risultati reali.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/store"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Vedi i prodotti
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/chi-siamo"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
            >
              Chi siamo
            </Link>
          </motion.div>
        </motion.div>

        <ScrollHint />
      </section>

      <section ref={s1Ref} className="relative h-[120svh] overflow-hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <SceneImage src={IMG.code} alt="Codice sullo schermo" scale={s1Sc} />
          <SceneQuote line1="Guarda questo." line2="Codice che funziona." opacity={s1Op} y={s1Y} />
        </div>
      </section>

      <section ref={s2Ref} className="relative h-[120svh] overflow-hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <SceneImage src={IMG.dual} alt="Schermi dual monitor" scale={s2Sc} />
          <SceneQuote line1="Dove l'idea" line2="incontra il deploy." opacity={s2Op} y={s2Y} />
        </div>
      </section>

      <section ref={s3Ref} className="relative h-[120svh] overflow-hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <SceneImage src={IMG.keyboard} alt="Tastiera meccanica" scale={s3Sc} />
          <SceneQuote line1="Dal prototipo" line2="al prodotto finito." opacity={s3Op} y={s3Y} />
        </div>
      </section>

      <section ref={s4Ref} className="relative h-[110svh] overflow-hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <SceneImage src={IMG.terminal} alt="Terminal" scale={s4Sc} />
          <SceneQuote line1="Porta online" line2="la tua visione." opacity={s4Op} y={s4Y} />
        </div>
      </section>

      <section className="relative bg-[#0a0a0f] px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center sm:mb-16">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.35em] text-violet-300/70">
              Cosa costruiamo
            </p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">
              Quattro modi
              <br />
              <span className="italic text-white/85">di fare software.</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={p.href}
                  className="group relative block overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/40 transition hover:border-violet-500/40"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={p.img}
                      alt={p.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur">
                      <p.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-medium text-white">{p.title}</h3>
                      <p className="mt-1 text-sm text-white/55">{p.subtitle}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-300 opacity-0 transition group-hover:opacity-100">
                        Scopri
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-28 sm:px-6 sm:py-36">
        <div className="absolute inset-0">
          <Image src={IMG.abstract} alt="" fill className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-[#050508]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,92,246,0.2),transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto mb-6 h-px w-12 bg-white/30" />
            <h2 className="font-serif text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Il tuo nuovo progetto
              <br />
              <span className="italic">ti aspetta.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base font-light text-white/60">
              Raccontaci cosa ti serve. Ti rispondiamo con un preventivo chiaro,
              tempi reali e zero giri di parole.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                <MessageSquare className="h-4 w-4" />
                Scrivici
              </Link>
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                <Code2 className="h-4 w-4" />
                Vai allo store
              </Link>
            </div>
            <div className="mx-auto mt-6 h-px w-12 bg-white/30" />
          </motion.div>
        </div>
      </section>

      <div className="bg-[#07070c]">
        <TeamSection />
      </div>

      <div className="border-t border-white/5 bg-[#07070c]">
        <Partners />
      </div>

      <section className="border-t border-white/5 bg-[#050508] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-2xl font-light text-white sm:text-3xl">
            Commenta{" "}
            <span className="italic text-violet-300">&ldquo;Sito&rdquo;</span>
            {" "}o scrivici in DM.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Oppure apri il form contatti — rispondiamo entro 24h.
          </p>
          <Link
            href="/contatti"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-6 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20"
          >
            Contattaci
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}
