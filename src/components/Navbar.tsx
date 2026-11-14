"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, LayoutDashboard, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/custom", label: "Custom" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/novita", label: "Novità" },
  { href: "/forum", label: "Forum" },
  { href: "/preventivo", label: "Preventivo" },
  { href: "/contatti", label: "Contatti" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/#team", label: "Team" },
  { href: "/faq", label: "FAQ" },
  { href: "/chi-siamo", label: "Chi siamo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = isAdminEmail(user?.email);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#07041a]/80 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Gaming Relax"
            width={36}
            height={36}
            className="rounded-xl ring-1 ring-white/10 transition group-hover:ring-violet-400/40"
          />
          <span className="hidden font-semibold tracking-tight text-white sm:inline">
            Gaming Relax
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:flex">
          {navLinks.slice(0, 8).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-pill",
                isActive(link.href)
                  ? "nav-pill-active"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {!loading &&
            (user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900/80 ring-offset-2 ring-offset-[#07041a] transition hover:border-violet-400/50 hover:ring-2 hover:ring-violet-500/30"
                  title="Menu profilo"
                >
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src="/logo.png" alt="" width={36} height={36} className="object-cover" />
                  )}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
                    <div className="mb-1 border-b border-white/5 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.displayName || "Utente"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profilo"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      Il mio profilo
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Esci
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden h-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white sm:inline-flex"
              >
                Accedi
              </Link>
            ))}

          <Link
            href="/carrello"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
            aria-label="Carrello"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-violet-500/40">
                {count}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/5 transition-all lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-0.5 bg-[#07041a]/95 px-3 py-3 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive(link.href)
                  ? "bg-violet-500/15 text-white"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
            >
              Accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
