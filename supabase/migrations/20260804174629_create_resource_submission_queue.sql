-- Outside Inmates resource submission review queue.
-- Public forms submit through a validated server route. Nothing is published automatically.

create table if not exists public.resource_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null default 'new',
  resource_name text not null,
  existing_resource_url text,
  category_slug text not null,
  description text not null,
  services text,
  eligibility text,
  service_area_type text,
  address text,
  city text,
  state text,
  zip_code text,
  counties_served text,
  phone text,
  email text,
  website text,
  hours text,
  cost text,
  application_process text,
  languages text,
  accessibility_notes text,
  source_url text,
  submitter_name text not null,
  submitter_email text not null,
  submitter_relationship text,
  additional_notes text,
  status text not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint resource_submissions_type_check
    check (submission_type in ('new', 'correction')),
  constraint resource_submissions_status_check
    check (status in ('pending', 'reviewing', 'approved', 'declined', 'duplicate')),
  constraint resource_submissions_service_area_type_check
    check (service_area_type is null or service_area_type in ('local', 'statewide', 'remote-national')),
  constraint resource_submissions_category_check
    check (category_slug in (
      'housing',
      'employment',
      'identification-documents',
      'legal-help',
      'family-support',
      'mental-health',
      'substance-use-recovery',
      'transportation',
      'education',
      'food-basic-needs',
      'reentry-planning',
      'communication-visitation'
    )),
  constraint resource_submissions_required_lengths_check
    check (
      char_length(trim(resource_name)) between 2 and 180
      and char_length(trim(description)) between 20 and 4000
      and char_length(trim(submitter_name)) between 2 and 120
      and char_length(trim(submitter_email)) between 5 and 320
    ),
  constraint resource_submissions_optional_lengths_check
    check (
      (existing_resource_url is null or char_length(existing_resource_url) <= 1000)
      and (services is null or char_length(services) <= 4000)
      and (eligibility is null or char_length(eligibility) <= 3000)
      and (address is null or char_length(address) <= 300)
      and (city is null or char_length(city) <= 120)
      and (state is null or char_length(state) <= 80)
      and (zip_code is null or char_length(zip_code) <= 20)
      and (counties_served is null or char_length(counties_served) <= 1000)
      and (phone is null or char_length(phone) <= 80)
      and (email is null or char_length(email) <= 320)
      and (website is null or char_length(website) <= 1000)
      and (hours is null or char_length(hours) <= 1000)
      and (cost is null or char_length(cost) <= 1000)
      and (application_process is null or char_length(application_process) <= 3000)
      and (languages is null or char_length(languages) <= 1000)
      and (accessibility_notes is null or char_length(accessibility_notes) <= 3000)
      and (source_url is null or char_length(source_url) <= 1000)
      and (submitter_relationship is null or char_length(submitter_relationship) <= 300)
      and (additional_notes is null or char_length(additional_notes) <= 4000)
    )
);

create index if not exists resource_submissions_status_created_idx
  on public.resource_submissions (status, created_at desc);

create index if not exists resource_submissions_name_idx
  on public.resource_submissions (lower(resource_name));

drop trigger if exists set_resource_submissions_updated_at on public.resource_submissions;
create trigger set_resource_submissions_updated_at
  before update on public.resource_submissions
  for each row execute procedure public.set_updated_at();

alter table public.resource_submissions enable row level security;
revoke all on table public.resource_submissions from anon, authenticated;
grant select, update on table public.resource_submissions to authenticated;
grant all on table public.resource_submissions to service_role;

drop policy if exists "Administrators can review resource submissions" on public.resource_submissions;
create policy "Administrators can review resource submissions"
  on public.resource_submissions for select to authenticated
  using (private.is_site_admin((select auth.uid())));

drop policy if exists "Administrators can update resource submissions" on public.resource_submissions;
create policy "Administrators can update resource submissions"
  on public.resource_submissions for update to authenticated
  using (private.is_site_admin((select auth.uid())))
  with check (private.is_site_admin((select auth.uid())));
