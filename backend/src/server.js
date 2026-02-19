import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Load environment variables from project root (single .env only)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please set these variables in the .env file in the project root.');
  console.error('   See ENV_TEMPLATE.txt or SETUP_ENV.md for an example.\n');
  process.exit(1);
}

// Validate JWT_SECRET length
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security!');
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10) || 3000;

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
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost port in development
    if (origin.match(/^http:\/\/localhost:\d+$/) || origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
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

// Serve uploaded files (absolute path from backend root)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// Serve frontend static files (when built and placed in backend/dist, e.g. by single Dockerfile)
const frontendDist = path.join(__dirname, '../dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

// 404 handler (only reached when not serving frontend)
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
