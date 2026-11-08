export type SiteRole = {
  id: string;
  name: string;
  color: string;
  emails: string[];
  order?: number;
};

export const DEFAULT_ROLE: Omit<SiteRole, "id" | "emails"> = {
  name: "Utente",
  color: "#ffffff",
};

export function normalizeEmail(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

export function rolesForEmail(
  allRoles: SiteRole[],
  email: string | null | undefined
): SiteRole[] {
  const e = normalizeEmail(email);
  if (!e) return [];
  return allRoles
    .filter((r) => (r.emails || []).some((x) => normalizeEmail(x) === e))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function hasStaffRole(
  allRoles: SiteRole[],
  email: string | null | undefined
): boolean {
  return rolesForEmail(allRoles, email).length > 0;
}

export const ROLE_COLOR_PRESETS = [
  { label: "Bianco", value: "#ffffff" },
  { label: "Viola", value: "#a78bfa" },
  { label: "Fucsia", value: "#e879f9" },
  { label: "Blu", value: "#60a5fa" },
  { label: "Ciano", value: "#22d3ee" },
  { label: "Verde", value: "#34d399" },
  { label: "Ambra", value: "#fbbf24" },
  { label: "Rosso", value: "#f87171" },
  { label: "Arancio", value: "#fb923c" },
  { label: "Grigio", value: "#a1a1aa" },
];
