import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

export class FeeRepository {
  async create(data) {
    const fee = new Fee(data);
    return fee.save();
  }

  async findById(id) {
    return Fee.findById(id).populate('student');
  }

  async findByStudent(studentId) {
    return Fee.find({ studentId })
      .sort({ year: -1, month: -1 });
  }

  async findByClass(classId) {
    const students = await Student.find({ classId });
    const studentIds = students.map(s => s._id);
    
    return Fee.find({ studentId: { $in: studentIds } })
      .populate('student', '_id name')
      .sort({ year: -1, month: -1 });
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId, status, month, year } = filters;
    const students = await Student.find({ instituteId });
    const studentIds = students.map(s => s._id);
    
    const studentMap = {};
    for (const student of students) {
      studentMap[student._id.toString()] = student;
    }

    const query = { studentId: { $in: studentIds } };
    if (classId) {
      const classStudents = await Student.find({ classId });
      query.studentId = { $in: classStudents.map(s => s._id) };
    }
    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);

    const fees = await Fee.find(query)
      .sort({ createdAt: -1 });

    const enrichedFees = fees.map(fee => ({
      ...fee.toObject(),
      student: {
        ...fee.student,
        class: studentMap[fee.studentId.toString()]?.classId
      }
    }));

    return enrichedFees;
  }

  async getPendingCount(instituteId) {
    const students = await Student.find({ instituteId });
    const studentIds = students.map(s => s._id);
    
    return Fee.countDocuments({
      status: 'pending',
      studentId: { $in: studentIds }
    });
  }

  async getCollectionStats(instituteId) {
    const students = await Student.find({ instituteId });
    const studentIds = students.map(s => s._id);
    
    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .select('_id amount status');

    const collected = fees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);
    const pending = fees
      .filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);

    return { collected, pending };
  }

  async upsert(studentId, month, year, data) {
    const existing = await Fee.findOne({ studentId, month, year });

    if (existing) {
      Object.assign(existing, data);
      return existing.save();
    } else {
      const fee = new Fee({
        studentId,
        month,
        year,
        ...data
      });
      return fee.save();
    }
  }
}

export default new FeeRepository();
