/*
  # Add Mobile Button Font Sizes to Final CTA Section

  1. Schema Changes
    - Add `button_text_size_mobile` column for mobile button text font size
    - Add `button_subtext_size_mobile` column for mobile button subtext font size
    
  2. Default Values
    - Mobile button text size: 18px
    - Mobile button subtext size: 13px
    
  3. Notes
    - Mobile applies to screens below md breakpoint
    - Desktop uses existing button_text_size and button_subtext_size
*/

DO $$
BEGIN
  -- Add mobile button text size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'button_text_size_mobile'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN button_text_size_mobile integer DEFAULT 18;
  END IF;

  -- Add mobile button subtext size
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'final_cta_section' AND column_name = 'button_subtext_size_mobile'
  ) THEN
    ALTER TABLE final_cta_section ADD COLUMN button_subtext_size_mobile integer DEFAULT 13;
  END IF;
END $$;