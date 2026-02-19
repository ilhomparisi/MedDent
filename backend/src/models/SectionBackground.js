import mongoose from 'mongoose';

const sectionBackgroundSchema = new mongoose.Schema({
  section_name: {
    type: String,
    required: true,
    unique: true
  },
  image_url: String,
  opacity: {
    type: String,
    default: '0.1'
  }
}, {
  timestamps: true
});

export default mongoose.model('SectionBackground', sectionBackgroundSchema);
