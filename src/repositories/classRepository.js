import Class from '../models/Class.js';
import Homework from '../models/Homework.js';
import Syllabus from '../models/Syllabus.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { toPlainObject } from '../utils/helpers.js';

export class ClassRepository {
  async create(data) {
    const classData = new Class(data);
    const saved = await classData.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const classData = await Class.findById(id)
      .populate('teacher', '_id name subject mobile email')
      .populate('students', '_id name parentMobile joiningDate')
      .lean();
    return toPlainObject(classData);
  }

  async findByInstitute(instituteId, filters = {}) {
    const classes = await Class.find({ instituteId, isActive: true, ...filters })
      .populate('teacher', '_id name subject')
      .sort({ createdAt: -1 })
      .lean();

    const result = [];
    for (const cls of classes) {
      const studentCount = await Student.countDocuments({ classId: cls._id, isActive: true });
      result.push({
        ...toPlainObject(cls),
        _count: { students: studentCount }
      });
    }

    return result;
  }

  async update(id, data) {
    const classData = await Class.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(classData);
  }

  async delete(id) {
    const classData = await Class.findByIdAndDelete(id).lean();
    return toPlainObject(classData);
  }

  async findTrash(instituteId) {
    const classes = await Class.find({ instituteId, isActive: false })
      .populate('teacher')
      .sort({ updatedAt: -1 })
      .lean();
    return toPlainObject(classes);
  }

  async permanentDelete(id) {
    await Homework.deleteMany({ classId: id });
    await Syllabus.deleteMany({ classId: id });
    const classData = await Class.findByIdAndDelete(id).lean();
    return toPlainObject(classData);
  }

  async getStats(instituteId) {
    const [classes, teachers, students] = await Promise.all([
      Class.countDocuments({ instituteId, isActive: true }),
      Teacher.countDocuments({ instituteId, isActive: true }),
      Student.countDocuments({ instituteId, isActive: true })
    ]);
    return { classes, teachers, students };
  }
}

export default new ClassRepository();
