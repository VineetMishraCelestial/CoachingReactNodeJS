import Notice from '../models/Notice.js';

export class NoticeRepository {
  async create(data) {
    const notice = new Notice(data);
    const saved = await notice.save();
    return saved.toObject();
  }

  async findById(id) {
    return Notice.findById(id).lean();
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId } = filters;
    const query = { instituteId };
    if (classId) query.classId = classId;

    return Notice.find(query)
      .sort({ createdAt: -1 })
      .lean();
  }

  async update(id, data) {
    return Notice.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async delete(id) {
    return Notice.findByIdAndDelete(id).lean();
  }
}

export default new NoticeRepository();
