import homeworkService from '../services/homeworkService.js';
import { successResponse } from '../utils/response.js';

export class HomeworkController {
  async create(req, res, next) {
    try {
      const { classId, ...data } = req.body;
      const homework = await homeworkService.create(classId, req.user.id, data);
      return successResponse(res, homework, 'Homework added', 201);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const homework = await homeworkService.getById(req.params.id);
      return successResponse(res, homework, 'Homework retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getByClass(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};
      if (status) filters.status = status;

      const homeworks = await homeworkService.getByClass(req.params.classId, req.user.id, filters);
      return successResponse(res, homeworks, 'Homeworks retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const homework = await homeworkService.update(req.params.id, req.user.id, req.body);
      return successResponse(res, homework, 'Homework updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await homeworkService.delete(req.params.id, req.user.id);
      return successResponse(res, null, 'Homework deleted');
    } catch (error) {
      next(error);
    }
  }

  async submit(req, res, next) {
    try {
      const { homeworkId, studentId } = req.body;
      const submission = await homeworkService.submitHomework(homeworkId, studentId);
      return successResponse(res, submission, 'Homework submitted');
    } catch (error) {
      next(error);
    }
  }
}

export default new HomeworkController();
