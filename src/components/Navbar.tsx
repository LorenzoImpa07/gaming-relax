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
  { href: "/novita", label: "Novità" },
  { href: "/forum", label: "Forum" },
  { href: "/#team", label: "Team" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/contatti", label: "Contatti" },
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0f]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/logo.png" alt="Gaming Relax" width={36} height={36} className="rounded-lg" />
          <span className="hidden font-semibold text-white sm:inline">Gaming Relax</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/50 px-2 py-1.5 lg:flex">
          {navLinks.slice(0, 7).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                isActive(link.href) ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
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
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 hover:border-violet-500/50"
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
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-zinc-700 bg-zinc-950 p-2 shadow-xl shadow-black/50">
                    <div className="mb-1 border-b border-zinc-800 px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.displayName || "Utente"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profilo"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      Il mio profilo
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
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
                className="hidden h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-700 sm:flex"
                title="Accedi"
              >
                <Image src="/logo.png" alt="Accedi" width={36} height={36} className="object-cover" />
              </Link>
            ))}

          <Link
            href="/carrello"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:border-violet-500/50"
            aria-label="Carrello"
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            className="p-2 text-zinc-400 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-zinc-800 transition-all lg:hidden",
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 bg-[#0a0a0f] px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3",
                isActive(link.href) ? "bg-zinc-900 text-white" : "text-zinc-300 hover:bg-zinc-900"
              )}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-zinc-300 hover:bg-zinc-900"
            >
              Accedi
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
