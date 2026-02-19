import PillSection from '../models/PillSection.js';
import ValueStackingItem from '../models/ValueStackingItem.js';
import CampaignLink from '../models/CampaignLink.js';

// Pill Sections
export const getAllPillSections = async (req, res) => {
  try {
    const query = req.query.active_only === 'true' ? { is_active: true } : {};
    const sections = await PillSection.find(query).sort({ display_order: 1 });
    res.json({ data: sections });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pill sections' });
  }
};

export const createPillSection = async (req, res) => {
  try {
    const section = new PillSection(req.body);
    await section.save();
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create pill section' });
  }
};

export const updatePillSection = async (req, res) => {
  try {
    const section = await PillSection.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pill section' });
  }
};

export const deletePillSection = async (req, res) => {
  try {
    const section = await PillSection.findByIdAndDelete(req.params.id);
    if (!section) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pill section' });
  }
};

// Value Stacking
export const getAllValueItems = async (req, res) => {
  try {
    const query = req.query.active_only === 'true' ? { is_active: true } : {};
    const items = await ValueStackingItem.find(query).sort({ display_order: 1 });
    res.json({ data: items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch value items' });
  }
};

export const createValueItem = async (req, res) => {
  try {
    const item = new ValueStackingItem(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create value item' });
  }
};

export const updateValueItem = async (req, res) => {
  try {
    const item = await ValueStackingItem.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update value item' });
  }
};

export const deleteValueItem = async (req, res) => {
  try {
    const item = await ValueStackingItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete value item' });
  }
};

// Campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignLink.find().sort({ created_at: -1 });
    res.json({ data: campaigns });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

export const getCampaignByCode = async (req, res) => {
  try {
    const campaign = await CampaignLink.findOne({ unique_code: req.params.code });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ data: campaign });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const campaign = new CampaignLink(req.body);
    await campaign.save();
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await CampaignLink.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true });
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await CampaignLink.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};

export const incrementCampaignClick = async (req, res) => {
  try {
    const { code } = req.body;
    const campaign = await CampaignLink.findOneAndUpdate(
      { unique_code: code, is_active: true },
      { $inc: { click_count: 1 }, updated_at: new Date() },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment click' });
  }
};

// CRM Credentials
export const getAllCRMUsers = async (req, res) => {
  try {
    const CRMUser = (await import('../models/CRMUser.js')).default;
    const users = await CRMUser.find().select('-password_hash').sort({ created_at: -1 });
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CRM users' });
  }
};

export const createCRMUser = async (req, res) => {
  try {
    const CRMUser = (await import('../models/CRMUser.js')).default;
    const user = new CRMUser(req.body);
    await user.save();
    res.status(201).json({ success: true, data: { ...user.toObject(), password_hash: undefined } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create CRM user' });
  }
};

export const updateCRMUser = async (req, res) => {
  try {
    const CRMUser = (await import('../models/CRMUser.js')).default;
    const user = await CRMUser.findByIdAndUpdate(req.params.id, { ...req.body, updated_at: new Date() }, { new: true }).select('-password_hash');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update CRM user' });
  }
};

export const deleteCRMUser = async (req, res) => {
  try {
    const CRMUser = (await import('../models/CRMUser.js')).default;
    const user = await CRMUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete CRM user' });
  }
};
