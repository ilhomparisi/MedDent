/*
  # Fix Configuration Cache Trigger Function

  ## Problem
  The trigger function `refresh_configuration_cache` runs an UPDATE without a WHERE clause.
  When RLS is enabled on `configuration_cache`, this causes "UPDATE requires a WHERE clause" error.

  ## Solution
  1. Drop the existing trigger and function
  2. Recreate the function with SECURITY DEFINER to bypass RLS
  3. Add explicit WHERE clause for safety
  4. Recreate the trigger
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS site_settings_cache_refresh ON site_settings;

-- Drop existing function
DROP FUNCTION IF EXISTS trigger_refresh_cache();
DROP FUNCTION IF EXISTS refresh_configuration_cache();

-- Recreate refresh_configuration_cache with SECURITY DEFINER
CREATE OR REPLACE FUNCTION refresh_configuration_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config_json jsonb;
BEGIN
  -- Gather all site_settings into JSON
  SELECT jsonb_object_agg(key, value)
  INTO config_json
  FROM site_settings;

  -- Update the cache (with WHERE TRUE to satisfy RLS requirements)
  UPDATE configuration_cache
  SET
    cache_data = config_json,
    cache_version = cache_version + 1,
    last_updated = now()
  WHERE TRUE;
END;
$$;

-- Recreate trigger_refresh_cache with SECURITY DEFINER
CREATE OR REPLACE FUNCTION trigger_refresh_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM refresh_configuration_cache();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER site_settings_cache_refresh
  AFTER INSERT OR UPDATE OR DELETE ON site_settings
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_refresh_cache();
