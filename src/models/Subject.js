import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  syllabusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Syllabus',
    required: true
  }
}, {
  timestamps: true
});

subjectSchema.index({ syllabusId: 1 });

export default mongoose.model('Subject', subjectSchema);
