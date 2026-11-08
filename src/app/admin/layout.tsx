"use client";

import { useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/ordini", label: "Ordini", icon: ShoppingBag },
  { href: "/admin/recensioni", label: "Recensioni", icon: Star },
  { href: "/admin/messaggi", label: "Messaggi", icon: MessageSquare },
  { href: "/admin/servizi", label: "Servizi", icon: Package },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/partner", label: "Partner", icon: Handshake },
  { href: "/admin/novita", label: "Novità", icon: Megaphone },
  { href: "/admin/sconti", label: "Sconti", icon: Percent },
  { href: "/admin/pagamenti", label: "Pagamenti", icon: CreditCard },
  { href: "/admin/forum", label: "Forum", icon: MessagesSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  if (loading || !user || !isAdminEmail(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-sm text-zinc-500">
        Caricamento dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="border-b border-zinc-800 bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">
              <ArrowLeft className="inline h-4 w-4" /> Sito
            </Link>
            <span className="font-semibold">Dashboard</span>
          </div>
          <button
            type="button"
            onClick={() => logout().then(() => router.push("/"))}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Esci
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
