import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  title_uz: String,
  title_ru: String,
  description: {
    type: String,
    required: true
  },
  description_uz: String,
  description_ru: String,
  detailed_description: String,
  detailed_description_uz: String,
  detailed_description_ru: String,
  price_from: Number,
  duration_minutes: Number,
  icon: String,
  image_url: String,
  is_active: {
    type: Boolean,
    default: true
  },
  display_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);
