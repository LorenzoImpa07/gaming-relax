"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/#servizi", label: "Servizi" },
  { href: "/store", label: "Store" },
  { href: "/#progetti", label: "Progetti" },
  { href: "/#team", label: "Team" },
  { href: "/contatti", label: "Contatti" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Gaming Relax Logo"
            width={42}
            height={42}
            className="rounded-lg object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-white group-hover:text-violet-300 transition-colors hidden sm:block">
            Gaming Relax
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/carrello"
            className="relative p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Carrello"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <User className="h-4 w-4" />
            Accedi
          </Link>

          <Link
            href="/contatti"
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105"
          >
            Inizia un progetto
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/carrello" className="relative p-2 text-zinc-400">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="p-2 text-zinc-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 border-t border-zinc-800",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 bg-[#0a0a0f]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-lg px-4 py-3 text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            Accedi / Registrati
          </Link>
          <Link
            href="/contatti"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Inizia un progetto
          </Link>
        </nav>
      </div>
    </header>
  );
}
