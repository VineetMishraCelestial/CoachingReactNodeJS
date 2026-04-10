import { Router } from 'express';
import feeController from '../controllers/feeController.js';
import { validate } from '../middlewares/validate.js';
import { createFeeValidation, recordPaymentValidation } from '../dto/feeDto.js';

const router = Router();

router.post('/', validate(createFeeValidation), feeController.create);
router.post('/generate', feeController.generateMonthlyFees);
router.post('/generate-advance', feeController.generateAdvanceFees);
router.get('/', feeController.getByInstitute);
router.get('/stats', feeController.getStats);
router.get('/class-wise', feeController.getClassWise);
router.get('/student/:studentId', feeController.getByStudent);
router.get('/class/:classId', feeController.getByClass);
router.put('/:id/payment', validate(recordPaymentValidation), feeController.recordPayment);

export default router;
