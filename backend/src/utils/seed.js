import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import AdminUser from '../models/AdminUser.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Validate required env vars
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is required in .env file');
      process.exit(1);
    }

    await connectDB();

    const email = process.env.ADMIN_SEED_EMAIL || 'admin@meddent.uz';
    const password = process.env.ADMIN_SEED_PASSWORD || 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', email);
      process.exit(0);
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
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
