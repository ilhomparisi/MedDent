/*
  # Add CTA text and button settings to results section

  1. New Settings
    - `results_cta_text` - Main CTA text displayed above the button
    - `results_cta_text_size` - Font size for CTA text
    - `results_cta_text_weight` - Font weight for CTA text
    - `results_cta_text_align` - Text alignment for CTA text
    - `results_button_text` - Text displayed on the button
    - `results_button_url` - URL or action for the button
    - `results_button_enabled` - Enable/disable the button
    - `results_subtext` - Small text below the button
    - `results_subtext_size` - Font size for subtext
    - `results_subtext_align` - Text alignment for subtext
  
  2. Notes
    - All settings are optional with sensible defaults
    - Button can be disabled if not needed
    - Text alignment supports left, center, right
*/

DO $$
BEGIN
  -- Add CTA text settings
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_cta_text'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_cta_text', '"Yours can be the next one."'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_cta_text_size'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_cta_text_size', '20'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_cta_text_weight'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_cta_text_weight', '"400"'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_cta_text_align'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_cta_text_align', '"center"'::jsonb, 'text');
  END IF;

  -- Add button settings
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_button_text'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_button_text', '"YES! GIVE ME ACCESS NOW"'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_button_url'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_button_url', '"#booking"'::jsonb, 'general');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_button_enabled'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_button_enabled', 'true'::jsonb, 'general');
  END IF;

  -- Add subtext settings
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_subtext'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_subtext', '"Secure your access today and start your journey."'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_subtext_size'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_subtext_size', '14'::jsonb, 'text');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_subtext_align'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_subtext_align', '"center"'::jsonb, 'text');
  END IF;
END $$;