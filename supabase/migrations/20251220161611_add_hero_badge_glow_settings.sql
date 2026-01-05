/*
  # Add Hero Badge Glow Effect Settings

  1. New Settings
    - `tooth_icon_color` (text)
      - Color for the tooth icon in the hero badge
      - Default: '#2563eb' (blue)
    - `hero_badge_glow_intensity` (text)
      - Glow effect intensity from 0-100%
      - Default: '50' (50% intensity)

  2. Changes
    - Adds two new configurable settings to control the tooth icon appearance and glow effect
    - Allows admin to customize the visual appearance of the hero badge
*/

-- Add tooth icon color setting
INSERT INTO site_settings (key, value, category, updated_at)
VALUES ('tooth_icon_color', '"#2563eb"'::jsonb, 'hero', NOW())
ON CONFLICT (key) DO NOTHING;

-- Add hero badge glow intensity setting
INSERT INTO site_settings (key, value, category, updated_at)
VALUES ('hero_badge_glow_intensity', '"50"'::jsonb, 'hero', NOW())
ON CONFLICT (key) DO NOTHING;
