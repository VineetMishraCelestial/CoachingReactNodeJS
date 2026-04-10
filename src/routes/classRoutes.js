import { Router } from 'express';
import classController from '../controllers/classController.js';
import { validate } from '../middlewares/validate.js';
import { createClassValidation, updateClassValidation } from '../dto/classDto.js';

const router = Router();

router.post('/', validate(createClassValidation), classController.create);
router.get('/', classController.getAll);
router.get('/trash', classController.getTrash);
router.get('/stats', classController.getStats);
router.get('/:id', classController.getById);
router.put('/:id', validate(updateClassValidation), classController.update);
router.delete('/:id', classController.delete);
router.post('/:id/restore', classController.restore);
router.delete('/:id/permanent', classController.permanentDelete);

export default router;
