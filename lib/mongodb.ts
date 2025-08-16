import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local\n' +
    'Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email-dashboard?retryWrites=true&w=majority'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB connection error:', e)
    
    // Provide helpful error messages based on common issues
    if (e instanceof Error) {
      if (e.message.includes('ECONNREFUSED') || e.message.includes('querySrv')) {
        throw new Error(
          'MongoDB connection failed. Please check:\n' +
          '1. Your MongoDB URI is correct\n' +
          '2. Your network connection\n' +
          '3. MongoDB Atlas whitelist settings\n' +
          '4. Username and password are correct\n\n' +
          `Original error: ${e.message}`
        )
      }
      if (e.message.includes('Authentication failed')) {
        throw new Error(
          'MongoDB authentication failed. Please check your username and password in the connection string.\n\n' +
          `Original error: ${e.message}`
        )
      }
    }
    
    throw e
  }

  return cached.conn
}

export default connectDB
