import noticeService from '../services/noticeService.js';
import { successResponse } from '../utils/response.js';

export class NoticeController {
  async create(req, res, next) {
    try {
      const notice = await noticeService.create(req.user.id, req.body);
      return successResponse(res, notice, 'Notice posted', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { classId } = req.query;
      const filters = {};
      if (classId) filters.classId = classId;

      const notices = await noticeService.getByInstitute(req.user.id, filters);
      return successResponse(res, notices, 'Notices retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const notice = await noticeService.getById(req.params.id);
      return successResponse(res, notice, 'Notice retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const notice = await noticeService.update(req.params.id, req.user.id, req.body);
      return successResponse(res, notice, 'Notice updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await noticeService.delete(req.params.id, req.user.id);
      return successResponse(res, null, 'Notice deleted');
    } catch (error) {
      next(error);
    }
  }
}

export default new NoticeController();
