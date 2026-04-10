import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry. Resource already exists.', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Resource not found.', 404);
  }

  return errorResponse(res, 'Internal server error', 500);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
