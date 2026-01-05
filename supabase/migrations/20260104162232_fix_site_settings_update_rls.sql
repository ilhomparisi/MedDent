/*
  # Fix Site Settings Update RLS Policy

  ## Overview
  This migration fixes the RLS policies for the site_settings table by replacing
  the catch-all `FOR ALL` policy with separate policies for INSERT, UPDATE, and DELETE.

  ## Changes
  1. Drop existing catch-all policy
  2. Create separate policies for INSERT, UPDATE, and DELETE operations
  
  ## Security
  - INSERT: Only authenticated users can insert new settings
  - UPDATE: Only authenticated users can update existing settings
  - DELETE: Only authenticated users can delete settings
*/

-- Drop the existing catch-all policy if it exists
DROP POLICY IF EXISTS "Only authenticated users can modify site_settings" ON site_settings;

-- Create separate policies for INSERT
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'Authenticated users can insert site_settings'
  ) THEN
    CREATE POLICY "Authenticated users can insert site_settings"
      ON site_settings FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Create separate policies for UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'Authenticated users can update site_settings'
  ) THEN
    CREATE POLICY "Authenticated users can update site_settings"
      ON site_settings FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create separate policies for DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'site_settings' 
    AND policyname = 'Authenticated users can delete site_settings'
  ) THEN
    CREATE POLICY "Authenticated users can delete site_settings"
      ON site_settings FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;
