/*
  # Add display order to reviews

  1. Changes
    - Add `display_order` column to reviews table
    - Set initial order values based on created_at (oldest first)
    - Add default value for new reviews
    - Update query ordering to use display_order

  2. Notes
    - Lower display_order numbers appear first
    - Allows admin to manually reorder reviews
    - Preserves existing reviews with automatic ordering
*/

-- Add display_order column with default
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Set initial order based on created_at (oldest reviews get lower numbers = appear first)
DO $$
DECLARE
  review_record RECORD;
  counter INTEGER := 1;
BEGIN
  FOR review_record IN 
    SELECT id FROM reviews ORDER BY created_at ASC
  LOOP
    UPDATE reviews 
    SET display_order = counter 
    WHERE id = review_record.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Create index for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_reviews_display_order ON reviews(display_order);
