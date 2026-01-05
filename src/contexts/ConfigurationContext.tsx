import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  loadConfigurationFromCache,
  subscribeToConfigurationChanges,
  SiteConfiguration,
  getConfigValue,
  getConfigValues,
  refreshConfigurationCache,
} from '../lib/configurationLoader';

interface ConfigurationContextType {
  config: SiteConfiguration;
  loading: boolean;
  error: Error | null;
  refreshConfig: () => Promise<void>;
  getConfig: <T = any>(key: string, defaultValue: T) => T;
  getConfigs: <T extends Record<string, any>>(keys: Array<keyof T>, defaults: T) => T;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfiguration>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedConfig = await loadConfigurationFromCache();
      setConfig(loadedConfig);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load configuration'));
      console.error('Configuration loading error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();

    const unsubscribe = subscribeToConfigurationChanges((newConfig) => {
      setConfig(newConfig);
    });

    return () => {
      unsubscribe();
    };
  }, [loadConfig]);

  const refreshConfig = useCallback(async () => {
    await refreshConfigurationCache();
    await loadConfig();
  }, [loadConfig]);

  const getConfig = useCallback(
    <T = any>(key: string, defaultValue: T): T => {
      return getConfigValue(config, key, defaultValue);
    },
    [config]
  );

  const getConfigs = useCallback(
    <T extends Record<string, any>>(keys: Array<keyof T>, defaults: T): T => {
      return getConfigValues(config, keys, defaults);
    },
    [config]
  );

  const value: ConfigurationContextType = {
    config,
    loading,
    error,
    refreshConfig,
    getConfig,
    getConfigs,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
}

export function useConfigValue<T = any>(key: string, defaultValue: T): T {
  const { getConfig } = useConfiguration();
  return getConfig(key, defaultValue);
}

export function useConfigValues<T extends Record<string, any>>(
  keys: Array<keyof T>,
  defaults: T
): T {
  const { getConfigs } = useConfiguration();
  return getConfigs(keys, defaults);
}
