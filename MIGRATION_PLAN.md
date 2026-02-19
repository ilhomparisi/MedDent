# Complete MongoDB Migration Plan

## Overview
This document outlines the complete migration from Supabase to MongoDB, including backend API creation and frontend component migration.

## Architecture

### Current (Supabase)
```
Frontend → Supabase Client → Supabase Database/Storage
```

### Target (MongoDB)
```
Frontend → API Client → Express Backend → MongoDB
```

## Phase 1: Backend API Setup

### 1.1 Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── ConsultationForm.js
│   │   ├── AdminUser.js
│   │   ├── CRMUser.js
│   │   ├── SiteSetting.js
│   │   ├── Doctor.js
│   │   ├── Review.js
│   │   └── ... (other models)
│   ├── routes/
│   │   ├── auth.js              # Admin authentication
│   │   ├── consultationForms.js # Public form submission
│   │   ├── admin/
│   │   │   ├── doctors.js
│   │   │   ├── reviews.js
│   │   │   ├── settings.js
│   │   │   └── ... (admin routes)
│   │   └── crm/
│   │       ├── forms.js         # CRM form management
│   │       └── credentials.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── consultationController.js
│   │   └── ... (other controllers)
│   ├── utils/
│   │   ├── storage.js            # File storage (replaces Supabase Storage)
│   │   └── seed.js              # Database seeding
│   └── server.js                # Express app entry point
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── package.json
└── README.md
```

### 1.2 Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 1.3 Environment Variables (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/meddent
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meddent?retryWrites=true&w=majority

# Server
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Admin Seed Credentials
ADMIN_SEED_EMAIL=admin@meddent.uz
ADMIN_SEED_PASSWORD=Admin123!

# File Upload (if using local storage)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS
FRONTEND_URL=http://localhost:5173
```

## Phase 2: Backend Implementation

### 2.1 MongoDB Connection
```javascript
// src/config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
```

### 2.2 Models Example
```javascript
// src/models/ConsultationForm.js
import mongoose from 'mongoose';

const consultationFormSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  lives_in_tashkent: String,
  last_dentist_visit: String,
  current_problems: String,
  previous_clinic_experience: String,
  missing_teeth: String,
  preferred_call_time: String,
  source: { type: String, default: 'Direct Visit' },
  time_spent_seconds: Number,
  lead_status: { type: String, default: 'Yangi' },
  notes: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('ConsultationForm', consultationFormSchema);
```

### 2.3 API Routes Example
```javascript
// src/routes/consultationForms.js
import express from 'express';
import { createForm, getForms, updateForm } from '../controllers/consultationController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint - no auth required
router.post('/', createForm);

// Protected endpoints - require admin auth
router.get('/', authenticateAdmin, getForms);
router.patch('/:id', authenticateAdmin, updateForm);

export default router;
```

### 2.4 Authentication Middleware
```javascript
// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.userId);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Phase 3: Frontend Migration

### 3.1 API Client Setup
```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Consultation Forms
  async submitConsultationForm(data: any) {
    return this.request('/consultation-forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConsultationForms(params?: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/consultation-forms?${queryString}`);
  }

  async updateConsultationForm(id: string, data: any) {
    return this.request(`/consultation-forms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    this.clearToken();
  }

  async getSession() {
    try {
      return await this.request('/auth/session');
    } catch {
      return null;
    }
  }
}

export const api = new ApiClient(API_BASE_URL);
```

### 3.2 Migration Pattern for Components

#### Before (Supabase):
```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('consultation_forms')
  .insert([formData]);
```

#### After (API):
```typescript
import { api } from '../lib/api';

try {
  await api.submitConsultationForm(formData);
} catch (error) {
  console.error('Error:', error);
}
```

## Phase 4: Component Migration Order

### Priority 1: Core Functionality
1. ✅ **ConsultationFormModal** - Public form submission
2. ✅ **AdminLogin** - Authentication
3. ✅ **AdminPanel** - Session management

### Priority 2: CRM Features
4. **FormSubmissions** - List and manage forms
5. **CRMDashboard** - Statistics and overview
6. **CRMAuthContext** - CRM user authentication

### Priority 3: Admin Management
7. **DoctorsManagement** - Doctor CRUD
8. **ReviewsManagement** - Review CRUD
9. **GeneralSettings** - Site settings
10. **All other admin components** - Systematic migration

### Priority 4: Public Components
11. **ConfigurationLoader** - Site configuration
12. **ImageUpload utilities** - File uploads
13. **All public-facing components** - Read-only operations

## Phase 5: File Storage Migration

### Current: Supabase Storage
```typescript
await supabase.storage
  .from('review-images')
  .upload(filePath, file);
```

### Target: Backend API
```typescript
// src/lib/api.ts
async uploadImage(file: File, type: 'reviews' | 'logos') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  return this.request('/upload/image', {
    method: 'POST',
    body: formData,
    headers: {} // Let browser set Content-Type for FormData
  });
}
```

## Phase 6: Testing Checklist

- [ ] Backend API starts successfully
- [ ] MongoDB connection established
- [ ] Public form submission works
- [ ] Admin login works
- [ ] Admin session persists
- [ ] Protected routes require authentication
- [ ] File uploads work
- [ ] All admin CRUD operations work
- [ ] Frontend builds without errors
- [ ] No Supabase references in production code

## Phase 7: Cleanup

1. Remove `@supabase/supabase-js` from package.json
2. Delete `src/lib/supabase.ts`
3. Remove Supabase environment variables
4. Archive `supabase/migrations/` folder
5. Update documentation

## Migration Timeline Estimate

- **Backend Setup**: 2-3 hours
- **Core Components Migration**: 3-4 hours
- **Admin Components Migration**: 4-6 hours
- **Public Components Migration**: 2-3 hours
- **Testing & Bug Fixes**: 2-3 hours
- **Total**: ~15-20 hours

## Rollback Plan

If issues occur:
1. Keep Supabase connection active during migration
2. Use feature flags to switch between Supabase and API
3. Gradually migrate components
4. Test each component before moving to next

## Notes

- Keep Supabase environment variables during migration for rollback
- Test each migrated component thoroughly
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states for better UX
