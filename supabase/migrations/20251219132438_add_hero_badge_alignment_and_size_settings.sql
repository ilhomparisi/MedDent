/*
  # Add Hero Badge Alignment and Size Settings

  1. Changes
    - Add hero_badge_text_align setting for badge text alignment (left, center, right)
    - Add hero_badge_text_size setting for badge text size in pixels
    - Default alignment: center
    - Default size: 14px
  
  2. Purpose
    - Allow admin to customize the badge text alignment and size
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_badge_text_align', '"center"'::jsonb, 'texts', NOW()),
  ('hero_badge_text_size', '"14"'::jsonb, 'texts', NOW())
ON CONFLICT (key) DO NOTHING;
