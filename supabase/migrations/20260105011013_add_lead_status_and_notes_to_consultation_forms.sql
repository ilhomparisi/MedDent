/*
  # Add Lead Status and Notes to Consultation Forms

  1. Changes to Existing Tables
    - `consultation_forms`
      - Add `lead_status` (text) - Status of the lead for CRM tracking
        - Values: "Yangi", "Qo'ng'iroq qilindi", "Kelishildi", "Rad etildi", "Kutmoqda"
        - Default: "Yangi" (New)
      - Add `notes` (text) - Notes added by CRM users after calls

  2. Security
    - Add policy allowing anonymous users to update lead_status and notes
      (Required because CRM uses local session auth, not Supabase auth)
*/

-- Add lead_status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_forms' AND column_name = 'lead_status'
  ) THEN
    ALTER TABLE consultation_forms ADD COLUMN lead_status text DEFAULT 'Yangi';
  END IF;
END $$;

-- Add notes column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_forms' AND column_name = 'notes'
  ) THEN
    ALTER TABLE consultation_forms ADD COLUMN notes text;
  END IF;
END $$;

-- Allow anonymous users to update consultation forms (for CRM status/notes updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'consultation_forms' 
    AND policyname = 'Anyone can update consultation form status and notes'
  ) THEN
    CREATE POLICY "Anyone can update consultation form status and notes"
      ON consultation_forms
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
