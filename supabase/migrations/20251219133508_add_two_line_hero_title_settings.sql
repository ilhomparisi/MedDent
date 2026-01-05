/*
  # Add Two-Line Hero Title Settings

  1. Changes
    - Add hero_title_line1 setting for first line of title (default: "BEPUL PROFESSIONAL")
    - Add hero_title_line2 setting for second line of title (default: "TISH CHISTKASI")
    - Add hero_title_line1_size setting for first line size (default: 48px)
    - Add hero_title_line2_size setting for second line size (default: 64px)
  
  2. Purpose
    - Allow admin to split hero title into two lines
    - Enable different font sizes for each line for better visual hierarchy
    - Provide separate control over each line's content and appearance
*/

INSERT INTO site_settings (key, value, category, updated_at)
VALUES 
  ('hero_title_line1', '"BEPUL PROFESSIONAL"'::jsonb, 'texts', NOW()),
  ('hero_title_line2', '"TISH CHISTKASI"'::jsonb, 'texts', NOW()),
  ('hero_title_line1_size', '"48"'::jsonb, 'texts', NOW()),
  ('hero_title_line2_size', '"64"'::jsonb, 'texts', NOW())
ON CONFLICT (key) DO NOTHING;
