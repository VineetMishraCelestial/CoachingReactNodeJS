import attendanceService from '../services/attendanceService.js';
import { successResponse } from '../utils/response.js';

export class AttendanceController {
  async markAttendance(req, res, next) {
    try {
      const { classId, date, records } = req.body;
      const teacherId = req.body.teacherId || null;
      const result = await attendanceService.markAttendance(teacherId, classId, date, records);
      return successResponse(res, result, 'Attendance marked successfully');
    } catch (error) {
      next(error);
    }
  }

  async getClassAttendance(req, res, next) {
    try {
      const { classId, date } = req.query;
      const result = await attendanceService.getClassAttendance(classId, date);
      return successResponse(res, result, 'Attendance retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getClassStats(req, res, next) {
    try {
      const { classId, month, year } = req.query;
      const result = await attendanceService.getClassStats(
        classId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined
      );
      return successResponse(res, result, 'Class attendance stats retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getStudentAttendance(req, res, next) {
    try {
      const { studentId, month, year } = req.query;
      const result = await attendanceService.getStudentAttendance(
        studentId,
        month ? parseInt(month) : undefined,
        year ? parseInt(year) : undefined
      );
      return successResponse(res, result, 'Student attendance retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
