# MongoDB Migration Setup Guide

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# IMPORTANT: Edit backend/.env file with your credentials
# - MONGODB_URI (required)
# - JWT_SECRET (required, min 32 characters)

# Seed admin user (creates initial admin with credentials from .env)
npm run seed

# Start development server
npm run dev
```

**⚠️ IMPORTANT:** Edit `backend/.env` file and replace:
- `MONGODB_URI` - Your MongoDB connection string (REQUIRED)
- `JWT_SECRET` - Secret key for JWT tokens, minimum 32 characters (REQUIRED)

The backend will run on `http://localhost:3001` and will exit with an error if required environment variables are not properly configured.

### 2. Frontend Setup

```bash
# In project root
# Install dependencies (if not already done)
npm install

# Optional: Edit .env file if backend runs on different URL
# (Default http://localhost:3001/api is already configured)

# Start development server
npm run dev
```

**Note:** The `.env` file is already configured for local development. Only edit if your backend runs on a different URL.

### 3. Environment Variables

#### Backend `.env` file (in `backend/` directory):

**⚠️ EDIT THIS FILE:** Open `backend/.env` and replace placeholder values.

```env
# REQUIRED: MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/meddent

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meddent?retryWrites=true&w=majority

# REQUIRED: JWT Secret (minimum 32 characters for security)
# Generate a strong secret: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Configuration (optional, has defaults)
PORT=3001
NODE_ENV=development

# Admin Seed Credentials (optional, used when running npm run seed)
ADMIN_SEED_EMAIL=admin@meddent.uz
ADMIN_SEED_PASSWORD=Admin123!

# File Upload Configuration (optional)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# CORS Configuration (optional)
FRONTEND_URL=http://localhost:5173
```

**Required Variables:**
- `MONGODB_URI` - MongoDB connection string (REQUIRED)
- `JWT_SECRET` - Secret for JWT token signing, minimum 32 characters (REQUIRED)

**Optional Variables:**
- All others have defaults or are optional

#### Frontend `.env` file (OPTIONAL - in project root):

```env
# API URL (defaults to http://localhost:3001/api if not set)
# Only needed if your backend runs on a different URL
VITE_API_URL=http://localhost:3001/api
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser.

## MongoDB Setup Options

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/meddent`

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string
5. Use format: `mongodb+srv://username:password@cluster.mongodb.net/meddent?retryWrites=true&w=majority`

## Testing the Migration

### 1. Test Form Submission
- Open the website
- Click to open consultation form
- Fill and submit
- Check MongoDB database for new entry

### 2. Test Admin Login
- Navigate to `/adminlogin`
- Use credentials from `.env` (default: `admin@meddent.uz` / `Admin123!`)
- Should redirect to `/adminpanel`

### 3. Test Form Management
- In admin panel, navigate to CRM section
- View form submissions
- Update lead status
- Add notes

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure MongoDB is running (if local)
- Check port 3001 is not in use

### Frontend can't connect to API
- Check `VITE_API_URL` in frontend `.env`
- Ensure backend is running
- Check CORS settings in backend

### Authentication fails
- Run seed script: `npm run seed` in backend directory
- Check JWT_SECRET is set
- Clear browser localStorage

### Form submission fails
- Check backend is running
- Check API URL in frontend
- Check browser console for errors

## Production Deployment

1. Set up production MongoDB (Atlas recommended)
2. Update `MONGODB_URI` in backend `.env`
3. Set strong `JWT_SECRET` (min 32 characters)
4. Change admin password after first login
5. Configure CORS for production domain
6. Set up file storage (S3, Cloudinary, etc.)
7. Update `FRONTEND_URL` in backend `.env`
8. Set `NODE_ENV=production`

## Next Steps

See `MIGRATION_STATUS.md` for remaining migration tasks.
