/*
  # Add video width coverage setting to section backgrounds

  1. Changes
    - Add `video_width_percentage` column to `section_backgrounds` table
      - Stores the width percentage (0-100) for video backgrounds
      - Defaults to 100 (full width)
    - Add `video_horizontal_align` column to control horizontal alignment
      - Options: 'left', 'center', 'right'
      - Defaults to 'center'
  
  2. Notes
    - These settings allow videos to occupy only a portion of the section width
    - When video_width_percentage is less than 100, the video will be positioned according to video_horizontal_align
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'video_width_percentage'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN video_width_percentage integer DEFAULT 100;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'video_horizontal_align'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN video_horizontal_align text DEFAULT 'center';
  END IF;
END $$;
