/*
  # Add Heading Color Configuration to Value Stacking

  1. Changes
    - Add `main_heading_color` column to `value_stacking` table
    - Default color is white (#FFFFFF) to match typical heading colors
    - Allows admins to customize the main heading color

  2. Notes
    - Previously the heading color was hardcoded to blue (#0066CC)
    - Now admins can change it to white or any other color
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'main_heading_color'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN main_heading_color text DEFAULT '#FFFFFF';
  END IF;
END $$;