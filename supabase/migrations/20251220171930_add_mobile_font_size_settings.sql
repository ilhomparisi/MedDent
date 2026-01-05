/*
  # Add Mobile Font Size Settings

  1. Changes
    - Add mobile-specific font size settings for hero section
    - Allows separate control of text sizes for mobile and desktop devices

  2. New Settings
    - `hero_title_line1_size_mobile` - First line title size for mobile (default: 28px)
    - `hero_title_line2_size_mobile` - Second line title size for mobile (default: 36px)
    - `hero_subtitle_size_mobile` - Subtitle size for mobile (default: 16px)
    - `hero_badge_text_size_mobile` - Badge text size for mobile (default: 12px)

  3. Notes
    - Existing size settings (hero_title_line1_size, etc.) will be used for desktop
    - Mobile sizes are used as default, desktop sizes apply at 768px breakpoint and above
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES
  ('hero_title_line1_size_mobile', '"29.5"'::jsonb, 'texts', NOW()),
  ('hero_title_line2_size_mobile', '"34.5"'::jsonb, 'texts', NOW()),
  ('hero_subtitle_size_mobile', '"13.5"'::jsonb, 'texts', NOW()),
  ('hero_badge_text_size_mobile', '"13"'::jsonb, 'texts', NOW())
ON CONFLICT (key) DO NOTHING;
