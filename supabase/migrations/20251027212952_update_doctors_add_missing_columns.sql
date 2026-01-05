/*
  # Update Doctors Table with Missing Columns

  1. Changes
    - Add `display_order` column for ordering doctors
    - Add `updated_at` column for tracking updates
    - Create indexes for efficient queries
    - Add trigger for auto-updating updated_at

  2. Storage
    - Create doctor-images bucket if not exists
    - Add storage policies for doctor images
*/

-- Add missing columns to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'doctors' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE doctors ADD COLUMN display_order integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'doctors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE doctors ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_doctors_display_order ON doctors(display_order);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Updated at trigger function for doctors
CREATE OR REPLACE FUNCTION update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for doctors updated_at
DROP TRIGGER IF EXISTS trigger_update_doctors_timestamp ON doctors;
CREATE TRIGGER trigger_update_doctors_timestamp
  BEFORE UPDATE ON doctors
  FOR EACH ROW
  EXECUTE FUNCTION update_doctors_updated_at();

-- Create storage bucket for doctor images
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-images', 'doctor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for doctor images
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view doctor images'
  ) THEN
    CREATE POLICY "Public can view doctor images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'doctor-images');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload doctor images'
  ) THEN
    CREATE POLICY "Authenticated users can upload doctor images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'doctor-images');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update doctor images'
  ) THEN
    CREATE POLICY "Authenticated users can update doctor images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'doctor-images')
      WITH CHECK (bucket_id = 'doctor-images');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete doctor images'
  ) THEN
    CREATE POLICY "Authenticated users can delete doctor images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'doctor-images');
  END IF;
END $$;
