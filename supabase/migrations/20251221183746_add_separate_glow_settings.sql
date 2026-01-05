/*
  # Add Separate Glow Settings for Tooth Icon and Badge Text

  1. New Settings
    - `tooth_icon_glow_color` - Color for the tooth icon glow effect (separate from text)
    - `tooth_icon_glow_intensity` - Intensity control for tooth icon glow (0-100)
    - `text_glow_color` - Color for the badge text glow effect (default white)
    - `text_glow_intensity` - Intensity control for text glow (0-100)
  
  2. Changes
    - Adds four new site settings to allow independent control of glow effects
    - Tooth icon glow can now be customized separately from text glow
    - Existing `tooth_icon_color` controls the icon color, not the glow
    - Existing `hero_badge_glow_intensity` remains for backward compatibility
  
  3. Default Values
    - tooth_icon_glow_color: #2563eb (blue)
    - tooth_icon_glow_intensity: 50 (50%)
    - text_glow_color: #ffffff (white)
    - text_glow_intensity: 50 (50%)
*/

-- Add tooth icon glow color setting
INSERT INTO site_settings (key, value, category)
VALUES (
  'tooth_icon_glow_color',
  '"#2563eb"',
  'appearance'
)
ON CONFLICT (key) DO NOTHING;

-- Add tooth icon glow intensity setting
INSERT INTO site_settings (key, value, category)
VALUES (
  'tooth_icon_glow_intensity',
  '"50"',
  'appearance'
)
ON CONFLICT (key) DO NOTHING;

-- Add text glow color setting
INSERT INTO site_settings (key, value, category)
VALUES (
  'text_glow_color',
  '"#ffffff"',
  'appearance'
)
ON CONFLICT (key) DO NOTHING;

-- Add text glow intensity setting
INSERT INTO site_settings (key, value, category)
VALUES (
  'text_glow_intensity',
  '"50"',
  'appearance'
)
ON CONFLICT (key) DO NOTHING;
