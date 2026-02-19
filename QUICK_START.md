# Quick Start - Environment Setup

## Step 1: Configure Environment Variables

Edit the `.env` files and replace placeholder values:

### Backend `.env` (in `backend/` directory):
Open `backend/.env` and replace:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Generate your own secret (min 32 chars)

### Frontend `.env` (in root directory):
Edit `.env` only if your backend runs on a different URL (default is fine for local development)

## Step 2: Generate JWT Secret
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

## Step 3: Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run seed  # Creates admin user
npm run dev

# Terminal 2 - Frontend
npm install
npm run dev
```

## Required Values to Replace in backend/.env:

- ✅ `MONGODB_URI` - Your MongoDB connection string
  - **Local MongoDB**: `mongodb://localhost:27017/meddent`
  - **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/meddent?retryWrites=true&w=majority`
  - See `MONGODB_SETUP.md` for detailed instructions
- ✅ `JWT_SECRET` - Your generated secret (32+ characters)

The `.env` file is already created with placeholders - just edit and replace the values.

## Example Configuration

### backend/.env (MongoDB Atlas example)
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/meddent?retryWrites=true&w=majority
JWT_SECRET=K8j2mN9pQ5rT7vW3xY6zA1bC4dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0=
```

### backend/.env (Local MongoDB example)
```env
MONGODB_URI=mongodb://localhost:27017/meddent
JWT_SECRET=K8j2mN9pQ5rT7vW3xY6zA1bC4dE8fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA0=
```

**📖 For detailed MongoDB setup instructions, see `MONGODB_SETUP.md`**

### .env (root)
```env
VITE_API_URL=http://localhost:3000/api
```
