# MongoDB URI Setup Guide

## What is MongoDB URI?

The MongoDB URI (Uniform Resource Identifier) is the connection string that tells your application how to connect to your MongoDB database.

## Option 1: Local MongoDB (Development)

If you have MongoDB installed locally on your computer:

### Format:
```
mongodb://localhost:27017/meddent
```

### Setup Steps:
1. Install MongoDB locally (if not already installed)
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow MongoDB installation guide

2. Start MongoDB service:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # Mac/Linux
   mongod --dbpath /path/to/data
   ```

3. Use in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/meddent
   ```

## Option 2: MongoDB Atlas (Cloud - Recommended)

MongoDB Atlas is a cloud-hosted MongoDB service (free tier available).

### Setup Steps:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your region (closest to you)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: (choose your username)
   - Password: (generate or create strong password)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" → "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string
   - It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Update Connection String**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name at the end: `/meddent`
   - Final format:
     ```
     mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/meddent?retryWrites=true&w=majority
     ```

7. **Use in `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/meddent?retryWrites=true&w=majority
   ```

## Option 3: Other MongoDB Hosting Services

### MongoDB Atlas (Alternative Regions)
- Same as above, but choose different cloud provider (AWS, Azure, GCP)

### Self-Hosted MongoDB
- If you have your own MongoDB server:
  ```
  mongodb://username:password@your-server-ip:27017/meddent
  ```

## Complete .env Example

### For Local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/meddent
JWT_SECRET=your-generated-jwt-secret-here
```

### For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meddent?retryWrites=true&w=majority
JWT_SECRET=your-generated-jwt-secret-here
```

## Testing Your Connection

After setting up your `.env` file:

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for this message:
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   Database: meddent
   ```

3. If you see an error:
   - Check your MongoDB URI format
   - Verify username/password are correct
   - Check network access (for Atlas)
   - Ensure MongoDB service is running (for local)

## Common Issues

### "MongoServerError: Authentication failed"
- Wrong username or password
- Check your database user credentials in MongoDB Atlas

### "MongooseServerSelectionError: connect ECONNREFUSED"
- Local MongoDB not running
- Wrong host/port in connection string

### "MongoNetworkError: failed to connect"
- Network access not configured (for Atlas)
- Add your IP to allowed list in MongoDB Atlas
- Or use "Allow Access from Anywhere" for development

### "MongoParseError: Invalid connection string"
- Check URI format
- Ensure special characters in password are URL-encoded
- Example: `@` becomes `%40`, `#` becomes `%23`

## URL Encoding Special Characters

If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

Or use MongoDB Atlas connection string builder which handles this automatically.

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to git (it's in `.gitignore`)
- Use strong passwords for database users
- For production, restrict network access to specific IPs
- Rotate passwords regularly
- Use environment variables in production hosting

## Quick Reference

| Type | Format |
|------|--------|
| Local | `mongodb://localhost:27017/meddent` |
| Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/meddent?retryWrites=true&w=majority` |
| Custom | `mongodb://user:pass@host:port/database` |
