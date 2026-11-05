"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-700 bg-[#12121a]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Utilizziamo i cookie</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Questo sito utilizza cookie tecnici necessari al funzionamento. 
                Per maggiori informazioni consulta la{" "}
                <Link href="/cookie" className="text-violet-400 hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex gap-3 shrink-0">
            <button
              onClick={decline}
              className="rounded-full border border-zinc-600 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Rifiuta
            </button>
            <button
              onClick={accept}
              className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
