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
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/parent', authenticate, parentRoutes);

router.use('/classes', authenticate, classRoutes);
router.use('/teachers', authenticate, teacherRoutes);
router.use('/students', authenticate, studentRoutes);
router.use('/attendance', authenticate, attendanceRoutes);
router.use('/fees', authenticate, feeRoutes);
router.use('/syllabus', authenticate, syllabusRoutes);
router.use('/homework', authenticate, homeworkRoutes);
router.use('/notices', authenticate, noticeRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);

export default router;
