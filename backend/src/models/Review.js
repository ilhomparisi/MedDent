import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review_text: { type: String, required: true },
  service_used: String,
  image_url: String,
  is_approved: { type: Boolean, default: true },
  is_result: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

reviewSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('Review', reviewSchema);
