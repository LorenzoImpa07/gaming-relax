"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingCart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/novita", label: "Novità" },
  { href: "/forum", label: "Forum" },
  { href: "/#team", label: "Team" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/contatti", label: "Contatti" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0f]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image
            src="/logo.png"
            alt="Gaming Relax"
            width={40}
            height={40}
            className="rounded-lg object-contain group-hover:scale-105 transition-transform"
            priority
          />
          <span className="text-base font-semibold tracking-tight bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent hidden sm:block">
            Gaming Relax
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/50 px-2 py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {!loading && (
            user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-zinc-400 max-w-[100px] truncate">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Esci"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 overflow-hidden"
                title="Accedi"
              >
                <Image src="/logo.png" alt="Profilo" width={36} height={36} className="object-cover" />
              </Link>
            )
          )}

          <Link
            href="/carrello"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/80 text-zinc-300 hover:border-violet-500/50 hover:text-white transition-colors"
            aria-label="Carrello"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-zinc-800",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 bg-[#0a0a0f]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 transition-colors",
                isActive(link.href) ? "bg-zinc-900 text-white" : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="rounded-lg px-4 py-3 text-left text-zinc-300 hover:bg-zinc-900">
              Esci
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-4 py-3 text-zinc-300 hover:bg-zinc-900">
              Accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
