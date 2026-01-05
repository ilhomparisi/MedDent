/*
  # Add Hero Section Spacing Controls
  
  1. New Settings
    - `hero_spacing_subtitle_button`: Spacing (in px) between subtitle and button (desktop)
    - `hero_spacing_subtitle_button_mobile`: Spacing (in px) between subtitle and button (mobile)
    - `hero_spacing_button_countup`: Spacing (in px) between button and count-up text (desktop)
    - `hero_spacing_button_countup_mobile`: Spacing (in px) between button and count-up text (mobile)
  
  2. Purpose
    - Allows fine-grained control over hero section vertical spacing between elements
    - Provides separate mobile and desktop configurations
*/

INSERT INTO site_settings (key, value, category) VALUES
  ('hero_spacing_subtitle_button', '32'::jsonb, 'appearance'),
  ('hero_spacing_subtitle_button_mobile', '24'::jsonb, 'appearance'),
  ('hero_spacing_button_countup', '32'::jsonb, 'appearance'),
  ('hero_spacing_button_countup_mobile', '32'::jsonb, 'appearance')
ON CONFLICT (key) DO NOTHING;