import { Router } from 'express';
import syllabusController from '../controllers/syllabusController.js';
import { validate } from '../middlewares/validate.js';
import { createSyllabusValidation, updateSyllabusValidation, createSubjectValidation, createTopicValidation, updateTopicValidation } from '../dto/syllabusDto.js';

const router = Router();

router.post('/', validate(createSyllabusValidation), syllabusController.create);
router.get('/class/:classId', syllabusController.getByClass);
router.get('/:id', syllabusController.getSyllabusById);
router.put('/:id', validate(updateSyllabusValidation), syllabusController.update);
router.delete('/:id', syllabusController.delete);

router.post('/:syllabusId/subjects', validate(createSubjectValidation), syllabusController.createSubject);
router.put('/subjects/:subjectId', syllabusController.updateSubject);
router.delete('/subjects/:subjectId', syllabusController.deleteSubject);
router.post('/subjects/:subjectId/topics', validate(createTopicValidation), syllabusController.createTopic);
router.put('/topics/:topicId', validate(updateTopicValidation), syllabusController.updateTopic);
router.delete('/topics/:topicId', syllabusController.deleteTopic);

export default router;
