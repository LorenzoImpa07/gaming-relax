import Link from "next/link";
import { Code2, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#08080c]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-white">Gaming Relax</span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Sviluppiamo applicazioni, bot Discord e software custom.  
              Soluzioni concrete, codice pulito, risultati reali.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Navigazione</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/#servizi" className="hover:text-violet-400 transition-colors">
                  Servizi
                </Link>
              </li>
              <li>
                <Link href="/#progetti" className="hover:text-violet-400 transition-colors">
                  Progetti
                </Link>
              </li>
              <li>
                <Link href="/#chi-siamo" className="hover:text-violet-400 transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-violet-400 transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legale & Contatti</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-violet-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="hover:text-violet-400 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:info@gamingrelaxofficials.it"
                  className="flex items-center gap-2 hover:text-violet-400 transition-colors"
                >
                  <Mail size={14} />
                  info@gamingrelaxofficials.it
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Gaming Relax. Tutti i diritti riservati.
          </p>
          <p className="text-xs text-zinc-500">
            P.IVA: da inserire • gamingrelaxofficials.it
          </p>
        </div>
      </div>
    </footer>
  );
}
