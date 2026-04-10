import studentService from '../services/studentService.js';
import { successResponse, paginatedResponse } from '../utils/response.js';

export class StudentController {
  async create(req, res, next) {
    try {
      const student = await studentService.create(req.user.id, req.body);
      return successResponse(res, student, 'Student added successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20, classId } = req.query;
      const filters = {};
      if (classId) filters.classId = classId;

      const result = await studentService.getByInstitute(req.user.id, filters, { page: parseInt(page), limit: parseInt(limit) });
      return paginatedResponse(res, result.students, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }, 'Students retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const student = await studentService.getById(req.params.id);
      return successResponse(res, student, 'Student retrieved');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const student = await studentService.update(req.params.id, req.user.id, req.body);
      return successResponse(res, student, 'Student updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await studentService.delete(req.params.id, req.user.id);
      return successResponse(res, null, 'Student deleted');
    } catch (error) {
      next(error);
    }
  }

  async getTrash(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await studentService.getTrash(req.user.id, { page: parseInt(page), limit: parseInt(limit) });
      return paginatedResponse(res, result.students, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }, 'Trash retrieved');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      await studentService.restore(req.params.id, req.user.id);
      return successResponse(res, null, 'Student restored');
    } catch (error) {
      next(error);
    }
  }

  async permanentDelete(req, res, next) {
    try {
      await studentService.permanentDelete(req.params.id, req.user.id);
      return successResponse(res, null, 'Student permanently deleted');
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceStats(req, res, next) {
    try {
      const { month, year } = req.query;
      const stats = await studentService.getAttendanceStats(
        req.params.id,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined
      );
      return successResponse(res, stats, 'Attendance stats retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();
