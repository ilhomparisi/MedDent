/*
  # Add Hero Badge Text Setting

  1. Changes
    - Add hero_badge_text setting to site_settings table for the badge text above hero title
    - Default value: "Yangi bemorlar uchun"
  
  2. Purpose
    - Allow admin to customize the badge text displayed above the hero title
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES ('hero_badge_text', '"Yangi bemorlar uchun"'::jsonb, 'texts', NOW())
ON CONFLICT (key) DO NOTHING;
