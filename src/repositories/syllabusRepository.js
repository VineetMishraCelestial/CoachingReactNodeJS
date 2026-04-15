import Syllabus from '../models/Syllabus.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';

export class SyllabusRepository {
  async create(data) {
    const syllabus = new Syllabus(data);
    const saved = await syllabus.save();
    return saved.toObject();
  }

  async findById(id) {
    return Syllabus.findById(id).populate({
      path: 'subjects',
      populate: { path: 'topics' }
    }).lean();
  }

  async findByClass(classId) {
    return Syllabus.find({ classId })
      .populate({
        path: 'subjects',
        populate: { path: 'topics' }
      })
      .sort({ createdAt: 1 })
      .lean();
  }

  async update(id, data) {
    return Syllabus.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    const subjects = await Subject.find({ syllabusId: id }).lean();
    for (const subject of subjects) {
      await Topic.deleteMany({ subjectId: subject._id });
    }
    await Subject.deleteMany({ syllabusId: id });
    return Syllabus.findByIdAndDelete(id).lean();
  }

  async getProgressStats(classId) {
    const syllabi = await Syllabus.find({ classId }).select('status').lean();
    const subjects = await Subject.find({ syllabusId: { $in: syllabi.map(s => s._id) } }).lean();

    const done = subjects.filter(s => s.status === 'done').length;
    const ongoing = subjects.filter(s => s.status === 'ongoing').length;
    const pending = subjects.filter(s => s.status === 'pending').length;

    return {
      total: subjects.length,
      done,
      ongoing,
      pending,
      percentage: subjects.length ? Math.round((done / subjects.length) * 100) : 0
    };
  }

  async createSubject(syllabusId, data) {
    const subject = new Subject({ ...data, syllabusId });
    const saved = await subject.save();
    return saved.toObject();
  }

  async getSubjectById(subjectId) {
    return Subject.findById(subjectId).populate('topics').lean();
  }

  async updateSubject(subjectId, data) {
    return Subject.findByIdAndUpdate(subjectId, data, { new: true }).lean();
  }

  async deleteSubject(subjectId) {
    await Topic.deleteMany({ subjectId });
    return Subject.findByIdAndDelete(subjectId).lean();
  }

  async createTopic(subjectId, data) {
    const topic = new Topic({ ...data, subjectId });
    const saved = await topic.save();
    return saved.toObject();
  }

  async updateTopic(topicId, data) {
    const topic = await Topic.findByIdAndUpdate(topicId, data, { new: true }).lean();
    
    if (data.isCompleted !== undefined && topic) {
      await this.updateSubjectStatus(topic.subjectId);
    }
    
    return topic;
  }

  async updateSubjectStatus(subjectId) {
    const subject = await Subject.findById(subjectId).populate('topics').lean();

    if (!subject) return;

    const allCompleted = subject.topics && subject.topics.length > 0 && subject.topics.every(t => t.isCompleted);
    
    await Subject.findByIdAndUpdate(subjectId, {
      status: allCompleted ? 'done' : 'ongoing'
    });
  }

  async deleteTopic(topicId) {
    const topic = await Topic.findById(topicId).lean();
    await Topic.findByIdAndDelete(topicId);
    if (topic) {
      await this.updateSubjectStatus(topic.subjectId);
    }
  }
}

export default new SyllabusRepository();
