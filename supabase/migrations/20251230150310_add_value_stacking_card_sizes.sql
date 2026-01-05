/*
  # Add Card Size Settings to Value Stacking

  1. Changes
    - Add `left_card_scale` column to value_stacking table (default 100)
    - Add `right_card_scale` column to value_stacking table (default 100)
    
  2. Purpose
    - Allow individual control of left and right card sizes
    - Values represent percentage scale (100 = normal size, 120 = 20% larger, 80 = 20% smaller)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'left_card_scale'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN left_card_scale integer DEFAULT 100;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'value_stacking' AND column_name = 'right_card_scale'
  ) THEN
    ALTER TABLE value_stacking ADD COLUMN right_card_scale integer DEFAULT 100;
  END IF;
END $$;