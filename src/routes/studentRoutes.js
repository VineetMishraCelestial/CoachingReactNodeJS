import { Router } from 'express';
import studentController from '../controllers/studentController.js';
import { validate } from '../middlewares/validate.js';
import { createStudentValidation, updateStudentValidation } from '../dto/studentDto.js';

const router = Router();

router.post('/', validate(createStudentValidation), studentController.create);
router.get('/', studentController.getAll);
router.get('/trash', studentController.getTrash);
router.get('/:id', studentController.getById);
router.get('/:id/attendance', studentController.getAttendanceStats);
router.put('/:id', validate(updateStudentValidation), studentController.update);
router.delete('/:id', studentController.delete);
router.post('/:id/restore', studentController.restore);
router.delete('/:id/permanent', studentController.permanentDelete);

export default router;
