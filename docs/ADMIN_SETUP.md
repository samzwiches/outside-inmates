# Outside Inmates administrator setup

This is a role-gated editor. A hidden URL, local browser state, or a production 404 never grants access.

## Sign in and access

1. Complete [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) using an Outside Inmates-only Supabase project.
2. Create the administrator’s Auth user in Supabase Dashboard → Authentication → Users.
3. Promote that user in the SQL Editor:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'the-admin-email@example.com';
   ```

   Replace the example address with the real administrator address; do not put it in this repository.
4. Open `/sign-in`, sign in with that account, then go to `/admin` or `/admin/site-media`.

The server checks the Supabase session and that user’s `profiles.role` on every protected page. The mutation API independently repeats that check before it uses the service-role client. Non-admin accounts are redirected to the same sign-in page without any indication of whether a particular email has administrator access.

## Using Media + Appearance

1. Search by media key, page, or human-readable location and choose an approved slot.
2. Review the current source: uploaded image, source fallback, or no image.
3. Upload a primary image. Use an optional mobile crop when the desktop framing does not fit a narrow screen.
4. Add useful alt text before saving, then add caption, credit, source, and license information when relevant.
5. Set desktop and mobile focal percentages with the live desktop/mobile previews. These change framing, not image pixels.
6. Use overlay controls sparingly. A valid custom hex takes precedence over the selected tone.
7. Save media. The registered route revalidates automatically.
8. Use **Reset Media** to return only to the source fallback or text-first surface. It does not reset appearance.
9. Use **Reset Appearance** only when reverting the safe visual treatment. It does not remove media.

The desk warns before switching slots with unsaved changes and before either reset. It also gives a low-contrast warning for saved solid background/heading combinations. Image-backed text still needs a visual review in both previews.

## Boundaries

The desk cannot change text, navigation, pages, resource listings, card layouts, button backgrounds, arbitrary CSS, gradients, scripts, or deployment configuration. Those remain source-controlled by design.
