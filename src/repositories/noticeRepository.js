import mongoose from 'mongoose';
import Notice from '../models/Notice.js';
import { toPlainObject } from '../utils/helpers.js';

export class NoticeRepository {
  async create(data) {
    if (data.instituteId) {
      data.instituteId = new mongoose.Types.ObjectId(data.instituteId);
    }
    const notice = new Notice(data);
    const saved = await notice.save();
    return toPlainObject(saved.toObject());
  }

  async findById(id) {
    const notice = await Notice.findById(id).lean();
    return toPlainObject(notice);
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId } = filters;
    const query = { instituteId };
    if (classId) query.classId = classId;

    const notices = await Notice.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return toPlainObject(notices);
  }

  async update(id, data) {
    const notice = await Notice.findByIdAndUpdate(id, data, { new: true }).lean();
    return toPlainObject(notice);
  }

  async delete(id) {
    const notice = await Notice.findByIdAndDelete(id).lean();
    return toPlainObject(notice);
  }
}

export default new NoticeRepository();
