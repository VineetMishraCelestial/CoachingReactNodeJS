import { Router } from 'express';
import attendanceController from '../controllers/attendanceController.js';
import { validate } from '../middlewares/validate.js';
import { markAttendanceValidation } from '../dto/attendanceDto.js';

const router = Router();

router.post('/', validate(markAttendanceValidation), attendanceController.markAttendance);
router.get('/class', attendanceController.getClassAttendance);
router.get('/class/stats', attendanceController.getClassStats);
router.get('/student', attendanceController.getStudentAttendance);

export default router;
