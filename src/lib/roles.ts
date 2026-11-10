export type ForumPermissions = {
  /** Eliminare messaggi di altri */
  deleteMessage: boolean;
  /** Modificare messaggi di altri */
  editMessage: boolean;
  /** Eliminare discussioni */
  deleteThread: boolean;
  /** Modificare titolo discussioni */
  editThread: boolean;
  /** Eliminare canali (dal sito, non solo dashboard) */
  deleteChannel: boolean;
  /** Modificare canali */
  editChannel: boolean;
  /** Creare canali */
  createChannel: boolean;
  /** Scrivere in canali solo-staff */
  writeStaffChannels: boolean;
  /** Accedere alla gestione forum in dashboard */
  manageForum: boolean;
  /** Leggere discussioni a risposta privata (aperte dagli utenti) */
  readPrivateThreads: boolean;
};

export const DEFAULT_PERMISSIONS: ForumPermissions = {
  deleteMessage: false,
  editMessage: false,
  deleteThread: false,
  editThread: false,
  deleteChannel: false,
  editChannel: false,
  createChannel: false,
  writeStaffChannels: false,
  manageForum: false,
  readPrivateThreads: false,
};

export const PERMISSION_LABELS: { key: keyof ForumPermissions; label: string; hint: string }[] = [
  {
    key: "deleteMessage",
    label: "Eliminare messaggi",
    hint: "Può cancellare messaggi di altri utenti nel forum",
  },
  {
    key: "editMessage",
    label: "Modificare messaggi",
    hint: "Può modificare messaggi di altri utenti",
  },
  {
    key: "deleteThread",
    label: "Eliminare discussioni",
    hint: "Può eliminare intere discussioni",
  },
  {
    key: "editThread",
    label: "Modificare discussioni",
    hint: "Può cambiare il titolo di una discussione",
  },
  {
    key: "deleteChannel",
    label: "Eliminare canali",
    hint: "Può eliminare canali del forum",
  },
  {
    key: "editChannel",
    label: "Modificare canali",
    hint: "Può modificare nome/descrizione/tag dei canali",
  },
  {
    key: "createChannel",
    label: "Creare canali",
    hint: "Può creare nuovi canali",
  },
  {
    key: "writeStaffChannels",
    label: "Scrivere in canali solo-staff",
    hint: "Può postare nei canali riservati allo staff",
  },
  {
    key: "manageForum",
    label: "Gestire forum (Dashboard)",
    hint: "Accesso alle impostazioni forum dalla Dashboard",
  },
  {
    key: "readPrivateThreads",
    label: "Risposte private",
    hint: "Può leggere le discussioni a risposta privata aperte dagli utenti (solo autore + chi ha questo permesso)",
  },
];

export type SiteRole = {
  id: string;
  name: string;
  color: string;
  emails: string[];
  order?: number;
  permissions?: ForumPermissions;
};

export const DEFAULT_ROLE: Omit<SiteRole, "id" | "emails"> = {
  name: "Utente",
  color: "#ffffff",
  permissions: { ...DEFAULT_PERMISSIONS },
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

/** True se almeno un ruolo dell'utente ha il permesso, oppure è admin globale */
export function can(
  allRoles: SiteRole[],
  email: string | null | undefined,
  permission: keyof ForumPermissions,
  isGlobalAdmin = false
): boolean {
  if (isGlobalAdmin) return true;
  const mine = rolesForEmail(allRoles, email);
  return mine.some((r) => !!(r.permissions && r.permissions[permission]));
}

export function mergePermissions(roles: SiteRole[]): ForumPermissions {
  const out = { ...DEFAULT_PERMISSIONS };
  for (const r of roles) {
    if (!r.permissions) continue;
    (Object.keys(out) as (keyof ForumPermissions)[]).forEach((k) => {
      if (r.permissions![k]) out[k] = true;
    });
  }
  return out;
}

export function parsePermissions(raw: unknown): ForumPermissions {
  const base = { ...DEFAULT_PERMISSIONS };
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  (Object.keys(base) as (keyof ForumPermissions)[]).forEach((k) => {
    if (typeof o[k] === "boolean") base[k] = o[k] as boolean;
  });
  return base;
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
