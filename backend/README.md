# MedDent Backend API

Backend API for MedDent application, migrated from Supabase to MongoDB.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

**⚠️ REQUIRED:** Edit the `.env` file in the `backend/` directory.

The `.env` file already exists with placeholder values. Open it and replace:

**Required environment variables:**
- `MONGODB_URI` - MongoDB connection string (REQUIRED)
  - Local: `mongodb://localhost:27017/meddent`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/meddent?retryWrites=true&w=majority`
  
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED, minimum 32 characters)
  - Generate: `openssl rand -base64 32`

**⚠️ The server will NOT start if `MONGODB_URI` or `JWT_SECRET` are not properly configured!**

### 3. Seed Admin User
```bash
npm run seed
```

This will create the initial admin user with credentials from `.env`.

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/session` - Get current session (protected)
- `POST /api/auth/logout` - Logout (protected)

### Consultation Forms
- `POST /api/consultation-forms` - Submit form (public)
- `GET /api/consultation-forms` - List forms (protected)
- `GET /api/consultation-forms/sources` - Get unique sources (protected)
- `GET /api/consultation-forms/:id` - Get form by ID (protected)
- `PATCH /api/consultation-forms/:id` - Update form (protected)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## MongoDB Models

- `ConsultationForm` - Consultation form submissions
- `AdminUser` - Admin users for authentication
- `CRMUser` - CRM system users

## Development

- Uses Express.js for the server
- MongoDB with Mongoose for database
- JWT for authentication
- CORS enabled for frontend communication
