-- Outside Inmates community message board.
-- Adds categories, threads, replies, reports, moderation controls, and RLS.

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists display_name text;

alter table public.profiles
  drop constraint if exists profiles_display_name_length_check;

alter table public.profiles
  add constraint profiles_display_name_length_check
  check (display_name is null or char_length(trim(display_name)) between 2 and 60);

create table if not exists public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint forum_categories_slug_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint forum_categories_name_length_check
    check (char_length(name) between 2 and 80),
  constraint forum_categories_description_length_check
    check (char_length(description) <= 300)
);

create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete restrict,
  author_display_name text not null default 'Community member',
  title text not null,
  body text not null,
  status text not null default 'published',
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  reply_count integer not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint forum_threads_title_length_check
    check (char_length(trim(title)) between 8 and 180),
  constraint forum_threads_body_length_check
    check (char_length(trim(body)) between 10 and 12000),
  constraint forum_threads_author_name_length_check
    check (char_length(author_display_name) between 2 and 60),
  constraint forum_threads_status_check
    check (status in ('published', 'pending', 'hidden', 'removed')),
  constraint forum_threads_reply_count_check
    check (reply_count >= 0)
);

create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  author_display_name text not null default 'Community member',
  body text not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint forum_replies_body_length_check
    check (char_length(trim(body)) between 2 and 8000),
  constraint forum_replies_author_name_length_check
    check (char_length(author_display_name) between 2 and 60),
  constraint forum_replies_status_check
    check (status in ('published', 'pending', 'hidden', 'removed'))
);

create table if not exists public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  thread_id uuid references public.forum_threads(id) on delete cascade,
  reply_id uuid references public.forum_replies(id) on delete cascade,
  reason text not null,
  details text,
  status text not null default 'open',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),

  constraint forum_reports_target_check
    check ((thread_id is not null)::integer + (reply_id is not null)::integer = 1),
  constraint forum_reports_reason_check
    check (reason in ('harassment', 'threat', 'hate', 'personal-information', 'misinformation', 'spam', 'other')),
  constraint forum_reports_details_length_check
    check (details is null or char_length(details) <= 2000),
  constraint forum_reports_status_check
    check (status in ('open', 'reviewing', 'resolved', 'dismissed'))
);

create index if not exists forum_categories_active_sort_idx
  on public.forum_categories (is_active, sort_order, name);

create index if not exists forum_threads_category_activity_idx
  on public.forum_threads (category_id, status, is_pinned desc, last_activity_at desc);

create index if not exists forum_threads_author_idx
  on public.forum_threads (author_id, created_at desc);

create index if not exists forum_replies_thread_created_idx
  on public.forum_replies (thread_id, status, created_at);

create index if not exists forum_replies_author_idx
  on public.forum_replies (author_id, created_at desc);

create index if not exists forum_reports_status_created_idx
  on public.forum_reports (status, created_at desc);

