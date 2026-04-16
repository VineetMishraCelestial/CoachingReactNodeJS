import mongoose from 'mongoose';
import Attendance from '../models/Attendance.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

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
    const cId = new mongoose.Types.ObjectId(classId);
    const result = await Attendance.find({ classId: cId, date: { $gte: start, $lte: end } }).populate('studentId').lean();
    return result.map(a => ({
      ...addId(a),
      studentId: a.studentId?._id,
      student: a.studentId ? addId(a.studentId) : null
    }));
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
      const updated = await Attendance.findByIdAndUpdate(existing._id, { status }, { new: true }).lean();
      return updated ? addId(updated) : null;
    }
    const a = new Attendance({ studentId: sId, classId: cId, date: localDate, status });
    const saved = await a.save();
    return addId(saved.toObject());
  }
}

export default new AttendanceRepository();
