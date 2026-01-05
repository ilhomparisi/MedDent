/*
  # Add Hero Oval Frame Border Color Setting

  1. Changes
    - Adds `hero_oval_frame_border_color` setting to control the pill-shaped image border color
    - Default value set to blue (#2563eb)
    
  2. Purpose
    - Allows customization of the oval frame border color from admin panel
    - Provides better visual control over the hero section design
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'hero_oval_frame_border_color'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('hero_oval_frame_border_color', '"#2563eb"', 'colors');
  END IF;
END $$;