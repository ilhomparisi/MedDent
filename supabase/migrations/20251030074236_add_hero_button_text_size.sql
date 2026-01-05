/*
  # Add Hero Button Text Size Setting

  1. New Setting
    - `hero_button_text_size` - Controls the font size of the hero CTA button text
  
  2. Implementation
    - Add to site_settings table with default value of 18px
    - Category: texts
    
  3. Notes
    - Default value matches current button text size
    - Will be enforced at application level with min/max limits
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_button_text_size', '18', 'texts', NOW())
ON CONFLICT (key) DO NOTHING;