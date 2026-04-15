import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';

export class StudentRepository {
  async create(data) {
    const student = new Student(data);
    const saved = await student.save();
    return saved.toObject();
  }

  async findById(id) {
    return Student.findById(id).populate('class').lean();
  }

  async findByInstitute(instituteId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find({ instituteId, isActive: true, ...filters })
        .populate('class')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ instituteId, isActive: true, ...filters })
    ]);

    const enrichedStudents = [];
    for (const student of students) {
      const latestFee = await Fee.findOne({ studentId: student._id })
        .sort({ createdAt: -1 })
        .lean();
      const attendanceCount = await Attendance.countDocuments({ studentId: student._id });
      
      enrichedStudents.push({
        ...student,
        fees: latestFee ? [latestFee] : [],
        _count: { attendances: attendanceCount }
      });
    }

    return { students: enrichedStudents, total, page, limit, totalPages: Math.ceil(total / limit) };
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

    const [students, total] = await Promise.all([
      Student.find({ instituteId, isActive: false })
        .populate('class')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ instituteId, isActive: false })
    ]);

    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async permanentDelete(id) {
    await Fee.deleteMany({ studentId: id });
    await HomeworkSubmission.deleteMany({ studentId: id });
    return Student.findByIdAndDelete(id).lean();
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
