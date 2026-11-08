"use client";

import Link from "next/link";
import { RoleBadges } from "./RoleBadges";
import type { SiteRole } from "@/lib/roles";
import { rolesForEmail } from "@/lib/roles";

type Props = {
  authorId?: string;
  authorName: string;
  authorEmail?: string | null;
  allRoles: SiteRole[];
  avatar?: string | null;
  compact?: boolean;
};

export function AuthorChip({
  authorId,
  authorName,
  authorEmail,
  allRoles,
  avatar,
  compact,
}: Props) {
  const roles = rolesForEmail(allRoles, authorEmail);
  const href = authorId
    ? `/utente/${authorId}`
    : authorEmail
      ? `/utente/${encodeURIComponent(authorEmail)}`
      : null;

  const inner = (
    <div className={`flex gap-3 ${compact ? "items-center" : "items-start"}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-sm font-bold text-violet-300">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          (authorName || "?").slice(0, 1).toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <p
          className={`truncate font-semibold ${
            href ? "text-sky-400 hover:underline" : "text-white"
          }`}
        >
          {authorName}
        </p>
        {!compact && <RoleBadges roles={roles} />}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
