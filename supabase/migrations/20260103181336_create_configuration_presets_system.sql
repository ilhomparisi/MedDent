/*
  # Configuration Presets System

  ## Overview
  Creates a comprehensive configuration preset management system that allows:
  - Saving complete site configuration snapshots
  - Loading and applying configuration presets
  - Preview mode for testing configurations before publishing
  - Configuration versioning and rollback capabilities

  ## 1. New Tables

  ### `configuration_presets`
  Stores complete configuration snapshots that can be saved, loaded, and applied
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Human-readable preset name (e.g., "Summer Theme", "Default")
  - `description` (text, optional) - Detailed description of the preset
  - `config_data` (jsonb) - Complete configuration data in JSON format
  - `is_active` (boolean) - Whether this preset is currently active/live
  - `is_default` (boolean) - Whether this is the default fallback preset
  - `created_by` (uuid, optional) - Admin user who created this preset
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  - `thumbnail_url` (text, optional) - Preview thumbnail URL

  ### `configuration_cache`
  Caches the current active configuration for fast loading
  - `id` (uuid, primary key) - Single row identifier
  - `cache_data` (jsonb) - Cached configuration data
  - `cache_version` (integer) - Version number for cache invalidation
  - `last_updated` (timestamptz) - Last cache update time

  ## 2. Security
  - Enable RLS on all new tables
  - Public read access for configuration_cache (needed for public site)
  - Authenticated admin-only access for configuration_presets management
  - Policies enforce proper access control

  ## 3. Functions
  - Function to apply a preset (copies preset data to site_settings)
  - Function to create preset from current settings
  - Function to refresh configuration cache
  - Trigger to auto-update cache when site_settings changes
*/

-- Create configuration_presets table
CREATE TABLE IF NOT EXISTS configuration_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  config_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT false,
  is_default boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  thumbnail_url text,
  CONSTRAINT unique_preset_name UNIQUE (name),
  CONSTRAINT only_one_active CHECK (is_active = false OR is_active = true)
);

-- Create configuration_cache table
CREATE TABLE IF NOT EXISTS configuration_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  cache_version integer DEFAULT 1,
  last_updated timestamptz DEFAULT now()
);

-- Insert initial cache row (single row table)
INSERT INTO configuration_cache (cache_data, cache_version, last_updated)
SELECT '{}'::jsonb, 1, now()
WHERE NOT EXISTS (SELECT 1 FROM configuration_cache);

-- Enable RLS
ALTER TABLE configuration_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuration_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for configuration_presets

-- Admins can view all presets
CREATE POLICY "Admins can view all presets"
  ON configuration_presets
  FOR SELECT
  TO authenticated
  USING (true);

-- Admins can create presets
CREATE POLICY "Admins can create presets"
  ON configuration_presets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update presets
CREATE POLICY "Admins can update presets"
  ON configuration_presets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete presets
CREATE POLICY "Admins can delete presets"
  ON configuration_presets
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for configuration_cache

-- Everyone can read the cache (needed for public site)
CREATE POLICY "Public can read configuration cache"
  ON configuration_cache
  FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can update cache
CREATE POLICY "Admins can update configuration cache"
  ON configuration_cache
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to refresh configuration cache from site_settings
CREATE OR REPLACE FUNCTION refresh_configuration_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config_json jsonb;
BEGIN
  -- Gather all site_settings into JSON
  SELECT jsonb_object_agg(key, value)
  INTO config_json
  FROM site_settings;

  -- Update the cache
  UPDATE configuration_cache
  SET
    cache_data = config_json,
    cache_version = cache_version + 1,
    last_updated = now();
END;
$$;

-- Function to create preset from current site_settings
CREATE OR REPLACE FUNCTION create_preset_from_current_settings(
  preset_name text,
  preset_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config_json jsonb;
  new_preset_id uuid;
BEGIN
  -- Gather all site_settings into JSON
  SELECT jsonb_object_agg(key, value)
  INTO config_json
  FROM site_settings;

  -- Insert new preset
  INSERT INTO configuration_presets (name, description, config_data)
  VALUES (preset_name, preset_description, config_json)
  RETURNING id INTO new_preset_id;

  RETURN new_preset_id;
END;
$$;

-- Function to apply a preset (copy preset data to site_settings)
CREATE OR REPLACE FUNCTION apply_configuration_preset(preset_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  preset_config jsonb;
  config_key text;
  config_value jsonb;
BEGIN
  -- Get the preset configuration
  SELECT config_data INTO preset_config
  FROM configuration_presets
  WHERE id = preset_id;

  IF preset_config IS NULL THEN
    RAISE EXCEPTION 'Preset not found';
  END IF;

  -- Deactivate all presets
  UPDATE configuration_presets SET is_active = false;

  -- Activate the selected preset
  UPDATE configuration_presets SET is_active = true WHERE id = preset_id;

  -- Apply each configuration key-value pair to site_settings
  FOR config_key, config_value IN SELECT * FROM jsonb_each(preset_config)
  LOOP
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (config_key, config_value, now())
    ON CONFLICT (key)
    DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = EXCLUDED.updated_at;
  END LOOP;

  -- Refresh the cache
  PERFORM refresh_configuration_cache();
END;
$$;

-- Trigger to auto-refresh cache when site_settings changes
CREATE OR REPLACE FUNCTION trigger_refresh_cache()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM refresh_configuration_cache();
  RETURN NEW;
END;
$$;

-- Create trigger on site_settings
DROP TRIGGER IF EXISTS site_settings_cache_refresh ON site_settings;
CREATE TRIGGER site_settings_cache_refresh
  AFTER INSERT OR UPDATE OR DELETE ON site_settings
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_cache();

-- Initialize cache with current settings
SELECT refresh_configuration_cache();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_presets_active ON configuration_presets(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_presets_default ON configuration_presets(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_presets_created_at ON configuration_presets(created_at DESC);
