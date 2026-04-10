import { body } from 'express-validator';

export const markAttendanceValidation = [
  body('classId')
    .isUUID().withMessage('Invalid class ID'),
  body('date')
    .optional()
    .isISO8601().withMessage('Invalid date format'),
  body('records')
    .isArray({ min: 1 }).withMessage('Records must be an array'),
  body('records.*.studentId')
    .isUUID().withMessage('Invalid student ID'),
  body('records.*.status')
    .isIn(['present', 'absent', 'late']).withMessage('Status must be present, absent, or late')
];
