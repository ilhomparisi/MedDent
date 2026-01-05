/*
  # Add Mobile Text Size for Countdown

  1. Changes
    - Add countdown_expiry_text_size_mobile setting for mobile devices
    - Default value is 12px for mobile

  2. Notes
    - Desktop size is controlled by countdown_expiry_text_size (default 16px)
    - Mobile size is controlled by countdown_expiry_text_size_mobile (default 12px)
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'countdown_expiry_text_size_mobile') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('countdown_expiry_text_size_mobile', '"12"', 'texts');
  END IF;
END $$;
