/*
  # Fix Section Backgrounds RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that work with Supabase Auth
    - Allow authenticated users to insert, update, and delete
    - Keep public read access

  2. Security
    - Public users can view (SELECT) section backgrounds
    - Authenticated users can manage (INSERT, UPDATE, DELETE) section backgrounds
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert section backgrounds" ON section_backgrounds;
DROP POLICY IF EXISTS "Admins can update section backgrounds" ON section_backgrounds;
DROP POLICY IF EXISTS "Admins can delete section backgrounds" ON section_backgrounds;
DROP POLICY IF EXISTS "Anyone can view section backgrounds" ON section_backgrounds;
DROP POLICY IF EXISTS "Only authenticated users can modify section_backgrounds" ON section_backgrounds;

-- Create new policies
CREATE POLICY "Public can view section backgrounds"
  ON section_backgrounds
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert section backgrounds"
  ON section_backgrounds
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update section backgrounds"
  ON section_backgrounds
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete section backgrounds"
  ON section_backgrounds
  FOR DELETE
  TO authenticated
  USING (true);
