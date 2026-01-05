/*
  # Add Complete Hero Section Spacing Controls

  1. New Settings
    - `hero_spacing_badge_title` - Desktop spacing between badge and title (pixels)
    - `hero_spacing_badge_title_mobile` - Mobile spacing between badge and title (pixels)
    - `hero_spacing_title_subtitle` - Desktop spacing between title and subtitle (pixels)
    - `hero_spacing_title_subtitle_mobile` - Mobile spacing between title and subtitle (pixels)

  2. Changes
    - Adds missing spacing controls to complete the hero section spacing system
    - Enables full control over all vertical spacing in the hero section
*/

-- Add spacing settings for badge-to-title and title-to-subtitle
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_spacing_badge_title', '16', 'hero', now()),
  ('hero_spacing_badge_title_mobile', '12', 'hero', now()),
  ('hero_spacing_title_subtitle', '24', 'hero', now()),
  ('hero_spacing_title_subtitle_mobile', '16', 'hero', now())
ON CONFLICT (key) DO NOTHING;