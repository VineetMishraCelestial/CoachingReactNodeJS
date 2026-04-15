import mongoose from 'mongoose';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { toPlainObject } from '../utils/helpers.js';

export class FeeRepository {
  async create(data) {
    if (data.studentId) {
      data.studentId = new mongoose.Types.ObjectId(data.studentId);
    }
    const fee = new Fee(data);
    const saved = await fee.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const fee = await Fee.findById(id).populate('student').lean();
    return toPlainObject(fee);
  }

  async findByStudent(studentId) {
    const fees = await Fee.find({ studentId })
      .sort({ year: -1, month: -1 })
      .lean();
    return toPlainObject(fees);
  }

  async findByClass(classId) {
    const students = await Student.find({ classId }).lean();
    const studentIds = students.map(s => s._id);
    
    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .populate('student', '_id name')
      .sort({ year: -1, month: -1 })
      .lean();
    return toPlainObject(fees);
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId, status, month, year } = filters;
    const instituteObjId = new mongoose.Types.ObjectId(instituteId);
    const students = await Student.find({ instituteId: instituteObjId }).lean();
    const studentIds = students.map(s => s._id);
    
    const studentMap = {};
    for (const student of students) {
      studentMap[student._id.toString()] = student;
    }

    const query = { studentId: { $in: studentIds } };
    if (classId) {
      const classStudents = await Student.find({ classId }).lean();
      query.studentId = { $in: classStudents.map(s => s._id) };
    }
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    const fees = await Fee.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const enrichedFees = fees.map(fee => toPlainObject({
      ...fee,
      student: {
        ...fee.student,
        classId: studentMap[fee.studentId.toString()]?.classId
      }
    }));

    return enrichedFees;
  }

  async getPendingCount(instituteId) {
    const instituteObjId = new mongoose.Types.ObjectId(instituteId);
    const students = await Student.find({ instituteId: instituteObjId }).lean();
    const studentIds = students.map(s => s._id);
    
    return Fee.countDocuments({
      status: 'pending',
      studentId: { $in: studentIds }
    });
  }

  async getCollectionStats(instituteId) {
    const instituteObjId = new mongoose.Types.ObjectId(instituteId);
    const students = await Student.find({ instituteId: instituteObjId }).lean();
    const studentIds = students.map(s => s._id);
    
    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .select('_id amount status')
      .lean();

    const collected = fees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);
    const pending = fees
      .filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);

    return { collected, pending };
  }

  async upsert(studentId, month, year, data) {
    const studentObjId = new mongoose.Types.ObjectId(studentId);
    const existing = await Fee.findOne({ studentId: studentObjId, month, year }).lean();

    if (existing) {
      const updated = await Fee.findByIdAndUpdate(existing._id, data, { new: true }).lean();
      return toPlainObject(updated);
    } else {
      const fee = new Fee({
        studentId: studentObjId,
        month,
        year,
        ...data
      });
      const saved = await fee.save();
      return toPlainObject(saved.toObject());
    }
  }
}

export default new FeeRepository();
