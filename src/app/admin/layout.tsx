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
  FileText,
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
  Bot,
  ExternalLink,
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
      { href: "/admin/preventivi", label: "Preventivi", icon: FileText },
    ],
  },
  {
    title: "Catalogo",
    items: [
      { href: "/admin/servizi", label: "Servizi", icon: Package },
      { href: "/admin/custom", label: "Custom", icon: Package },
      { href: "/admin/sconti", label: "Sconti", icon: Percent },
      { href: "/admin/pagamenti", label: "Pagamenti", icon: CreditCard },
    ],
  },
  {
    title: "Contenuti",
    items: [
      { href: "/admin/banner", label: "Banner home", icon: Radio },
      { href: "/admin/supporto", label: "Assistente chat", icon: Bot },
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
      <div className="flex min-h-screen items-center justify-center bg-[#06060c]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-gradient-to-br from-violet-600/40 to-fuchsia-500/30" />
            <div className="absolute inset-0 animate-ping rounded-2xl bg-violet-500/20" />
          </div>
          <p className="text-sm text-zinc-500">Verifica accesso admin…</p>
        </div>
      </div>
    );
  }

  const pageTitle =
    navGroups.flatMap((g) => g.items).find((i) => isActive(pathname, i.href))?.label ||
    "Dashboard";

  const SidebarNav = (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
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
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40"
                      : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
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
  );

  return (
    <div className="min-h-screen bg-[#06060c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/12 blur-[120px]" />
        <div className="absolute -right-40 bottom-20 h-[380px] w-[380px] rounded-full bg-fuchsia-600/10 blur-[110px]" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0a0a12]/90 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-3 sm:h-16 sm:gap-4 sm:px-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10 lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/30 sm:h-10 sm:w-10">
              <Image src="/logo.png" alt="" width={40} height={40} className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-white">Gaming Relax</p>
              <p className="flex items-center gap-1 text-[10px] text-violet-300/80">
                <Database className="h-2.5 w-2.5" />
                Control panel
              </p>
            </div>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center gap-3 pl-2 lg:flex">
            <div className="h-6 w-px bg-white/10" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Database / CMS
              </p>
              <h1 className="truncate text-sm font-semibold text-white">{pageTitle}</h1>
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:hidden">
            <p className="truncate text-sm font-semibold text-white">{pageTitle}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 md:flex">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-tight text-emerald-300">
                  Admin autenticato
                </p>
                <p className="max-w-[160px] truncate text-[10px] text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 md:hidden">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span className="max-w-[100px] truncate text-[10px] text-emerald-200/90">
                {user.email?.split("@")[0]}
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-white/25 hover:bg-white/10 hover:text-white sm:px-3.5 sm:py-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sito</span>
            </Link>
            <button
              type="button"
              onClick={() => logout().then(() => router.push("/"))}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 sm:px-3.5 sm:py-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Chiudi"
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col border-r border-white/10 bg-[#0c0c14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500">
                  <Image src="/logo.png" alt="" width={32} height={32} className="object-cover" />
                </div>
                <span className="text-sm font-semibold">Menu</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {SidebarNav}
            <div className="border-t border-white/10 p-4">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <div className="min-w-0">
                  <p className="text-[11px] text-emerald-300">Admin autenticato</p>
                  <p className="truncate text-[10px] text-zinc-500">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-zinc-400"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Sito
                </Link>
                <button
                  type="button"
                  onClick={() => logout().then(() => router.push("/"))}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-zinc-400"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Esci
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="relative mx-auto flex min-h-screen max-w-[1600px] pt-14 sm:pt-16">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-white/5 bg-[#0a0a12]/60 backdrop-blur-xl sm:top-16 sm:h-[calc(100vh-4rem)] lg:block lg:w-64">
          <div className="flex h-full flex-col">{SidebarNav}</div>
        </aside>

        <div className="min-w-0 flex-1">
          <main className="relative px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
