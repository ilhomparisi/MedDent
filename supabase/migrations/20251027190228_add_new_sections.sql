/*
  # Add New Sections (Kim Uchun and Patient Results)

  1. New Tables
    - `who_for_items` - Items describing who the services are for
    - `patient_results` - Before/after patient results with images

  2. Security
    - Enable RLS on both tables
    - Public read access for active items
    - Authenticated admin write access

  3. Settings
    - Add section titles and subtitles
    - Add alignment settings

  4. Sample Data
    - Insert example data for both sections
*/

-- Create who_for_items table
CREATE TABLE IF NOT EXISTS who_for_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE who_for_items ENABLE ROW LEVEL SECURITY;

-- Public can read active items
CREATE POLICY "Anyone can view active who_for items"
  ON who_for_items
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage items
CREATE POLICY "Authenticated users can insert who_for items"
  ON who_for_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update who_for items"
  ON who_for_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete who_for items"
  ON who_for_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create patient_results table
CREATE TABLE IF NOT EXISTS patient_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  service_used text DEFAULT '',
  image_url text,
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patient_results ENABLE ROW LEVEL SECURITY;

-- Public can read active results
CREATE POLICY "Anyone can view active patient results"
  ON patient_results
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage results
CREATE POLICY "Authenticated users can insert patient results"
  ON patient_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patient results"
  ON patient_results
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete patient results"
  ON patient_results
  FOR DELETE
  TO authenticated
  USING (true);

-- Add section settings
INSERT INTO site_settings (key, value, category, description)
VALUES
  -- Who For section
  ('who_for_title', '"Kim Uchun"', 'texts', 'Who For section title'),
  ('who_for_subtitle', '"Bizning xizmatlarimiz quyidagilar uchun mos keladi"', 'texts', 'Who For section subtitle'),
  ('who_for_title_align', '"center"', 'texts', 'Who For title alignment'),
  ('who_for_subtitle_align', '"center"', 'texts', 'Who For subtitle alignment'),

  -- Patient Results section
  ('patient_results_title', '"Bemorlarimiz Natijalari"', 'texts', 'Patient Results section title'),
  ('patient_results_subtitle', '"Bizning bemorlarimizning haqiqiy natijalari"', 'texts', 'Patient Results section subtitle'),
  ('patient_results_title_align', '"center"', 'texts', 'Patient Results title alignment'),
  ('patient_results_subtitle_align', '"center"', 'texts', 'Patient Results subtitle alignment')
ON CONFLICT (key) DO NOTHING;

-- Insert sample who_for items
INSERT INTO who_for_items (title, description, display_order, is_active)
VALUES
  ('Yoshlar uchun', 'Yosh avlod uchun og''riqsiz va zamonaviy stomatologik xizmatlar', 1, true),
  ('Kattalar uchun', 'Kattalar uchun professional va sifatli tish parvarishi', 2, true),
  ('Oilalar uchun', 'Butun oila uchun qulay va hamyonbop xizmatlar', 3, true),
  ('Keksalar uchun', 'Keksa yoshdagilar uchun maxsus g''amxo''rlik va yordam', 4, true),
  ('Ishbilarmonlar uchun', 'Band odamlar uchun tez va samarali xizmatlar', 5, true),
  ('Sportchilar uchun', 'Sportchilar uchun maxsus stomatologik himoya va xizmatlar', 6, true)
ON CONFLICT DO NOTHING;

-- Insert sample patient results (you can add real image URLs later)
INSERT INTO patient_results (patient_name, service_used, description, display_order, is_active)
VALUES
  ('Bemor A.', 'Tish oqartirish', 'Professional tish oqartirish xizmati natijasida ajoyib natijaga erishdik', 1, true),
  ('Bemor B.', 'Ortodontik davolash', 'Breket tizimi yordamida mukammal tabassumga erishdik', 2, true),
  ('Bemor C.', 'Implantatsiya', 'Yuqori sifatli implantlar o''rnatildi', 3, true),
  ('Bemor D.', 'Vinir', 'Keramik vinirlar yordamida go''zal tabassum yaratdik', 4, true)
ON CONFLICT DO NOTHING;
