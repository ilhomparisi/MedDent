/*
  # Add Mobile Button Height Settings

  1. New Settings
    - `hero_button_height_mobile` (integer) - Mobile button height in pixels

  2. Purpose
    - Allow independent control of button height on mobile
    - Button height remains static while text size can be decreased
    - Provides better control over mobile button appearance

  3. Note
    - Mobile button height applies to screens < 768px
    - Desktop button uses default padding (py-2.5 md:py-4)
*/

INSERT INTO site_settings (key, category, value, updated_at)
VALUES 
  ('hero_button_height_mobile', 'hero', '50', now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
