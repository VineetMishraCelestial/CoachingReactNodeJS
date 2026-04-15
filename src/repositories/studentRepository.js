import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class StudentRepository {
  async create(data) {
    if (data.instituteId) data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    if (data.classId) data.classId = new mongoose.Types.ObjectId(data.classId);
    const s = new Student(data);
    const saved = await s.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    const s = await Student.findById(id).populate('classId').lean();
    if (!s) return null;
    return {
      ...addId(s),
      class: s.classId ? addId(s.classId) : null
    };
  }

  async findByInstitute(instituteId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;
    const objId = new mongoose.Types.ObjectId(instituteId);

    const [students, total] = await Promise.all([
      Student.find({ instituteId: objId, isActive: true, ...filters })
        .populate('classId').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Student.countDocuments({ instituteId: objId, isActive: true, ...filters })
    ]);

    const result = [];
    for (const s of students) {
      const fee = await Fee.findOne({ studentId: s._id }).sort({ createdAt: -1 }).lean();
      const attCount = await Attendance.countDocuments({ studentId: s._id });
      result.push({ ...addId(s), class: s.classId ? addId(s.classId) : null, fees: fee ? [addId(fee)] : [], _count: { attendances: attCount } });
    }
    return { students: result, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    return Student.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Student.findByIdAndDelete(id).lean();
  }

  async findTrash(instituteId, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;
    const objId = new mongoose.Types.ObjectId(instituteId);
    const [students, total] = await Promise.all([
      Student.find({ instituteId: objId, isActive: false }).populate('classId').sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Student.countDocuments({ instituteId: objId, isActive: false })
    ]);
    return {
      students: students.map(s => ({ ...addId(s), class: s.classId ? addId(s.classId) : null })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async permanentDelete(id) {
    await Fee.deleteMany({ studentId: id });
    await HomeworkSubmission.deleteMany({ studentId: id });
    return Student.findByIdAndDelete(id).lean();
  }

  async getAttendanceStats(studentId, month, year) {
    const sId = new mongoose.Types.ObjectId(studentId);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const count = await Attendance.countDocuments({ studentId: sId, date: { $gte: startDate, $lte: endDate } });
    return { attended: count, total: endDate.getDate() };
  }
}

export default new StudentRepository();
