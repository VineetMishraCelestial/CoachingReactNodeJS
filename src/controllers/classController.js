import classService from '../services/classService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export class ClassController {
  async create(req, res, next) {
    try {
      const classData = await classService.create(req.user.id, req.body);
      return successResponse(res, classData, 'Class created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const classes = await classService.getByInstitute(req.user.id);
      return successResponse(res, classes, 'Classes retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const classData = await classService.getById(req.params.id);
      return successResponse(res, classData, 'Class retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const classData = await classService.update(req.params.id, req.user.id, req.body);
      return successResponse(res, classData, 'Class updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await classService.delete(req.params.id, req.user.id);
      return successResponse(res, null, 'Class deleted');
    } catch (error) {
      next(error);
    }
  }

  async getTrash(req, res, next) {
    try {
      const classes = await classService.getTrash(req.user.id);
      return successResponse(res, classes, 'Trash retrieved');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      await classService.restore(req.params.id, req.user.id);
      return successResponse(res, null, 'Class restored');
    } catch (error) {
      next(error);
    }
  }

  async permanentDelete(req, res, next) {
    try {
      await classService.permanentDelete(req.params.id, req.user.id);
      return successResponse(res, null, 'Class permanently deleted');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await classService.getStats(req.user.id);
      return successResponse(res, stats, 'Stats retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export default new ClassController();
