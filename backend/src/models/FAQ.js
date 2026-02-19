import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  question_uz: String,
  question_ru: String,
  answer: { type: String, required: true },
  answer_uz: String,
  answer_ru: String,
  display_order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

faqSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('FAQ', faqSchema);
