import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  dueDate: {
    type: Date
  },
  paidDate: {
    type: Date
  },
  paymentMode: {
    type: String
  },
  note: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  }
}, {
  timestamps: true
});

feeSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });
feeSchema.index({ studentId: 1 });

export default mongoose.model('Fee', feeSchema);
