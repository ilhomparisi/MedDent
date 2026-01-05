/*
  # Add Hero Card Image Setting

  1. Changes
    - Add hero_card_image setting to site_settings table for the hero section card image
  
  2. Purpose
    - Allow admin to configure the hero section card image (left side image)
    - Provide default value from existing hero section
*/

INSERT INTO site_settings (key, value, category)
VALUES (
  'hero_card_image',
  '"https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg"'::jsonb,
  'images'
)
ON CONFLICT (key) DO NOTHING;
