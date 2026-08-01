# Supabase setup for Outside Inmates

Outside Inmates requires its own Supabase project. Do not reuse an At The In Gate project, bucket, Auth user, table, or key.

## 1. Create the project

1. Create a new Supabase project for Outside Inmates in the Supabase dashboard.
2. Keep the project reference, API URL, anon key, and service-role key private.
3. From this repository, open the SQL Editor in that new project and run the complete migration in `supabase/migrations/20260801000000_create_site_media_system.sql`.

The migration creates `profiles`, `site_media`, `site_section_appearance`, the private `site-media` bucket, RLS policies, the initial member profile trigger, and the server-verifiable `admin` role. It also creates a profile for any Auth user that exists before the migration runs.

## 2. Configure Authentication URLs

In Supabase Dashboard → Authentication → URL Configuration:

1. Set **Site URL** to the current production Outside Inmates site URL.
2. Add your local development URL, for example `http://localhost:3000/**`, to **Redirect URLs**.
3. Add the production site URL with `/**` to **Redirect URLs**.

If your local Vinext server uses another port, add that exact origin instead. Email/password authentication is sufficient for this initial admin desk; no public registration flow is required.

## 3. Add environment variables

Copy `.env.example` to an untracked local `.env.local`, then add values from this new project only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are the browser-safe public values. `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SITE_URL` are matching server-runtime aliases for this host; use the same URL and anonymous key values, and the same site URL. `SUPABASE_SERVICE_ROLE_KEY` is required only by server mutation routes and must never be exposed in a client bundle, public configuration, git, screenshots, or documentation. `NEXT_PUBLIC_SITE_URL` is the production site origin; use `http://localhost:3000` only for local development.

Add all seven variable names and their values in the Outside Inmates deployment environment before publishing a build. Set both `NEXT_PUBLIC_SITE_URL` and `SITE_URL` to the production Outside Inmates URL. The current repository and hosting configuration intentionally contain no Supabase credentials.

## 4. Create the first admin

1. In Supabase Dashboard → Authentication → Users, create the administrator’s email/password user.
2. In SQL Editor, run:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'the-admin-email@example.com';
   ```

3. Sign in at `/sign-in` and open `/admin/site-media`.

All new Auth users are members by default. Only explicitly promoted `admin` profiles can read the desk, upload, reset, or save Media + Appearance settings.

## 5. Verify before relying on it

1. Sign in as the promoted admin and visit `/admin/site-media`.
2. Upload a small JPG, PNG, or WebP with alt text. Confirm it appears in `site-media` storage and in `site_media`.
3. Refresh the affected public route and verify the saved assignment appears.
4. Save a safe appearance change, refresh, then use **Reset Appearance** and confirm the media remains.
5. Use **Reset Media** and confirm the source fallback/text-first surface returns.
6. Sign in as a normal member and verify `/admin` redirects to `/sign-in`.

Until the project, migration, variables, and administrator promotion are completed, the application deliberately keeps persistent media disabled. The public site still falls back to its source-controlled or text-first presentation.
