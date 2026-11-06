"use client";

import { motion } from "framer-motion";

export default function TerminiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-6">Termini e Condizioni</h1>
        <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <p>
            Utilizzando il sito Gaming Relax e i relativi servizi, accetti i presenti termini.
            I contenuti e i servizi sono forniti da Gaming Relax.
          </p>
          <p>
            <strong className="text-zinc-200">Servizi:</strong> i pacchetti descritti nello Store
            sono indicativi. Il dettaglio del lavoro viene concordato prima dell&apos;inizio.
          </p>
          <p>
            <strong className="text-zinc-200">Pagamenti:</strong> gli ordini vengono registrati
            e confermati dallo staff. I metodi di pagamento online saranno attivati progressivamente.
          </p>
          <p>
            <strong className="text-zinc-200">Proprietà intellettuale:</strong> salvo diversi
            accordi, il codice consegnato al cliente è utilizzabile per i suoi scopi. Non è
            consentita la rivendita del codice senza autorizzazione.
          </p>
          <p>
            <strong className="text-zinc-200">Limitazione di responsabilità:</strong> non siamo
            responsabili per usi impropri del software o interruzioni di servizi di terzi
            (Discord, hosting, ecc.).
          </p>
          <p className="text-xs text-zinc-600 pt-4">
            Documento di base — da aggiornare con il supporto legale quando necessario.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
