/*
  # Create FAQ Section Table

  1. New Tables
    - `faq_items`
      - `id` (uuid, primary key) - Unique identifier
      - `question` (text) - FAQ question text
      - `answer` (text) - FAQ answer text
      - `is_active` (boolean) - Whether FAQ item is displayed
      - `display_order` (integer) - Order of display
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `faq_items` table
    - Add policy for public read access to active FAQ items
    - Add policies for authenticated users to manage FAQ items (admin panel)

  3. Initial Data
    - Insert sample FAQ items with common questions
*/

CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active FAQ items"
  ON faq_items
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all FAQ items"
  ON faq_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert FAQ items"
  ON faq_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQ items"
  ON faq_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQ items"
  ON faq_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, display_order) VALUES
('Qanday qilib ro''yxatdan o''taman?', 'Sahifadagi "Ro''yxatdan o''tish" tugmasini bosing va oddiy formani to''ldiring. Siz bilan bog''lanamiz.', 1),
('Kurs qancha davom etadi?', 'Kurs davomiyligi sizning tanlagan dasturingizga bog''liq, odatda 3 oydan 12 oygacha.', 2),
('Narxlar qancha?', 'Narxlar turli dasturlar uchun turlicha. Batafsil ma''lumot uchun biz bilan bog''laning.', 3),
('Online yoki offline darslar bormi?', 'Biz ikkalasini ham taklif qilamiz - online va offline darslar. Sizga qulay bo''lgan variantni tanlashingiz mumkin.', 4);
