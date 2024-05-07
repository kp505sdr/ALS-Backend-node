// Import mongoose correctly
import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  profilepic: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String, // Assuming verification code is a string
  },
  email_verified: {
    type: Boolean,
    default: false,
  },

  socialMedia: {
    type: Object,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create and export the User model
export default mongoose.model('User', userSchema);
