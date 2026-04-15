import mongoose from 'mongoose';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class TeacherRepository {
  async create(data) {
    if (data.instituteId) {
      data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    }
    const teacher = new Teacher(data);
    const saved = await teacher.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    return Teacher.findById(id).lean();
  }

  async findByMobile(mobile) {
    return Teacher.findOne({ mobile }).lean();
  }

  async findByInstitute(instituteId, filters = {}) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const teachers = await Teacher.find({ instituteId: objId, isActive: true, ...filters })
      .sort({ createdAt: -1 }).lean();
    
    const result = [];
    for (const t of teachers) {
      const classes = await Class.find({ teacherId: t._id, isActive: true }).select('_id name subject').lean();
      result.push({ ...addId(t), classes: addId(classes) });
    }
    return result;
  }

  async update(id, data) {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Teacher.findByIdAndDelete(id).lean();
  }

  async findTrash(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    return Teacher.find({ instituteId: objId, isActive: false }).sort({ updatedAt: -1 }).lean();
  }

  async permanentDelete(id) {
    return Teacher.findByIdAndDelete(id).lean();
  }
}

export default new TeacherRepository();
