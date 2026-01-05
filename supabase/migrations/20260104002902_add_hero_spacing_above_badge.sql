/*
  # Add hero spacing above badge setting
  
  1. New Settings
    - `hero_spacing_above_badge` (desktop)
    - `hero_spacing_above_badge_mobile` (mobile)
*/

INSERT INTO site_settings (key, value, category) VALUES
  ('hero_spacing_above_badge', '0', 'display'),
  ('hero_spacing_above_badge_mobile', '0', 'display')
ON CONFLICT (key) DO NOTHING;
