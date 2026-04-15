import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  monthlyFee: {
    type: Number,
    default: 0
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  days: {
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
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }
}, {
  timestamps: true
});

classSchema.index({ instituteId: 1, isActive: 1 });
classSchema.index({ teacherId: 1 });

export default mongoose.model('Class', classSchema);
