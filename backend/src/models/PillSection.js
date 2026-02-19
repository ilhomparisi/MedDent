import mongoose from 'mongoose';

const pillSectionSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  title_uz: String,
  title_ru: String,
  description: { type: String, required: true },
  description_uz: String,
  description_ru: String,
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  matrix_image_url: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

pillSectionSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('PillSection', pillSectionSchema);
