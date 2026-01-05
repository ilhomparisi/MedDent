/*
  # Add Hero Oval Frame Size Settings

  1. New Settings
    - `hero_oval_frame_width` - Width of the oval frame image (in pixels or 'auto')
    - `hero_oval_frame_height` - Height of the oval frame image (in pixels)
    - `hero_oval_frame_visible_mobile` - Whether to show the oval frame on mobile devices

  2. Changes
    - Add three new columns to `site_settings` table
    - Set defaults: width='auto', height='600', visible_mobile=false

  3. Important Notes
    - Width and height apply only to desktop view (>= 1024px)
    - Mobile visibility defaults to false to ensure text readability
    - Backward compatible with existing hero section images
*/

DO $$
BEGIN
  -- Add hero_oval_frame_width column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_width'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_oval_frame_width text DEFAULT 'auto';
  END IF;

  -- Add hero_oval_frame_height column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_height'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_oval_frame_height text DEFAULT '600';
  END IF;

  -- Add hero_oval_frame_visible_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_oval_frame_visible_mobile'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_oval_frame_visible_mobile boolean DEFAULT false;
  END IF;
END $$;
