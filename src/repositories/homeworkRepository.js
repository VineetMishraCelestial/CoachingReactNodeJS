import mongoose from 'mongoose';
import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';

export class HomeworkRepository {
  async create(data) {
    if (data.classId) data.classId = new mongoose.Types.ObjectId(data.classId);
    const h = new Homework(data);
    const saved = await h.save();
    return saved.toObject();
  }

  async findById(id) {
    return Homework.findById(id).populate('class').populate({ path: 'submissions', populate: { path: 'student' } }).lean();
  }

  async findByClass(classId, filters = {}) {
    const homeworks = await Homework.find({ classId, ...filters }).populate({ path: 'submissions' }).sort({ createdAt: -1 }).lean();
    const result = [];
    for (const h of homeworks) {
      const count = await HomeworkSubmission.countDocuments({ homeworkId: h._id });
      result.push({ ...h, submissions: h.submissions, _count: { submissions: count } });
    }
    return result;
  }

  async update(id, data) {
    return Homework.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    await HomeworkSubmission.deleteMany({ homeworkId: id });
    return Homework.findByIdAndDelete(id).lean();
  }

  async addSubmission(homeworkId, studentId) {
    const existing = await HomeworkSubmission.findOne({ homeworkId, studentId }).lean();
    if (existing) {
      return HomeworkSubmission.findByIdAndUpdate(existing._id, { status: 'submitted', submittedAt: new Date() }, { new: true }).lean();
    }
    const s = new HomeworkSubmission({ homeworkId, studentId, status: 'submitted', submittedAt: new Date() });
    const saved = await s.save();
    return saved.toObject();
  }
}

export default new HomeworkRepository();
