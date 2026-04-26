import parentService from '../services/parentService.js';
import { successResponse } from '../utils/response.js';

export class ParentController {
  async getMyChildren(req, res, next) {
    try {
      const children = await parentService.getMyChildren(req.user.id);
      return successResponse(res, children, 'Children retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getChildAttendance(req, res, next) {
    try {
      const { month, year } = req.query;
      const attendance = await parentService.getChildAttendance(
        req.user.id,
        req.params.studentId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined
      );
      return successResponse(res, attendance, 'Attendance retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getChildFeeHistory(req, res, next) {
    try {
      const fees = await parentService.getChildFeeHistory(req.user.id, req.params.studentId);
      return successResponse(res, fees, 'Fee history retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getChildSyllabus(req, res, next) {
    try {
      const syllabus = await parentService.getChildSyllabus(req.user.id, req.params.studentId);
      return successResponse(res, syllabus, 'Syllabus retrieved');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { mobile, name, password } = req.body;
      const result = await parentService.updateProfile(req.user.id, { mobile, name, password });
      return successResponse(res, result, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }
}

export default new ParentController();