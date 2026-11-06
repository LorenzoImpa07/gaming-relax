import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

const socials = [
  {
    name: "Discord",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: "mailto:supportogamingrelax@gmail.com",
    icon: <Mail className="h-5 w-5" />,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#08080c]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Gaming Relax" width={36} height={36} className="rounded-lg object-contain" />
              <span className="font-semibold text-white">Gaming Relax</span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              Sviluppiamo applicazioni, bot Discord e software custom.
              Soluzioni concrete, codice pulito, risultati reali.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/50 text-zinc-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Navigazione</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-violet-400 transition-colors">Home</Link></li>
              <li><Link href="/store" className="hover:text-violet-400 transition-colors">Store</Link></li>
              <li><Link href="/novita" className="hover:text-violet-400 transition-colors">Novit\u00e0</Link></li>
              <li><Link href="/forum" className="hover:text-violet-400 transition-colors">Forum</Link></li>
              <li><Link href="/#team" className="hover:text-violet-400 transition-colors">Team</Link></li>
              <li><Link href="/recensioni" className="hover:text-violet-400 transition-colors">Recensioni</Link></li>
              <li><Link href="/contatti" className="hover:text-violet-400 transition-colors">Contatti</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">Link utili</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/faq" className="hover:text-violet-400 transition-colors">FAQ (Domande Frequenti)</Link></li>
              <li><Link href="/termini" className="hover:text-violet-400 transition-colors">Termini e Condizioni</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie" className="hover:text-violet-400 transition-colors">Cookies</Link></li>
              <li><Link href="/#chi-siamo" className="hover:text-violet-400 transition-colors">Chi siamo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Orari di supporto & disponibilit\u00e0
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Lun - Ven: 10:00 - 19:00</li>
              <li>Sab - Dom: Su appuntamento</li>
              <li className="pt-2">
                <a
                  href="mailto:supportogamingrelax@gmail.com"
                  className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Mail size={14} />
                  supportogamingrelax@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            \u00a9 {new Date().getFullYear()} Gaming Relax. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-zinc-500">P.IVA: da inserire \u2022 gamingrelaxofficials.it</p>
        </div>
      </div>
    </footer>
  );
}
