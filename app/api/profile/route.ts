import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user by ID
    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user profile data
    const userProfile = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(userProfile, { status: 200 })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('authToken')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { fullName } = await request.json()

    // Validate required fields
    if (!fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { 
        fullName: fullName.trim(),
        updatedAt: new Date(),
      },
      { new: true, select: '-password' }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return updated user profile data
    const userProfile = {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userProfile,
    }, { status: 200 })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



