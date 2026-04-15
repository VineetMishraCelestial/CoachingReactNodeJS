import { body, param } from 'express-validator';

export const createSyllabusValidation = [
  body('classId')
    .notEmpty().withMessage('Class ID is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Syllabus name is required'),
  body('status')
    .optional()
    .isIn(['pending', 'ongoing', 'done']).withMessage('Status must be pending, ongoing, or done')
];

export const updateSyllabusValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Syllabus name cannot be empty'),
  body('status')
    .optional()
    .isIn(['pending', 'ongoing', 'done']).withMessage('Status must be pending, ongoing, or done')
];

export const createSubjectValidation = [
  param('syllabusId')
    .notEmpty().withMessage('Syllabus ID is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Subject name is required')
];

export const createTopicValidation = [
  param('subjectId')
    .notEmpty().withMessage('Subject ID is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Topic name is required')
];

export const updateTopicValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Topic name cannot be empty'),
  body('isCompleted')
    .optional()
    .isBoolean().withMessage('isCompleted must be a boolean')
];
