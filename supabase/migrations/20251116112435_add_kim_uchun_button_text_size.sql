/*
  # Add button text size configuration for Kim Uchun section

  1. Changes
    - Add kim_uchun_button_text_size setting to site_settings table
    - Default value is '16' (pixels)
  
  2. Purpose
    - Allow admins to configure the button text size in Kim Uchun section
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES ('kim_uchun_button_text_size', '16', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;