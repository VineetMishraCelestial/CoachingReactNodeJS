import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'general'
  },
  priority: {
    type: String,
    default: 'normal'
  },
  classId: {
    type: String
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

noticeSchema.index({ instituteId: 1 });
noticeSchema.index({ classId: 1 });

export default mongoose.model('Notice', noticeSchema);
