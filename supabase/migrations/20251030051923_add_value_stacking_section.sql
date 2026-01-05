/*
  # Add Value Stacking Section

  1. New Tables
    - `value_stacking`
      - `id` (uuid, primary key)
      - `main_heading` (text) - Main section heading
      - `left_pay_label` (text) - Label for left side "PAY"
      - `left_price` (text) - Price on left side
      - `left_description` (text) - Description for left option
      - `left_button_text` (text) - Button text for left option
      - `right_pay_label` (text) - Label for right side "PAY"
      - `right_price` (text) - Price on right side
      - `right_description` (text) - Description for right option
      - `right_button_text` (text) - Button text for right option
      - `vs_text` (text) - Text for the "VS" badge
      - `is_active` (boolean) - Whether section is visible
      - `main_heading_size` (integer) - Font size for main heading
      - `pay_label_size` (integer) - Font size for PAY labels
      - `price_size` (integer) - Font size for prices
      - `description_size` (integer) - Font size for descriptions
      - `button_text_size` (integer) - Font size for button text
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `value_stacking` table
    - Add policy for public read access
    - Add policy for authenticated admin update access
*/

CREATE TABLE IF NOT EXISTS value_stacking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_heading text DEFAULT 'IKKI YO''L, BITTA TANLOV',
  left_pay_label text DEFAULT 'TO''LANG',
  left_price text DEFAULT '700,000+',
  left_description text DEFAULT 'An''anaviy tish muolajasiga yillar va minglab so''mlar sarflang, faqat o''zingizni shunga o''xshash ko''plab boshqalar orasida topish uchun.',
  left_button_text text DEFAULT 'XUDDI SHUNDAY NATIJAGA YOPISHISH',
  right_pay_label text DEFAULT 'TO''LANG',
  right_price text DEFAULT '0 so''m',
  right_description text DEFAULT 'Hozir ishlayotgan ilg''or onlayn strategiyalarga zudlik bilan kirish huquqiga ega bo''ling. O''zingizni eng so''nggi amaliy tushunchalar va real hayotiy taktikalar bilan jihozlang.',
  right_button_text text DEFAULT 'HOZIROQ KIRISH HUQUQINI BERING',
  vs_text text DEFAULT 'VS',
  is_active boolean DEFAULT true,
  main_heading_size integer DEFAULT 48,
  pay_label_size integer DEFAULT 16,
  price_size integer DEFAULT 56,
  description_size integer DEFAULT 18,
  button_text_size integer DEFAULT 16,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE value_stacking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view value stacking"
  ON value_stacking
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update value stacking"
  ON value_stacking
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert value stacking"
  ON value_stacking
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete value stacking"
  ON value_stacking
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO value_stacking (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
