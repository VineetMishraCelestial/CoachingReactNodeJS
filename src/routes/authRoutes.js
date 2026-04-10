import { Router } from 'express';
import authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerValidation, loginValidation, refreshValidation } from '../dto/authDto.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);
router.post('/refresh', validate(refreshValidation), authController.refresh);
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

export default router;
