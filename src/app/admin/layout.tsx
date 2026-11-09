"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  MessageSquare,
  Package,
  Users,
  Handshake,
  Megaphone,
  Percent,
  MessagesSquare,
  CreditCard,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Shield,
  Database,
  BadgeCheck,
  Radio,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "Generale",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/ordini", label: "Ordini", icon: ShoppingBag },
      { href: "/admin/recensioni", label: "Recensioni", icon: Star },
      { href: "/admin/messaggi", label: "Messaggi", icon: MessageSquare },
    ],
  },
  {
    title: "Catalogo",
    items: [
      { href: "/admin/servizi", label: "Servizi", icon: Package },
      { href: "/admin/sconti", label: "Sconti", icon: Percent },
      { href: "/admin/pagamenti", label: "Pagamenti", icon: CreditCard },
    ],
  },
  {
    title: "Contenuti",
    items: [
      { href: "/admin/banner", label: "Banner home", icon: Radio },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/partner", label: "Partner", icon: Handshake },
      { href: "/admin/novita", label: "Novità", icon: Megaphone },
      { href: "/admin/forum", label: "Forum", icon: MessagesSquare },
      { href: "/admin/ruoli", label: "Ruoli", icon: BadgeCheck },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/admin");
      return;
    }
    if (!isAdminEmail(user.email)) {
      router.replace("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070c]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-2xl bg-violet-500/20" />
          <p className="text-sm text-zinc-500">Verifica accesso admin...</p>
        </div>
      </div>
    );
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/5 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/30">
            <Image src="/logo.png" alt="" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Gaming Relax</p>
            <p className="flex items-center gap-1 text-[11px] text-violet-300/80">
              <Database className="h-3 w-3" />
              Control panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-gradient-to-r from-violet-600/90 to-fuchsia-600/70 text-white shadow-md shadow-violet-900/40"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-white" : "text-zinc-500 group-hover:text-violet-300"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium text-emerald-300/90">Admin autenticato</span>
          </div>
          <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Sito
          </Link>
          <button
            type="button"
            onClick={() => logout().then(() => router.push("/"))}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-zinc-400 transition hover:border-red-500/30 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Esci
          </button>
        </div>
      </div>
    </div>
  );

  const pageTitle =
    navGroups.flatMap((g) => g.items).find((i) => isActive(pathname, i.href))?.label ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#07070c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
      </div>

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-[#0a0a12]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold">{pageTitle}</span>
        </div>
        <Link href="/" className="text-xs text-zinc-500">
          Vai al sito
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Chiudi"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col border-r border-white/10 bg-[#0c0c14] shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-zinc-500 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="relative mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/5 bg-[#0a0a12]/80 backdrop-blur-xl lg:block">
          {Sidebar}
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 hidden border-b border-white/5 bg-[#07070c]/80 px-8 py-4 backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                  Database / CMS
                </p>
                <h1 className="text-xl font-semibold tracking-tight text-white">{pageTitle}</h1>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs text-zinc-400">Sistema online</span>
              </div>
            </div>
          </header>

          <main className="relative px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
