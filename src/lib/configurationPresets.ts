import { api } from './api';

export interface ConfigurationPreset {
  id: string;
  name: string;
  description?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export async function getConfigurationPresets(): Promise<ConfigurationPreset[]> {
  try {
    const { data } = await api.getPresets();
    return data;
  } catch (error) {
    console.error('Error fetching presets:', error);
    return [];
  }
}

export async function getConfigurationPresetById(id: string): Promise<ConfigurationPreset | null> {
  try {
    const { data } = await api.getPreset(id);
    return data;
  } catch (error) {
    console.error('Error fetching preset:', error);
    return null;
  }
}

export async function createPresetFromCurrentSettings(name: string, description?: string): Promise<ConfigurationPreset | null> {
  try {
    const { data } = await api.createPreset(name, description);
    return data;
  } catch (error) {
    console.error('Error creating preset:', error);
    throw error;
  }
}

export async function applyConfigurationPreset(presetId: string): Promise<boolean> {
  try {
    await api.applyPreset(presetId);
    return true;
  } catch (error) {
    console.error('Error applying preset:', error);
    throw error;
  }
}

export async function updateConfigurationPreset(
  presetId: string,
  updates: { name?: string; description?: string }
): Promise<ConfigurationPreset | null> {
  try {
    const { data } = await api.updatePreset(presetId, updates);
    return data;
  } catch (error) {
    console.error('Error updating preset:', error);
    throw error;
  }
}

export async function deleteConfigurationPreset(presetId: string): Promise<boolean> {
  try {
    await api.deletePreset(presetId);
    return true;
  } catch (error) {
    console.error('Error deleting preset:', error);
    throw error;
  }
}

export async function exportPresetAsJSON(presetId: string): Promise<string | null> {
  try {
    const preset = await getConfigurationPresetById(presetId);
    if (!preset) return null;
    return JSON.stringify(preset, null, 2);
  } catch (error) {
    console.error('Error exporting preset:', error);
    return null;
  }
}

export async function exportAllPresetsAsJSON(): Promise<string | null> {
  try {
    const presets = await getConfigurationPresets();
    return JSON.stringify(presets, null, 2);
  } catch (error) {
    console.error('Error exporting presets:', error);
    return null;
  }
}
