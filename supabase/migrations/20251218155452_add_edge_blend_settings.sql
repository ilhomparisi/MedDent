/*
  # Add Edge Blend Settings for Video/Image Backgrounds

  This migration adds settings to control edge blending effects for background videos and images,
  creating smooth transitions between the background and media elements.

  1. Changes to site_settings table
    - `edge_blend_enabled` (boolean, default: false) - Enable/disable edge blending
    - `edge_blend_width` (integer, default: 100) - Width of the blend effect in pixels (0-300)
    - `edge_blend_side` (text, default: 'left') - Which side to apply blend: 'left', 'right', or 'both'

  2. Notes
    - Edge blending creates a gradient overlay that transitions from the background color to transparent
    - This eliminates harsh cuts between backgrounds and positioned media elements
    - The effect is particularly useful when videos/images are aligned to one side
*/

-- Add edge blend settings columns to site_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'edge_blend_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN edge_blend_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'edge_blend_width'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN edge_blend_width integer DEFAULT 100 CHECK (edge_blend_width >= 0 AND edge_blend_width <= 300);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'edge_blend_side'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN edge_blend_side text DEFAULT 'left' CHECK (edge_blend_side IN ('left', 'right', 'both'));
  END IF;
END $$;