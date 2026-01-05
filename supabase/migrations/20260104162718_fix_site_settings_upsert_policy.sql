/*
  # Fix Site Settings Upsert RLS Policy

  ## Overview
  This migration ensures RLS policies allow upsert operations properly.
  
  ## Changes
  - Ensure INSERT policy allows upserting new rows
  - Ensure UPDATE policy allows updating existing rows
  - Both policies allow authenticated users to perform these operations
*/

-- Drop existing policies that may interfere
DROP POLICY IF EXISTS "Authenticated users can insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can delete site_settings" ON site_settings;

-- Create simplified policies that allow upsert operations
CREATE POLICY "Allow authenticated users to insert site_settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site_settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete site_settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);