create or replace function public.forum_display_name(user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(nullif(trim(display_name), ''), 'Community member')
  from public.profiles
  where id = user_id;
$$;

create or replace function public.set_forum_author_name()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.author_display_name := coalesce(public.forum_display_name(new.author_id), 'Community member');
  return new;
end;
$$;

create or replace function public.refresh_forum_thread_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_thread_id uuid;
begin
  target_thread_id := coalesce(new.thread_id, old.thread_id);

  update public.forum_threads thread
  set
    reply_count = (
      select count(*)::integer
      from public.forum_replies reply
      where reply.thread_id = target_thread_id
        and reply.status = 'published'
    ),
    last_activity_at = greatest(
      thread.created_at,
      coalesce((
        select max(reply.created_at)
        from public.forum_replies reply
        where reply.thread_id = target_thread_id
          and reply.status = 'published'
      ), thread.created_at)
    )
  where thread.id = target_thread_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists set_forum_categories_updated_at on public.forum_categories;
create trigger set_forum_categories_updated_at
  before update on public.forum_categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_forum_threads_updated_at on public.forum_threads;
create trigger set_forum_threads_updated_at
  before update on public.forum_threads
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_forum_replies_updated_at on public.forum_replies;
create trigger set_forum_replies_updated_at
  before update on public.forum_replies
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_forum_thread_author_name on public.forum_threads;
create trigger set_forum_thread_author_name
  before insert or update of author_id on public.forum_threads
  for each row execute procedure public.set_forum_author_name();

drop trigger if exists set_forum_reply_author_name on public.forum_replies;
create trigger set_forum_reply_author_name
  before insert or update of author_id on public.forum_replies
  for each row execute procedure public.set_forum_author_name();

drop trigger if exists refresh_thread_after_reply_change on public.forum_replies;
create trigger refresh_thread_after_reply_change
  after insert or update of status, thread_id or delete on public.forum_replies
  for each row execute procedure public.refresh_forum_thread_activity();

insert into public.forum_categories (slug, name, description, sort_order)
values
  ('family-navigation', 'Family navigation', 'Questions about locating someone, communication, visitation, and managing family life outside.', 10),
  ('reentry-basics', 'Reentry basics', 'Documents, release preparation, transportation, benefits, treatment, and first steps home.', 20),
  ('family-support', 'Family support', 'Parenting, children, relationships, emotional support, and caring for yourself while helping someone else.', 30),
  ('housing', 'Housing', 'Housing searches, eligibility questions, sober living, transitional housing, and practical next steps.', 40),
  ('employment-education', 'Employment and education', 'Work, training, resumes, education, credentials, and fair-chance opportunities.', 50),
  ('recovery-wellness', 'Recovery and wellness', 'Recovery support, mental health, health care, peer support, and steadier routines.', 60),
  ('legal-system', 'Legal and system questions', 'General navigation questions and referrals. This community does not provide legal representation.', 70),
  ('community-room', 'Community room', 'Introductions, encouragement, lived experience, and conversations that do not fit another category.', 80)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

alter table public.forum_categories enable row level security;
alter table public.forum_threads enable row level security;
alter table public.forum_replies enable row level security;
alter table public.forum_reports enable row level security;

revoke all on table public.forum_categories from anon, authenticated;
revoke all on table public.forum_threads from anon, authenticated;
revoke all on table public.forum_replies from anon, authenticated;
revoke all on table public.forum_reports from anon, authenticated;

grant select on table public.forum_categories to anon, authenticated;
grant select on table public.forum_threads to anon, authenticated;
grant select on table public.forum_replies to anon, authenticated;
grant insert, update, delete on table public.forum_threads to authenticated;
grant insert, update, delete on table public.forum_replies to authenticated;
grant insert, select on table public.forum_reports to authenticated;
grant all on table public.forum_categories, public.forum_threads, public.forum_replies, public.forum_reports to service_role;

drop policy if exists "Active forum categories are public" on public.forum_categories;
create policy "Active forum categories are public"
  on public.forum_categories for select to anon, authenticated
  using (is_active or private.is_site_admin((select auth.uid())));

drop policy if exists "Published forum threads are public" on public.forum_threads;
create policy "Published forum threads are public"
  on public.forum_threads for select to anon, authenticated
  using (
    status = 'published'
    or author_id = (select auth.uid())
    or private.is_site_admin((select auth.uid()))
  );

drop policy if exists "Members can create forum threads" on public.forum_threads;
create policy "Members can create forum threads"
  on public.forum_threads for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and author_id = (select auth.uid())
    and status in ('published', 'pending')
    and is_pinned = false
    and is_locked = false
  );

drop policy if exists "Authors can update their forum threads" on public.forum_threads;
create policy "Authors can update their forum threads"
  on public.forum_threads for update to authenticated
  using (author_id = (select auth.uid()) or private.is_site_admin((select auth.uid())))
  with check (
    private.is_site_admin((select auth.uid()))
    or (
      author_id = (select auth.uid())
      and status in ('published', 'pending', 'removed')
      and is_pinned = false
      and is_locked = false
    )
  );

drop policy if exists "Authors can delete their forum threads" on public.forum_threads;
create policy "Authors can delete their forum threads"
  on public.forum_threads for delete to authenticated
  using (author_id = (select auth.uid()) or private.is_site_admin((select auth.uid())));

drop policy if exists "Published forum replies are public" on public.forum_replies;
create policy "Published forum replies are public"
  on public.forum_replies for select to anon, authenticated
  using (
    status = 'published'
    or author_id = (select auth.uid())
    or private.is_site_admin((select auth.uid()))
  );

drop policy if exists "Members can create forum replies" on public.forum_replies;
create policy "Members can create forum replies"
  on public.forum_replies for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and author_id = (select auth.uid())
    and status in ('published', 'pending')
    and exists (
      select 1
      from public.forum_threads thread
      where thread.id = thread_id
        and thread.status = 'published'
        and thread.is_locked = false
    )
  );

drop policy if exists "Authors can update their forum replies" on public.forum_replies;
create policy "Authors can update their forum replies"
  on public.forum_replies for update to authenticated
  using (author_id = (select auth.uid()) or private.is_site_admin((select auth.uid())))
  with check (
    private.is_site_admin((select auth.uid()))
    or (
      author_id = (select auth.uid())
      and status in ('published', 'pending', 'removed')
    )
  );

drop policy if exists "Authors can delete their forum replies" on public.forum_replies;
create policy "Authors can delete their forum replies"
  on public.forum_replies for delete to authenticated
  using (author_id = (select auth.uid()) or private.is_site_admin((select auth.uid())));

drop policy if exists "Members can submit forum reports" on public.forum_reports;
create policy "Members can submit forum reports"
  on public.forum_reports for insert to authenticated
  with check (
    reporter_id = (select auth.uid())
    and status = 'open'
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists "Members can read their own forum reports" on public.forum_reports;
create policy "Members can read their own forum reports"
  on public.forum_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or private.is_site_admin((select auth.uid())));
