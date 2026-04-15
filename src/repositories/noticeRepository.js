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
    const n = await Notice.findById(id).lean();
    return n ? addId(n) : null;
  }

  async findByInstitute(instituteId, filters = {}) {
    const objId = new mongoose.Types.ObjectId(instituteId);
    const query = { instituteId: objId };
    if (filters.classId) query.classId = filters.classId;
    const notices = await Notice.find(query).sort({ createdAt: -1 }).lean();
    return addId(notices);
  }

  async update(id, data) {
    const n = await Notice.findByIdAndUpdate(id, data, { new: true }).lean();
    return n ? addId(n) : null;
  }

  async delete(id) {
    const n = await Notice.findByIdAndDelete(id).lean();
    return n ? addId(n) : null;
  }
}

export default new NoticeRepository();
