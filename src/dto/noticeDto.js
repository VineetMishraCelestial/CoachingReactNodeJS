import { body } from 'express-validator';

export const createNoticeValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required'),
  body('type')
    .optional()
    .isIn(['general', 'urgent', 'fee', 'holiday']).withMessage('Invalid type'),
  body('priority')
    .optional()
    .isIn(['normal', 'high', 'low']).withMessage('Invalid priority')
];

export const updateNoticeValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty'),
  body('message')
    .optional()
    .trim()
    .notEmpty().withMessage('Message cannot be empty'),
  body('type')
    .optional()
    .isIn(['general', 'urgent', 'fee', 'holiday']).withMessage('Invalid type'),
  body('priority')
    .optional()
    .isIn(['normal', 'high', 'low']).withMessage('Invalid priority')
];
