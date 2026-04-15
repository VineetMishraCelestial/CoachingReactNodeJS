import { body } from 'express-validator';

export const markAttendanceValidation = [
  body('classId')
    .notEmpty().withMessage('Class ID is required'),
  body('date')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
  body('records')
    .isArray({ min: 1 }).withMessage('Records must be an array'),
  body('records.*.studentId')
    .notEmpty().withMessage('Student ID is required'),
  body('records.*.status')
    .isIn(['present', 'absent', 'late']).withMessage('Status must be present, absent, or late')
];
