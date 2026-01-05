/*
  # Add Hero Spacing Controls

  1. New Settings
    - `hero_spacing_subtitle_button` - Desktop spacing between subtitle and button (pixels)
    - `hero_spacing_subtitle_button_mobile` - Mobile spacing between subtitle and button (pixels)
    - `hero_spacing_button_countup` - Desktop spacing between button and count-up section (pixels)
    - `hero_spacing_button_countup_mobile` - Mobile spacing between button and count-up section (pixels)
  
  2. Defaults
    - Subtitle to Button Desktop: 32px
    - Subtitle to Button Mobile: 24px
    - Button to CountUp Desktop: 32px
    - Button to CountUp Mobile: 32px
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES
  ('hero_spacing_subtitle_button', '32', 'hero', now()),
  ('hero_spacing_subtitle_button_mobile', '24', 'hero', now()),
  ('hero_spacing_button_countup', '32', 'hero', now()),
  ('hero_spacing_button_countup_mobile', '32', 'hero', now())
ON CONFLICT (key) DO NOTHING;