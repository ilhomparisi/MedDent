import { api } from './api';

export interface ConfigurationPreset {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  settings: Record<string, any>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

// --- Core functions ---

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

// --- Aliases / component-friendly wrappers ---

export async function getAllPresets(): Promise<ConfigurationPreset[]> {
  return getConfigurationPresets();
}

export async function saveCurrentConfigurationAsPreset(
  name: string,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.createPreset(name, description);
    return { success: true };
  } catch (error: any) {
    console.error('Error saving preset:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function applyPreset(
  presetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.applyPreset(presetId);
    return { success: true };
  } catch (error: any) {
    console.error('Error applying preset:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function deletePreset(
  presetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await api.deletePreset(presetId);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting preset:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function duplicatePreset(
  presetId: string,
  newName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const preset = await getConfigurationPresetById(presetId);
    if (!preset) return { success: false, error: 'Preset not found' };
    await api.createPreset(newName, preset.description);
    return { success: true };
  } catch (error: any) {
    console.error('Error duplicating preset:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

export async function importPresetFromJSON(
  name: string,
  jsonString: string
): Promise<{ success: boolean; error?: string }> {
  try {
    JSON.parse(jsonString); // validate JSON
    await api.createPreset(name, undefined);
    return { success: true };
  } catch (error: any) {
    console.error('Error importing preset:', error);
    return { success: false, error: error?.message || 'Invalid JSON or network error' };
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

export async function createPresetFromCurrentSettings(
  name: string,
  description?: string
): Promise<ConfigurationPreset | null> {
  try {
    const { data } = await api.createPreset(name, description);
    return data;
  } catch (error) {
    console.error('Error creating preset:', error);
    throw error;
  }
}
