/*
  # Add Final CTA Section

  1. New Tables
    - `final_cta_section`
      - `id` (uuid, primary key)
      - `is_active` (boolean) - Whether the section is displayed
      - `heading_line1` (text) - First part of heading (e.g., "SIGN UP")
      - `heading_highlight1` (text) - Highlighted text (e.g., "TODAY")
      - `heading_line2` (text) - Second part of heading (e.g., "TO TAKE YOUR FIRST STEPS")
      - `heading_line3` (text) - Third line (e.g., "TOWARDS A NEW LIFE")
      - `heading_highlight2` (text) - Second highlighted text (e.g., "TOMORROW")
      - `description` (text) - Main description text
      - `button_text` (text) - CTA button text
      - `button_subtext` (text) - Text below button
      - `heading_line1_size` (integer) - Font size for heading line 1
      - `heading_highlight1_size` (integer) - Font size for first highlight
      - `heading_line2_size` (integer) - Font size for heading line 2
      - `heading_line3_size` (integer) - Font size for heading line 3
      - `heading_highlight2_size` (integer) - Font size for second highlight
      - `description_size` (integer) - Font size for description
      - `button_text_size` (integer) - Font size for button text
      - `button_subtext_size` (integer) - Font size for button subtext
      - `heading_alignment` (text) - Text alignment for heading
      - `description_alignment` (text) - Text alignment for description
      - `button_alignment` (text) - Button alignment
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `final_cta_section` table
    - Add policy for public read access
    - Add policy for authenticated admin updates
*/

CREATE TABLE IF NOT EXISTS final_cta_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean DEFAULT true,
  heading_line1 text DEFAULT 'SIGN UP',
  heading_highlight1 text DEFAULT 'TODAY',
  heading_line2 text DEFAULT 'TO TAKE YOUR FIRST STEPS',
  heading_line3 text DEFAULT 'TOWARDS A NEW LIFE',
  heading_highlight2 text DEFAULT 'TOMORROW',
  description text DEFAULT 'Don''t wait to start building the life you''ve always dreamed of. With our service, you''ll gain the skills, support, and resources needed to transform your future.',
  button_text text DEFAULT 'YES! GIVE ME ACCESS NOW',
  button_subtext text DEFAULT 'Secure your access today and start your journey.',
  heading_line1_size integer DEFAULT 72,
  heading_highlight1_size integer DEFAULT 72,
  heading_line2_size integer DEFAULT 72,
  heading_line3_size integer DEFAULT 72,
  heading_highlight2_size integer DEFAULT 72,
  description_size integer DEFAULT 20,
  button_text_size integer DEFAULT 24,
  button_subtext_size integer DEFAULT 16,
  heading_alignment text DEFAULT 'center',
  description_alignment text DEFAULT 'center',
  button_alignment text DEFAULT 'center',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE final_cta_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view final CTA section"
  ON final_cta_section
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update final CTA section"
  ON final_cta_section
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert final CTA section"
  ON final_cta_section
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default data
INSERT INTO final_cta_section (
  heading_line1,
  heading_highlight1,
  heading_line2,
  heading_line3,
  heading_highlight2,
  description,
  button_text,
  button_subtext
) VALUES (
  'SIGN UP',
  'TODAY',
  'TO TAKE YOUR FIRST STEPS',
  'TOWARDS A NEW LIFE',
  'TOMORROW',
  'Don''t wait to start building the life you''ve always dreamed of. With our service, you''ll gain the skills, support, and resources needed to transform your future.',
  'YES! GIVE ME ACCESS NOW',
  'Secure your access today and start your journey.'
);