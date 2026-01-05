/*
  # Add Language Support to UI Texts

  1. Changes
    - Add `value_uz` column to store Uzbek text
    - Add `value_ru` column to store Russian text
    - Migrate existing `value` data to `value_uz` for backward compatibility
    - Keep `value` column for default/fallback text

  2. Notes
    - Existing data in `value` will be copied to `value_uz`
    - `value_ru` will be NULL by default, requiring manual translation
    - This enables bilingual support for footer and other UI texts
*/

DO $$ 
BEGIN
  -- Add value_uz column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ui_texts' AND column_name = 'value_uz'
  ) THEN
    ALTER TABLE ui_texts ADD COLUMN value_uz text;
    
    -- Migrate existing data to value_uz
    UPDATE ui_texts SET value_uz = value WHERE value_uz IS NULL;
  END IF;

  -- Add value_ru column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ui_texts' AND column_name = 'value_ru'
  ) THEN
    ALTER TABLE ui_texts ADD COLUMN value_ru text;
  END IF;
END $$;