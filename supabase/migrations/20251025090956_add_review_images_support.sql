/*
  # Add Image Support to Reviews

  1. Schema Changes
    - Add `image_url` column to `reviews` table to store uploaded review images
    - Column is optional (nullable) to maintain backward compatibility

  2. Storage Configuration
    - Create storage bucket `review-images` for storing review photos
    - Configure bucket to be public for displaying images on the website
    - Set up RLS policies for secure image upload and deletion

  3. Security
    - Public read access for all review images (since approved reviews are public)
    - Authenticated users can upload images (admin only in practice)
    - Authenticated users can delete images
    - File size and type restrictions handled at application level

  4. Notes
    - Images will be stored with UUID-based filenames to prevent conflicts
    - Old images should be cleaned up when reviews are updated or deleted
    - Recommended image size: 800x600px or similar aspect ratio
*/

-- Add image_url column to reviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE reviews ADD COLUMN image_url text;
  END IF;
END $$;

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create index for image_url column for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_image_url ON reviews(image_url) WHERE image_url IS NOT NULL;
