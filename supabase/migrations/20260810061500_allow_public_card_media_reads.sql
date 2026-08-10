-- Allow public pages to create signed URLs for images assigned to editable cards.
-- The site-media bucket is private, so select access must be explicitly tied
-- to a published card assignment just as hero media is tied to site_media.

drop policy if exists "Assigned Outside Inmates card media is readable" on storage.objects;
create policy "Assigned Outside Inmates card media is readable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'site-media'
    and exists (
      select 1 from public.site_card_content card
      where card.image_storage_path = name
    )
  );
