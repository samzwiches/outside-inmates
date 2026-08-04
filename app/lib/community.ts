import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./supabase/config";

export type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
};

export type ForumThreadSummary = {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  title: string;
  body: string;
  authorDisplayName: string;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  lastActivityAt: string;
};

export type ForumReply = {
  id: string;
  body: string;
  authorDisplayName: string;
  createdAt: string;
  updatedAt: string;
};

export type ForumThreadDetail = ForumThreadSummary & {
  replies: ForumReply[];
};

function getPublicCommunityClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

export async function getForumCategories(): Promise<ForumCategory[]> {
  const client = getPublicCommunityClient();
  if (!client) return [];

  const { data, error } = await client
    .from("forum_categories")
    .select("id,slug,name,description,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data) return [];
  return data as ForumCategory[];
}

export async function getRecentForumThreads(limit = 20): Promise<ForumThreadSummary[]> {
  const client = getPublicCommunityClient();
  if (!client) return [];

  const [categories, threadResult] = await Promise.all([
    getForumCategories(),
    client
      .from("forum_threads")
      .select("id,category_id,title,body,author_display_name,reply_count,is_pinned,is_locked,created_at,last_activity_at")
      .eq("status", "published")
      .order("is_pinned", { ascending: false })
      .order("last_activity_at", { ascending: false })
      .limit(limit),
  ]);

  if (threadResult.error || !threadResult.data) return [];
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return threadResult.data.map((thread) => {
    const category = categoryMap.get(thread.category_id);
    return {
      id: thread.id,
      categoryId: thread.category_id,
      categoryName: category?.name ?? "Community",
      categorySlug: category?.slug ?? "community-room",
      title: thread.title,
      body: thread.body,
      authorDisplayName: thread.author_display_name,
      replyCount: thread.reply_count,
      isPinned: thread.is_pinned,
      isLocked: thread.is_locked,
      createdAt: thread.created_at,
      lastActivityAt: thread.last_activity_at,
    };
  });
}

export async function getForumThread(threadId: string): Promise<ForumThreadDetail | null> {
  const client = getPublicCommunityClient();
  if (!client) return null;

  const [categories, threadResult, repliesResult] = await Promise.all([
    getForumCategories(),
    client
      .from("forum_threads")
      .select("id,category_id,title,body,author_display_name,reply_count,is_pinned,is_locked,created_at,last_activity_at")
      .eq("id", threadId)
      .eq("status", "published")
      .maybeSingle(),
    client
      .from("forum_replies")
      .select("id,body,author_display_name,created_at,updated_at")
      .eq("thread_id", threadId)
      .eq("status", "published")
      .order("created_at", { ascending: true }),
  ]);

  if (threadResult.error || !threadResult.data || repliesResult.error) return null;
  const thread = threadResult.data;
  const category = categories.find((item) => item.id === thread.category_id);

  return {
    id: thread.id,
    categoryId: thread.category_id,
    categoryName: category?.name ?? "Community",
    categorySlug: category?.slug ?? "community-room",
    title: thread.title,
    body: thread.body,
    authorDisplayName: thread.author_display_name,
    replyCount: thread.reply_count,
    isPinned: thread.is_pinned,
    isLocked: thread.is_locked,
    createdAt: thread.created_at,
    lastActivityAt: thread.last_activity_at,
    replies: (repliesResult.data ?? []).map((reply) => ({
      id: reply.id,
      body: reply.body,
      authorDisplayName: reply.author_display_name,
      createdAt: reply.created_at,
      updatedAt: reply.updated_at,
    })),
  };
}

export function formatForumTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Recently";
  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const absolute = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absolute < 60) return "Just now";
  if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
  if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
  if (absolute < 604800) return formatter.format(Math.round(seconds / 86400), "day");
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(timestamp));
}
