"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Building2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("paypal");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    indirizzo: "",
    citta: "",
    cap: "",
    provincia: "",
    codiceFiscale: "",
    note: "",
  });

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Carrello vuoto</h1>
        <p className="text-zinc-400 mb-6">Aggiungi dei servizi prima di procedere al checkout.</p>
        <a href="/store" className="text-violet-400 hover:underline">
          Vai allo Store
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-400 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-2">Ordine ricevuto!</h1>
        <p className="text-zinc-400 mb-8">
          Grazie. Ti contatteremo a breve per confermare i dettagli e procedere con il pagamento.
        </p>
        <a
          href="/"
          className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Torna alla home
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-3xl font-bold text-white mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Dati anagrafici</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome *</label>
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Cognome *</label>
                <input required value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Telefono</label>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-zinc-400 mb-1">Indirizzo</label>
                <input value={form.indirizzo} onChange={(e) => setForm({ ...form, indirizzo: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Città</label>
                <input value={form.citta} onChange={(e) => setForm({ ...form, citta: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">CAP</label>
                <input value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Provincia</label>
                <input value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Codice Fiscale</label>
                <input value={form.codiceFiscale} onChange={(e) => setForm({ ...form, codiceFiscale: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-zinc-400 mb-1">Note (opzionale)</label>
                <textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-white focus:border-violet-500 focus:outline-none resize-none" placeholder="Dettagli sul progetto, scadenze, preferenze..." />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Metodo di pagamento</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === "paypal" ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}>
                <input type="radio" name="payment" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} className="accent-violet-500" />
                <Building2 className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white">PayPal</div>
                  <div className="text-xs text-zinc-400">Pagamento sicuro tramite PayPal</div>
                </div>
              </label>

              <label className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}>
                <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-violet-500" />
                <CreditCard className="h-5 w-5 text-zinc-300" />
                <div>
                  <div className="font-medium text-white">Carta di credito / debito</div>
                  <div className="text-xs text-zinc-400">Visa, Mastercard, Amex (via Stripe – in arrivo)</div>
                </div>
              </label>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Il pagamento reale verrà collegato in seguito. Per ora l&apos;ordine viene registrato e ti contatteremo.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Riepilogo ordine</h2>
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li key={item.service.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">{item.service.name} × {item.quantity}</span>
                  <span className="text-white">€{(item.service.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-zinc-700 pt-4 flex justify-between">
              <span className="font-medium text-zinc-300">Totale</span>
              <span className="text-xl font-bold text-white">€{total.toFixed(2)}</span>
            </div>

            <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:opacity-60">
              {loading ? "Elaborazione..." : "Conferma ordine"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
