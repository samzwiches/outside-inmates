create table if not exists public.site_card_content (
  card_key text primary key,
  title text,
  description text,
  eyebrow text,
  action_label text,
  href text,
  secondary_action_label text,
  secondary_href text,
  tone text,
  image_storage_path text,
  image_alt text,
  focal_x numeric not null default 50,
  focal_y numeric not null default 50,
  updated_at timestamptz not null default now()
);

alter table public.site_card_content enable row level security;

drop policy if exists "Public can read site card content" on public.site_card_content;
create policy "Public can read site card content"
on public.site_card_content
for select
using (true);

create index if not exists site_card_content_updated_at_idx
  on public.site_card_content(updated_at desc);
