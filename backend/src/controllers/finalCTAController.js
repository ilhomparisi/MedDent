import FinalCTA from '../models/FinalCTA.js';

export const getFinalCTA = async (req, res) => {
  try {
    // Get the first (and should be only) FinalCTA record
    let finalCTA = await FinalCTA.findOne();
    
    // If none exists, create a default one
    if (!finalCTA) {
      finalCTA = new FinalCTA({
        is_active: true,
        heading_line1: 'Ready to Transform',
        heading_highlight1: 'Your Smile?',
        heading_line2: '',
        heading_line3: '',
        heading_highlight2: '',
        heading_highlight3: '',
        description: 'Book your consultation today',
        button_text: 'Book Now',
        button_subtext: 'Free consultation',
        heading_line1_size: 48,
        heading_highlight1_size: 48,
        heading_line2_size: 48,
        heading_line3_size: 48,
        heading_highlight2_size: 48,
        heading_highlight3_size: 48,
        description_size: 18,
        button_text_size: 18,
        button_subtext_size: 14,
        heading_alignment: 'center',
        description_alignment: 'center',
        button_alignment: 'center'
      });
      await finalCTA.save();
    }
    
    res.json({ data: finalCTA });
  } catch (error) {
    console.error('Error fetching final CTA:', error);
    res.status(500).json({ error: 'Failed to fetch final CTA' });
  }
};

export const updateFinalCTA = async (req, res) => {
  try {
    let finalCTA = await FinalCTA.findOne();
    
    if (!finalCTA) {
      finalCTA = new FinalCTA(req.body);
    } else {
      Object.assign(finalCTA, req.body);
    }
    
    await finalCTA.save();
    res.json({ success: true, data: finalCTA });
  } catch (error) {
    console.error('Error updating final CTA:', error);
    res.status(500).json({ error: 'Failed to update final CTA' });
  }
};
