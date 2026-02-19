import mongoose from 'mongoose';

const crmUserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  last_login: Date,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update updated_at before saving
crmUserSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model('CRMUser', crmUserSchema);
