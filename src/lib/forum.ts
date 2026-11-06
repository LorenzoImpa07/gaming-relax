export type ForumCategory = {
  id: string;
  name: string;
  order: number;
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
  createdAt?: unknown;
};
