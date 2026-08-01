-- Scoped visual controls for the homepage Guided pathways section.
-- Values stay constrained to the Media + Appearance registry and are never raw CSS.

alter table public.site_section_appearance
  add column if not exists background_image_fit text,
  add column if not exists background_image_zoom numeric,
  add column if not exists background_overlay_enabled boolean,
  add column if not exists background_overlay_tone text,
  add column if not exists background_overlay_color text,
  add column if not exists background_overlay_opacity numeric,
  add column if not exists background_overlay_direction text,
  add column if not exists background_overlay_distribution text,
  add column if not exists background_blur integer,
  add column if not exists card_surface_preset text,
  add column if not exists card_surface_opacity numeric,
  add column if not exists card_border_tone text,
  add column if not exists card_border_opacity numeric,
  add column if not exists card_shadow text,
  add column if not exists card_backdrop_blur text,
  add column if not exists card_text_tone text,
  add column if not exists card_image_enabled boolean;

alter table public.site_section_appearance
  drop constraint if exists site_section_appearance_journey_controls_check;

alter table public.site_section_appearance
  add constraint site_section_appearance_journey_controls_check check (
    (background_image_fit is null or background_image_fit in ('cover', 'contain'))
    and (background_image_zoom is null or background_image_zoom between 100 and 140)
    and (background_overlay_tone is null or background_overlay_tone in ('deep-ink', 'warm-cream', 'clay', 'sage', 'storm', 'custom'))
    and (background_overlay_color is null or background_overlay_color ~ '^#[0-9a-f]{6}$')
    and (background_overlay_opacity is null or background_overlay_opacity between 0 and 0.9)
    and (background_overlay_direction is null or background_overlay_direction in ('full', 'top-to-bottom', 'bottom-to-top', 'left-to-right', 'right-to-left', 'center-vignette', 'heading-focus'))
    and (background_overlay_distribution is null or background_overlay_distribution in ('soft', 'balanced', 'strong'))
    and (background_blur is null or background_blur in (0, 1, 2, 3, 4, 6))
    and (card_surface_preset is null or card_surface_preset in ('paper', 'warm-paper', 'cream', 'translucent-light', 'translucent-dark'))
    and (card_surface_opacity is null or card_surface_opacity between 0.4 and 1)
    and (card_border_tone is null or card_border_tone in ('soft-ink', 'paper', 'clay', 'sage', 'storm'))
    and (card_border_opacity is null or card_border_opacity between 0 and 1)
    and (card_shadow is null or card_shadow in ('none', 'soft', 'medium'))
    and (card_backdrop_blur is null or card_backdrop_blur in ('none', 'subtle', 'medium'))
    and (card_text_tone is null or card_text_tone in ('auto', 'ink', 'paper'))
  );
