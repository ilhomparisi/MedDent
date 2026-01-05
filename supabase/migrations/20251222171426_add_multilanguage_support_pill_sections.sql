/*
  # Add multilanguage support to pill_sections table

  1. Changes
    - Add language-specific columns for all text fields
    - Columns: main_heading, subheading, blue_pill_title, blue_pill_description, blue_pill_details
    - Columns: red_pill_title, red_pill_description, red_pill_details, button_text
    - Each field gets _uz and _ru variants
    - Copy existing data to both language columns

  2. Notes
    - Existing columns are kept for backward compatibility
    - Admin panel will be updated to manage both languages
*/

-- Add language-specific columns for pill_sections
DO $$
BEGIN
  -- Main heading
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'main_heading_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN main_heading_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'main_heading_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN main_heading_ru text DEFAULT '';
  END IF;
  
  -- Subheading
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'subheading_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN subheading_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'subheading_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN subheading_ru text DEFAULT '';
  END IF;
  
  -- Blue pill
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_title_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_title_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_title_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_title_ru text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_description_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_description_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_description_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_description_ru text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_details_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_details_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'blue_pill_details_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN blue_pill_details_ru text DEFAULT '';
  END IF;
  
  -- Red pill
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_title_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_title_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_title_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_title_ru text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_description_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_description_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_description_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_description_ru text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_details_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_details_uz text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'red_pill_details_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN red_pill_details_ru text DEFAULT '';
  END IF;
  
  -- Button text
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'button_text_uz') THEN
    ALTER TABLE pill_sections ADD COLUMN button_text_uz text DEFAULT 'Ro''yxatdan o''tish';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pill_sections' AND column_name = 'button_text_ru') THEN
    ALTER TABLE pill_sections ADD COLUMN button_text_ru text DEFAULT 'Зарегистрироваться';
  END IF;
END $$;

-- Copy existing data to language-specific columns
UPDATE pill_sections 
SET 
  main_heading_uz = COALESCE(main_heading_uz, main_heading),
  main_heading_ru = COALESCE(main_heading_ru, main_heading),
  subheading_uz = COALESCE(subheading_uz, subheading),
  subheading_ru = COALESCE(subheading_ru, subheading),
  blue_pill_title_uz = COALESCE(blue_pill_title_uz, blue_pill_title),
  blue_pill_title_ru = COALESCE(blue_pill_title_ru, blue_pill_title),
  blue_pill_description_uz = COALESCE(blue_pill_description_uz, blue_pill_description),
  blue_pill_description_ru = COALESCE(blue_pill_description_ru, blue_pill_description),
  blue_pill_details_uz = COALESCE(blue_pill_details_uz, blue_pill_details),
  blue_pill_details_ru = COALESCE(blue_pill_details_ru, blue_pill_details),
  red_pill_title_uz = COALESCE(red_pill_title_uz, red_pill_title),
  red_pill_title_ru = COALESCE(red_pill_title_ru, red_pill_title),
  red_pill_description_uz = COALESCE(red_pill_description_uz, red_pill_description),
  red_pill_description_ru = COALESCE(red_pill_description_ru, red_pill_description),
  red_pill_details_uz = COALESCE(red_pill_details_uz, red_pill_details),
  red_pill_details_ru = COALESCE(red_pill_details_ru, red_pill_details),
  button_text_uz = COALESCE(button_text_uz, button_text),
  button_text_ru = COALESCE(button_text_ru, button_text)
WHERE main_heading_uz IS NULL OR main_heading_uz = '' OR main_heading_ru IS NULL OR main_heading_ru = '';