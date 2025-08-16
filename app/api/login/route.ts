import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { comparePassword, generateToken, validateEmail } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    // Connect to database
    await connectDB()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = generateToken(user._id.toString())

    // Return success response with token and user data (without password)
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    }

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: userResponse,
        token,
      },
      { status: 200 }
    )

    // Set JWT token as HTTP-only cookie for additional security
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

// Optional: Add logout route
export async function DELETE() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  )

  // Clear the auth token cookie
  response.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })

  return response
}

