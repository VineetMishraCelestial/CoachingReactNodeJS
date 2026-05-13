import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  createdBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String
  },
  updatedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String
  }
}, {
  timestamps: true
});

syllabusSchema.index({ classId: 1 });

export default mongoose.model('Syllabus', syllabusSchema);
