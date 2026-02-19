import { api } from './api';

export interface SiteConfiguration {
  [key: string]: any;
}

let configCache: SiteConfiguration | null = null;

export async function loadConfigurationFromCache(): Promise<SiteConfiguration> {
  if (configCache !== null) {
    return configCache;
  }

  try {
    const { settings } = await api.getAllSettings();
    configCache = settings;
    return configCache;
  } catch (error) {
    console.error('Error loading configuration:', error);
    return {};
  }
}

export async function refreshConfigurationCache(): Promise<SiteConfiguration> {
  configCache = null;
  return loadConfigurationFromCache();
}

export function invalidateConfigurationCache(): void {
  configCache = null;
}

export function getConfigValue<T>(config: SiteConfiguration, key: string, defaultValue: T): T {
  return config[key] !== undefined ? config[key] : defaultValue;
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

export function subscribeToConfigurationChanges(callback: (config: SiteConfiguration) => void): () => void {
  // For now, just poll every 30 seconds
  const intervalId = setInterval(async () => {
    const newConfig = await refreshConfigurationCache();
    callback(newConfig);
  }, 30000);

  return () => clearInterval(intervalId);
}
