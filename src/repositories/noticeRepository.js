import mongoose from 'mongoose';
import Notice from '../models/Notice.js';

const addId = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(d => addId(d));
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
};

export class NoticeRepository {
  async create(data) {
    if (data.instituteId) data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    const n = new Notice(data);
    const saved = await n.save();
    return addId(saved.toObject());
  }

  async findById(id) {
    return Notice.findById(id).lean();
  }

  async findByInstitute(instituteId, filters = {}) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const query = { instituteId: objId };
    if (filters.classId) query.classId = filters.classId;
    return Notice.find(query).sort({ createdAt: -1 }).lean();
  }

  async update(id, data) {
    return Notice.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Notice.findByIdAndDelete(id).lean();
  }
}

export default new NoticeRepository();
