import mongoose from 'mongoose';
import Syllabus from '../models/Syllabus.js';
import Subject from '../models/Subject.js';
import Topic from '../models/Topic.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class SyllabusRepository {
  async create(data) {
    if (data.classId) data.classId = new mongoose.Types.ObjectId(data.classId);
    const s = new Syllabus(data);
    const saved = await s.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    const s = await Syllabus.findById(id).lean();
    if (!s) return null;
    const result = addId(s);
    const subjects = await Subject.find({ syllabusId: s._id }).populate('topics').lean();
    result.subjects = addId(subjects);
    return result;
  }

  async findByClass(classId) {
    const cId = new mongoose.Types.ObjectId(classId);
    const syllabi = await Syllabus.find({ classId: cId }).sort({ createdAt: 1 }).lean();
    const result = [];
    for (const syllabus of syllabi) {
      const syllabusWithId = addId(syllabus);
      const subjects = await Subject.find({ syllabusId: syllabus._id }).lean();
      const subjectIds = subjects.map(s => s._id);
      let topics = [];
      if (subjectIds.length > 0) {
        topics = await Topic.find({ subjectId: { $in: subjectIds } }).lean();
      }
      const topicsBySubject = topics.reduce((acc, t) => {
        if (!acc[t.subjectId]) acc[t.subjectId] = [];
        acc[t.subjectId].push(addId(t));
        return acc;
      }, {});
      syllabusWithId.subjects = subjects.map(s => ({
        ...addId(s),
        topics: topicsBySubject[s._id] || []
      }));
      result.push(syllabusWithId);
    }
    return result;
  }

  async update(id, data) {
    const s = await Syllabus.findByIdAndUpdate(id, data, { new: true }).lean();
    return s ? addId(s) : null;
  }

  async delete(id) {
    const subjects = await Subject.find({ syllabusId: id }).lean();
    for (const sub of subjects) {
      await Topic.deleteMany({ subjectId: sub._id });
    }
    await Subject.deleteMany({ syllabusId: id });
    const s = await Syllabus.findByIdAndDelete(id).lean();
    return s ? addId(s) : null;
  }

  async getSubjectById(subjectId) {
    const sub = await Subject.findById(subjectId).populate('topics').lean();
    return sub ? addId(sub) : null;
  }

  async updateSubject(subjectId, data) {
    const sub = await Subject.findByIdAndUpdate(subjectId, data, { new: true }).lean();
    return sub ? addId(sub) : null;
  }

  async deleteSubject(subjectId) {
    await Topic.deleteMany({ subjectId });
    const sub = await Subject.findByIdAndDelete(subjectId).lean();
    return sub ? addId(sub) : null;
  }

  async createTopic(subjectId, data) {
    const t = new Topic({ ...data, subjectId });
    const saved = await t.save();
    return addId(saved.toObject());
  }

  async updateTopic(topicId, data) {
    const topic = await Topic.findByIdAndUpdate(topicId, data, { new: true }).lean();
    if (data.isCompleted !== undefined && topic) {
      await this.updateSubjectStatus(topic.subjectId);
    }
    return topic ? addId(topic) : null;
  }

  async updateSubjectStatus(subjectId) {
    const subject = await Subject.findById(subjectId).populate('topics').lean();
    if (!subject) return;
    const allDone = subject.topics && subject.topics.length > 0 && subject.topics.every(t => t.isCompleted);
    await Subject.findByIdAndUpdate(subjectId, { status: allDone ? 'done' : 'ongoing' });
  }

  async deleteTopic(topicId) {
    const topic = await Topic.findById(topicId).lean();
    await Topic.findByIdAndDelete(topicId);
    if (topic) await this.updateSubjectStatus(topic.subjectId);
  }

  async getProgressStats(classId) {
    try {
      const cId = new mongoose.Types.ObjectId(classId);
      const syllabi = await Syllabus.find({ classId: cId }).select('status').lean();
      const syllabusIds = syllabi.map(s => s._id);
      const query = syllabusIds.length > 0 ? { syllabusId: { $in: syllabusIds } } : { syllabusId: null };
      const subs = await Subject.find(query).lean();
      const done = subs.filter(s => s.status === 'done').length;
      const ongoing = subs.filter(s => s.status === 'ongoing').length;
      const pending = subs.filter(s => s.status === 'pending').length;
      return { total: subs.length, done, ongoing, pending, percentage: subs.length ? Math.round((done / subs.length) * 100) : 0 };
    } catch (error) {
      console.error('Error in getProgressStats:', error);
      return { total: 0, done: 0, ongoing: 0, pending: 0, percentage: 0 };
    }
  }

  async createSubject(syllabusId, data) {
    const s = new Subject({ ...data, syllabusId });
    const saved = await s.save();
    return addId(saved.toObject());
  }
}

export default new SyllabusRepository();
