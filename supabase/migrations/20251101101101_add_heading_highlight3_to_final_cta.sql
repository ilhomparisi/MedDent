/*
  # Add Heading Highlight 3 to Final CTA Section

  1. Changes
    - Add `heading_highlight3` text column to `final_cta_section` table
    - Add `heading_highlight3_size` integer column to `final_cta_section` table
    - Set default size to 42px to match other heading sizes
  
  2. Purpose
    - Allows for a third blue highlight word in the Final CTA section heading
    - Enables highlighting specific words like "boshlansin" in blue color
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight3'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight3 text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'heading_highlight3_size'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_highlight3_size integer DEFAULT 42;
  END IF;
END $$;
