import { body } from 'express-validator';

export const createFeeValidation = [
  body('studentId')
    .isUUID().withMessage('Invalid student ID'),
  body('month')
    .trim()
    .notEmpty().withMessage('Month is required'),
  body('year')
    .isInt({ min: 2020, max: 2100 }).withMessage('Invalid year'),
  body('amount')
    .optional()
    .isInt({ min: 0 }).withMessage('Amount must be positive'),
  body('status')
    .optional()
    .isIn(['paid', 'pending']).withMessage('Status must be paid or pending'),
  body('paymentMode')
    .optional()
    .isIn(['cash', 'upi', 'bank']).withMessage('Invalid payment mode')
];

export const recordPaymentValidation = [
  body('paymentMode')
    .optional()
    .isIn(['cash', 'upi', 'bank']).withMessage('Invalid payment mode')
];
