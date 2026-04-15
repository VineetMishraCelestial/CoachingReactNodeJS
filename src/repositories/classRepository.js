import mongoose from 'mongoose';
import Class from '../models/Class.js';
import Homework from '../models/Homework.js';
import Syllabus from '../models/Syllabus.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class ClassRepository {
  async create(data) {
    if (data.instituteId) data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    if (data.teacherId) data.teacherId = new mongoose.Types.ObjectId(data.teacherId);
    const c = new Class(data);
    const saved = await c.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    const cls = await Class.findById(id)
      .populate('teacher', '_id name subject mobile email')
      .populate('students', '_id name parentMobile joiningDate').lean();
    return cls ? addId(cls) : null;
  }

  async findByInstitute(instituteId, filters = {}) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const classes = await Class.find({ instituteId: objId, isActive: true, ...filters })
      .populate('teacher', '_id name subject').sort({ createdAt: -1 }).lean();
    
    const result = [];
    for (const cls of classes) {
      const count = await Student.countDocuments({ classId: cls._id, isActive: true });
      result.push({ ...addId(cls), _count: { students: count } });
    }
    return result;
  }

  async update(id, data) {
    const cls = await Class.findByIdAndUpdate(id, data, { new: true }).lean();
    return cls ? addId(cls) : null;
  }

  async delete(id) {
    const cls = await Class.findByIdAndDelete(id).lean();
    return cls ? addId(cls) : null;
  }

  async findTrash(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const classes = await Class.find({ instituteId: objId, isActive: false }).populate('teacher').sort({ updatedAt: -1 }).lean();
    return addId(classes);
  }

  async permanentDelete(id) {
    await Homework.deleteMany({ classId: id });
    await Syllabus.deleteMany({ classId: id });
    const cls = await Class.findByIdAndDelete(id).lean();
    return cls ? addId(cls) : null;
  }

  async getStats(instituteId) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const [classes, teachers, students] = await Promise.all([
      Class.countDocuments({ instituteId: objId, isActive: true }),
      Teacher.countDocuments({ instituteId: objId, isActive: true }),
      Student.countDocuments({ instituteId: objId, isActive: true })
    ]);
    return { classes, teachers, students };
  }
}

export default new ClassRepository();
