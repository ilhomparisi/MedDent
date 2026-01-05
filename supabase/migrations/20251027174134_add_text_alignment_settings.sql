/*
  # Add Text Alignment Settings

  1. New Settings
    - Adds alignment settings for each section's title and subtitle
    - Values: 'left', 'center', or 'right'
    - Default alignment is 'center' for all sections

  2. Sections with Alignment
    - Hero section (title and subtitle)
    - Services section (title and subtitle)
    - Doctors section (title and subtitle)
    - Reviews section (title and subtitle)
    - About section (title and subtitle)

  3. Purpose
    - Allows admins to customize text alignment per section
    - Provides flexibility for different design preferences
*/

-- Insert alignment settings for all sections
INSERT INTO site_settings (key, value, category, description)
VALUES
  -- Hero section alignments
  ('hero_title_align', '"center"', 'texts', 'Hero title text alignment'),
  ('hero_subtitle_align', '"center"', 'texts', 'Hero subtitle text alignment'),

  -- Services section alignments
  ('services_title_align', '"center"', 'texts', 'Services title text alignment'),
  ('services_subtitle_align', '"center"', 'texts', 'Services subtitle text alignment'),

  -- Doctors section alignments
  ('doctors_title_align', '"center"', 'texts', 'Doctors title text alignment'),
  ('doctors_subtitle_align', '"center"', 'texts', 'Doctors subtitle text alignment'),

  -- Reviews section alignments
  ('reviews_title_align', '"center"', 'texts', 'Reviews title text alignment'),
  ('reviews_subtitle_align', '"center"', 'texts', 'Reviews subtitle text alignment'),

  -- About section alignments
  ('about_title_align', '"center"', 'texts', 'About title text alignment'),
  ('about_subtitle_align', '"center"', 'texts', 'About subtitle text alignment')
ON CONFLICT (key) DO NOTHING;
