/*
  # Add individual button spacing controls for Value Stacking cards

  1. New Columns
    - `left_description_to_button_spacing_mobile` (integer)
    - `left_description_to_button_spacing_desktop` (integer)
    - `right_description_to_button_spacing_mobile` (integer)
    - `right_description_to_button_spacing_desktop` (integer)

  2. Purpose
    - Allows independent control of spacing between description text and buttons
    - For left (black) card and right (blue) card
    - Different values for mobile and desktop views
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'left_description_to_button_spacing_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN left_description_to_button_spacing_mobile integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'left_description_to_button_spacing_desktop'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN left_description_to_button_spacing_desktop integer DEFAULT 64;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'right_description_to_button_spacing_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN right_description_to_button_spacing_mobile integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'right_description_to_button_spacing_desktop'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN right_description_to_button_spacing_desktop integer DEFAULT 64;
  END IF;
END $$;
