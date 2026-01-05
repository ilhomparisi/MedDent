/*
  # Add Hero Badge Font Family Setting

  1. Changes
    - Add hero_badge_font_family setting to control the font of the hero badge text
    - Default value: 'Inter, system-ui, -apple-system, sans-serif' (matching the primary font)
  
  2. Purpose
    - Allow admin to customize the font family of the hero badge "Yangi bemorlar uchun"
    - Provides better visual customization options for the hero section
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_badge_font_family', '"Inter, system-ui, -apple-system, sans-serif"'::jsonb, 'texts', NOW())
ON CONFLICT (key) DO NOTHING;
