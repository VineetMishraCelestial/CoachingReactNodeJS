import { body } from 'express-validator';

export const registerValidation = [
  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 100 }).withMessage('Email must be less than 100 characters'),
  body('instituteName')
    .trim()
    .notEmpty().withMessage('Institute name is required')
    .isLength({ max: 200 }).withMessage('Institute name must be less than 200 characters'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
  body('role')
    .optional()
    .isIn(['institute', 'teacher']).withMessage('Role must be institute or teacher')
];

export const loginValidation = [
  body('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile must be 10 digits'),
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const refreshValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 100 }).withMessage('Email must be less than 100 characters'),
  body('instituteName')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Institute name must be less than 200 characters'),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City must be less than 100 characters'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];
