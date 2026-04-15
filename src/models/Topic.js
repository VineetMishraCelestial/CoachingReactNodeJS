import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
}, {
  timestamps: true
});

topicSchema.index({ subjectId: 1 });

export default mongoose.model('Topic', topicSchema);
