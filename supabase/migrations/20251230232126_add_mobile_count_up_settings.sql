/*
  # Add Mobile Count-Up Animation Settings

  1. New Settings
    - `hero_count_up_duration_mobile` (integer) - Mobile animation duration in milliseconds
    - `hero_count_up_text_size_mobile` (integer) - Mobile font size for count-up text in pixels

  2. Purpose
    - Enable separate mobile configuration for count-up animation
    - Allow different animation duration and text sizes on mobile vs desktop
    - Provide complete mobile customization for the counter

  3. Note
    - Mobile settings will be used on screens < 768px
    - Desktop settings remain unchanged when mobile settings are not configured
*/

INSERT INTO site_settings (key, category, value, updated_at)
VALUES 
  ('hero_count_up_duration_mobile', 'hero', '1500', now()),
  ('hero_count_up_text_size_mobile', 'hero', '16', now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();
