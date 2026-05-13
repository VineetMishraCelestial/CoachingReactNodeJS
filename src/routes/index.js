import { Router } from 'express';
import authRoutes from './authRoutes.js';
import classRoutes from './classRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import studentRoutes from './studentRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import feeRoutes from './feeRoutes.js';
import syllabusRoutes from './syllabusRoutes.js';
import homeworkRoutes from './homeworkRoutes.js';
import noticeRoutes from './noticeRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import parentRoutes from './parentRoutes.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/parent', authenticate, parentRoutes);

router.use('/classes', authenticate, authorize('institute', 'teacher'), classRoutes);
router.use('/teachers', authenticate, authorize('institute'), teacherRoutes);
router.use('/students', authenticate, authorize('institute', 'teacher'), studentRoutes);
router.use('/attendance', authenticate, authorize('institute', 'teacher'), attendanceRoutes);
router.use('/fees', authenticate, authorize('institute'), feeRoutes);
router.use('/syllabus', authenticate, authorize('institute', 'teacher'), syllabusRoutes);
router.use('/homework', authenticate, authorize('institute'), homeworkRoutes);
router.use('/notices', authenticate, authorize('institute'), noticeRoutes);
router.use('/dashboard', authenticate, authorize('institute'), dashboardRoutes);

export default router;
