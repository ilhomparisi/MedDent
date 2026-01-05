/*
  # Add Font Family Setting
  
  1. Changes
    - Add font_family setting to site_settings table for global font customization
    - Default font set to 'Inter' which is a modern, professional sans-serif font
  
  2. Settings Added
    - font_family: Global font family for the entire website
*/

-- Add font_family setting
INSERT INTO site_settings (key, value, category)
VALUES (
  'font_family',
  '"Inter, system-ui, -apple-system, sans-serif"'::jsonb,
  'typography'
)
ON CONFLICT (key) DO NOTHING;