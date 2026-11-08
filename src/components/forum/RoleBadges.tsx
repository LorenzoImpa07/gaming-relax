"use client";

import type { SiteRole } from "@/lib/roles";
import { DEFAULT_ROLE } from "@/lib/roles";

export function RoleBadges({ roles }: { roles: SiteRole[] }) {
  const list =
    roles.length > 0
      ? roles
      : [{ id: "default", name: DEFAULT_ROLE.name, color: DEFAULT_ROLE.color, emails: [] }];

  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {list.map((r) => {
        const isWhite =
          r.color?.toLowerCase() === "#ffffff" || r.color?.toLowerCase() === "#fff";
        return (
          <span
            key={r.id}
            className="inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{
              borderColor: r.color || "#fff",
              color: isWhite ? "#e4e4e7" : r.color,
              backgroundColor: isWhite ? "rgba(255,255,255,0.08)" : `${r.color}22`,
            }}
          >
            {r.name}
          </span>
        );
      })}
    </div>
  );
}
