import SectionBackground from '../models/SectionBackground.js';

export const getSectionBackgrounds = async (req, res) => {
  try {
    const backgrounds = await SectionBackground.find();
    res.json({ data: backgrounds });
  } catch (error) {
    console.error('Error fetching section backgrounds:', error);
    res.status(500).json({ error: 'Failed to fetch section backgrounds' });
  }
};

export const getSectionBackground = async (req, res) => {
  try {
    const { section_name } = req.params;
    const background = await SectionBackground.findOne({ section_name });
    if (!background) {
      return res.json({ data: null });
    }
    res.json({ data: background });
  } catch (error) {
    console.error('Error fetching section background:', error);
    res.status(500).json({ error: 'Failed to fetch section background' });
  }
};

export const updateSectionBackground = async (req, res) => {
  try {
    const { section_name } = req.params;
    const background = await SectionBackground.findOneAndUpdate(
      { section_name },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: background });
  } catch (error) {
    console.error('Error updating section background:', error);
    res.status(500).json({ error: 'Failed to update section background' });
  }
};

export const deleteSectionBackground = async (req, res) => {
  try {
    const { section_name } = req.params;
    const background = await SectionBackground.findOneAndDelete({ section_name });
    if (!background) {
      return res.status(404).json({ error: 'Section background not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting section background:', error);
    res.status(500).json({ error: 'Failed to delete section background' });
  }
};
