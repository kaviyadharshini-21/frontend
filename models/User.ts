import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  fullName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
  },
  {
    timestamps: true,
  }
)

// Note: Email index is automatically created by unique: true, so no need for explicit index

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
