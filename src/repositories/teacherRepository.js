import mongoose from 'mongoose';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import { toPlainObject } from '../utils/helpers.js';

export class TeacherRepository {
  async create(data) {
    if (data.instituteId) {
      data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    }
    const teacher = new Teacher(data);
    const saved = await teacher.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const teacher = await Teacher.findById(id).lean();
    return toPlainObject(teacher);
  }

  async findByMobile(mobile) {
    const teacher = await Teacher.findOne({ mobile }).lean();
    return toPlainObject(teacher);
  }

  async findByInstitute(instituteId, filters = {}) {
    const teachers = await Teacher.find({ instituteId, isActive: true, ...filters })
      .sort({ createdAt: -1 })
      .lean();

    const result = [];
    for (const teacher of teachers) {
      const classes = await Class.find({ teacherId: teacher._id, isActive: true })
        .select('_id name subject')
        .lean();
      result.push({
        ...toPlainObject(teacher),
        classes: toPlainObject(classes)
      });
    }

    return result;
  }

  async update(id, data) {
    const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(teacher);
  }

  async delete(id) {
    const teacher = await Teacher.findByIdAndDelete(id).lean();
    return toPlainObject(teacher);
  }

  async findTrash(instituteId) {
    const teachers = await Teacher.find({ instituteId, isActive: false })
      .sort({ updatedAt: -1 })
      .lean();
    return toPlainObject(teachers);
  }

  async permanentDelete(id) {
    const teacher = await Teacher.findByIdAndDelete(id).lean();
    return toPlainObject(teacher);
  }
}

export default new TeacherRepository();
