"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Partner = { id: string; name: string; href: string; image: string };

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=400&q=80";

const fallbackPartners: Partner[] = [
  {
    id: "fallback",
    name: "Mega Wolf",
    href: "#",
    image: FALLBACK_IMAGE,
  },
];

function isValidImageSrc(src: string | undefined | null): boolean {
  if (!src || typeof src !== "string") return false;
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith("/")) return true;
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
    getDocs(collection(db, "site_partners"))
      .then((snap) => {
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
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-24 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">I nostri partner</h2>
          <p className="mt-3 text-zinc-400">I brand e gli studi con cui collaboriamo.</p>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner, i) => (
            <motion.a
              key={partner.id}
              href={partner.href}
              target={partner.href.startsWith("http") ? "_blank" : undefined}
              rel={partner.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl border border-zinc-700/80 bg-zinc-900/60 p-3 shadow-lg shadow-black/30 transition-all hover:border-violet-500/50 hover:bg-zinc-900 hover:scale-105"
              title={partner.name}
            >
              <Image
                src={partner.image}
                alt={partner.name}
                width={120}
                height={120}
                className="rounded-xl object-cover w-full h-full"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
