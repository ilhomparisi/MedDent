/*
  # Add Results Section Solid Blue Width Setting

  1. Changes
    - Add `results_solid_blue_width` setting to control the width of the solid blue background areas on the sides
    - Default value set to 64px (decreased from 128px)
  
  2. Purpose
    - Allows admin to configure the width of the solid blue background in the fade-out areas
    - Provides more control over the visual appearance of the results section
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'results_solid_blue_width'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('results_solid_blue_width', '64', 'results_section');
  END IF;
END $$;