import { Router } from 'express';
import classController from '../controllers/classController.js';
import { validate } from '../middlewares/validate.js';
import { createClassValidation, updateClassValidation } from '../dto/classDto.js';
import { authorize } from '../middlewares/auth.js';

const router = Router();

router.get('/', classController.getAll);
router.get('/trash', authorize('institute'), classController.getTrash);
router.get('/stats', authorize('institute'), classController.getStats);
router.get('/:id', classController.getById);
router.post('/', authorize('institute'), validate(createClassValidation), classController.create);
router.put('/:id', authorize('institute'), validate(updateClassValidation), classController.update);
router.delete('/:id', authorize('institute'), classController.delete);
router.post('/:id/restore', authorize('institute'), classController.restore);
router.delete('/:id/permanent', authorize('institute'), classController.permanentDelete);

export default router;
