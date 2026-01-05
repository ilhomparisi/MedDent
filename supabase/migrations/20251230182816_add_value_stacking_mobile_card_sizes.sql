/*
  # Add Mobile Card Size Settings for Value Stacking

  1. Changes
    - Add `left_card_scale_mobile` column (default 100) for left card size on mobile devices
    - Add `right_card_scale_mobile` column (default 100) for right card size on mobile devices
  
  2. Purpose
    - Allow separate control of card sizes for mobile vs desktop
    - Desktop uses existing `left_card_scale` and `right_card_scale` columns
    - Mobile uses new `left_card_scale_mobile` and `right_card_scale_mobile` columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'left_card_scale_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN left_card_scale_mobile integer DEFAULT 100;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'right_card_scale_mobile'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN right_card_scale_mobile integer DEFAULT 100;
  END IF;
END $$;