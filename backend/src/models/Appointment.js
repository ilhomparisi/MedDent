import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true
  },
  email: String,
  phone: {
    type: String,
    required: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  },
  preferred_date: Date,
  preferred_time: String,
  message: String,
  booking_type: {
    type: String,
    enum: ['quick', 'scheduled'],
    default: 'scheduled'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Appointment', appointmentSchema);
