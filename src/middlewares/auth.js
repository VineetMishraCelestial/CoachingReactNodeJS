import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UnauthorizedError } from '../utils/errors.js';
import prisma from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        mobile: true,
        role: true,
        name: true,
        instituteName: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new UnauthorizedError('Access denied. Insufficient permissions.'));
    }
    next();
  };
};
