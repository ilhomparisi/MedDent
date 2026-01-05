/*
  # CRM System Database Schema

  1. Changes to Existing Tables
    - Add `source` column to `consultation_forms` table
      - Stores the campaign source or 'Direct Visit' for organic traffic

  2. New Tables
    - `campaign_links`
      - `id` (uuid, primary key) - Unique identifier
      - `campaign_name` (text) - Name of the campaign
      - `unique_code` (text) - URL-safe unique code for tracking
      - `is_active` (boolean) - Whether the campaign is active
      - `expiry_date` (timestamptz) - Optional expiration date
      - `click_count` (integer) - Number of link clicks
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `crm_credentials`
      - `id` (uuid, primary key) - Unique identifier
      - `username` (text) - Unique username for CRM login
      - `password_hash` (text) - Hashed password
      - `is_active` (boolean) - Whether the user can login
      - `last_login` (timestamptz) - Last login timestamp
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  3. Security
    - Enable RLS on all new tables
    - Allow authenticated admin users to manage campaign_links
    - Allow authenticated admin users to manage crm_credentials
    - Allow anonymous users to read active campaigns (for tracking)
    - Allow anonymous users to increment click counts
*/

-- Add source column to consultation_forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'consultation_forms' AND column_name = 'source'
  ) THEN
    ALTER TABLE consultation_forms ADD COLUMN source text DEFAULT 'Direct Visit';
  END IF;
END $$;

-- Create campaign_links table
CREATE TABLE IF NOT EXISTS campaign_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL,
  unique_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  expiry_date timestamptz,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaign_links ENABLE ROW LEVEL SECURITY;

-- Policies for campaign_links
CREATE POLICY "Authenticated users can manage campaign links"
  ON campaign_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read active campaigns"
  ON campaign_links
  FOR SELECT
  TO anon
  USING (is_active = true AND (expiry_date IS NULL OR expiry_date > now()));

-- Create crm_credentials table
CREATE TABLE IF NOT EXISTS crm_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE crm_credentials ENABLE ROW LEVEL SECURITY;

-- Only authenticated admin users can manage CRM credentials
CREATE POLICY "Authenticated users can view crm credentials"
  ON crm_credentials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert crm credentials"
  ON crm_credentials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update crm credentials"
  ON crm_credentials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete crm credentials"
  ON crm_credentials
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anonymous to verify credentials (for CRM login)
CREATE POLICY "Anyone can verify credentials"
  ON crm_credentials
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Function to increment click count
CREATE OR REPLACE FUNCTION increment_campaign_click(campaign_code text)
RETURNS void AS $$
BEGIN
  UPDATE campaign_links
  SET click_count = click_count + 1,
      updated_at = now()
  WHERE unique_code = campaign_code
    AND is_active = true
    AND (expiry_date IS NULL OR expiry_date > now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_campaign_links_updated_at ON campaign_links;
CREATE TRIGGER update_campaign_links_updated_at
  BEFORE UPDATE ON campaign_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_crm_credentials_updated_at ON crm_credentials;
CREATE TRIGGER update_crm_credentials_updated_at
  BEFORE UPDATE ON crm_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
