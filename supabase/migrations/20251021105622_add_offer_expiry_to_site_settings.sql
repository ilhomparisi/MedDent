/*
  # Add Offer Expiry Settings

  1. Updates
    - Add offer expiry date setting to site_settings table
    - Add hero background image setting
    - Add font family settings
*/

INSERT INTO site_settings (key, value, category) VALUES
('offer_expiry_date', '"2025-12-31T23:59:59"', 'promotion'),
('offer_enabled', 'true', 'promotion'),
('hero_background_image', '"https://images.pexels.com/photos/3779709/pexels-photo-3779709.jpeg"', 'images'),
('hero_background_opacity', '0.3', 'images'),
('primary_font', '"Inter, sans-serif"', 'typography'),
('heading_font', '"Inter, sans-serif"', 'typography')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
