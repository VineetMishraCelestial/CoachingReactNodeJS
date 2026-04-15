import mongoose from 'mongoose';

const homeworkSubmissionSchema = new mongoose.Schema({
  status: {
    type: String,
    default: 'pending'
  },
  submittedAt: {
    type: Date
  },
  homeworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Homework',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }
}, {
  timestamps: true
});

homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 }, { unique: true });

export default mongoose.model('HomeworkSubmission', homeworkSubmissionSchema);
