/*
  # Fix Section Backgrounds Storage Policies

  1. Changes
    - Drop existing restrictive storage policies that check admin_users
    - Add new policies that work with Supabase Auth
    - Allow authenticated users to upload, update, and delete files
    - Keep public read access

  2. Security
    - Public users can view (SELECT) files
    - Authenticated users can manage (INSERT, UPDATE, DELETE) files
*/

-- Drop existing policies on storage.objects for section-backgrounds bucket
DROP POLICY IF EXISTS "Admins can upload section backgrounds storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update section backgrounds storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete section backgrounds storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view section backgrounds" ON storage.objects;

-- Create new policies for section-backgrounds bucket
CREATE POLICY "Public can view section backgrounds"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'section-backgrounds');

CREATE POLICY "Authenticated users can upload section backgrounds"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'section-backgrounds');

CREATE POLICY "Authenticated users can update section backgrounds"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'section-backgrounds')
  WITH CHECK (bucket_id = 'section-backgrounds');

CREATE POLICY "Authenticated users can delete section backgrounds"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'section-backgrounds');
