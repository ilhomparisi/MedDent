import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import AdminUser from '../models/AdminUser.js';
import SiteSetting from '../models/SiteSetting.js';

dotenv.config();

// Check if database is empty
const isDatabaseEmpty = async () => {
  try {
    const adminCount = await AdminUser.countDocuments();
    const settingsCount = await SiteSetting.countDocuments();
    return adminCount === 0 && settingsCount === 0;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_SEED_EMAIL || 'admin@meddent.uz';
    const password = process.env.ADMIN_SEED_PASSWORD || 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', email);
      return;
    }

    // Create new admin user
    const admin = new AdminUser({
      email,
      password, // Will be hashed by pre-save hook
      is_active: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    throw error;
  }
};

// Seed default site settings
const seedDefaultSettings = async () => {
  try {
    const defaultSettings = [
      { key: 'primary_color', value: '#2563eb' },
      { key: 'secondary_color', value: '#1e40af' },
      { key: 'offer_enabled', value: 'true' },
      { key: 'offer_hours', value: '24' },
      { key: 'site_name', value: 'MedDent' },
      { key: 'site_description', value: 'Professional Dental Care' },
    ];

    for (const setting of defaultSettings) {
      const existing = await SiteSetting.findOne({ key: setting.key });
      if (!existing) {
        await SiteSetting.create(setting);
        console.log(`✅ Created default setting: ${setting.key}`);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding default settings:', error);
    throw error;
  }
};

// Main seed function
const seed = async () => {
  try {
    // Validate required env vars
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is required in .env file');
      process.exit(1);
    }

    console.log('🌱 Starting database seeding...');
    await connectDB();

    // Check if database is empty
    const isEmpty = await isDatabaseEmpty();
    
    if (!isEmpty) {
      console.log('📊 Database already contains data. Running selective seeding...');
    } else {
      console.log('📦 Database is empty. Running full seeding...');
    }

    // Always seed admin (will skip if exists)
    await seedAdmin();

    // Only seed default settings if database is empty
    if (isEmpty) {
      await seedDefaultSettings();
    }

    console.log('✅ Seeding completed successfully!');
    
    // Only exit if called directly as a script
    if (process.argv[1]?.includes('seed.js') || import.meta.url === `file://${process.argv[1]}`) {
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    
    // Only exit if called directly as a script
    if (process.argv[1]?.includes('seed.js') || import.meta.url === `file://${process.argv[1]}`) {
      process.exit(1);
    }
    throw error;
  }
};

// Run if called directly
if (process.argv[1]?.includes('seed.js') || import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export default seed;
