import { Router } from 'express';
import teacherController from '../controllers/teacherController.js';
import { validate } from '../middlewares/validate.js';
import { createTeacherValidation, loginTeacherValidation } from '../dto/teacherDto.js';

const router = Router();

router.post('/', validate(createTeacherValidation), teacherController.register);
router.post('/login', validate(loginTeacherValidation), teacherController.login);
router.get('/', teacherController.getAll);
router.get('/trash', teacherController.getTrash);
router.get('/:id', teacherController.getById);
router.put('/:id', teacherController.update);
router.delete('/:id', teacherController.delete);
router.post('/:id/restore', teacherController.restore);
router.delete('/:id/permanent', teacherController.permanentDelete);

export default router;
