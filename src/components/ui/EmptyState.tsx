"use client";

import Link from "next/link";
import { Inbox, MessageSquare, Package, Sparkles } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  codeHint?: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "forum" | "store" | "generic";
};

const icons = {
  forum: MessageSquare,
  store: Package,
  generic: Inbox,
};

export function EmptyState({
  title,
  description,
  codeHint = "// ancora vuoto — sii il primo",
  actionLabel,
  actionHref,
  variant = "generic",
}: Props) {
  const Icon = icons[variant];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-700/80 bg-zinc-900/30 px-6 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-300">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        )}
        <pre className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 px-3 py-2 font-mono text-[11px] text-zinc-500">
          <Sparkles className="mr-1.5 inline h-3 w-3 text-violet-400" />
          {codeHint}
        </pre>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="btn-press mt-6 inline-flex items-center rounded-full bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
