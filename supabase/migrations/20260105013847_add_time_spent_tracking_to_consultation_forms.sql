/*
  # Add Time Spent Tracking to Consultation Forms
  
  1. New Columns
    - `time_spent_seconds` (integer, nullable) - Time in seconds the user spent on the page before submitting the form
  
  2. Purpose
    - Track user engagement by measuring how long visitors spend on the page
    - Helps analyze lead quality and user behavior
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_forms' AND column_name = 'time_spent_seconds'
  ) THEN
    ALTER TABLE consultation_forms ADD COLUMN time_spent_seconds integer;
  END IF;
END $$;