"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ForumCategory } from "../../lib/community";
import { createSupabaseBrowserClient, type BrowserSupabaseConfig } from "../../lib/supabase/browser";

type FormState = { kind: "idle" | "saving" | "error" | "success"; message: string };

function safeSignInRedirect(next: string) {
  return `/sign-in?next=${encodeURIComponent(next)}`;
}

export function NewThreadForm({ config, categories }: { config: BrowserSupabaseConfig | null; categories: ForumCategory[] }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ kind: "idle", message: "" });

  async function submitThread(formData: FormData) {
    if (!config) {
      setState({ kind: "error", message: "Community posting is not connected in this environment." });
      return;
    }

    const categoryId = String(formData.get("categoryId") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!categoryId || title.length < 8 || body.length < 10) {
      setState({ kind: "error", message: "Choose a category and add a clear title and a little context." });
      return;
    }

    const client = createSupabaseBrowserClient(config);
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) {
      window.location.href = safeSignInRedirect("/community#new-thread");
      return;
    }

    setState({ kind: "saving", message: "Posting your question…" });
    const { data, error } = await client
      .from("forum_threads")
      .insert({ category_id: categoryId, author_id: userData.user.id, title, body, status: "published" })
      .select("id")
      .single();

    if (error || !data) {
      setState({ kind: "error", message: "We could not post that question. Please try again." });
      return;
    }

    setState({ kind: "success", message: "Your question is live." });
    router.push(`/community/${data.id}`);
    router.refresh();
  }

  return <form className="community-composer" action={submitThread}>
    <label>Choose a topic<select name="categoryId" required defaultValue=""><option value="" disabled>Select a category</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
    <label>Question or discussion title<input name="title" type="text" minLength={8} maxLength={180} required placeholder="What do you need help figuring out?" /></label>
    <label>What is happening?<textarea name="body" minLength={10} maxLength={12000} rows={7} required placeholder="Share only what is useful. Leave out names, case numbers, medical details, addresses, and anything else you do not want public." /></label>
    <p className="community-privacy-note">Posts are public. Do not include identifying legal, medical, location, or account information.</p>
    {state.kind !== "idle" ? <p className={`community-form-status ${state.kind === "error" ? "is-error" : ""}`} role="status">{state.message}</p> : null}
    <button className="button button-primary" type="submit" disabled={state.kind === "saving"}>{state.kind === "saving" ? "Posting…" : "Post question"}</button>
  </form>;
}

export function ReplyForm({ config, threadId, locked }: { config: BrowserSupabaseConfig | null; threadId: string; locked: boolean }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ kind: "idle", message: "" });

  if (locked) return <div className="community-locked-note"><p className="eyebrow">Discussion locked</p><p>This thread is still readable, but it is no longer accepting replies.</p></div>;

  async function submitReply(formData: FormData) {
    if (!config) {
      setState({ kind: "error", message: "Community posting is not connected in this environment." });
      return;
    }

    const body = String(formData.get("body") ?? "").trim();
    if (body.length < 2) {
      setState({ kind: "error", message: "Add a reply before posting." });
      return;
    }

    const client = createSupabaseBrowserClient(config);
    const { data: userData } = await client.auth.getUser();
    if (!userData.user) {
      window.location.href = safeSignInRedirect(`/community/${threadId}#reply`);
      return;
    }

    setState({ kind: "saving", message: "Posting your reply…" });
    const { error } = await client.from("forum_replies").insert({ thread_id: threadId, author_id: userData.user.id, body, status: "published" });

    if (error) {
      setState({ kind: "error", message: "We could not post that reply. Please try again." });
      return;
    }

    setState({ kind: "success", message: "Reply posted." });
    const form = document.querySelector<HTMLFormElement>(`form[data-thread-reply="${threadId}"]`);
    form?.reset();
    router.refresh();
  }

  return <form className="community-composer community-reply-form" action={submitReply} data-thread-reply={threadId}>
    <label>Add a reply<textarea name="body" minLength={2} maxLength={8000} rows={6} required placeholder="Share what helped, ask a follow-up question, or point toward a responsible resource." /></label>
    <p className="community-privacy-note">Keep private information private. This is peer conversation, not legal or medical advice.</p>
    {state.kind !== "idle" ? <p className={`community-form-status ${state.kind === "error" ? "is-error" : ""}`} role="status">{state.message}</p> : null}
    <button className="button button-primary" type="submit" disabled={state.kind === "saving"}>{state.kind === "saving" ? "Posting…" : "Post reply"}</button>
  </form>;
}
