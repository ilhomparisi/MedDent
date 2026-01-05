/*
  # Add Pixel-Based Positioning Controls

  1. New Columns
    - `background_position_left` (integer) - Position from left in pixels
    - `background_position_right` (integer) - Position from right in pixels
    - `background_position_top` (integer) - Position from top in pixels
    - `background_position_bottom` (integer) - Position from bottom in pixels

  2. Purpose
    - Enable pixel-precise image positioning for section backgrounds
    - Replace simple dropdown positioning with developer-friendly px controls
    - Provide granular control over image placement from all edges

  3. Note
    - Backward compatible with existing background_position column
    - Null values mean the pixel positioning is not being used
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_position_left'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_position_left integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_position_right'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_position_right integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_position_top'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_position_top integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_position_bottom'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_position_bottom integer DEFAULT 0;
  END IF;
END $$;
