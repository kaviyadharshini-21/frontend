import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, validateEmail, validatePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, confirmPassword } = await request.json()

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })

    await newUser.save()

    // Return success response (without password)
    const userResponse = {
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      createdAt: newUser.createdAt,
    }

    return NextResponse.json(
      { 
        message: 'Account created successfully',
        user: userResponse
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      )
    }

    // Handle duplicate key error (shouldn't happen due to our check, but just in case)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Handle MongoDB connection errors
    if (error.message && error.message.includes('MongoDB connection failed')) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please contact support.',
          details: 'Unable to connect to the database. This may be a temporary issue.'
        },
        { status: 503 }
      )
    }

    // Handle missing environment variables
    if (error.message && error.message.includes('MONGODB_URI')) {
      return NextResponse.json(
        { 
          error: 'Server configuration error. Please contact support.',
          details: 'Database configuration is missing.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
