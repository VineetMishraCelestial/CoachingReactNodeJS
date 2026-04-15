import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';

export class AttendanceRepository {
  async findByClassAndDate(classId, date) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    } else {
      localDate = new Date(date);
    }
    const start = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 23, 59, 59, 999));
    return Attendance.find({ classId, date: { $gte: start, $lte: end } }).populate('student').lean();
  }

  async upsert(studentId, classId, date, status) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0));
    } else {
      localDate = new Date(date);
      localDate = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 0, 0, 0, 0));
    }
    const sId = new mongoose.Types.ObjectId(studentId);
    const cId = new mongoose.Types.ObjectId(classId);
    const existing = await Attendance.findOne({ studentId: sId, classId: cId, date: localDate }).lean();
    if (existing) {
      return Attendance.findByIdAndUpdate(existing._id, { status }, { new: true }).lean();
    }
    const a = new Attendance({ studentId: sId, classId: cId, date: localDate, status });
    const saved = await a.save();
    return saved.toObject();
  }
}

export default new AttendanceRepository();
