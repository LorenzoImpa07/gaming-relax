"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, Building2, CheckCircle2 } from "lucide-react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { COUNTRIES, ITALY_PROVINCES } from "@/lib/countries";

type TipOption = 0 | 2 | 5 | 10;

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">("card");
  const [tipPercent, setTipPercent] = useState<TipOption>(2);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountApplied, setDiscountApplied] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: user?.email || "",
    telefono: "",
    indirizzo: "",
    citta: "",
    cap: "",
    paese: "Italia",
    provincia: "",
    codiceFiscale: "",
    note: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const subtotal = total;
  const discountAmount = useMemo(
    () => (subtotal * discountPercent) / 100,
    [subtotal, discountPercent]
  );
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const tipAmount = useMemo(
    () => (afterDiscount * tipPercent) / 100,
    [afterDiscount, tipPercent]
  );
  const iva = useMemo(() => afterDiscount * 0.22, [afterDiscount]);
  const grandTotal = afterDiscount + tipAmount + iva;

  const applyDiscount = async () => {
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setDiscountError("Inserisci un codice");
      return;
    }
    try {
      const q = query(
        collection(db, "discount_codes"),
        where("code", "==", code),
        where("active", "==", true)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setDiscountPercent(0);
        setDiscountApplied("");
        setDiscountError("Codice non valido o scaduto");
        return;
      }
      const percent = Number(snap.docs[0].data().percent) || 0;
      setDiscountPercent(percent);
      setDiscountApplied(code);
      setDiscountError("");
    } catch (e) {
      console.error(e);
      setDiscountError("Errore verifica codice");
    }
  };

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Carrello vuoto</h1>
        <p className="mb-6 text-zinc-400">Aggiungi dei servizi prima di procedere al checkout.</p>
        <Link href="/store" className="text-violet-400 hover:underline">
          Vai allo Store
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (paymentMethod === "card" && (!card.number || !card.expiry || !card.cvc || !card.name)) {
      setError("Compila tutti i dati della carta");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: user?.uid || null,
        customer: { ...form },
        items: items.map((i) => ({
          id: i.service.id,
          name: i.service.name,
          price: i.service.price,
          quantity: i.quantity,
        })),
        subtotal,
        discountCode: discountApplied || null,
        discountPercent,
        discountAmount,
        tipPercent,
        tipAmount,
        iva,
        total: grandTotal,
        paymentMethod,
        cardLast4:
          paymentMethod === "card" ? card.number.replace(/\s/g, "").slice(-4) : null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      clearCart();
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Errore nel salvataggio dell'ordine. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-400" />
        <h1 className="mb-2 text-2xl font-bold text-white">Ordine ricevuto!</h1>
        <p className="mb-6 text-zinc-400">
          Ti contatteremo a breve per confermare e completare il pagamento.
        </p>
        <Link href="/store" className="text-violet-400 hover:underline">
          Torna allo Store
        </Link>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">Dati di fatturazione</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className={field}
              />
              <input
                required
                placeholder="Cognome"
                value={form.cognome}
                onChange={(e) => setForm({ ...form, cognome: e.target.value })}
                className={field}
              />
            </div>
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
            <input
              placeholder="Telefono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className={field}
            />
            <input
              placeholder="Indirizzo"
              value={form.indirizzo}
              onChange={(e) => setForm({ ...form, indirizzo: e.target.value })}
              className={field}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                placeholder="Citta"
                value={form.citta}
                onChange={(e) => setForm({ ...form, citta: e.target.value })}
                className={field}
              />
              <input
                placeholder="CAP"
                value={form.cap}
                onChange={(e) => setForm({ ...form, cap: e.target.value })}
                className={field}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Paese</label>
                <select
                  required
                  value={form.paese}
                  onChange={(e) => setForm({ ...form, paese: e.target.value, provincia: "" })}
                  className={field}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">
                  {form.paese === "Italia" ? "Provincia" : "Stato / Regione / Provincia"}
                </label>
                {form.paese === "Italia" ? (
                  <select
                    required
                    value={form.provincia}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    className={field}
                  >
                    <option value="">Seleziona provincia</option>
                    {ITALY_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    placeholder="Stato / Regione / Provincia"
                    value={form.provincia}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    className={field}
                  />
                )}
              </div>
            </div>
            <input
              placeholder="Codice fiscale / P.IVA (opzionale)"
              value={form.codiceFiscale}
              onChange={(e) => setForm({ ...form, codiceFiscale: e.target.value })}
              className={field}
            />
            <textarea
              placeholder="Note ordine (opzionale)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className={field}
              rows={2}
            />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-fuchsia-500" />
              <h2 className="text-lg font-semibold text-white">Mancia</h2>
            </div>
            <p className="mb-4 text-sm text-zinc-400">Un piccolo extra per il team Gaming Relax.</p>
            <div className="flex flex-wrap gap-2">
              {([2, 5, 10, 0] as TipOption[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTipPercent(p)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                    tipPercent === p
                      ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-300"
                      : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  {p === 0 ? "Nessuna" : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-fuchsia-500" />
              <h2 className="text-lg font-semibold text-white">Pagamento</h2>
            </div>
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${
                  paymentMethod === "card"
                    ? "border-fuchsia-500 bg-fuchsia-500/10"
                    : "border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-fuchsia-500"
                />
                <CreditCard className="h-5 w-5 text-zinc-300" />
                <div className="flex-1">
                  <div className="font-medium text-white">Carta di credito / debito</div>
                  <div className="text-xs text-zinc-400">VISA · MASTERCARD · AMEX</div>
                </div>
              </label>
              {paymentMethod === "card" && (
                <div className="space-y-3 rounded-xl border border-fuchsia-500/40 bg-zinc-950/60 p-5">
                  <input
                    placeholder="Numero carta"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className={field}
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Scadenza (MM / YY)"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className={field}
                      autoComplete="cc-exp"
                    />
                    <input
                      placeholder="Codice di sicurezza"
                      value={card.cvc}
                      onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                      className={field}
                      autoComplete="cc-csc"
                    />
                  </div>
                  <input
                    placeholder="Nome sulla carta"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className={field}
                    autoComplete="cc-name"
                  />
                  <p className="text-xs text-zinc-500">
                    I dati carta non vengono salvati in chiaro. L'addebito reale andra con
                    Stripe.
                  </p>
                </div>
              )}
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${
                  paymentMethod === "paypal"
                    ? "border-fuchsia-500 bg-fuchsia-500/10"
                    : "border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="accent-fuchsia-500"
                />
                <Building2 className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white">PayPal</div>
                  <div className="text-xs text-zinc-400">Pagamento sicuro tramite PayPal</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Riepilogo</h2>
            <ul className="mb-4 space-y-3">
              {items.map((item) => (
                <li key={item.service.id} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    {item.service.name} × {item.quantity}
                  </span>
                  <span className="text-white">
                    €{(item.service.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mb-4 flex gap-2">
              <input
                placeholder="Codice sconto o codice creator"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={applyDiscount}
                className="rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:border-fuchsia-500"
              >
                Applica
              </button>
            </div>
            {discountError && <p className="mb-2 text-xs text-red-400">{discountError}</p>}
            {discountApplied && (
              <p className="mb-2 text-xs text-green-400">
                Codice {discountApplied} applicato (−{discountPercent}%)
              </p>
            )}
            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotale</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Sconto ({discountPercent}%)</span>
                  <span>−€{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>IVA stimata (22%)</span>
                <span>€{iva.toFixed(2)}</span>
              </div>
              {tipPercent > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Mancia ({tipPercent}%)</span>
                  <span>€{tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="font-medium text-zinc-200">Totale</span>
                <span className="text-xl font-bold text-fuchsia-400">
                  €{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-500 py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Elaborazione..." : "Paga ora"}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-500">
              <Link href="/carrello" className="hover:text-fuchsia-400">
                ← Torna al carrello
              </Link>
              {" · "}
              <Link href="/privacy" className="hover:text-fuchsia-400">
                Privacy
              </Link>
              {" · "}
              <Link href="/termini" className="hover:text-fuchsia-400">
                Termini
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
