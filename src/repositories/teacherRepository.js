import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

export class TeacherRepository {
  async create(data) {
    const teacher = new Teacher(data);
    const saved = await teacher.save();
    return saved.toObject();
  }

  async findById(id) {
    return Teacher.findById(id).lean();
  }

  async findByMobile(mobile) {
    return Teacher.findOne({ mobile }).lean();
  }

  async findByInstitute(instituteId, filters = {}) {
    const teachers = await Teacher.find({ instituteId, isActive: true, ...filters })
      .sort({ createdAt: -1 })
      .lean();

    for (const teacher of teachers) {
      const classes = await Class.find({ teacherId: teacher._id, isActive: true })
        .select('_id name subject')
        .lean();
      teacher.classes = classes;
    }

    return teachers;
  }

  async update(id, data) {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Teacher.findByIdAndDelete(id).lean();
  }

  async findTrash(instituteId) {
    return Teacher.find({ instituteId, isActive: false })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async permanentDelete(id) {
    return Teacher.findByIdAndDelete(id).lean();
  }
}

export default new TeacherRepository();
