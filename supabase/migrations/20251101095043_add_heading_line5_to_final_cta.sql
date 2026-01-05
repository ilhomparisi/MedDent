/*
  # Add Heading Line 5 to Final CTA Section

  1. Changes
    - Add `heading_line5` text column to `final_cta_section` table
    - Add `heading_line5_size` integer column to `final_cta_section` table
    - Set default size to 42px to match other heading sizes
  
  2. Purpose
    - Allows for an additional heading line between Highlight 2 and the final heading line
    - Provides flexibility in CTA section heading structure
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'heading_line5'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line5 text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'heading_line5_size'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN heading_line5_size integer DEFAULT 42;
  END IF;
END $$;