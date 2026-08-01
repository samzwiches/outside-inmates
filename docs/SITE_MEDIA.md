# Site media and appearance

`/admin/site-media` is Outside Inmates’ authenticated Media + Appearance desk. It is deliberately a fixed-layout editor, not a page builder: administrators can replace approved images and make carefully limited presentation adjustments without touching copy, navigation, CSS, layouts, or a deployment.

A media save is stored in this project’s Supabase database and triggers revalidation of the affected route, `/admin`, `/admin/site-media`, and the root layout. Refresh an already-open public tab to see its newly resolved assignment.

## Resolution order

Every media location resolves in this order:

1. A saved `site_media` assignment, including its signed Storage URL.
2. Its source-controlled fallback path in `public/media`, if the registry has one.
3. The existing text-only treatment.

The approved provider fallback filenames and attribution remain source-controlled. The desk never deletes them. The current approved fallback downloads are still manual where noted in [MEDIA_ATTRIBUTION.md](./MEDIA_ATTRIBUTION.md); placing a file at its documented path makes it available automatically as a fallback.

If an assigned Storage object cannot be read, public rendering attempts the fallback and otherwise preserves a calm, non-broken text-first surface.

## Approved media locations

The registry in `app/data/media.ts` is the one central allowlist used by public rendering, the editor, API validation, and revalidation. Do not add a key in an API route or database constraint by hand.

| Media key | Page | Placement | Route refreshed |
| --- | --- | --- | --- |
| `home.hero` | Home | Homepage hero | `/` |
| `home.journeys` | Home | Guided pathways | `/` |
| `home.resources` | Home | Resource Finder | `/` |
| `home.families` | Home | Family support feature | `/` |
| `home.reentry` | Home | Reentry support feature | `/` |
| `resources.hero` | Resources | Resource Finder hero | `/resources` |
| `families.hero` | Families | Family Support hero | `/families` |
| `families.children` | Families | Children guide hero | `/families/children` |
| `families.visitation` | Families | Visitation guide hero | `/families/visitation` |
| `families.emotional-support` | Families | Emotional support guide hero | `/families/emotional-support` |
| `reentry.hero` | Reentry | Reentry landing hero | `/reentry` |
| `reentry.documents` | Reentry | Documents guide hero | `/reentry/documents` |
| `reentry.housing` | Reentry | Housing guide hero | `/reentry/housing` |
| `reentry.employment` | Reentry | Employment guide hero | `/reentry/employment` |
| `reentry.health` | Reentry | Health guide hero | `/reentry/health` |
| `reentry.family-transition` | Reentry | Family transition guide hero | `/reentry/family-transition` |
| `start.hero` | Start Here | Start Here hero | `/start` |
| `about.hero` | About | About hero | `/about` |
| `community.hero` | Community | Community hero | `/community` |
| `ask-for-help.hero` | Ask for Help | Advocacy hero | `/ask-for-help` |

Keys for route shells that do not yet exist are reserved and remain harmless until those routes are built. They do not create a page, navigation item, or alternate editor.

## Media fields and storage rules

An assignment may include a primary image, optional mobile crop, alt text, caption, creator credit and URL, source name and URL, license label, desktop/mobile focal positions, mobile visibility, an overlay tone, optional custom overlay color, and opacity.

- Only JPG/JPEG, PNG, and WebP files are accepted; maximum file size is 6 MB.
- The browser checks file type and size. The server checks MIME type, filename extension, and magic bytes again.
- Storage paths are generated on the server from the approved media key and a UUID. The client cannot provide a path.
- SVGs, executables, path traversal, and unapproved media keys are rejected.
- Replaced or reset uploads are removed only if no `site_media` row still references them.
- The `site-media` bucket is private. Public reads are allowed only for objects referenced by a public assignment. The service-role key is used only in server code.

## Appearance scope

The companion `site_section_appearance` record may only set a scoped subset of existing CSS custom properties:

- Approved colors: background, surface, border, default text, eyebrow, heading, body, button text, and metadata.
- Font family: `inherit`, `serif`, or `sans`.
- Hero edge: `inherit`, `soft-fade`, `rounded`, `rounded-fade`, or `none`, with a size from 0–96px.

Colors accept `#112233`, `112233`, `#abc`, or `abc`, and save as lowercase six-digit hex. Named colors, `rgb()`, `hsl()`, CSS variables, gradients, arbitrary CSS, layout rules, scripts, page copy, and dynamic classes are not accepted.

Overlay presets are `none`, `light`, `dark`, `cream`, and `brand`. A valid custom hex color overrides the preset; clearing it restores the selected preset. Opacity is independently constrained to 0–0.72 so an image is not made opaque by default.

Media reset and appearance reset are separate actions. Resetting media deletes only its database assignment and safe unreferenced uploads. Resetting appearance deletes only the presentation override.
