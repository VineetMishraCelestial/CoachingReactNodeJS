import mongoose from 'mongoose';
import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';
import { toPlainObject } from '../utils/helpers.js';

export class HomeworkRepository {
  async create(data) {
    if (data.classId) {
      data.classId = new mongoose.Types.ObjectId(data.classId);
    }
    const homework = new Homework(data);
    const saved = await homework.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const homework = await Homework.findById(id)
      .populate('class')
      .populate({
        path: 'submissions',
        populate: { path: 'student' }
      })
      .lean();
    return toPlainObject(homework);
  }

  async findByClass(classId, filters = {}) {
    const homeworks = await Homework.find({ classId, ...filters })
      .populate({ path: 'submissions' })
      .sort({ createdAt: -1 })
      .lean();

    const result = [];
    for (const hw of homeworks) {
      const submissionCount = await HomeworkSubmission.countDocuments({ homeworkId: hw._id });
      result.push({
        ...toPlainObject(hw),
        submissions: toPlainObject(hw.submissions),
        _count: { submissions: submissionCount }
      });
    }

    return result;
  }

  async update(id, data) {
    const homework = await Homework.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(homework);
  }

  async delete(id) {
    await HomeworkSubmission.deleteMany({ homeworkId: id });
    const homework = await Homework.findByIdAndDelete(id).lean();
    return toPlainObject(homework);
  }

  async addSubmission(homeworkId, studentId) {
    const existing = await HomeworkSubmission.findOne({ homeworkId, studentId }).lean();

    if (existing) {
      const submission = await HomeworkSubmission.findByIdAndUpdate(existing._id, {
        status: 'submitted',
        submittedAt: new Date()
      }, { new: true }).lean();
      return toPlainObject(submission);
    } else {
      const submission = new HomeworkSubmission({
        homeworkId,
        studentId,
        status: 'submitted',
        submittedAt: new Date()
      });
      const saved = await submission.save();
      return toPlainObject(saved.toObject());
    }
  }
}

export default new HomeworkRepository();
