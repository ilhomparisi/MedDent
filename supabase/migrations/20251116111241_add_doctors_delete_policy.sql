/*
  # Add DELETE policy for doctors table

  1. Changes
    - Add policy to allow authenticated users to delete doctors
  
  2. Security
    - Only authenticated users (admins) can delete doctors
    - This completes the CRUD operations for the doctors table
*/

-- Add DELETE policy for doctors table
CREATE POLICY "Only authenticated users can delete doctors"
  ON doctors
  FOR DELETE
  TO authenticated
  USING (true);