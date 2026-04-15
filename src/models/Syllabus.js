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
  }
}, {
  timestamps: true
});

syllabusSchema.index({ classId: 1 });

export default mongoose.model('Syllabus', syllabusSchema);
