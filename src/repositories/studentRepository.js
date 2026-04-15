import mongoose from 'mongoose';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';
import { toPlainObject } from '../utils/helpers.js';

export class StudentRepository {
  async create(data) {
    if (data.instituteId) {
      data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    }
    if (data.classId) {
      data.classId = new mongoose.Types.ObjectId(data.classId);
    }
    const student = new Student(data);
    const saved = await student.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const student = await Student.findById(id).populate('class').lean();
    return toPlainObject(student);
  }

  async findByInstitute(instituteId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;
    const instituteObjId = new mongoose.Types.ObjectId(instituteId);

    const [students, total] = await Promise.all([
      Student.find({ instituteId: instituteObjId, isActive: true, ...filters })
        .populate('class')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ instituteId: instituteObjId, isActive: true, ...filters })
    ]);

    const enrichedStudents = [];
    for (const student of students) {
      const latestFee = await Fee.findOne({ studentId: student._id })
        .sort({ createdAt: -1 })
        .lean();
      const attendanceCount = await Attendance.countDocuments({ studentId: student._id });
      
      enrichedStudents.push({
        ...toPlainObject(student),
        fees: latestFee ? [toPlainObject(latestFee)] : [],
        _count: { attendances: attendanceCount }
      });
    }

    return { students: enrichedStudents, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    const student = await Student.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(student);
  }

  async delete(id) {
    const student = await Student.findByIdAndDelete(id).lean();
    return toPlainObject(student);
  }

  async findTrash(instituteId, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;
    const instituteObjId = new mongoose.Types.ObjectId(instituteId);

    const [students, total] = await Promise.all([
      Student.find({ instituteId: instituteObjId, isActive: false })
        .populate('class')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ instituteId: instituteObjId, isActive: false })
    ]);

    return { students: toPlainObject(students), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async permanentDelete(id) {
    await Fee.deleteMany({ studentId: id });
    await HomeworkSubmission.deleteMany({ studentId: id });
    const student = await Student.findByIdAndDelete(id).lean();
    return toPlainObject(student);
  }

  async getAttendanceStats(studentId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await Attendance.countDocuments({
      studentId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    return { attended: attendances, total: endDate.getDate() };
  }
}

export default new StudentRepository();
