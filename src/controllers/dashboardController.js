import classService from '../services/classService.js';
import feeService from '../services/feeService.js';
import noticeService from '../services/noticeService.js';
import { successResponse } from '../utils/response.js';

export class DashboardController {
  async getStats(req, res, next) {
    try {
      const [stats, feeStats] = await Promise.all([
        classService.getStats(req.user.id),
        feeService.getStats(req.user.id)
      ]);

      return successResponse(res, {
        classes: stats.classes,
        teachers: stats.teachers,
        students: stats.students,
        feePending: feeStats.pendingCount,
        feeCollected: feeStats.collected,
        feePendingAmount: feeStats.pending
      }, 'Dashboard stats retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getOverview(req, res, next) {
    try {
      const [classes, recentFees, recentNotices] = await Promise.all([
        classService.getByInstitute(req.user.id),
        feeService.getByInstitute(req.user.id, { status: 'pending' }),
        noticeService.getByInstitute(req.user.id, {})
      ]);

      return successResponse(res, {
        classes,
        pendingFees: recentFees.slice(0, 5),
        notices: recentNotices.slice(0, 3)
      }, 'Dashboard overview retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
