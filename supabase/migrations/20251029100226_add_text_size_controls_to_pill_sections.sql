/*
  # Add Text Size and Image Size Controls to Pill Sections

  1. Schema Changes
    - Add font size columns for main heading and subheading
    - Add font size columns for blue pill title, description, and details
    - Add font size columns for red pill title, description, and details
    - Add font size column for button text
    - Add column for Matrix image max width control
    
  2. Default Values
    - Set sensible default font sizes for all text elements
    - Set default Matrix image max width to 600px
    
  3. Notes
    - All font sizes are stored as integers representing pixel values
    - Matrix image max width is also stored as integer (pixels)
    - Minimum and maximum values will be enforced at the application level
*/

DO $$
BEGIN
  -- Add main heading and subheading font sizes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'main_heading_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN main_heading_size integer DEFAULT 48;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'subheading_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN subheading_size integer DEFAULT 20;
  END IF;

  -- Add blue pill font sizes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_title_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_title_size integer DEFAULT 24;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_description_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_description_size integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_details_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_details_size integer DEFAULT 14;
  END IF;

  -- Add red pill font sizes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'red_pill_title_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_title_size integer DEFAULT 24;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'red_pill_description_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_description_size integer DEFAULT 16;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'red_pill_details_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_details_size integer DEFAULT 14;
  END IF;

  -- Add button text font size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'button_text_size'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN button_text_size integer DEFAULT 20;
  END IF;

  -- Add Matrix image max width control
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'matrix_image_max_width'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN matrix_image_max_width integer DEFAULT 600;
  END IF;
END $$;