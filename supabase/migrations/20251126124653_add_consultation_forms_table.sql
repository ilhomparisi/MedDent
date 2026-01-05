/*
  # Create consultation forms table

  1. New Tables
    - `consultation_forms`
      - `id` (uuid, primary key) - Unique identifier for each form submission
      - `full_name` (text) - Full name of the person
      - `phone` (text) - Phone number
      - `lives_in_tashkent` (text) - Whether they live in Tashkent (Ha/Yo'q)
      - `last_dentist_visit` (text) - When they last visited a dentist
      - `current_problems` (text) - Current dental problems they're experiencing
      - `previous_clinic_experience` (text) - Experience with previous clinics
      - `missing_teeth` (text) - Information about missing teeth
      - `preferred_call_time` (text) - Preferred time for phone call (09:00-18:00)
      - `created_at` (timestamptz) - When the form was submitted
      
  2. Security
    - Enable RLS on `consultation_forms` table
    - Add policy for inserting forms (public access for form submission)
    - Add policy for authenticated admin users to read all forms
*/

CREATE TABLE IF NOT EXISTS consultation_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  lives_in_tashkent text,
  last_dentist_visit text,
  current_problems text,
  previous_clinic_experience text,
  missing_teeth text,
  preferred_call_time text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE consultation_forms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a consultation form
CREATE POLICY "Anyone can submit consultation form"
  ON consultation_forms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to view all consultation forms
CREATE POLICY "Authenticated users can view all forms"
  ON consultation_forms
  FOR SELECT
  TO authenticated
  USING (true);
