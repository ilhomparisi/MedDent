import mongoose from 'mongoose';

const campaignLinkSchema = new mongoose.Schema({
  campaign_name: { type: String, required: true },
  unique_code: { type: String, required: true, unique: true },
  is_active: { type: Boolean, default: true },
  expiry_date: Date,
  click_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

campaignLinkSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('CampaignLink', campaignLinkSchema);
