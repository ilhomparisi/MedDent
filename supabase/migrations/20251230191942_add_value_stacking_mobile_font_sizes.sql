/*
  # Add Mobile Font Size Settings to Value Stacking Section

  1. Changes
    - Add mobile-specific font size columns to value_stacking table:
      - main_heading_size_mobile (default: same as desktop)
      - pay_label_size_mobile (default: same as desktop)
      - price_size_mobile (default: same as desktop)
      - description_size_mobile (default: same as desktop)
      - button_text_size_mobile (default: same as desktop)

  2. Notes
    - These allow independent control of font sizes on mobile devices
    - Defaults match desktop sizes for backward compatibility
*/

DO $$ 
BEGIN
  -- Add main_heading_size_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'value_stacking' AND column_name = 'main_heading_size_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN main_heading_size_mobile integer DEFAULT 48;
  END IF;

  -- Add pay_label_size_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'value_stacking' AND column_name = 'pay_label_size_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN pay_label_size_mobile integer DEFAULT 16;
  END IF;

  -- Add price_size_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'value_stacking' AND column_name = 'price_size_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN price_size_mobile integer DEFAULT 56;
  END IF;

  -- Add description_size_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'value_stacking' AND column_name = 'description_size_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN description_size_mobile integer DEFAULT 18;
  END IF;

  -- Add button_text_size_mobile column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'value_stacking' AND column_name = 'button_text_size_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN button_text_size_mobile integer DEFAULT 16;
  END IF;
END $$;
