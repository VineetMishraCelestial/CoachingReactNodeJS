import { Router } from 'express';
import noticeController from '../controllers/noticeController.js';
import { validate } from '../middlewares/validate.js';
import { createNoticeValidation, updateNoticeValidation } from '../dto/noticeDto.js';

const router = Router();

router.post('/', validate(createNoticeValidation), noticeController.create);
router.get('/', noticeController.getAll);
router.get('/:id', noticeController.getById);
router.put('/:id', validate(updateNoticeValidation), noticeController.update);
router.delete('/:id', noticeController.delete);

export default router;
