import { supabase } from './supabase';
import { SiteConfiguration } from './configurationLoader';

export interface ConfigurationPreset {
  id: string;
  name: string;
  description: string | null;
  config_data: SiteConfiguration;
  is_active: boolean;
  is_default: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
}

export async function getAllPresets(): Promise<ConfigurationPreset[]> {
  try {
    const { data, error } = await supabase
      .from('configuration_presets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching presets:', error);
    return [];
  }
}

export async function getActivePreset(): Promise<ConfigurationPreset | null> {
  try {
    const { data, error } = await supabase
      .from('configuration_presets')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching active preset:', error);
    return null;
  }
}

export async function getPresetById(id: string): Promise<ConfigurationPreset | null> {
  try {
    const { data, error } = await supabase
      .from('configuration_presets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching preset:', error);
    return null;
  }
}

export async function saveCurrentConfigurationAsPreset(
  name: string,
  description?: string
): Promise<{ success: boolean; presetId?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc('create_preset_from_current_settings', {
      preset_name: name,
      preset_description: description || null,
    });

    if (error) throw error;

    return { success: true, presetId: data };
  } catch (error: any) {
    console.error('Error saving preset:', error);
    return { success: false, error: error.message || 'Failed to save preset' };
  }
}

export async function applyPreset(
  presetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('apply_configuration_preset', {
      preset_id: presetId,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error applying preset:', error);
    return { success: false, error: error.message || 'Failed to apply preset' };
  }
}

export async function updatePreset(
  presetId: string,
  updates: {
    name?: string;
    description?: string;
    thumbnail_url?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('configuration_presets')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', presetId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating preset:', error);
    return { success: false, error: error.message || 'Failed to update preset' };
  }
}

export async function deletePreset(
  presetId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('configuration_presets')
      .delete()
      .eq('id', presetId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting preset:', error);
    return { success: false, error: error.message || 'Failed to delete preset' };
  }
}

export async function exportPresetAsJSON(presetId: string): Promise<string | null> {
  try {
    const preset = await getPresetById(presetId);
    if (!preset) return null;

    return JSON.stringify(preset.config_data, null, 2);
  } catch (error) {
    console.error('Error exporting preset:', error);
    return null;
  }
}

export async function importPresetFromJSON(
  name: string,
  configJSON: string,
  description?: string
): Promise<{ success: boolean; presetId?: string; error?: string }> {
  try {
    const configData = JSON.parse(configJSON);

    const { data, error } = await supabase
      .from('configuration_presets')
      .insert({
        name,
        description: description || null,
        config_data: configData,
        is_active: false,
        is_default: false,
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, presetId: data.id };
  } catch (error: any) {
    console.error('Error importing preset:', error);
    return { success: false, error: error.message || 'Failed to import preset' };
  }
}

export async function duplicatePreset(
  presetId: string,
  newName: string
): Promise<{ success: boolean; presetId?: string; error?: string }> {
  try {
    const original = await getPresetById(presetId);
    if (!original) {
      return { success: false, error: 'Preset not found' };
    }

    const { data, error } = await supabase
      .from('configuration_presets')
      .insert({
        name: newName,
        description: original.description,
        config_data: original.config_data,
        is_active: false,
        is_default: false,
      })
      .select('id')
      .single();

    if (error) throw error;

    return { success: true, presetId: data.id };
  } catch (error: any) {
    console.error('Error duplicating preset:', error);
    return { success: false, error: error.message || 'Failed to duplicate preset' };
  }
}
