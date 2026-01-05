/*
  # Add Hero Oval Frame Setting

  1. Changes
    - Add `hero_oval_frame` setting to site_settings table for controlling oval frame on hero background image
    
  2. Purpose
    - Allows admin to toggle oval frame styling on hero section background image
    - Default is true for the new oval frame design
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'hero_oval_frame'
  ) THEN
    INSERT INTO site_settings (key, value, category)
    VALUES ('hero_oval_frame', 'true', 'appearance');
  END IF;
END $$;