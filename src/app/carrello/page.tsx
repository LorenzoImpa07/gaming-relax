"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CarrelloPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-zinc-600 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Il carrello è vuoto</h1>
        <p className="text-zinc-400 mb-8">Aggiungi dei servizi dallo Store per iniziare.</p>
        <Link
          href="/store"
          className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Vai allo Store
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-white mb-8">Il tuo carrello</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <motion.div
            key={item.service.id}
            layout
            className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-white">{item.service.name}</h3>
              <p className="text-sm text-zinc-400 mt-1">{item.service.description}</p>
              <p className="text-violet-400 font-medium mt-2">€{item.service.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                className="rounded-lg border border-zinc-700 p-1.5 hover:bg-zinc-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                className="rounded-lg border border-zinc-700 p-1.5 hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeItem(item.service.id)}
                className="ml-2 rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-zinc-400">Totale</span>
          <span className="text-2xl font-bold text-white">€{total.toFixed(2)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={clearCart}
            className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Svuota carrello
          </button>
          <Link
            href="/checkout"
            className="flex-1 text-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
          >
            Procedi al checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
