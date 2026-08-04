import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReplyForm } from "../../components/community/CommunityForms";
import { SiteFooter, SiteHeader } from "../../components/layout";
import { formatForumTime, getForumThread } from "../../lib/community";
import { getSupabasePublicConfig } from "../../lib/supabase/config";

type ThreadPageProps = { params: Promise<{ threadId: string }> };

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { threadId } = await params;
  const thread = await getForumThread(threadId);
  return thread ? { title: `${thread.title} | Outside Inmates Community`, description: thread.body.slice(0, 155) } : { title: "Discussion not found | Outside Inmates" };
}

export default async function CommunityThreadPage({ params }: ThreadPageProps) {
  const { threadId } = await params;
  const thread = await getForumThread(threadId);
  if (!thread) notFound();

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader />
    <main id="main-content" className="community-thread-page">
      <section className="community-thread-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/community">Community</Link><span aria-hidden="true">/</span><span>{thread.categoryName}</span></nav>
          <p className="eyebrow">{thread.categoryName}</p>
          <h1>{thread.title}</h1>
          <div className="community-thread-byline"><span>Asked by {thread.authorDisplayName}</span><span>{formatForumTime(thread.createdAt)}</span>{thread.isPinned ? <b>Pinned</b> : null}{thread.isLocked ? <b>Locked</b> : null}</div>
        </div>
      </section>

      <section className="section community-discussion-section">
        <div className="container community-discussion-layout">
          <article className="community-original-post">
            <p>{thread.body}</p>
          </article>

          <div className="community-replies" aria-labelledby="replies-heading">
            <div className="community-replies-heading"><div><p className="eyebrow">Conversation</p><h2 id="replies-heading">{thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}</h2></div><Link className="quiet-link" href="/community">Back to all discussions <span aria-hidden="true">→</span></Link></div>
            {thread.replies.length ? thread.replies.map((reply, index) => <article className="community-reply" key={reply.id}>
              <header><strong>{reply.authorDisplayName}</strong><span>Reply {index + 1}</span><time dateTime={reply.createdAt}>{formatForumTime(reply.createdAt)}</time></header>
              <p>{reply.body}</p>
            </article>) : <div className="community-no-replies"><p>No replies yet. A thoughtful first answer can change the whole temperature of a room.</p></div>}
          </div>

          <section className="community-reply-section" id="reply" aria-labelledby="reply-heading">
            <div><p className="eyebrow">Join the conversation</p><h2 id="reply-heading">Add what you know without pretending to know everything.</h2><p>Share lived experience, ask a follow-up question, or point toward a responsible resource. Avoid legal conclusions, diagnoses, threats, and personal identifying information.</p></div>
            <ReplyForm config={getSupabasePublicConfig()} threadId={thread.id} locked={thread.isLocked} />
          </section>
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
