import mongoose from 'mongoose';

const finalCTASchema = new mongoose.Schema({
  is_active: {
    type: Boolean,
    default: true
  },
  heading_line1: String,
  heading_line1_uz: String,
  heading_line1_ru: String,
  heading_highlight1: String,
  heading_highlight1_uz: String,
  heading_highlight1_ru: String,
  heading_line2: String,
  heading_line2_uz: String,
  heading_line2_ru: String,
  heading_line3: String,
  heading_line3_uz: String,
  heading_line3_ru: String,
  heading_highlight2: String,
  heading_highlight2_uz: String,
  heading_highlight2_ru: String,
  heading_highlight3: String,
  heading_highlight3_uz: String,
  heading_highlight3_ru: String,
  description: String,
  description_uz: String,
  description_ru: String,
  button_text: String,
  button_text_uz: String,
  button_text_ru: String,
  button_subtext: String,
  button_subtext_uz: String,
  button_subtext_ru: String,
  heading_line1_size: Number,
  heading_highlight1_size: Number,
  heading_line2_size: Number,
  heading_line3_size: Number,
  heading_highlight2_size: Number,
  heading_highlight3_size: Number,
  description_size: Number,
  button_text_size: Number,
  button_subtext_size: Number,
  button_text_size_mobile: Number,
  button_subtext_size_mobile: Number,
  heading_alignment: String,
  description_alignment: String,
  button_alignment: String
}, {
  timestamps: true
});

export default mongoose.model('FinalCTA', finalCTASchema);
