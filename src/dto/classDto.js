import { body } from 'express-validator';

export const createClassValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Class name is required'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required'),
  body('monthlyFee')
    .optional()
    .isInt({ min: 0 }).withMessage('Monthly fee must be a positive number'),
  body('startTime')
    .optional()
    .trim(),
  body('endTime')
    .optional()
    .trim(),
  body('days')
    .optional()
    .trim()
];

export const updateClassValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Class name cannot be empty'),
  body('subject')
    .optional()
    .trim()
    .notEmpty().withMessage('Subject cannot be empty'),
  body('monthlyFee')
    .optional()
    .isInt({ min: 0 }).withMessage('Monthly fee must be a positive number')
];
