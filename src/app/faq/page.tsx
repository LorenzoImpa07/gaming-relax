"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "Quanto tempo serve per sviluppare un bot Discord?",
    a: "Dipende dalla complessità. Un bot base può richiedere pochi giorni, mentre un bot Pro con dashboard e integrazioni può richiedere 1–3 settimane.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "Puoi ordinare dallo Store e completare il checkout. Il pagamento reale (PayPal / carta) verrà collegato a breve; nel frattempo ti contattiamo per confermare l'ordine.",
  },
  {
    q: "Offrite supporto dopo la consegna?",
    a: "Sì. Ogni pacchetto include un periodo di supporto. È disponibile anche un piano di manutenzione mensile.",
  },
  {
    q: "Posso richiedere modifiche in corso d'opera?",
    a: "Sì, entro i limiti concordati. Modifiche importanti possono richiedere un adeguamento del preventivo.",
  },
  {
    q: "Lavorate solo su Discord?",
    a: "No. Sviluppiamo anche applicazioni web, software custom e automazioni tra vari servizi.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">FAQ</h1>
        <p className="mt-4 text-zinc-400">Domande frequenti su servizi, tempi e supporto.</p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <h2 className="font-semibold text-white">{item.q}</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
