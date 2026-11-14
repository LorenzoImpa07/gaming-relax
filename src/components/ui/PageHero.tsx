"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
};

/** Header di pagina coerente: eyebrow, titolo, descrizione, azioni opzionali. */
export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
  children,
}: PageHeroProps) {
  const center = align === "center";
  return (
    <div className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_-10%,rgba(139,92,246,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_0%,rgba(34,211,238,0.1),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      <div
        className={`relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 ${
          center ? "text-center" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}
        >
          {eyebrow && (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-200">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              {description}
            </p>
          )}
          {children && <div className={`mt-8 ${center ? "flex justify-center" : ""}`}>{children}</div>}
        </motion.div>
      </div>
    </div>
  );
}
