/*
  # Add multilanguage support to doctors table

  1. Changes
    - Add `name_uz` column for Uzbek name
    - Add `name_ru` column for Russian name
    - Add `specialty_uz` column for Uzbek specialty
    - Add `specialty_ru` column for Russian specialty
    - Add `bio_uz` column for Uzbek bio
    - Add `bio_ru` column for Russian bio
    - Add `education_uz` column for Uzbek education
    - Add `education_ru` column for Russian education
    - Copy existing data to language-specific columns

  2. Notes
    - Existing columns are kept for backward compatibility
    - Admin panel will be updated to manage both languages
*/

-- Add language-specific columns for doctors
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'name_uz') THEN
    ALTER TABLE doctors ADD COLUMN name_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'name_ru') THEN
    ALTER TABLE doctors ADD COLUMN name_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'specialty_uz') THEN
    ALTER TABLE doctors ADD COLUMN specialty_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'specialty_ru') THEN
    ALTER TABLE doctors ADD COLUMN specialty_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'bio_uz') THEN
    ALTER TABLE doctors ADD COLUMN bio_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'bio_ru') THEN
    ALTER TABLE doctors ADD COLUMN bio_ru text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'education_uz') THEN
    ALTER TABLE doctors ADD COLUMN education_uz text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'doctors' AND column_name = 'education_ru') THEN
    ALTER TABLE doctors ADD COLUMN education_ru text;
  END IF;
END $$;

-- Copy existing data to language-specific columns
UPDATE doctors 
SET 
  name_uz = COALESCE(name_uz, name),
  name_ru = COALESCE(name_ru, name),
  specialty_uz = COALESCE(specialty_uz, specialty),
  specialty_ru = COALESCE(specialty_ru, specialty),
  bio_uz = COALESCE(bio_uz, bio),
  bio_ru = COALESCE(bio_ru, bio),
  education_uz = COALESCE(education_uz, education),
  education_ru = COALESCE(education_ru, education)
WHERE name_uz IS NULL OR name_ru IS NULL;