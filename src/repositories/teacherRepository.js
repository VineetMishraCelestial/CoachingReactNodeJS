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
    const t = await Teacher.findById(id).lean();
    return t ? addId(t) : null;
  }

  async findByMobile(mobile) {
    const t = await Teacher.findOne({ mobile }).lean();
    return t ? addId(t) : null;
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
    const t = await Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
    return t ? addId(t) : null;
  }

  async delete(id) {
    const t = await Teacher.findByIdAndDelete(id).lean();
    return t ? addId(t) : null;
  }

  async findTrash(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const teachers = await Teacher.find({ instituteId: objId, isActive: false }).sort({ updatedAt: -1 }).lean();
    return addId(teachers);
  }

  async permanentDelete(id) {
    const t = await Teacher.findByIdAndDelete(id).lean();
    return t ? addId(t) : null;
  }
}

export default new TeacherRepository();
