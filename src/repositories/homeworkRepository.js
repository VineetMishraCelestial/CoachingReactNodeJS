import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';

export class HomeworkRepository {
  async create(data) {
    const homework = new Homework(data);
    const saved = await homework.save();
    return saved.toObject();
  }

  async findById(id) {
    return Homework.findById(id)
      .populate('class')
      .populate({
        path: 'submissions',
        populate: { path: 'student' }
      })
      .lean();
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
        ...hw,
        submissions: hw.submissions,
        _count: { submissions: submissionCount }
      });
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
      return HomeworkSubmission.findByIdAndUpdate(existing._id, {
        status: 'submitted',
        submittedAt: new Date()
      }, { new: true }).lean();
    } else {
      const submission = new HomeworkSubmission({
        homeworkId,
        studentId,
        status: 'submitted',
        submittedAt: new Date()
      });
      const saved = await submission.save();
      return saved.toObject();
    }
  }
}

export default new HomeworkRepository();
