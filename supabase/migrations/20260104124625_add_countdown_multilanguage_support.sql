/*
  # Add Multilanguage Support for Countdown Text

  1. Changes
    - Add countdown_expiry_text_uz for Uzbek translation
    - Add countdown_expiry_text_ru for Russian translation
    - Preserve existing countdown_expiry_text as default

  2. Notes
    - Uzbek: "Taklif faqat 24 soat davomida amal qiladi."
    - Russian: "Предложение действует только 24 часа."
*/

DO $$
BEGIN
  -- Add Uzbek countdown text
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text_uz') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text_uz', '"Taklif faqat 24 soat davomida amal qiladi."', 'texts');
  END IF;

  -- Add Russian countdown text
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text_ru') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text_ru', '"Предложение действует только 24 часа."', 'texts');
  END IF;
END $$;
