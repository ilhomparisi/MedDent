/*
  # Add Mobile Font Size Settings for Pill Sections

  1. Changes
    - Add mobile-specific font size columns for pill sections
    - Allows separate control of text sizes for mobile and desktop devices

  2. New Columns
    - `main_heading_size_mobile` - Main heading size for mobile (default: 24px)
    - `subheading_size_mobile` - Subheading size for mobile (default: 14px)
    - `blue_pill_title_size_mobile` - Blue pill title size for mobile (default: 18px)
    - `blue_pill_description_size_mobile` - Blue pill description size for mobile (default: 14px)
    - `blue_pill_details_size_mobile` - Blue pill details size for mobile (default: 12px)
    - `red_pill_title_size_mobile` - Red pill title size for mobile (default: 18px)
    - `red_pill_description_size_mobile` - Red pill description size for mobile (default: 14px)
    - `red_pill_details_size_mobile` - Red pill details size for mobile (default: 12px)
    - `button_text_size_mobile` - Button text size for mobile (default: 14px)

  3. Notes
    - Existing size columns will be used for desktop
    - Mobile sizes are used as default, desktop sizes apply at 768px breakpoint and above
*/

ALTER TABLE pill_sections
  ADD COLUMN IF NOT EXISTS main_heading_size_mobile INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS subheading_size_mobile INTEGER DEFAULT 14,
  ADD COLUMN IF NOT EXISTS blue_pill_title_size_mobile INTEGER DEFAULT 18,
  ADD COLUMN IF NOT EXISTS blue_pill_description_size_mobile INTEGER DEFAULT 14,
  ADD COLUMN IF NOT EXISTS blue_pill_details_size_mobile INTEGER DEFAULT 12,
  ADD COLUMN IF NOT EXISTS red_pill_title_size_mobile INTEGER DEFAULT 18,
  ADD COLUMN IF NOT EXISTS red_pill_description_size_mobile INTEGER DEFAULT 14,
  ADD COLUMN IF NOT EXISTS red_pill_details_size_mobile INTEGER DEFAULT 12,
  ADD COLUMN IF NOT EXISTS button_text_size_mobile INTEGER DEFAULT 14;
