import ConfigurationPreset from '../models/ConfigurationPreset.js';
import SiteSetting from '../models/SiteSetting.js';

// Get all presets
export const getAllPresets = async (req, res) => {
  try {
    const presets = await ConfigurationPreset.find().sort({ created_at: -1 });
    res.json({ data: presets });
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({ error: 'Failed to fetch presets' });
  }
};

// Get preset by ID
export const getPresetById = async (req, res) => {
  try {
    const { id } = req.params;
    const preset = await ConfigurationPreset.findById(id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ data: preset });
  } catch (error) {
    console.error('Error fetching preset:', error);
    res.status(500).json({ error: 'Failed to fetch preset' });
  }
};

// Create preset from current settings
export const createPreset = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Get all current settings
    const settings = await SiteSetting.find().lean();
    const settingsMap = new Map();
    settings.forEach(setting => {
      settingsMap.set(setting.key, setting.value);
    });

    const preset = new ConfigurationPreset({
      name,
      description,
      settings: settingsMap
    });

    await preset.save();
    res.json({ success: true, data: preset });
  } catch (error) {
    console.error('Error creating preset:', error);
    res.status(500).json({ error: 'Failed to create preset' });
  }
};

// Apply preset
export const applyPreset = async (req, res) => {
  try {
    const { id } = req.params;
    const preset = await ConfigurationPreset.findById(id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    // Apply all settings from preset
    const operations = [];
    preset.settings.forEach((value, key) => {
      operations.push({
        updateOne: {
          filter: { key },
          update: { key, value, updated_at: new Date() },
          upsert: true
        }
      });
    });

    if (operations.length > 0) {
      await SiteSetting.bulkWrite(operations);
    }

    res.json({ success: true, message: 'Preset applied successfully' });
  } catch (error) {
    console.error('Error applying preset:', error);
    res.status(500).json({ error: 'Failed to apply preset' });
  }
};

// Update preset
export const updatePreset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const preset = await ConfigurationPreset.findByIdAndUpdate(
      id,
      { name, description, updated_at: new Date() },
      { new: true }
    );

    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ success: true, data: preset });
  } catch (error) {
    console.error('Error updating preset:', error);
    res.status(500).json({ error: 'Failed to update preset' });
  }
};

// Delete preset
export const deletePreset = async (req, res) => {
  try {
    const { id } = req.params;
    const preset = await ConfigurationPreset.findByIdAndDelete(id);
    
    if (!preset) {
      return res.status(404).json({ error: 'Preset not found' });
    }

    res.json({ success: true, message: 'Preset deleted' });
  } catch (error) {
    console.error('Error deleting preset:', error);
    res.status(500).json({ error: 'Failed to delete preset' });
  }
};
