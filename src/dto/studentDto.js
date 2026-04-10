import { body } from 'express-validator';

export const createStudentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Student name is required'),
  body('parentMobile')
    .trim()
    .notEmpty().withMessage('Parent mobile is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('classId')
    .isUUID().withMessage('Invalid class ID'),
  body('address')
    .optional()
    .trim(),
  body('joiningDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('initialFee')
    .optional()
    .isObject().withMessage('Initial fee must be an object'),
  body('initialFee.amount')
    .optional()
    .isInt({ min: 0 }).withMessage('Amount must be positive'),
  body('initialFee.status')
    .optional()
    .isIn(['pending', 'paid']).withMessage('Status must be pending or paid'),
  body('initialFee.paymentMode')
    .optional()
    .isIn(['cash', 'upi', 'bank']).withMessage('Invalid payment mode'),
  body('initialFee.note')
    .optional()
    .trim()
];

export const updateStudentValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Student name cannot be empty'),
  body('parentMobile')
    .optional()
    .trim()
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('classId')
    .optional()
    .isUUID().withMessage('Invalid class ID'),
  body('address')
    .optional()
    .trim()
];
