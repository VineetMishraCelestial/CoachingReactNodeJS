import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'teacher'
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  instituteName: {
    type: String
  },
  city: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tempPin: {
    type: String
  }
}, {
  timestamps: true
});

userSchema.index({ role: 1, isActive: 1 });

export default mongoose.model('User', userSchema);
