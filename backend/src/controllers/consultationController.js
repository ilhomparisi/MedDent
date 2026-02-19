import ConsultationForm from '../models/ConsultationForm.js';

// Create a new consultation form (public endpoint)
export const createForm = async (req, res) => {
  try {
    const formData = {
      full_name: req.body.full_name,
      phone: req.body.phone,
      lives_in_tashkent: req.body.lives_in_tashkent,
      last_dentist_visit: req.body.last_dentist_visit,
      current_problems: req.body.current_problems,
      previous_clinic_experience: req.body.previous_clinic_experience,
      missing_teeth: req.body.missing_teeth,
      preferred_call_time: req.body.preferred_call_time,
      source: req.body.source || 'Direct Visit',
      time_spent_seconds: req.body.time_spent_seconds,
      lead_status: 'Yangi'
    };

    const form = new ConsultationForm(formData);
    await form.save();

    res.status(201).json({ 
      success: true, 
      message: 'Form submitted successfully',
      id: form._id 
    });
  } catch (error) {
    console.error('Error creating consultation form:', error);
    res.status(500).json({ 
      error: 'Failed to submit form',
      details: error.message 
    });
  }
};

// Get all consultation forms (protected)
export const getForms = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      search = '',
      sourceFilter = '',
      statusFilter = '',
      dateFrom = '',
      dateTo = ''
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (sourceFilter) {
      query.source = sourceFilter;
    }

    if (statusFilter) {
      query.lead_status = statusFilter;
    }

    if (dateFrom || dateTo) {
      query.created_at = {};
      if (dateFrom) {
        query.created_at.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.created_at.$lte = endDate;
      }
    }

    // Get total count
    const totalCount = await ConsultationForm.countDocuments(query);

    // Get paginated results
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const forms = await ConsultationForm.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(perPage))
      .lean();

    res.json({
      data: forms,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(perPage))
      }
    });
  } catch (error) {
    console.error('Error fetching consultation forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

// Get unique sources (protected)
export const getSources = async (req, res) => {
  try {
    const sources = await ConsultationForm.distinct('source');
    res.json({ sources: sources.filter(s => s) });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
};

// Update consultation form (protected)
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status, notes } = req.body;

    const updateData = {};
    if (lead_status !== undefined) updateData.lead_status = lead_status;
    if (notes !== undefined) updateData.notes = notes;
    updateData.updated_at = new Date();

    const form = await ConsultationForm.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ success: true, data: form });
  } catch (error) {
    console.error('Error updating consultation form:', error);
    res.status(500).json({ error: 'Failed to update form' });
  }
};

// Get form by ID (protected)
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await ConsultationForm.findById(id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json({ data: form });
  } catch (error) {
    console.error('Error fetching consultation form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};
