import { useConfigValues } from '../contexts/ConfigurationContext';

export interface ColorConfig {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  hero_oval_frame_border_color: string;
}

const DEFAULT_COLOR_CONFIG: ColorConfig = {
  primary_color: '#2563eb',
  secondary_color: '#dc2626',
  accent_color: '#0891b2',
  hero_oval_frame_border_color: '#2563eb',
};

export function useColorConfig(): ColorConfig {
  return useConfigValues<ColorConfig>(
    Object.keys(DEFAULT_COLOR_CONFIG) as Array<keyof ColorConfig>,
    DEFAULT_COLOR_CONFIG
  );
}
