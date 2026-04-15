import Syllabus from '../models/Syllabus.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';

export class SyllabusRepository {
  async create(data) {
    const syllabus = new Syllabus(data);
    return syllabus.save();
  }

  async findById(id) {
    const syllabus = await Syllabus.findById(id).populate({
      path: 'subjects',
      populate: {
        path: 'topics'
      }
    });
    return syllabus;
  }

  async findByClass(classId) {
    return Syllabus.find({ classId })
      .populate({
        path: 'subjects',
        populate: {
          path: 'topics'
        }
      })
      .sort({ createdAt: 1 });
  }

  async update(id, data) {
    return Syllabus.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    const subjects = await Subject.find({ syllabusId: id });
    for (const subject of subjects) {
      await Topic.deleteMany({ subjectId: subject._id });
    }
    await Subject.deleteMany({ syllabusId: id });
    return Syllabus.findByIdAndDelete(id);
  }

  async getProgressStats(classId) {
    const syllabi = await Syllabus.find({ classId }).select('status');
    const subjects = await Subject.find({ syllabusId: { $in: syllabi.map(s => s._id) } });

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
    return subject.save();
  }

  async getSubjectById(subjectId) {
    return Subject.findById(subjectId).populate('topics');
  }

  async updateSubject(subjectId, data) {
    return Subject.findByIdAndUpdate(subjectId, data, { new: true });
  }

  async deleteSubject(subjectId) {
    await Topic.deleteMany({ subjectId });
    return Subject.findByIdAndDelete(subjectId);
  }

  async createTopic(subjectId, data) {
    const topic = new Topic({ ...data, subjectId });
    return topic.save();
  }

  async updateTopic(topicId, data) {
    const topic = await Topic.findByIdAndUpdate(topicId, data, { new: true });
    
    if (data.isCompleted !== undefined) {
      await this.updateSubjectStatus(topic.subjectId);
    }
    
    return topic;
  }

  async updateSubjectStatus(subjectId) {
    const subject = await Subject.findById(subjectId).populate('topics');

    if (!subject) return;

    const allCompleted = subject.topics.length > 0 && subject.topics.every(t => t.isCompleted);
    
    await Subject.findByIdAndUpdate(subjectId, {
      status: allCompleted ? 'done' : 'ongoing'
    });
  }

  async deleteTopic(topicId) {
    const topic = await Topic.findById(topicId);
    await Topic.findByIdAndDelete(topicId);
    if (topic) {
      await this.updateSubjectStatus(topic.subjectId);
    }
  }
}

export default new SyllabusRepository();
