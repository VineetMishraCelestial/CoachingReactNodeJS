import noticeRepository from '../repositories/noticeRepository.js';
import classRepository from '../repositories/classRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class NoticeService {
  async create(instituteId, data) {
    if (data.classId) {
      const classData = await classRepository.findById(data.classId);
      if (!classData || classData.instituteId?.toString() !== instituteId) {
        throw new BadRequestError('Invalid class');
      }
    }

    return noticeRepository.create({
      ...data,
      instituteId
    });
  }

  async getById(id) {
    const notice = await noticeRepository.findById(id);
    if (!notice) {
      throw new NotFoundError('Notice not found');
    }
    return notice;
  }

  async getByInstitute(instituteId, filters = {}) {
    return noticeRepository.findByInstitute(instituteId, filters);
  }

  async update(id, instituteId, data) {
    const notice = await noticeRepository.findById(id);
    if (!notice) {
      throw new NotFoundError('Notice not found');
    }
    if (notice.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Not authorized');
    }

    if (data.classId) {
      const classData = await classRepository.findById(data.classId);
      if (!classData || classData.instituteId?.toString() !== instituteId) {
        throw new BadRequestError('Invalid class');
      }
    }

    return noticeRepository.update(id, data);
  }

  async delete(id, instituteId) {
    const notice = await noticeRepository.findById(id);
    if (!notice) {
      throw new NotFoundError('Notice not found');
    }
    if (notice.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Not authorized');
    }

    return noticeRepository.delete(id);
  }
}

export default new NoticeService();
