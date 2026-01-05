import { supabase } from './supabase';

export interface SiteConfiguration {
  [key: string]: any;
}

export interface ConfigurationCache {
  data: SiteConfiguration;
  version: number;
  lastUpdated: string;
}

let configCache: ConfigurationCache | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function loadConfigurationFromCache(): Promise<SiteConfiguration> {
  const now = Date.now();

  if (configCache && now < cacheExpiry) {
    return configCache.data;
  }

  try {
    const { data, error } = await supabase
      .from('configuration_cache')
      .select('cache_data, cache_version, last_updated')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (data && data.cache_data) {
      configCache = {
        data: data.cache_data as SiteConfiguration,
        version: data.cache_version || 1,
        lastUpdated: data.last_updated,
      };
      cacheExpiry = now + CACHE_TTL;
      return configCache.data;
    }

    return await loadConfigurationFromSettings();
  } catch (error) {
    console.error('Error loading configuration from cache:', error);
    return await loadConfigurationFromSettings();
  }
}

async function loadConfigurationFromSettings(): Promise<SiteConfiguration> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw error;

    const config: SiteConfiguration = {};
    data?.forEach((setting) => {
      config[setting.key] = setting.value;
    });

    return config;
  } catch (error) {
    console.error('Error loading configuration from settings:', error);
    return {};
  }
}

export function invalidateConfigurationCache(): void {
  configCache = null;
  cacheExpiry = 0;
}

export async function refreshConfigurationCache(): Promise<void> {
  invalidateConfigurationCache();
  await loadConfigurationFromCache();
}

export function subscribeToConfigurationChanges(
  callback: (config: SiteConfiguration) => void
): () => void {
  const channel = supabase
    .channel('configuration-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'site_settings',
      },
      async () => {
        await refreshConfigurationCache();
        if (configCache) {
          callback(configCache.data);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function getConfigValue<T = any>(
  config: SiteConfiguration,
  key: string,
  defaultValue: T
): T {
  return config[key] !== undefined ? (config[key] as T) : defaultValue;
}

export function getConfigValues<T extends Record<string, any>>(
  config: SiteConfiguration,
  keys: Array<keyof T>,
  defaults: T
): T {
  const result = { ...defaults };
  keys.forEach((key) => {
    if (config[key as string] !== undefined) {
      result[key] = config[key as string];
    }
  });
  return result;
}
