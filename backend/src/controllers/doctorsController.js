import Doctor from '../models/Doctor.js';

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { active_only } = req.query;
    const query = active_only === 'true' ? { is_active: true } : {};
    
    const doctors = await Doctor.find(query).sort({ display_order: 1, created_at: -1 });
    res.json({ data: doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ data: doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// Create doctor
export const createDoctor = async (req, res) => {
  try {
    const doctorData = req.body;
    const doctor = new Doctor(doctorData);
    await doctor.save();
    
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date() };
    
    const doctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ success: true, message: 'Doctor deleted' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};

// Update display order
export const updateDoctorOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { display_order, updated_at: new Date() },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error('Error updating doctor order:', error);
    res.status(500).json({ error: 'Failed to update doctor order' });
  }
};
