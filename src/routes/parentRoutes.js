import { Router } from 'express';
import parentController from '../controllers/parentController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.get('/children', authenticate, parentController.getMyChildren);
router.get('/children/:studentId/attendance', authenticate, parentController.getChildAttendance);
router.get('/children/:studentId/fees', authenticate, parentController.getChildFeeHistory);
router.get('/children/:studentId/syllabus', authenticate, parentController.getChildSyllabus);
router.put('/profile', authenticate, parentController.updateProfile);

export default router;