/*
  # Create Pill Sections Table for Matrix-themed Choice Sections

  1. New Tables
    - `pill_sections`
      - `id` (uuid, primary key) - Unique identifier
      - `section_type` (text) - Either 'white' or 'black' background variant
      - `main_heading` (text) - Main title text
      - `subheading` (text) - Subtitle/description text
      - `blue_pill_title` (text) - Title for blue pill option
      - `blue_pill_description` (text) - Description for blue pill
      - `blue_pill_details` (text) - Additional details for blue pill
      - `red_pill_title` (text) - Title for red pill option
      - `red_pill_description` (text) - Description for red pill
      - `red_pill_details` (text) - Additional details for red pill
      - `button_text` (text) - Call-to-action button text
      - `heading_align` (text) - Text alignment for heading (left, center, right)
      - `subheading_align` (text) - Text alignment for subheading
      - `is_active` (boolean) - Whether section is displayed
      - `display_order` (integer) - Order of display
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `pill_sections` table
    - Add policy for public read access (unauthenticated users can view active sections)
    - Add policy for authenticated users to manage sections (admin panel)

  3. Initial Data
    - Insert default content for white background section
    - Insert default content for black background section
*/

CREATE TABLE IF NOT EXISTS pill_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type text NOT NULL CHECK (section_type IN ('white', 'black')),
  main_heading text NOT NULL DEFAULT '',
  subheading text NOT NULL DEFAULT '',
  blue_pill_title text NOT NULL DEFAULT '',
  blue_pill_description text NOT NULL DEFAULT '',
  blue_pill_details text NOT NULL DEFAULT '',
  red_pill_title text NOT NULL DEFAULT '',
  red_pill_description text NOT NULL DEFAULT '',
  red_pill_details text NOT NULL DEFAULT '',
  button_text text NOT NULL DEFAULT 'Ro''yxatdan o''tish',
  heading_align text NOT NULL DEFAULT 'center' CHECK (heading_align IN ('left', 'center', 'right')),
  subheading_align text NOT NULL DEFAULT 'center' CHECK (subheading_align IN ('left', 'center', 'right')),
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pill_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pill sections"
  ON pill_sections
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all pill sections"
  ON pill_sections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pill sections"
  ON pill_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pill sections"
  ON pill_sections
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pill sections"
  ON pill_sections
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default content for white background section
INSERT INTO pill_sections (
  section_type,
  main_heading,
  subheading,
  blue_pill_title,
  blue_pill_description,
  blue_pill_details,
  red_pill_title,
  red_pill_description,
  red_pill_details,
  button_text,
  heading_align,
  subheading_align,
  display_order
) VALUES (
  'white',
  'Sahifani yopishdan oldin...',
  'Sizning oldingizda 2 ta yo''l bor:',
  'Ko''k tabletka',
  'Hayotingizni oldingidek qoldirasiz va organishni qiyinchilik bilan davom etasiz.',
  'Ko''k tabletkani tanlang - hammasi oldingidek qoladi, uyg''onasiz va oldin ishongan haqiqatingizga ishonishda davom etasiz.',
  'Qizil tabletka',
  'Kursni boshlaysiz va tushunasizki: ingliz tilini tõg''ri usulda õrganish juda oson',
  'Qizil tabletkani tanlang va sizga ingliz tilini o''rganish qanchalik oson ekanini kõrsataman.',
  'Ro''yxatdan o''tish',
  'left',
  'right',
  1
);

-- Insert default content for black background section
INSERT INTO pill_sections (
  section_type,
  main_heading,
  subheading,
  blue_pill_title,
  blue_pill_description,
  blue_pill_details,
  red_pill_title,
  red_pill_description,
  red_pill_details,
  button_text,
  heading_align,
  subheading_align,
  display_order
) VALUES (
  'black',
  'Sahifani yopishdan oldin...',
  'Sizning oldingizda 2 ta yo''l bor:',
  'Ko''k tabletka',
  'Hayotingizni oldingidek qoldirasiz va organishni qiyinchilik bilan davom etasiz.',
  'Ko''k tabletkani tanlang - hammasi oldingidek qoladi, uyg''onasiz va oldin ishongan haqiqatingizga ishonishda davom etasiz.',
  'Qizil tabletka',
  'Kursni boshlaysiz va tushunasizki: ingliz tilini tõg''ri usulda õrganish juda oson',
  'Qizil tabletkani tanlang va sizga ingliz tilini o''rganish qanchalik oson ekanini kõrsataman.',
  'Ro''yxatdan o''tish',
  'left',
  'right',
  2
);
