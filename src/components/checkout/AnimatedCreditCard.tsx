"use client";

import { motion } from "framer-motion";

export type CardFormState = {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function formatCardNumber(raw: string) {
  const d = onlyDigits(raw).slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function detectBrand(number: string): "visa" | "mastercard" | "amex" | "unknown" {
  const d = onlyDigits(number);
  if (/^4/.test(d)) return "visa";
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return "mastercard";
  if (/^3[47]/.test(d)) return "amex";
  return "unknown";
}

function BrandMark({ brand }: { brand: ReturnType<typeof detectBrand> }) {
  if (brand === "visa") {
    return (
      <span className="font-serif text-lg font-bold italic tracking-wide text-white">VISA</span>
    );
  }
  if (brand === "mastercard") {
    return (
      <span className="flex items-center -space-x-2">
        <span className="h-7 w-7 rounded-full bg-[#EB001B]/90" />
        <span className="h-7 w-7 rounded-full bg-[#F79E1B]/90" />
      </span>
    );
  }
  if (brand === "amex") {
    return (
      <span className="rounded border border-white/40 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
        AMEX
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
      CARD
    </span>
  );
}

type Props = {
  card: CardFormState;
  showBack?: boolean;
};

export function AnimatedCreditCard({ card, showBack = false }: Props) {
  const brand = detectBrand(card.number);
  const displayNumber =
    formatCardNumber(card.number) || "•••• •••• •••• ••••";
  const displayName = (card.name || "NOME COGNOME").toUpperCase();
  const displayExp = card.expiry.trim() || "MM/YY";
  const displayCvc = card.cvc ? onlyDigits(card.cvc).slice(0, 4) : "•••";

  return (
    <div className="perspective-[1200px] mx-auto w-full max-w-[340px]">
      <motion.div
        className="relative h-[200px] w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15 p-5 shadow-2xl shadow-violet-900/40"
          style={{
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, #4c1d95 0%, #5b21b6 35%, #0e7490 100%)",
          }}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 left-8 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-10 w-12 rounded-md bg-gradient-to-br from-amber-200/90 to-amber-500/70 shadow-inner" />
              <BrandMark brand={brand} />
            </div>

            <motion.p
              key={displayNumber}
              initial={{ opacity: 0.6, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[1.15rem] tracking-[0.18em] text-white sm:text-xl"
            >
              {displayNumber}
            </motion.p>

            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">Titolare</p>
                <motion.p
                  key={displayName}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="truncate font-medium tracking-wide text-white"
                >
                  {displayName}
                </motion.p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/50">Scadenza</p>
                <motion.p
                  key={displayExp}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm text-white"
                >
                  {displayExp}
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-violet-900/40"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #164e63 100%)",
          }}
        >
          <div className="mt-6 h-10 w-full bg-zinc-900/90" />
          <div className="mt-5 px-5">
            <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-white/45">
              Codice di sicurezza
            </p>
            <div className="flex items-center justify-end rounded bg-white px-3 py-2">
              <motion.span
                key={displayCvc}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-lg tracking-widest text-zinc-900"
              >
                {displayCvc}
              </motion.span>
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-white/40">
              Il CVC si trova sul retro della carta, accanto alla banda magnetica.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function formatCardNumberInput(value: string) {
  return formatCardNumber(value);
}

export function formatExpiryInput(value: string) {
  const d = onlyDigits(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)} / ${d.slice(2)}`;
}
