import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

export class TeacherRepository {
  async create(data) {
    const teacher = new Teacher(data);
    return teacher.save();
  }

  async findById(id) {
    return Teacher.findById(id);
  }

  async findByMobile(mobile) {
    return Teacher.findOne({ mobile });
  }

  async findByInstitute(instituteId, filters = {}) {
    const teachers = await Teacher.find({ instituteId, isActive: true, ...filters })
      .sort({ createdAt: -1 });

    for (const teacher of teachers) {
      const classes = await Class.find({ teacherId: teacher._id, isActive: true })
        .select('_id name subject');
      teacher._doc.classes = classes;
    }

    return teachers;
  }

  async update(id, data) {
    return Teacher.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Teacher.findByIdAndDelete(id);
  }

  async findTrash(instituteId) {
    return Teacher.find({ instituteId, isActive: false })
      .sort({ updatedAt: -1 });
  }

  async permanentDelete(id) {
    return Teacher.findByIdAndDelete(id);
  }
}

export default new TeacherRepository();
