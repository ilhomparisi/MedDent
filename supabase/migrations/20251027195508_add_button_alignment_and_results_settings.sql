/*
  # Add Button Alignment and Results Section Settings

  1. New Settings
    - Adds button alignment setting for hero section
    - Adds title and subtitle alignment settings for results section
    - Values: 'left', 'center', or 'right'
    - Default alignment is 'center' for all settings

  2. Settings Added
    - `hero_button_align` - Controls alignment of hero CTA buttons
    - `results_title_align` - Controls alignment of results section title
    - `results_subtitle_align` - Controls alignment of results section subtitle

  3. Purpose
    - Allows admins to customize button alignment in hero section
    - Provides consistent alignment control across hero elements (badge, title, subtitle, buttons)
    - Enables alignment customization for results section headers
*/

-- Insert button alignment and results section settings
INSERT INTO site_settings (key, value, category)
VALUES
  -- Hero button alignment
  ('hero_button_align', '"center"', 'texts'),

  -- Results section alignments
  ('results_title_align', '"center"', 'texts'),
  ('results_subtitle_align', '"center"', 'texts')
ON CONFLICT (key) DO NOTHING;