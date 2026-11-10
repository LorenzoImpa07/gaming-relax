export type ForumCategory = {
  id: string;
  name: string;
  order: number;
  color?: string;
};

export type ForumChannel = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: string;
  type: "discussion" | "link";
  externalUrl?: string;
  staffOnly: boolean;
  /** Discussioni leggibili solo da autore + ruoli con readPrivateThreads */
  privateReply?: boolean;
  order: number;
  tags?: string[];
  threadCount?: number;
  messageCount?: number;
};

/** Tag stato discussione (Chiuso, Risolto, Guida…) gestiti da Dashboard */
export type ForumThreadTag = {
  id: string;
  name: string;
  color: string;
  order?: number;
};

export type ForumThread = {
  id: string;
  channelId: string;
  title: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt?: unknown;
  replyCount: number;
  lastActivity?: unknown;
  /** ID tag stato da forum_thread_tags */
  statusTagId?: string | null;
  /** Snapshot nome/colore per display veloce */
  statusTagName?: string | null;
  statusTagColor?: string | null;
  locked?: boolean;
  /** true se canale privateReply (copia per query/filtri) */
  privateReply?: boolean;
};

export type ForumPost = {
  id: string;
  threadId: string;
  channelId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  createdAt?: unknown;
};

export const CATEGORY_COLOR_PRESETS = [
  { label: "Verde", value: "#34d399" },
  { label: "Viola", value: "#a78bfa" },
  { label: "Rosa", value: "#f472b6" },
  { label: "Blu", value: "#60a5fa" },
  { label: "Ciano", value: "#22d3ee" },
  { label: "Ambra", value: "#fbbf24" },
  { label: "Rosso", value: "#f87171" },
  { label: "Arancio", value: "#fb923c" },
  { label: "Giallo", value: "#facc15" },
  { label: "Grigio", value: "#a1a1aa" },
];

/** Default tag se la collection è vuota (solo UI seed in admin) */
export const DEFAULT_THREAD_TAG_SUGGESTIONS = [
  { name: "Guida", color: "#facc15" },
  { name: "Chiuso", color: "#a1a1aa" },
  { name: "Risolto", color: "#22c55e" },
  { name: "In attesa", color: "#60a5fa" },
  { name: "Regolamento", color: "#a78bfa" },
  { name: "Respinto", color: "#ef4444" },
];
