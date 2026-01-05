/*
  # Enhance Section Backgrounds Configuration

  1. Schema Updates
    - Add `background_type` column (color, image, video, gradient)
    - Add `background_value` column for color/gradient values
    - Add `background_overlay_color` column
    - Add `background_overlay_opacity` column (rename from opacity)
    - Add `background_position` column
    - Add `background_size` column
    - Add `background_repeat` column
    - Add `background_attachment` column
    - Add `video_loop` column
    - Add `video_muted` column
    - Add `video_autoplay` column
    - Add `enabled` column
    - Add `created_at` column

  2. Data Migration
    - Preserve existing data
    - Set defaults for new columns

  3. Default Sections
    - Add all main sections if they don't exist
*/

-- Add new columns to section_backgrounds table
DO $$
BEGIN
  -- Add background_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_type'
  ) THEN
    ALTER TABLE section_backgrounds 
    ADD COLUMN background_type text DEFAULT 'color' 
    CHECK (background_type IN ('color', 'image', 'video', 'gradient'));
  END IF;

  -- Add background_value column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_value'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_value text DEFAULT '#ffffff';
  END IF;

  -- Add background_overlay_color column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_overlay_color'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_overlay_color text DEFAULT '#000000';
  END IF;

  -- Rename opacity to background_overlay_opacity if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'opacity'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_overlay_opacity'
  ) THEN
    ALTER TABLE section_backgrounds RENAME COLUMN opacity TO background_overlay_opacity;
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_overlay_opacity'
  ) THEN
    ALTER TABLE section_backgrounds 
    ADD COLUMN background_overlay_opacity numeric DEFAULT 0 
    CHECK (background_overlay_opacity >= 0 AND background_overlay_opacity <= 1);
  END IF;

  -- Add background_position column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_position'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_position text DEFAULT 'center';
  END IF;

  -- Add background_size column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_size'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_size text DEFAULT 'cover';
  END IF;

  -- Add background_repeat column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_repeat'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_repeat text DEFAULT 'no-repeat';
  END IF;

  -- Add background_attachment column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'background_attachment'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN background_attachment text DEFAULT 'scroll';
  END IF;

  -- Add video_loop column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'video_loop'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN video_loop boolean DEFAULT true;
  END IF;

  -- Add video_muted column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'video_muted'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN video_muted boolean DEFAULT true;
  END IF;

  -- Add video_autoplay column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'video_autoplay'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN video_autoplay boolean DEFAULT true;
  END IF;

  -- Add enabled column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'enabled'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN enabled boolean DEFAULT false;
  END IF;

  -- Add created_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'section_backgrounds' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE section_backgrounds ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Update existing rows with image_url to set background_type = 'image'
UPDATE section_backgrounds 
SET background_type = 'image' 
WHERE image_url IS NOT NULL AND image_url != '' AND background_type = 'color';

-- Create storage bucket for section backgrounds if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('section-backgrounds', 'section-backgrounds', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for section backgrounds
DO $$
BEGIN
  -- Public view policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public can view section backgrounds'
  ) THEN
    CREATE POLICY "Public can view section backgrounds"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'section-backgrounds');
  END IF;

  -- Admin upload policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Admins can upload section backgrounds storage'
  ) THEN
    CREATE POLICY "Admins can upload section backgrounds storage"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'section-backgrounds' AND
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;

  -- Admin update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Admins can update section backgrounds storage'
  ) THEN
    CREATE POLICY "Admins can update section backgrounds storage"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'section-backgrounds' AND
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;

  -- Admin delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Admins can delete section backgrounds storage'
  ) THEN
    CREATE POLICY "Admins can delete section backgrounds storage"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'section-backgrounds' AND
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;
END $$;

-- Insert default configurations for all main sections if they don't exist
INSERT INTO section_backgrounds (section_name, background_type, background_value, enabled) VALUES
  ('hero', 'color', '#ffffff', false),
  ('services', 'color', '#ffffff', false),
  ('doctors', 'color', '#f9fafb', false),
  ('reviews', 'color', '#ffffff', false),
  ('about', 'color', '#f9fafb', false),
  ('results', 'color', '#000000', false),
  ('kim_uchun', 'color', '#ffffff', false),
  ('pill_choice', 'color', '#f9fafb', false),
  ('faq', 'color', '#ffffff', false),
  ('value_stacking', 'color', '#f9fafb', false),
  ('final_cta', 'color', '#000000', false)
ON CONFLICT (section_name) DO NOTHING;
