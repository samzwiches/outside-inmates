-- Outside Inmates: profiles, role-gated Media + Appearance desk, and private media storage.
-- This migration is intentionally independent from any other project.

create extension if not exists pgcrypto;
create schema if not exists private;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_profile();

insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update set email = excluded.email;

create or replace function private.is_site_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, private
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
revoke all on table public.profiles from anon;
grant select on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(),
  media_key text not null unique,
  storage_path text not null unique,
  mobile_storage_path text unique,
  alt_text text not null default '',
  caption text,
  credit_name text,
  credit_url text,
  source_name text,
  source_url text,
  license_label text,
  focal_x numeric not null default 50,
  focal_y numeric not null default 50,
  mobile_focal_x numeric not null default 50,
  mobile_focal_y numeric not null default 50,
  overlay_tone text not null default 'none',
  overlay_color text,
  overlay_opacity numeric not null default 0,
  show_on_mobile boolean not null default true,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint site_media_key_format_check check (media_key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  constraint site_media_storage_path_check check (
    char_length(storage_path) between 1 and 500
    and storage_path !~ '(^|/)\\.\\.?(/|$)'
  ),
  constraint site_media_mobile_storage_path_check check (
    mobile_storage_path is null or (
      char_length(mobile_storage_path) between 1 and 500
      and mobile_storage_path !~ '(^|/)\\.\\.?(/|$)'
    )
  ),
  constraint site_media_text_lengths_check check (
    char_length(alt_text) <= 500
    and (caption is null or char_length(caption) <= 500)
    and (credit_name is null or char_length(credit_name) <= 200)
    and (credit_url is null or char_length(credit_url) <= 1000)
    and (source_name is null or char_length(source_name) <= 200)
    and (source_url is null or char_length(source_url) <= 1000)
    and (license_label is null or char_length(license_label) <= 200)
  ),
  constraint site_media_focal_x_check check (focal_x between 0 and 100),
  constraint site_media_focal_y_check check (focal_y between 0 and 100),
  constraint site_media_mobile_focal_x_check check (mobile_focal_x between 0 and 100),
  constraint site_media_mobile_focal_y_check check (mobile_focal_y between 0 and 100),
  constraint site_media_overlay_tone_check check (overlay_tone in ('none', 'light', 'dark', 'cream', 'brand')),
  constraint site_media_overlay_color_hex_check check (overlay_color is null or overlay_color ~ '^#[0-9a-f]{6}$'),
  constraint site_media_overlay_opacity_check check (overlay_opacity between 0 and 0.72)
);

create index if not exists site_media_updated_by_updated_idx
  on public.site_media (updated_by, updated_at desc);

drop trigger if exists set_site_media_updated_at on public.site_media;
create trigger set_site_media_updated_at
  before update on public.site_media
  for each row execute procedure public.set_updated_at();

alter table public.site_media enable row level security;
revoke all on table public.site_media from anon, authenticated;
grant select on table public.site_media to anon, authenticated;
grant all on table public.site_media to service_role;

drop policy if exists "Public site media is readable" on public.site_media;
create policy "Public site media is readable"
  on public.site_media for select to anon, authenticated using (true);

drop policy if exists "Administrators can manage site media" on public.site_media;

create table if not exists public.site_section_appearance (
  section_key text primary key,
  background_color text,
  surface_color text,
  border_color text,
  default_text_color text,
  eyebrow_color text,
  heading_color text,
  body_color text,
  button_text_color text,
  metadata_color text,
  font_family text,
  hero_edge_style text,
  hero_edge_size integer,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint site_section_appearance_key_format_check check (section_key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  constraint site_section_appearance_font_family_check check (font_family is null or font_family in ('inherit', 'serif', 'sans')),
  constraint site_section_appearance_edge_style_check check (hero_edge_style is null or hero_edge_style in ('inherit', 'soft-fade', 'rounded', 'rounded-fade', 'none')),
  constraint site_section_appearance_edge_size_check check (hero_edge_size is null or hero_edge_size between 0 and 96),
  constraint site_section_appearance_colors_check check (
    (background_color is null or background_color ~ '^#[0-9a-f]{6}$')
    and (surface_color is null or surface_color ~ '^#[0-9a-f]{6}$')
    and (border_color is null or border_color ~ '^#[0-9a-f]{6}$')
    and (default_text_color is null or default_text_color ~ '^#[0-9a-f]{6}$')
    and (eyebrow_color is null or eyebrow_color ~ '^#[0-9a-f]{6}$')
    and (heading_color is null or heading_color ~ '^#[0-9a-f]{6}$')
    and (body_color is null or body_color ~ '^#[0-9a-f]{6}$')
    and (button_text_color is null or button_text_color ~ '^#[0-9a-f]{6}$')
    and (metadata_color is null or metadata_color ~ '^#[0-9a-f]{6}$')
  )
);

create index if not exists site_section_appearance_updated_by_updated_idx
  on public.site_section_appearance (updated_by, updated_at desc);

drop trigger if exists set_site_section_appearance_updated_at on public.site_section_appearance;
create trigger set_site_section_appearance_updated_at
  before update on public.site_section_appearance
  for each row execute procedure public.set_updated_at();

alter table public.site_section_appearance enable row level security;
revoke all on table public.site_section_appearance from anon, authenticated;
grant select on table public.site_section_appearance to anon, authenticated;
grant all on table public.site_section_appearance to service_role;

drop policy if exists "Public section appearance is readable" on public.site_section_appearance;
create policy "Public section appearance is readable"
  on public.site_section_appearance for select to anon, authenticated using (true);

drop policy if exists "Administrators can manage section appearance" on public.site_section_appearance;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  false,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Assigned Outside Inmates media is readable" on storage.objects;
create policy "Assigned Outside Inmates media is readable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'site-media'
    and exists (
      select 1 from public.site_media media
      where media.storage_path = name or media.mobile_storage_path = name
    )
  );

drop policy if exists "Outside Inmates administrators can manage media objects" on storage.objects;
