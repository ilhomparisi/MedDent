/*
  # Add Countdown Text Glow Settings

  1. New Settings
    - `countdown_glow_text` - The specific text to apply glow effect to (e.g., "24 soat")
    - `countdown_glow_color` - The color of the glow effect
    - `countdown_glow_intensity` - The intensity of the glow effect (0-100)
  
  2. Purpose
    - Allows admins to specify which portion of countdown text should have glow effect
    - Allows customization of glow color and intensity
    - Settings are stored in site_settings table
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES
  ('countdown_glow_text', '"24 soat"'::jsonb, 'general', now()),
  ('countdown_glow_color', '"#0066CC"'::jsonb, 'general', now()),
  ('countdown_glow_intensity', '"50"'::jsonb, 'general', now())
ON CONFLICT (key) DO NOTHING;
