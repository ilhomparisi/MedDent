import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

siteSettingSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('SiteSetting', siteSettingSchema);
