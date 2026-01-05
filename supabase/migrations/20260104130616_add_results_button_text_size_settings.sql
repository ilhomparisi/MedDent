/*
  # Add Results Button Text Size Settings

  1. Changes
    - Add results_button_text_size_desktop setting (default 18px)
    - Add results_button_text_size_mobile setting (default 16px)

  2. Notes
    - Desktop size is controlled by results_button_text_size_desktop
    - Mobile size is controlled by results_button_text_size_mobile
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'results_button_text_size_desktop') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_button_text_size_desktop', '"18"', 'texts');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'results_button_text_size_mobile') THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_button_text_size_mobile', '"16"', 'texts');
  END IF;
END $$;
