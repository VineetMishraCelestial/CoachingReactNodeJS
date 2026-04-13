import { errorResponse } from '../utils/response.js';
import fs from 'fs';
import path from 'path';

const logError = (err, req) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.originalUrl}\nError: ${err.message}\nStack: ${err.stack}\n---\n`;
  
  try {
    fs.appendFileSync(path.join(process.cwd(), 'error.log'), logEntry);
  } catch (e) {
    console.error('Failed to write to error log:', e);
  }
  
  console.error('Error:', err);
};

export const errorHandler = (err, req, res, next) => {
  logError(err, req);

  if (err.statusCode) {
    return errorResponse(res, err.message, err.statusCode, err.errors);
  }

  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry. Resource already exists.', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Resource not found.', 404);
  }

  if (err.code === 'P2003') {
    return errorResponse(res, 'Invalid reference. Related resource not found.', 400);
  }

  return errorResponse(res, 'Internal server error', 500);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
