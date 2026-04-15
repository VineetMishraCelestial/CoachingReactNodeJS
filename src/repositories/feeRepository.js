import mongoose from 'mongoose';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class FeeRepository {
  async create(data) {
    if (data.studentId) data.studentId = new mongoose.Types.ObjectId(data.studentId);
    const f = new Fee(data);
    const saved = await f.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    const fee = await Fee.findById(id).populate('studentId').lean();
    if (!fee) return null;
    return {
      ...addId(fee),
      student: fee.studentId ? addId(fee.studentId) : null
    };
  }

  async findByStudent(studentId) {
    const sId = new mongoose.Types.ObjectId(studentId);
    return Fee.find({ studentId: sId }).sort({ year: -1, month: -1 }).lean();
  }

  async findByClass(classId) {
    const students = await Student.find({ classId }).lean();
    const ids = students.map(s => s._id);
    return Fee.find({ studentId: { $in: ids } }).populate('student', '_id name').sort({ year: -1, month: -1 }).lean();
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId, status, month, year } = filters;
    const objId = new mongoose.Types.ObjectId(instituteId);
    const students = await Student.find({ instituteId: objId }).lean();
    const ids = students.map(s => s._id);
    const query = { studentId: { $in: ids } };
    if (classId) query.studentId = { $in: (await Student.find({ classId }).lean()).map(s => s._id) };
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    return Fee.find(query).sort({ createdAt: -1 }).lean();
  }

  async getPendingCount(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const ids = (await Student.find({ instituteId: objId }).lean()).map(s => s._id);
    return Fee.countDocuments({ status: 'pending', studentId: { $in: ids } });
  }

  async getCollectionStats(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const ids = (await Student.find({ instituteId: objId }).lean()).map(s => s._id);
    const fees = await Fee.find({ studentId: { $in: ids } }).select('_id amount status').lean();
    const collected = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pending = fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
    return { collected, pending };
  }

  async upsert(studentId, month, year, data) {
    const sId = new mongoose.Types.ObjectId(studentId);
    const existing = await Fee.findOne({ studentId: sId, month, year }).lean();
    if (existing) {
      const updated = await Fee.findByIdAndUpdate(existing._id, data, { new: true }).lean();
      return updated ? addId(updated) : null;
    }
    const f = new Fee({ studentId: sId, month, year, ...data });
    const saved = await f.save();
    return addId(saved.toObject());
  }
}

export default new FeeRepository();
