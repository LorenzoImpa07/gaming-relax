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
  order: number;
  tags?: string[];
  threadCount?: number;
  messageCount?: number;
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
];
