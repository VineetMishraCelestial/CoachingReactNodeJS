import { body } from 'express-validator';

export const createTeacherValidation = [
  body('teacherName')
    .trim()
    .notEmpty().withMessage('Teacher name is required'),
  body('joiningDate')
    .trim()
    .notEmpty().withMessage('Joining date is required')
    .isISO8601().withMessage('Joining date must be in YYYY-MM-DD format'),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required'),
  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('qualification')
    .trim()
    .notEmpty().withMessage('Qualification is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];

export const loginTeacherValidation = [
  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('password')
    .notEmpty().withMessage('Password is required')
];
