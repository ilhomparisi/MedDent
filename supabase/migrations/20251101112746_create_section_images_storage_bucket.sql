/*
  # Create Section Images Storage Bucket

  1. New Storage Bucket
    - Create `section-images` bucket for storing section background images
    - Set as public bucket for easy access
    - Configure file size limit to 5MB

  2. Security
    - Allow authenticated users (admins) to upload images
    - Allow public read access to images
*/

-- Create the section-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'section-images',
  'section-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete section images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for section images" ON storage.objects;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload section images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'section-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update section images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'section-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete section images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'section-images');

-- Allow public read access to all images
CREATE POLICY "Public read access for section images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'section-images');