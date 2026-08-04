import type { Metadata } from "next";
import Link from "next/link";
import { NewThreadForm } from "../components/community/CommunityForms";
import { SiteFooter, SiteHeader } from "../components/layout";
import { PageHero } from "../components/page-hero";
import { formatForumTime, getForumCategories, getRecentForumThreads } from "../lib/community";
import { getSupabasePublicConfig } from "../lib/supabase/config";

export const metadata: Metadata = {
  title: "Community | Outside Inmates",
  description: "Ask practical questions, share lived experience, and find steadier next steps through incarceration and reentry.",
};

type CommunityPageProps = { searchParams: Promise<{ category?: string }> };

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const [{ category: selectedCategory }, categories, allThreads] = await Promise.all([
    searchParams,
    getForumCategories(),
    getRecentForumThreads(60),
  ]);
  const activeCategory = categories.find((category) => category.slug === selectedCategory);
  const threads = activeCategory ? allThreads.filter((thread) => thread.categorySlug === activeCategory.slug) : allThreads;

  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader />
    <main id="main-content" className="community-page">
      <PageHero
        variant="page"
        mediaKey="community.hero"
        eyebrow="Community"
        title="You are not the only one asking."
        description="Ask practical questions, share what helped, and find people who understand the strange, exhausting corners of incarceration and reentry."
      >
        <Link className="button button-primary" href="#new-thread">Ask a question <span aria-hidden="true">↓</span></Link>
      </PageHero>

      <section className="section community-board-section" aria-labelledby="community-board-heading">
        <div className="container community-board-layout">
          <aside className="community-category-panel" aria-labelledby="community-categories-heading">
            <p className="eyebrow">Browse by topic</p>
            <h2 id="community-categories-heading">Start where the question belongs.</h2>
            <nav aria-label="Community categories">
              <Link href="/community#community-board" aria-current={!activeCategory ? "page" : undefined}><span>All discussions</span><small>See the newest conversations from every topic.</small></Link>
              {categories.map((category) => <Link href={`/community?category=${category.slug}#community-board`} aria-current={activeCategory?.id === category.id ? "page" : undefined} key={category.id}><span>{category.name}</span><small>{category.description}</small></Link>)}
            </nav>
          </aside>

          <div className="community-thread-list" id="community-board">
            <div className="community-thread-list-heading">
              <div><p className="eyebrow">{activeCategory ? activeCategory.name : "Recent discussions"}</p><h2 id="community-board-heading">{activeCategory ? activeCategory.description : "Questions, answers, and lived experience."}</h2></div>
              <span>{threads.length} {threads.length === 1 ? "discussion" : "discussions"}</span>
            </div>

            {threads.length ? threads.map((thread) => <article className="community-thread-card" key={thread.id}>
              <div className="community-thread-meta"><span>{thread.categoryName}</span>{thread.isPinned ? <b>Pinned</b> : null}{thread.isLocked ? <b>Locked</b> : null}</div>
              <h3><Link href={`/community/${thread.id}`}>{thread.title}</Link></h3>
              <p>{thread.body.length > 220 ? `${thread.body.slice(0, 217)}…` : thread.body}</p>
              <footer><span>Asked by {thread.authorDisplayName}</span><span>{thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}</span><span>{formatForumTime(thread.lastActivityAt)}</span></footer>
            </article>) : <div className="community-empty-state">
              <p className="eyebrow">The room is ready</p>
              <h3>{activeCategory ? `No one has started a ${activeCategory.name.toLowerCase()} discussion yet.` : "Be the first person to ask the question someone else is afraid to say out loud."}</h3>
              <p>The privacy reminders are in place and the board is ready for a real conversation.</p>
              <Link className="button button-primary" href="#new-thread">Start the first discussion</Link>
            </div>}
          </div>
        </div>
      </section>

      <section className="community-new-thread-section" id="new-thread" aria-labelledby="new-thread-heading">
        <div className="container community-new-thread-layout">
          <div><p className="eyebrow">Ask the community</p><h2 id="new-thread-heading">What do you need help figuring out?</h2><p>You do not need perfect wording. Give enough context for people to understand the question, but keep names, case details, addresses, account information, and private medical information off the public board.</p></div>
          <NewThreadForm config={getSupabasePublicConfig()} categories={categories} />
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
