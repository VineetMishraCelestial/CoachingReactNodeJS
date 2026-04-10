import { Router } from 'express';
import homeworkController from '../controllers/homeworkController.js';
import { validate } from '../middlewares/validate.js';
import { createHomeworkValidation, updateHomeworkValidation, submitHomeworkValidation } from '../dto/homeworkDto.js';

const router = Router();

router.post('/', validate(createHomeworkValidation), homeworkController.create);
router.get('/class/:classId', homeworkController.getByClass);
router.get('/:id', homeworkController.getById);
router.put('/:id', validate(updateHomeworkValidation), homeworkController.update);
router.delete('/:id', homeworkController.delete);
router.post('/submit', validate(submitHomeworkValidation), homeworkController.submit);

export default router;
