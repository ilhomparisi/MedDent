import mongoose from 'mongoose';

const valueStackingItemSchema = new mongoose.Schema({
  feature_name: { type: String, required: true },
  feature_name_uz: String,
  feature_name_ru: String,
  estimated_value: { type: Number, required: true },
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

valueStackingItemSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('ValueStackingItem', valueStackingItemSchema);
