import SiteSetting from '../models/SiteSetting.js';

// Get all settings
export const getAllSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.find().lean();
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    res.json({ settings: settingsObject });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Get setting by key
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SiteSetting.findOne({ key });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

// Update or create setting
export const upsertSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const setting = await SiteSetting.findOneAndUpdate(
      { key },
      { key, value, updated_at: new Date() },
      { new: true, upsert: true }
    );

    res.json({ success: true, setting });
  } catch (error) {
    console.error('Error upserting setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Bulk update settings
export const bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    const operations = Object.entries(settings).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { key, value, updated_at: new Date() },
        upsert: true
      }
    }));

    await SiteSetting.bulkWrite(operations);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error bulk updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// Delete setting
export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await SiteSetting.findOneAndDelete({ key });
    
    if (!result) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({ error: 'Failed to delete setting' });
  }
};
