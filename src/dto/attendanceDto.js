import { body } from 'express-validator';

export const markAttendanceValidation = [
  body('classId')
    .isUUID().withMessage('Invalid class ID'),
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('records')
    .isArray({ min: 1 }).withMessage('Records must be an array'),
  body('records.*.studentId')
    .isUUID().withMessage('Invalid student ID'),
  body('records.*.status')
    .isIn(['present', 'absent', 'late']).withMessage('Status must be present, absent, or late')
];
