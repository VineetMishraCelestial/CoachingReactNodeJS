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
    return Syllabus.findById(id).populate({ path: 'subjects', populate: { path: 'topics' } }).lean();
  }

  async findByClass(classId) {
    return Syllabus.find({ classId }).populate({ path: 'subjects', populate: { path: 'topics' } }).sort({ createdAt: 1 }).lean();
  }

  async update(id, data) {
    return Syllabus.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    const subjects = await Subject.find({ syllabusId: id }).lean();
    for (const sub of subjects) {
      await Topic.deleteMany({ subjectId: sub._id });
    }
    await Subject.deleteMany({ syllabusId: id });
    return Syllabus.findByIdAndDelete(id).lean();
  }

  async getProgressStats(classId) {
    const syllabi = await Syllabus.find({ classId }).select('status').lean();
    const subs = await Subject.find({ syllabusId: { $in: syllabi.map(s => s._id) } }).lean();
    const done = subs.filter(s => s.status === 'done').length;
    const ongoing = subs.filter(s => s.status === 'ongoing').length;
    const pending = subs.filter(s => s.status === 'pending').length;
    return { total: subs.length, done, ongoing, pending, percentage: subs.length ? Math.round((done / subs.length) * 100) : 0 };
  }

  async createSubject(syllabusId, data) {
    const s = new Subject({ ...data, syllabusId });
    const saved = await s.save();
    return addId(saved.toObject());
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
    const t = new Topic({ ...data, subjectId });
    const saved = await t.save();
    return addId(saved.toObject());
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
    const allDone = subject.topics && subject.topics.length > 0 && subject.topics.every(t => t.isCompleted);
    await Subject.findByIdAndUpdate(subjectId, { status: allDone ? 'done' : 'ongoing' });
  }

  async deleteTopic(topicId) {
    const topic = await Topic.findById(topicId).lean();
    await Topic.findByIdAndDelete(topicId);
    if (topic) await this.updateSubjectStatus(topic.subjectId);
  }
}

export default new SyllabusRepository();
