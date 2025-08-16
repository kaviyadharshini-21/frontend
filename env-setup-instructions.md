# Environment Setup Instructions

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Connection String
# Replace <username>, <password>, and <cluster-url> with your actual MongoDB credentials
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/email-dashboard?retryWrites=true&w=majority

# JWT Secret Key
# Generate a strong random secret key for JWT token signing
# You can generate one using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-here

# Environment
NODE_ENV=development
```

## MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Database Setup**
   - Create a database called `email-dashboard`
   - The User collection will be created automatically when the first user signs up

3. **Connection String**
   - In Atlas, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace the placeholders in your `.env.local` file

4. **Network Access**
   - In Atlas, go to "Network Access"
   - Add your IP address or use 0.0.0.0/0 for development (less secure)

## JWT Secret

Generate a secure JWT secret key:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Dependencies Installation

Make sure to install the required dependencies:

```bash
npm install bcryptjs jsonwebtoken mongoose @types/bcryptjs @types/jsonwebtoken
```

## Testing the Setup

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/signup` to create an account
3. Navigate to `http://localhost:3000/login` to sign in
4. Check the MongoDB Atlas dashboard to see the created user

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong passwords for MongoDB
- Generate a unique JWT secret for each environment
- In production, use secure cookies and HTTPS

