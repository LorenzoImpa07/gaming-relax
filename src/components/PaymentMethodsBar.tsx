"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CreditCard } from "lucide-react";

type PayRow = {
  id: string;
  name: string;
  requiresCard?: boolean;
  active?: boolean;
  order?: number;
};

function detectKind(name: string, requiresCard?: boolean) {
  const n = name.toLowerCase();
  if (n.includes("paypal")) return "paypal" as const;
  if (n.includes("stripe")) return "stripe" as const;
  if (n.includes("bonifico") || n.includes("bank") || n.includes("iban")) return "bank" as const;
  if (
    requiresCard ||
    n.includes("carta") ||
    n.includes("credit") ||
    n.includes("debit") ||
    n.includes("visa") ||
    n.includes("master")
  )
    return "card" as const;
  return "other" as const;
}

function PayPalIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.65h6.855c2.28 0 4.06.52 5.13 1.5 1.02.93 1.4 2.25 1.13 3.93-.03.18-.07.36-.11.53-.5 2.12-1.65 3.58-3.41 4.33-1.02.44-2.22.66-3.56.66H9.75a.77.77 0 0 0-.76.66l-.9 5.65a.64.64 0 0 1-.633.54H7.076z"
        opacity=".35"
      />
      <path d="M19.915 7.5c-.03.18-.07.36-.11.53-.5 2.12-1.65 3.58-3.41 4.33-1.02.44-2.22.66-3.56.66h-1.8a.77.77 0 0 0-.76.66l-1.09 6.9a.641.641 0 0 1-.633.54H5.8l.14-.9.9-5.65a.77.77 0 0 1 .76-.66h1.8c1.34 0 2.54-.22 3.56-.66 1.76-.75 2.91-2.21 3.41-4.33.04-.17.08-.35.11-.53.37-1.55.05-2.76-.85-3.66.22.03.43.07.63.12 1.65.42 2.79 1.55 3.14 3.34z" />
    </svg>
  );
}

function VisaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-hidden>
      <rect width="48" height="32" rx="4" fill="#1A1F71" />
      <path
        d="M19.5 21h-2.8l1.75-10.5h2.8L19.5 21zm11.2-10.25c-.55-.2-1.4-.42-2.45-.42-2.7 0-4.6 1.4-4.62 3.4-.02 1.48 1.35 2.3 2.38 2.8 1.05.5 1.4.84 1.4 1.3-.01.7-.85 1.02-1.64 1.02-1.1 0-1.68-.16-2.58-.55l-.35-.17-.38 2.3c.64.28 1.82.52 3.05.53 2.88 0 4.76-1.38 4.78-3.52.01-1.17-.72-2.06-2.3-2.8-.96-.48-1.54-.8-1.54-1.28.01-.43.48-.88 1.53-.88.87-.01 1.5.18 1.98.38l.24.11.36-2.22zm6.55-.25h-2.15c-.67 0-1.17.19-1.46.88l-4.15 9.62h2.95l.59-1.6h3.6l.34 1.6h2.6L37.25 10.75zm-3.12 6.05c.23-.62 1.13-3.05 1.13-3.05l.02-.04.65 3.09h-1.8zm-16.2-6.05l-2.72 7.55-.3-1.48c-.5-1.7-2.1-3.55-3.88-4.47l2.5 9.4h2.98l4.43-10.5h-3.01z"
        fill="white"
      />
      <path d="M9.8 10.75L5.55 21h2.98l4.25-10.25H9.8z" fill="#F9A61A" />
    </svg>
  );
}

function MastercardIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 32" fill="none" aria-hidden>
      <rect width="48" height="32" rx="4" fill="#252525" />
      <circle cx="19" cy="16" r="8" fill="#EB001B" />
      <circle cx="29" cy="16" r="8" fill="#F79E1B" />
      <path d="M24 10.2a8 8 0 0 1 0 11.6 8 8 0 0 1 0-11.6z" fill="#FF5F00" />
    </svg>
  );
}

function BankIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M3 10h18M5 10v8m4-8v8m4-8v8m4-8v8M2 18h20M12 4l9 6H3l9-6z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MethodIcon({ kind }: { kind: ReturnType<typeof detectKind> }) {
  if (kind === "paypal")
    return (
      <span className="flex h-8 w-12 items-center justify-center rounded-md border border-[#003087]/40 bg-[#003087]/20 text-[#66a3ff]">
        <PayPalIcon className="h-5 w-5" />
      </span>
    );
  if (kind === "card")
    return (
      <span className="flex items-center gap-1">
        <span className="overflow-hidden rounded-md border border-zinc-700 shadow-sm">
          <VisaIcon className="h-7 w-11" />
        </span>
        <span className="overflow-hidden rounded-md border border-zinc-700 shadow-sm">
          <MastercardIcon className="h-7 w-11" />
        </span>
      </span>
    );
  if (kind === "bank")
    return (
      <span className="flex h-8 w-12 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
        <BankIcon className="h-4 w-4" />
      </span>
    );
  if (kind === "stripe")
    return (
      <span className="flex h-8 items-center rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 font-mono text-[10px] font-bold tracking-wide text-indigo-300">
        stripe
      </span>
    );
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-zinc-400">
      <CreditCard className="h-4 w-4" />
    </span>
  );
}

type Props = {
  variant?: "footer" | "cart";
  className?: string;
};

export function PaymentMethodsBar({ variant = "footer", className = "" }: Props) {
  const [methods, setMethods] = useState<PayRow[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "site_payment_methods"),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<PayRow, "id">) }))
          .filter((m) => m.active !== false)
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setMethods(list);
      },
      () => setMethods([])
    );
    return () => unsub();
  }, []);

  const fallback: PayRow[] = [
    { id: "f-paypal", name: "PayPal" },
    { id: "f-card", name: "Carta di credito / debito", requiresCard: true },
  ];

  const rows = methods.length > 0 ? methods : fallback;

  if (variant === "footer") {
    return (
      <div className={className}>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-300">
          Metodi di pagamento
        </h4>
        <ul className="space-y-2.5">
          {rows.map((m) => {
            const kind = detectKind(m.name, m.requiresCard);
            return (
              <li key={m.id} className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MethodIcon kind={kind} />
                <span>{m.name}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-600">
          Carta fronte e retro accettata al checkout quando previsto dal metodo.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-violet-400" />
        <p className="text-sm font-semibold text-white">Metodi di pagamento accettati</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {rows.map((m) => {
          const kind = detectKind(m.name, m.requiresCard);
          return (
            <div
              key={m.id}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2"
            >
              <MethodIcon kind={kind} />
              <span className="text-xs font-medium text-zinc-300">{m.name}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-zinc-500">
        In checkout puoi scegliere il metodo. Per le carte vengono richiesti numero, scadenza, CVV
        (retro) e nome sul fronte.
      </p>
    </div>
  );
}
