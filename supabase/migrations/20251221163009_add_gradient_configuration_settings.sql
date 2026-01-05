/*
  # Add Gradient Configuration Settings

  Adds configurable settings for the blue gradient overlay that appears on black background sections.

  1. New Settings
    - `gradient_opacity` - Controls the overall opacity/intensity of the gradient (default: 0.25)
    - `gradient_width` - Controls the width percentage of the gradient (default: 90)
    - `gradient_height` - Controls the height percentage of the gradient (default: 85)
    - `gradient_blur` - Controls the blur amount in pixels (default: 60)
    
  2. Purpose
    - Provides admin panel controls for customizing the blue gradient effect
    - Allows fine-tuning of visual impact across all black sections
*/

DO $$
BEGIN
  -- Add gradient opacity setting
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'gradient_opacity'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('gradient_opacity', '"0.25"', 'appearance');
  END IF;

  -- Add gradient width setting
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'gradient_width'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('gradient_width', '"90"', 'appearance');
  END IF;

  -- Add gradient height setting
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'gradient_height'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('gradient_height', '"85"', 'appearance');
  END IF;

  -- Add gradient blur setting
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'gradient_blur'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('gradient_blur', '"60"', 'appearance');
  END IF;
END $$;