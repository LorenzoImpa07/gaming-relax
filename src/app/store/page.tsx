"use client";

import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import { services } from "@/data/services";
import { useCart } from "@/context/CartContext";

export default function StorePage() {
  const { addItem } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Store Servizi</h1>
        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
          Scegli il pacchetto più adatto alle tue esigenze.  
          Tutti i prezzi sono trasparenti e includono supporto.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-2xl border p-6 flex flex-col ${
              service.popular
                ? "border-violet-500/50 bg-violet-500/5"
                : "border-zinc-800 bg-zinc-900/40"
            }`}
          >
            {service.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-0.5 text-xs font-semibold text-white">
                Più richiesto
              </span>
            )}

            <h3 className="text-xl font-semibold text-white">{service.name}</h3>
            <p className="mt-2 text-sm text-zinc-400 flex-1">{service.description}</p>

            <div className="mt-4 mb-5">
              <span className="text-3xl font-bold text-white">€{service.price}</span>
              <span className="text-zinc-500 text-sm ml-1">una tantum</span>
            </div>

            <ul className="space-y-2 mb-6">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => addItem(service)}
              className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all hover:scale-[1.02]"
            >
              <ShoppingCart className="h-4 w-4" />
              Aggiungi al carrello
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
