/*
  # Add multilanguage support to services table

  1. Changes
    - Add `title_uz` column for Uzbek title
    - Add `title_ru` column for Russian title
    - Add `description_uz` column for Uzbek description
    - Add `description_ru` column for Russian description
    - Add `detailed_description_uz` column for Uzbek detailed description
    - Add `detailed_description_ru` column for Russian detailed description
    - Copy existing data to `_uz` columns
    - Set `_ru` columns to existing data as well (can be edited by admin later)

  2. Notes
    - Existing `title`, `description`, `detailed_description` columns are kept for backward compatibility
    - Admin panel will be updated to manage both languages
*/

-- Add language-specific columns for services
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_uz') THEN
    ALTER TABLE services ADD COLUMN title_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'title_ru') THEN
    ALTER TABLE services ADD COLUMN title_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'description_uz') THEN
    ALTER TABLE services ADD COLUMN description_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'description_ru') THEN
    ALTER TABLE services ADD COLUMN description_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'detailed_description_uz') THEN
    ALTER TABLE services ADD COLUMN detailed_description_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'detailed_description_ru') THEN
    ALTER TABLE services ADD COLUMN detailed_description_ru text;
  END IF;
END $$;

-- Copy existing data to language-specific columns
UPDATE services 
SET 
  title_uz = COALESCE(title_uz, title),
  title_ru = COALESCE(title_ru, title),
  description_uz = COALESCE(description_uz, description),
  description_ru = COALESCE(description_ru, description),
  detailed_description_uz = COALESCE(detailed_description_uz, detailed_description),
  detailed_description_ru = COALESCE(detailed_description_ru, detailed_description)
WHERE title_uz IS NULL OR title_ru IS NULL OR description_uz IS NULL OR description_ru IS NULL;