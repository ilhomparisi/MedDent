import FAQ from '../models/FAQ.js';

// Get all FAQs
export const getAllFAQs = async (req, res) => {
  try {
    const { active_only } = req.query;
    const query = active_only === 'true' ? { is_active: true } : {};
    
    const faqs = await FAQ.find(query).sort({ display_order: 1, created_at: -1 });
    res.json({ data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

// Get FAQ by ID
export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ data: faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
};

// Create FAQ
export const createFAQ = async (req, res) => {
  try {
    const faqData = req.body;
    const faq = new FAQ(faqData);
    await faq.save();
    
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

// Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };
    
    const faq = await FAQ.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

// Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};

// Update display order
export const updateFAQOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;
    
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { display_order, updated_at: new Date() },
      { new: true }
    );
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Error updating FAQ order:', error);
    res.status(500).json({ error: 'Failed to update FAQ order' });
  }
};
