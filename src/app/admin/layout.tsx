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
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-400 text-sm">
        Verifica accesso admin...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-violet-400 mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
            <ArrowLeft className="h-4 w-4" />
            Sito
          </Link>
          <button onClick={() => logout()} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900">
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                active ? "bg-violet-600 text-white" : "border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
