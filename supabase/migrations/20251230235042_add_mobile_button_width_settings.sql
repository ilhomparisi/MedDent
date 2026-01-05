/*
  # Add Mobile Button Width Settings

  1. New Settings
    - `hero_button_width_mobile` (text) - Mobile button width (e.g., '100%', 'auto')

  2. Purpose
    - Allow independent control of button width on mobile
    - Can set fixed width or percentage width
*/

INSERT INTO site_settings (key, category, value, updated_at)
VALUES 
  ('hero_button_width_mobile', 'hero', '"auto"', now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
