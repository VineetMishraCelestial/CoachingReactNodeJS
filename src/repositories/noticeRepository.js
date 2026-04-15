import Notice from '../models/Notice.js';

export class NoticeRepository {
  async create(data) {
    const notice = new Notice(data);
    return notice.save();
  }

  async findById(id) {
    return Notice.findById(id);
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId } = filters;
    const query = { instituteId };
    if (classId) query.classId = classId;

    return Notice.find(query)
      .sort({ createdAt: -1 });
  }

  async update(id, data) {
    return Notice.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return Notice.findByIdAndDelete(id);
  }
}

export default new NoticeRepository();
