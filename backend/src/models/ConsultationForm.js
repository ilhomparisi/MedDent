import mongoose from 'mongoose';

const consultationFormSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  lives_in_tashkent: String,
  last_dentist_visit: String,
  current_problems: String,
  previous_clinic_experience: String,
  missing_teeth: String,
  preferred_call_time: String,
  source: { type: String, default: 'Direct Visit' },
  time_spent_seconds: Number,
  lead_status: { type: String, default: 'Yangi' },
  notes: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update updated_at before saving
consultationFormSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('ConsultationForm', consultationFormSchema);
