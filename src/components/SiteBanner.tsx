"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X } from "lucide-react";

type BannerConfig = {
  enabled: boolean;
  message: string;
};

export function SiteBanner() {
  const [cfg, setCfg] = useState<BannerConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "site_settings", "banner"),
      (snap) => {
        if (!snap.exists()) {
          setCfg(null);
          return;
        }
        const d = snap.data();
        setCfg({
          enabled: !!d.enabled,
          message: String(d.message || ""),
        });
      },
      () => setCfg(null)
    );
    return () => unsub();
  }, []);

  if (!cfg?.enabled || !cfg.message?.trim() || dismissed) return null;

  const text = cfg.message.trim();
  const loop = `${text}   ·   ${text}   ·   ${text}   ·   `;

  return (
    <div className="fixed left-0 right-0 top-16 z-[45] flex h-9 items-center overflow-hidden border-b border-violet-500/30 bg-gradient-to-r from-violet-950 via-fuchsia-950 to-violet-950 text-xs text-violet-100 sm:top-20">
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_28s_linear_infinite] will-change-transform">
          <span className="px-4 font-medium tracking-wide">{loop}</span>
          <span className="px-4 font-medium tracking-wide">{loop}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 px-3 text-violet-300 hover:text-white"
        aria-label="Chiudi banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
