"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2 } from "lucide-react";
import {
  AnimatedCreditCard,
  formatCardNumberInput,
  formatExpiryInput,
} from "@/components/checkout/AnimatedCreditCard";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { COUNTRIES, ITALY_PROVINCES } from "@/lib/countries";

type TipOption = 0 | 2 | 5 | 10;
type PayMethod = {
  id: string;
  name: string;
  description?: string;
  link?: string;
  requiresCard?: boolean;
  active?: boolean;
  order?: number;
};

const field =
  "w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-fuchsia-500 focus:outline-none";

export default function CheckoutClient() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [payMethods, setPayMethods] = useState<PayMethod[]>([]);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [tipPercent, setTipPercent] = useState<TipOption>(2);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountApplied, setDiscountApplied] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [giftCode, setGiftCode] = useState("");
  const [giftApplied, setGiftApplied] = useState<{ id: string; code: string; balance: number } | null>(null);
  const [giftError, setGiftError] = useState("");
  const [giftAmount, setGiftAmount] = useState(0);
  const [form, setForm] = useState({
    nome: "", cognome: "", email: user?.email || "", telefono: "", indirizzo: "",
    citta: "", cap: "", paese: "Italia", provincia: "", codiceFiscale: "", note: "",
  });
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [cvcFocused, setCvcFocused] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "site_payment_methods"), (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<PayMethod, "id">) }))
        .filter((m) => m.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setPayMethods(list);
      setPaymentMethodId((prev) => (prev && list.some((m) => m.id === prev) ? prev : list[0]?.id || ""));
    }, () => setPayMethods([]));
    return () => unsub();
  }, []);

  const selectedPay = payMethods.find((m) => m.id === paymentMethodId) || null;
  const subtotal = total;
  const discountAmount = useMemo(() => (subtotal * discountPercent) / 100, [subtotal, discountPercent]);
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const tipAmount = useMemo(() => (afterDiscount * tipPercent) / 100, [afterDiscount, tipPercent]);
  const iva = useMemo(() => afterDiscount * 0.22, [afterDiscount]);
  const beforeGift = afterDiscount + tipAmount + iva;
  const giftUse = Math.min(giftAmount, beforeGift);
  const grandTotal = Math.max(0, beforeGift - giftUse);

  const applyDiscount = async () => {
    setDiscountError("");
    const code = discountCode.trim().toUpperCase();
    if (!code) return setDiscountError("Inserisci un codice");
    try {
      const snap = await getDocs(query(collection(db, "discount_codes"), where("code", "==", code), where("active", "==", true)));
      if (snap.empty) {
        setDiscountPercent(0); setDiscountApplied(""); setDiscountError("Codice non valido o scaduto"); return;
      }
      setDiscountPercent(Number(snap.docs[0].data().percent) || 0);
      setDiscountApplied(code); setDiscountError("");
    } catch { setDiscountError("Errore verifica codice"); }
  };

  const applyGift = async () => {
    setGiftError("");
    const code = giftCode.trim().toUpperCase();
    if (!code) return setGiftError("Inserisci il codice gift card");
    const email = (form.email || user?.email || "").trim().toLowerCase();
    if (!email) return setGiftError("Inserisci l'email di fatturazione prima");
    try {
      const snap = await getDocs(query(collection(db, "gift_cards"), where("code", "==", code), where("active", "==", true)));
      if (snap.empty) { setGiftApplied(null); setGiftAmount(0); setGiftError("Gift card non valida"); return; }
      const d = snap.docs[0]; const data = d.data();
      const assigned = String(data.assignedEmail || "").toLowerCase();
      if (assigned && assigned !== email) { setGiftApplied(null); setGiftAmount(0); setGiftError("Gift card assegnata ad altra email"); return; }
      const balance = Number(data.balance) || 0;
      if (balance <= 0) { setGiftApplied(null); setGiftAmount(0); setGiftError("Saldo esaurito"); return; }
      setGiftApplied({ id: d.id, code, balance }); setGiftAmount(balance); setGiftError("");
    } catch { setGiftError("Errore verifica gift card"); }
  };

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Carrello vuoto</h1>
        <Link href="/store" className="text-violet-400 hover:underline">Vai allo Store</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!selectedPay) return setError("Nessun metodo di pagamento disponibile.");
    if (selectedPay.requiresCard && (!card.number || !card.expiry || !card.cvc || !card.name))
      return setError("Compila tutti i dati della carta");
    setLoading(true);
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user?.uid || null, customer: { ...form },
        items: items.map((i) => ({ id: i.service.id, name: i.service.name, price: i.service.price, quantity: i.quantity, planId: i.planId || null, planName: i.planName || null })),
        subtotal, discountCode: discountApplied || null, discountPercent, discountAmount, tipPercent, tipAmount, iva,
        giftCardCode: giftApplied?.code || null, giftCardAmount: giftUse, total: grandTotal,
        paymentMethod: selectedPay.name, paymentMethodId: selectedPay.id, paymentLink: selectedPay.link || null,
        cardLast4: selectedPay.requiresCard ? card.number.replace(/\s/g, "").slice(-4) : null,
        status: "pending", createdAt: serverTimestamp(),
      });
      if (giftApplied && giftUse > 0) {
        const before = giftApplied.balance; const after = Math.max(0, before - giftUse);
        await updateDoc(doc(db, "gift_cards", giftApplied.id), {
          balance: after,
          history: arrayUnion({ type: "used", amount: giftUse, balanceBefore: before, balanceAfter: after, orderId: orderRef.id, at: new Date().toISOString() }),
        });
      }
      clearCart(); setDone(true);
    } catch { setError("Errore nel salvataggio dell'ordine. Riprova."); }
    finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-400" />
        <h1 className="mb-2 text-2xl font-bold text-white">Ordine ricevuto!</h1>
        <Link href="/store" className="text-violet-400 hover:underline">Torna allo Store</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
      {error && <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">Dati di fatturazione</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className={field} />
              <input required placeholder="Cognome" value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })} className={field} />
            </div>
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            <input placeholder="Telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className={field} />
            <input placeholder="Indirizzo" value={form.indirizzo} onChange={(e) => setForm({ ...form, indirizzo: e.target.value })} className={field} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Città" value={form.citta} onChange={(e) => setForm({ ...form, citta: e.target.value })} className={field} />
              <input placeholder="CAP" value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} className={field} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">Paese</label>
                <select required value={form.paese} onChange={(e) => setForm({ ...form, paese: e.target.value, provincia: "" })} className={field}>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-zinc-500">{form.paese === "Italia" ? "Provincia" : "Stato / Regione"}</label>
                {form.paese === "Italia" ? (
                  <select required value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} className={field}>
                    <option value="">Seleziona provincia</option>
                    {ITALY_PROVINCES.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
                  </select>
                ) : (
                  <input required placeholder="Stato / Regione" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} className={field} />
                )}
              </div>
            </div>
            <input placeholder="Codice fiscale / P.IVA (opzionale)" value={form.codiceFiscale} onChange={(e) => setForm({ ...form, codiceFiscale: e.target.value })} className={field} />
            <textarea placeholder="Note ordine (opzionale)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={field} rows={2} />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Mancia</h2>
            <div className="flex flex-wrap gap-2">
              {([2, 5, 10, 0] as TipOption[]).map((p) => (
                <button key={p} type="button" onClick={() => setTipPercent(p)} className={`rounded-full border px-5 py-2.5 text-sm font-medium ${tipPercent === p ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-300" : "border-zinc-700 text-zinc-300"}`}>
                  {p === 0 ? "Nessuna" : `${p}%`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Pagamento</h2>
            {payMethods.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun metodo attivo. Dashboard → Pagamenti.</p>
            ) : (
              <div className="space-y-3">
                {payMethods.map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 ${paymentMethodId === m.id ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-zinc-700"}`}>
                    <input type="radio" name="payment" checked={paymentMethodId === m.id} onChange={() => setPaymentMethodId(m.id)} className="accent-fuchsia-500" />
                    <CreditCard className="h-5 w-5 text-zinc-300" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white">{m.name}</div>
                      {m.description && <div className="text-xs text-zinc-400">{m.description}</div>}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {selectedPay?.requiresCard && (
              <div className="mt-4 space-y-4 rounded-xl border border-fuchsia-500/40 bg-zinc-950/60 p-5">
                <div className="grid gap-5 lg:grid-cols-[1fr_minmax(240px,320px)] lg:items-start">
                  <div className="space-y-3">
                    <input placeholder="Numero carta" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumberInput(e.target.value) })} className={field} inputMode="numeric" autoComplete="cc-number" maxLength={19} />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Scadenza (MM / YY)" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiryInput(e.target.value) })} className={field} autoComplete="cc-exp" maxLength={7} />
                      <input placeholder="Codice di sicurezza" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} onFocus={() => setCvcFocused(true)} onBlur={() => setCvcFocused(false)} className={field} autoComplete="cc-csc" inputMode="numeric" maxLength={4} />
                    </div>
                    <input placeholder="Nome sulla carta" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={field} autoComplete="cc-name" />
                    <p className="text-xs text-zinc-500">I dati carta non vengono salvati in chiaro. La preview è solo visuale.</p>
                  </div>
                  <div className="lg:sticky lg:top-28">
                    <AnimatedCreditCard card={card} showBack={cvcFocused} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Riepilogo</h2>
            <ul className="mb-4 space-y-3">
              {items.map((item) => (
                <li key={`${item.service.id}-${item.planId || "base"}`} className="flex justify-between text-sm">
                  <span className="text-zinc-300">{item.service.name} × {item.quantity}</span>
                  <span className="text-white">€{(item.service.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mb-4 flex gap-2">
              <input placeholder="Codice sconto" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white" />
              <button type="button" onClick={applyDiscount} className="rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-200">Applica</button>
            </div>
            {discountError && <p className="mb-2 text-xs text-red-400">{discountError}</p>}
            {discountApplied && <p className="mb-2 text-xs text-green-400">Codice {discountApplied} (−{discountPercent}%)</p>}
            <div className="mb-4 flex gap-2">
              <input placeholder="Gift card" value={giftCode} onChange={(e) => setGiftCode(e.target.value)} className="flex-1 rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-white" />
              <button type="button" onClick={applyGift} className="rounded-full border border-zinc-600 px-4 py-2 text-sm text-zinc-200">Gift</button>
            </div>
            {giftError && <p className="mb-2 text-xs text-red-400">{giftError}</p>}
            {giftApplied && <p className="mb-2 text-xs text-violet-300">Gift {giftApplied.code}: €{giftApplied.balance.toFixed(2)}</p>}
            <div className="space-y-2 border-t border-zinc-800 pt-4 text-sm">
              <div className="flex justify-between text-zinc-400"><span>Subtotale</span><span>€{subtotal.toFixed(2)}</span></div>
              {discountPercent > 0 && <div className="flex justify-between text-green-400"><span>Sconto</span><span>−€{discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-zinc-400"><span>IVA (22%)</span><span>€{iva.toFixed(2)}</span></div>}
              {tipPercent > 0 && <div className="flex justify-between text-zinc-400"><span>Mancia</span><span>€{tipAmount.toFixed(2)}</span></div>}
              {giftUse > 0 && <div className="flex justify-between text-violet-300"><span>Gift card</span><span>−€{giftUse.toFixed(2)}</span></div>}
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="font-medium text-zinc-200">Totale</span>
                <span className="text-xl font-bold text-white">€{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" disabled={loading || payMethods.length === 0} className="btn-press mt-6 w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-3.5 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? "Invio..." : "Conferma ordine"}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-500">
              <Link href="/carrello" className="hover:text-fuchsia-400">← Torna al carrello</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
