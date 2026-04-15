import { body } from 'express-validator';

export const createHomeworkValidation = [
  body('classId')
    .notEmpty().withMessage('Class ID is required'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required'),
  body('description')
    .optional()
    .trim(),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format')
];

export const updateHomeworkValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty'),
  body('description')
    .optional()
    .trim(),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('status')
    .optional()
    .isIn(['active', 'completed']).withMessage('Status must be active or completed')
];

export const submitHomeworkValidation = [
  body('homeworkId')
    .notEmpty().withMessage('Homework ID is required'),
  body('studentId')
    .notEmpty().withMessage('Student ID is required')
];
