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
      .populate('teacherId', '_id name subject mobile email').lean();
    if (!cls) return null;
    
    const students = await Student.find({ classId: cls._id, isActive: true })
      .select('_id name parentMobile joiningDate').lean();
    
    return {
      ...addId(cls),
      teacher: cls.teacherId ? addId(cls.teacherId) : null,
      students: addId(students)
    };
  }

  async findByInstitute(instituteId, filters = {}) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const classes = await Class.find({ instituteId: objId, isActive: true, ...filters })
      .populate('teacherId', '_id name subject').sort({ createdAt: -1 }).lean();
    
    const result = [];
    for (const cls of classes) {
      const count = await Student.countDocuments({ classId: cls._id, isActive: true });
      result.push({
        ...addId(cls),
        teacher: cls.teacherId ? addId(cls.teacherId) : null,
        _count: { students: count }
      });
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
    const classes = await Class.find({ instituteId: objId, isActive: false }).populate('teacherId', '_id name subject').sort({ updatedAt: -1 }).lean();
    return classes.map(c => ({
      ...addId(c),
      teacher: c.teacherId ? addId(c.teacherId) : null
    }));
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
