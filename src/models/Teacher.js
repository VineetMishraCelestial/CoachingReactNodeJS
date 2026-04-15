import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date
  },
  subject: {
    type: String
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  classIds: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

teacherSchema.index({ instituteId: 1, isActive: 1 });

export default mongoose.model('Teacher', teacherSchema);
