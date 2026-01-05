/*
  # Remove Hero Oval Frame Size Settings

  1. Changes
    - Remove `hero_oval_frame_width` column from `site_settings` table
    - Remove `hero_oval_frame_height` column from `site_settings` table
    - Remove `hero_oval_frame_visible_mobile` column from `site_settings` table

  2. Rationale
    - Simplifying the oval frame implementation to use fixed responsive CSS sizes
    - Removing database configuration in favor of component-based sizing
    - The `hero_oval_frame` boolean toggle remains for enabling/disabling the feature

  3. Impact
    - Oval frame sizes now controlled by component CSS: 200px x 400px (desktop), hidden on mobile
    - Admin panel no longer needs size configuration controls
    - Cleaner, more maintainable implementation
*/

DO $$
BEGIN
  -- Remove hero_oval_frame_width column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_width'
  ) THEN
    ALTER TABLE site_settings DROP COLUMN hero_oval_frame_width;
  END IF;

  -- Remove hero_oval_frame_height column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_height'
  ) THEN
    ALTER TABLE site_settings DROP COLUMN hero_oval_frame_height;
  END IF;

  -- Remove hero_oval_frame_visible_mobile column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_visible_mobile'
  ) THEN
    ALTER TABLE site_settings DROP COLUMN hero_oval_frame_visible_mobile;
  END IF;
END $$;
