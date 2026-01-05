/*
  # Add shadow opacity configuration for results section

  1. Changes
    - Add `results_shadow_opacity` setting to site_settings table with category 'display'
    - Default value is '0.9' (90% opacity) matching current implementation
  
  2. Notes
    - This allows admins to control the intensity of the blue shadow gradient
    - Values should be between 0 and 1 (e.g., '0.5' for 50%, '0.9' for 90%)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_shadow_opacity'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_shadow_opacity', '0.9', 'display');
  END IF;
END $$;