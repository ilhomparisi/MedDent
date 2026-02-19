# Environment Setup Guide

## Backend .env File

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/meddent

# JWT Secret (generate a secure random string, at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Admin User Seed (for initial setup)
ADMIN_SEED_EMAIL=admin@meddent.uz
ADMIN_SEED_PASSWORD=Admin123!

# Optional: Run seed on server start (development only)
RUN_SEED_ON_START=true
```

## Frontend .env File

Create a `.env` file in the root directory with:

```env
# Frontend API URL
VITE_API_URL=http://localhost:3001/api
```

## Quick Setup

1. Copy the example files:
   ```bash
   cp backend/.env.example backend/.env
   cp .env.example .env
   ```

2. Update the values in `backend/.env`:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Generate a secure `JWT_SECRET` (at least 32 characters)
   - Update `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD` if needed

3. Start MongoDB (if running locally):
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7
   
   # Or using docker-compose
   docker-compose up -d mongodb
   ```

4. Start the backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

5. Start the frontend:
   ```bash
   npm install
   npm run dev
   ```

## Database Seeding

The seed process runs automatically:
- On server start if `RUN_SEED_ON_START=true` (development)
- When running `npm run seed` in the backend directory
- In Docker containers on startup

The seed process will:
- Check if the database is empty
- Create an admin user if it doesn't exist
- Create default site settings if the database is empty

## Security Notes

⚠️ **Important**: 
- Never commit `.env` files to version control
- Use strong, unique `JWT_SECRET` values in production
- Change default admin credentials after first login
- Use environment-specific values for production deployments
