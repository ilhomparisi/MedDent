/*
  # Add button size configuration to pill sections

  1. Changes
    - Add `button_padding_x` column for horizontal padding (px)
    - Add `button_padding_y` column for vertical padding (px)
    - Add `button_max_width` column for maximum button width (px)
  
  2. Notes
    - Default values set for existing records
    - button_padding_x: 48px (equivalent to px-12 in Tailwind)
    - button_padding_y: 16px (equivalent to py-4 in Tailwind)
    - button_max_width: 320px (equivalent to max-w-xs in Tailwind)
*/

-- Add button size configuration columns
ALTER TABLE pill_sections 
ADD COLUMN IF NOT EXISTS button_padding_x INTEGER DEFAULT 48,
ADD COLUMN IF NOT EXISTS button_padding_y INTEGER DEFAULT 16,
ADD COLUMN IF NOT EXISTS button_max_width INTEGER DEFAULT 320;

-- Update existing records with default values
UPDATE pill_sections 
SET 
  button_padding_x = 48,
  button_padding_y = 16,
  button_max_width = 320
WHERE button_padding_x IS NULL 
  OR button_padding_y IS NULL 
  OR button_max_width IS NULL;