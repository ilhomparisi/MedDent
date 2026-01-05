/*
  # Add Hero Image Size Settings

  1. New Settings
    - `hero_image_outer_width` - Width of the outer oval frame (default: 236px)
    - `hero_image_outer_height` - Height of the outer oval frame (default: 436px)
    
  2. Purpose
    - Allow admin to control the hero section image dimensions
    - Inner dimensions are calculated automatically (outer - 48px)
    - Settings stored in site_settings table with category 'appearance'
    
  3. Notes
    - Width range: 150px to 500px
    - Height range: 300px to 700px
    - Default values match current hardcoded dimensions
*/

-- Insert default hero image size settings if they don't exist
INSERT INTO site_settings (key, value, category)
VALUES 
  ('hero_image_outer_width', '236', 'appearance'),
  ('hero_image_outer_height', '436', 'appearance')
ON CONFLICT (key) DO NOTHING;
