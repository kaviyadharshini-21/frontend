# MongoDB Setup Guide - Fixing Connection Errors

## 🚨 **Current Issue**
```
Error: ECONNREFUSED _mongodb._tcp.zentar.7blnxfe.mongodb.net
```

This error indicates that the MongoDB connection is failing. Here's how to fix it:

## 🛠️ **Step-by-Step Solution**

### 1. **Create Environment File**
Create a `.env.local` file in your project root:

```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-dashboard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 2. **Setup MongoDB Atlas (Recommended)**

1. **Create Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create Cluster**:
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free tier)
   - Choose a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access" in the sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (remember these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access" in the sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Or add your specific IP address for security
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in the sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

### 3. **Alternative: Local MongoDB**

If you prefer local development:

```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: Follow MongoDB installation guide

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/email-dashboard
```

### 4. **Generate JWT Secret**

Generate a secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32

# Or use any secure random string generator
```

### 5. **Example .env.local File**

```bash
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/email-dashboard?retryWrites=true&w=majority

# Replace with a secure random string
JWT_SECRET=kJ8x9Pq2mN4vB7zR3wE6tY9uI1oP5aS8dF2gH4jK7lQ0

# Environment
NODE_ENV=development
```

## 🔧 **Fixes Applied**

### 1. **MongoDB Connection Improvements**
- Enhanced error messages for common connection issues
- Better debugging information
- Helpful troubleshooting steps in error messages

### 2. **User Model Fix**
- Removed duplicate index warning on email field
- The `unique: true` property automatically creates an index

### 3. **API Error Handling**
- Better error responses for database connection issues
- More specific error messages for troubleshooting
- Development mode shows detailed error information

## ✅ **Testing the Fix**

1. **Create `.env.local`** with your MongoDB credentials
2. **Restart the development server**: `npm run dev`
3. **Test the signup**: Go to `/signup` and try creating an account
4. **Check logs**: Look for "✅ MongoDB connected successfully" in the console

## 🚨 **Common Issues & Solutions**

### Issue: "Authentication failed"
**Solution**: Check username/password in connection string

### Issue: "Network timeout" or "ECONNREFUSED"
**Solutions**:
- Check network access whitelist in MongoDB Atlas
- Verify your internet connection
- Try using a different network (sometimes corporate firewalls block MongoDB)

### Issue: "Database name not found"
**Solution**: MongoDB will create the database automatically when you insert the first document

### Issue: "IP not whitelisted"
**Solution**: Add your IP address to Network Access in MongoDB Atlas

## 🔒 **Security Best Practices**

1. **Never commit `.env.local`** to version control
2. **Use strong passwords** for MongoDB users
3. **Restrict network access** to specific IPs in production
4. **Use different credentials** for different environments
5. **Rotate JWT secrets** regularly

## 📝 **Next Steps**

Once your `.env.local` is configured:

1. Restart the development server
2. Try the signup process
3. Check the MongoDB Atlas dashboard to see if data is being created
4. Test the login process

The authentication system should work perfectly once MongoDB is properly configured!

## 🆘 **Still Having Issues?**

If you're still experiencing problems:

1. Check the server console for detailed error messages
2. Verify your MongoDB Atlas cluster is running
3. Test the connection string in MongoDB Compass or another client
4. Make sure there are no typos in your `.env.local` file
5. Check if your network allows connections to MongoDB Atlas








