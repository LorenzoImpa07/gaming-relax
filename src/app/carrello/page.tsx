"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PaymentMethodsBar } from "@/components/PaymentMethodsBar";

export default function CarrelloPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-zinc-600" />
        <h1 className="mb-2 text-2xl font-bold text-white">Il carrello è vuoto</h1>
        <p className="mb-8 text-zinc-400">Aggiungi dei servizi dallo Store per iniziare.</p>
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
      <h1 className="mb-8 text-3xl font-bold text-white">Il tuo carrello</h1>

      <div className="mb-10 space-y-4">
        {items.map((item) => (
          <motion.div
            key={`${item.service.id}-${item.planId || "base"}`}
            layout
            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-white">{item.service.name}</h3>
              {item.planName && (
                <p className="mt-0.5 text-xs text-violet-400">Piano: {item.planName}</p>
              )}
              <p className="mt-1 text-sm text-zinc-400">{item.service.description}</p>
              <p className="mt-2 font-medium text-violet-400">€{item.service.price}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.service.id, item.quantity - 1, item.planId)}
                className="rounded-lg border border-zinc-700 p-1.5 hover:bg-zinc-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.service.id, item.quantity + 1, item.planId)}
                className="rounded-lg border border-zinc-700 p-1.5 hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => removeItem(item.service.id, item.planId)}
                className="ml-2 rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <PaymentMethodsBar variant="cart" className="mb-6" />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-zinc-400">Totale</span>
          <span className="text-2xl font-bold text-white">€{total.toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={clearCart}
            className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Svuota carrello
          </button>
          <Link
            href="/checkout"
            className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25"
          >
            Procedi al checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
