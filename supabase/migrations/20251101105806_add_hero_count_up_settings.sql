/*
  # Add Hero Count-Up Animation Settings

  1. Changes
    - Add count-up animation configuration to site_settings table
    - Fields include:
      - hero_count_up_enabled: Enable/disable count-up animation
      - hero_count_up_number: Target number to count up to
      - hero_count_up_text: Text to display after the number
      - hero_count_up_duration: Animation duration in milliseconds
      - hero_count_up_text_size: Font size for the count-up text

  2. Default Values
    - Count-up enabled by default
    - Target number: 60 (as shown in the design)
    - Text: "bemorlar ishonchi"
    - Duration: 2000ms (2 seconds)
    - Text size: 18px
*/

-- Insert count-up settings (value is JSONB so we use proper JSON format)
INSERT INTO site_settings (key, value, category) VALUES
  ('hero_count_up_enabled', '"true"', 'hero'),
  ('hero_count_up_number', '60', 'hero'),
  ('hero_count_up_text', '"bemorlar ishonchi"', 'hero'),
  ('hero_count_up_duration', '2000', 'hero'),
  ('hero_count_up_text_size', '18', 'hero')
ON CONFLICT (key) DO NOTHING;