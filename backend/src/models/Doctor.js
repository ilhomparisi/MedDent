import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_uz: String,
  name_ru: String,
  specialty: { type: String, required: true },
  specialty_uz: String,
  specialty_ru: String,
  image_url: String,
  bio: String,
  bio_uz: String,
  bio_ru: String,
  years_experience: { type: Number, default: 0 },
  education: String,
  education_uz: String,
  education_ru: String,
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

doctorSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('Doctor', doctorSchema);
