import feeService from '../services/feeService.js';
import { successResponse } from '../utils/response.js';

export class FeeController {
  async create(req, res, next) {
    try {
      const { studentId, ...data } = req.body;
      const fee = await feeService.create(studentId, data);
      return successResponse(res, fee, 'Fee record created', 201);
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req, res, next) {
    try {
      const fees = await feeService.getByStudent(req.params.studentId);
      return successResponse(res, fees, 'Fee history retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getByClass(req, res, next) {
    try {
      const fees = await feeService.getByClass(req.params.classId);
      return successResponse(res, fees, 'Class fees retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getByInstitute(req, res, next) {
    try {
      const { classId, status, month, year } = req.query;
      const filters = {};
      if (classId) filters.classId = classId;
      if (status) filters.status = status;
      if (month) filters.month = month;
      if (year) filters.year = year;

      const fees = await feeService.getByInstitute(req.user.id, filters);
      return successResponse(res, fees, 'Fees retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await feeService.getStats(req.user.id);
      return successResponse(res, stats, 'Fee stats retrieved');
    } catch (error) {
      next(error);
    }
  }

  async recordPayment(req, res, next) {
    try {
      const { paymentMode, discount, total } = req.body;
      const fee = await feeService.recordPayment(req.params.id, { paymentMode, discount, total });
      return successResponse(res, fee, 'Payment recorded');
    } catch (error) {
      next(error);
    }
  }

  async getClassWise(req, res, next) {
    try {
      const result = await feeService.getClassWiseFees(req.user.id);
      return successResponse(res, result, 'Class-wise fees retrieved');
    } catch (error) {
      next(error);
    }
  }

  async generateMonthlyFees(req, res, next) {
    try {
      const { month, year } = req.body;
      const result = await feeService.generateMonthlyFees(req.user.id, month, year);
      return successResponse(res, result, 'Monthly fees generated');
    } catch (error) {
      next(error);
    }
  }

  async generateAdvanceFees(req, res, next) {
    try {
      const { month, year } = req.body;
      const result = await feeService.generateAdvanceFees(req.user.id, month, year);
      return successResponse(res, result, 'Advance fees generated');
    } catch (error) {
      next(error);
    }
  }
}

export default new FeeController();
