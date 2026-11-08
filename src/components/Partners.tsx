"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Partner = { id: string; name: string; href: string; image: string };

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&q=80";

const fallbackPartners: Partner[] = [
  { id: "fallback", name: "Mega Wolf", href: "#", image: FALLBACK_IMAGE },
];

function isValidImageSrc(src: string | undefined | null): boolean {
  if (!src || typeof src !== "string") return false;
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith("/")) return true;
  if (s.startsWith("data:image/")) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function safeImage(src: string | undefined | null): string {
  return isValidImageSrc(src) ? src!.trim() : FALLBACK_IMAGE;
}

function safeHref(href: string | undefined | null): string {
  if (!href || !href.trim()) return "#";
  const h = href.trim();
  if (h === "#") return "#";
  try {
    const u = new URL(h);
    if (u.protocol === "http:" || u.protocol === "https:") return h;
  } catch {
    /* ignore */
  }
  return "#";
}

export function Partners() {
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_partners"),
      (snap) => {
        if (snap.empty) return;
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: (data.name as string) || "Partner",
            href: safeHref(data.href as string),
            image: safeImage(data.image as string),
          };
        });
        if (list.length > 0) setPartners(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-950/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">I nostri partner</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            I brand e gli studi con cui collaboriamo.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {partners.map((partner, i) => (
            <motion.a
              key={partner.id}
              href={partner.href}
              target={partner.href.startsWith("http") ? "_blank" : undefined}
              rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col items-center gap-3"
            >
              <div className="relative h-[120px] w-[120px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all group-hover:border-violet-500/40 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.25)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.image}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              <span className="text-sm text-zinc-400 transition-colors group-hover:text-violet-300">
                {partner.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
