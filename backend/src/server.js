import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import consultationFormsRoutes from './routes/consultationForms.js';
import settingsRoutes from './routes/settings.js';
import presetsRoutes from './routes/presets.js';
import doctorsRoutes from './routes/doctors.js';
import reviewsRoutes from './routes/reviews.js';
import faqsRoutes from './routes/faqs.js';
import miscRoutes from './routes/misc.js';
import uploadRoutes from './routes/upload.js';
import servicesRoutes from './routes/services.js';
import sectionBackgroundsRoutes from './routes/sectionBackgrounds.js';
import finalCTARoutes from './routes/finalCTA.js';
import appointmentsRoutes from './routes/appointments.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please create a .env file in the backend/ directory with these variables.');
  console.error('   See ENV_TEMPLATE.txt for an example.\n');
  process.exit(1);
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security!');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB and optionally seed
connectDB().then(async () => {
  // Run seed if database is empty (only in development or if explicitly enabled)
  if (process.env.RUN_SEED_ON_START === 'true' || process.env.NODE_ENV === 'development') {
    try {
      const seed = await import('./utils/seed.js');
      await seed.default();
    } catch (error) {
      console.error('⚠️  Seeding skipped or failed:', error.message);
    }
  }
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedDent API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/consultation-forms', consultationFormsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/presets', presetsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/section-backgrounds', sectionBackgroundsRoutes);
app.use('/api/final-cta', finalCTARoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api', miscRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
