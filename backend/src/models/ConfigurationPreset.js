import mongoose from 'mongoose';

const configurationPresetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  settings: { type: Map, of: mongoose.Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

configurationPresetSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('ConfigurationPreset', configurationPresetSchema);
