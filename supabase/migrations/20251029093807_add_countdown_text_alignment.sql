/*
  # Add Countdown Text Alignment Setting

  1. Changes
    - Add countdown_expiry_text_align setting to site_settings table
    - Default value is 'center' for centered alignment
    - Supports 'left', 'center', and 'right' alignment options

  2. Security
    - No changes to RLS policies needed
*/

-- Add countdown text alignment setting
INSERT INTO site_settings (key, value, category)
VALUES ('countdown_expiry_text_align', '"center"'::jsonb, 'text_settings')
ON CONFLICT (key) DO NOTHING;
