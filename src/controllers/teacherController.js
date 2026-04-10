import teacherService from '../services/teacherService.js';
import { successResponse } from '../utils/response.js';

export class TeacherController {
  async register(req, res, next) {
    try {
      const result = await teacherService.register(req.user.id, req.body);
      return successResponse(res, result, 'Teacher registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { mobile, password } = req.body;
      const result = await teacherService.login(mobile, password);
      return successResponse(res, result, 'Teacher login successful');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const teachers = await teacherService.getByInstitute(req.user.id);
      return successResponse(res, teachers, 'Teachers retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const teacher = await teacherService.getById(req.params.id);
      return successResponse(res, teacher, 'Teacher retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const teacher = await teacherService.update(req.params.id, req.body);
      return successResponse(res, teacher, 'Teacher updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await teacherService.delete(req.params.id);
      return successResponse(res, null, 'Teacher deleted');
    } catch (error) {
      next(error);
    }
  }

  async getTrash(req, res, next) {
    try {
      const teachers = await teacherService.getTrash(req.user.id);
      return successResponse(res, teachers, 'Trash retrieved');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      await teacherService.restore(req.params.id, req.user.id);
      return successResponse(res, null, 'Teacher restored');
    } catch (error) {
      next(error);
    }
  }

  async permanentDelete(req, res, next) {
    try {
      await teacherService.permanentDelete(req.params.id, req.user.id);
      return successResponse(res, null, 'Teacher permanently deleted');
    } catch (error) {
      next(error);
    }
  }
}

export default new TeacherController();
