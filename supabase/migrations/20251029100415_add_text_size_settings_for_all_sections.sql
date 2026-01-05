/*
  # Add Text Size Settings for All Sections

  1. New Settings Added
    - Add text size settings for Hero section (title, subtitle)
    - Add text size settings for Kim Uchun section (title, card texts, button)
    - Add text size settings for Reviews section (title, subtitle)
    - Add text size settings for Results section (title, subtitle)
    - Add text size settings for Doctors section (title, subtitle)
    - Add text size settings for Services section (title, subtitle)
    
  2. Implementation
    - Use site_settings table with key-value pairs
    - Each text element gets a corresponding size setting
    - Default values set to match current design
    
  3. Notes
    - All font sizes stored as strings representing pixel values
    - Values will be enforced at application level with min/max limits
*/

-- Hero section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_title_size', '48', 'texts', NOW()),
  ('hero_subtitle_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;

-- Kim Uchun section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('kim_uchun_title_size', '36', 'texts', NOW()),
  ('kim_uchun_card_text_size', '16', 'texts', NOW()),
  ('kim_uchun_button_text_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;

-- Reviews section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('reviews_title_size', '36', 'texts', NOW()),
  ('reviews_subtitle_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;

-- Results section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('results_title_size', '36', 'texts', NOW()),
  ('results_subtitle_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;

-- Doctors section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('doctors_title_size', '36', 'texts', NOW()),
  ('doctors_subtitle_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;

-- Services section text sizes
INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('services_title_size', '36', 'texts', NOW()),
  ('services_subtitle_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;