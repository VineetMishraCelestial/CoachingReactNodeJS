import { Router } from 'express';
import studentController from '../controllers/studentController.js';
import { validate } from '../middlewares/validate.js';
import { createStudentValidation, updateStudentValidation } from '../dto/studentDto.js';
import { authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', studentController.getAll);
router.get('/trash', authorize('institute'), studentController.getTrash);
router.get('/:id', studentController.getById);
router.get('/:id/attendance', studentController.getAttendanceStats);
router.post('/', authorize('institute'), validate(createStudentValidation), studentController.create);
router.put('/:id', authorize('institute'), validate(updateStudentValidation), studentController.update);
router.delete('/:id', authorize('institute'), studentController.delete);
router.post('/:id/restore', authorize('institute'), studentController.restore);
router.delete('/:id/permanent', authorize('institute'), studentController.permanentDelete);

export default router;
