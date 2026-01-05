/*
  # Add Matrix Image URL to Pill Sections

  1. Changes
    - Add matrix_image_url column to pill_sections table
    - Stores the URL of the uploaded Matrix character image
    - Allows NULL (optional) since not all sections may have an image

  2. Notes
    - The image will be uploaded to Supabase Storage
    - Each section can have its own Matrix character image
*/

-- Add matrix_image_url column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'matrix_image_url'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN matrix_image_url text;
  END IF;
END $$;