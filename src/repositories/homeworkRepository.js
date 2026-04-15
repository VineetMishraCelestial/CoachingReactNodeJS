import Homework from '../models/Homework.js';
import HomeworkSubmission from '../models/HomeworkSubmission.js';

export class HomeworkRepository {
  async create(data) {
    const homework = new Homework(data);
    return homework.save();
  }

  async findById(id) {
    const homework = await Homework.findById(id)
      .populate('class')
      .populate({
        path: 'submissions',
        populate: {
          path: 'student'
        }
      });
    return homework;
  }

  async findByClass(classId, filters = {}) {
    const homeworks = await Homework.find({ classId, ...filters })
      .populate({
        path: 'submissions'
      })
      .sort({ createdAt: -1 });

    const result = [];
    for (const hw of homeworks) {
      const submissionCount = await HomeworkSubmission.countDocuments({ homeworkId: hw._id });
      result.push({
        ...hw.toObject(),
        submissions: hw.submissions,
        _count: { submissions: submissionCount }
      });
    }

    return result;
  }

  async update(id, data) {
    return Homework.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    await HomeworkSubmission.deleteMany({ homeworkId: id });
    return Homework.findByIdAndDelete(id);
  }

  async addSubmission(homeworkId, studentId) {
    const existing = await HomeworkSubmission.findOne({ homeworkId, studentId });

    if (existing) {
      existing.status = 'submitted';
      existing.submittedAt = new Date();
      return existing.save();
    } else {
      const submission = new HomeworkSubmission({
        homeworkId,
        studentId,
        status: 'submitted',
        submittedAt: new Date()
      });
      return submission.save();
    }
  }
}

export default new HomeworkRepository();
