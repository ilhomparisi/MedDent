/*
  # Add Pill Content Spacing Controls

  1. Schema Changes
    - Add `pill_spacing_mobile` column to control spacing between blue and red pill on mobile
    - Add `pill_spacing_desktop` column to control spacing between blue and red pill on desktop
    
  2. Default Values
    - Mobile spacing: 32px (equivalent to mt-8)
    - Desktop spacing: 0px (no margin on desktop as they're side by side)
    
  3. Notes
    - Spacing values are stored as integers representing pixel values
    - Mobile applies to screens below lg breakpoint
    - Desktop applies to screens lg and above
*/

DO $$
BEGIN
  -- Add mobile spacing control
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'pill_spacing_mobile'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN pill_spacing_mobile integer DEFAULT 32;
  END IF;

  -- Add desktop spacing control
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pill_sections' AND column_name = 'pill_spacing_desktop'
  ) THEN
    ALTER TABLE pill_sections ADD COLUMN pill_spacing_desktop integer DEFAULT 0;
  END IF;
END $$;