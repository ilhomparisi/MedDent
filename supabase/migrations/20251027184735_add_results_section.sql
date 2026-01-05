/*
  # Add Results Section

  1. New Tables
    - `results`
      - `id` (uuid, primary key)
      - `title` (text) - The title of the result metric
      - `value` (text) - The value/number to display
      - `description` (text) - Description of the result
      - `display_order` (integer) - Order in which to display
      - `is_active` (boolean) - Whether to show this result
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `results` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Settings
    - Add results section title and subtitle settings
    - Add text alignment settings for results section

  4. Sample Data
    - Insert example results for demonstration
*/

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  value text NOT NULL,
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Public can read active results
CREATE POLICY "Anyone can view active results"
  ON results
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage results
CREATE POLICY "Authenticated users can insert results"
  ON results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update results"
  ON results
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete results"
  ON results
  FOR DELETE
  TO authenticated
  USING (true);

-- Add results section settings
INSERT INTO site_settings (key, value, category, description)
VALUES
  ('results_title', '"Bizning Natijalar"', 'texts', 'Results section title'),
  ('results_subtitle', '"Raqamlar orqali bizning muvaffaqiyatlarimiz"', 'texts', 'Results section subtitle'),
  ('results_title_align', '"center"', 'texts', 'Results title alignment'),
  ('results_subtitle_align', '"center"', 'texts', 'Results subtitle alignment')
ON CONFLICT (key) DO NOTHING;

-- Insert sample results
INSERT INTO results (title, value, description, display_order, is_active)
VALUES
  ('Baxtli Bemorlar', '5000+', 'Bizning xizmatlarimizdan foydalangan bemorlar', 1, true),
  ('Tajriba', '15+', 'Yillik professional tajriba', 2, true),
  ('Muvaffaqiyatli Davolash', '98%', 'Davolash samaradorligi', 3, true),
  ('Zamonaviy Uskunalar', '100%', 'Eng yangi texnologiyalar', 4, true)
ON CONFLICT DO NOTHING;
