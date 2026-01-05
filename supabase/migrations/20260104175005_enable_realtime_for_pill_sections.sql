/*
  # Enable Real-time Updates for Pill Sections Table

  1. Changes
    - Add `pill_sections` table to the `supabase_realtime` publication
    - This enables real-time subscriptions to work for the pill sections table
    - Users will now see instant updates when pill section content is modified in the admin panel
  
  2. Purpose
    - Fixes the issue where pill section text changes in admin panel don't update on the frontend
    - Enables live updates without requiring page refresh
*/

-- Add pill_sections table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE pill_sections;
