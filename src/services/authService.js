import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import userRepository from '../repositories/userRepository.js';
import teacherRepository from '../repositories/teacherRepository.js';
import { UnauthorizedError, ConflictError } from '../utils/errors.js';

export class AuthService {
  async register(data) {
    const { mobile, password, role, name, email, instituteName, city } = data;

    const existingUser = await userRepository.findByMobile(mobile);
    if (existingUser) {
      throw new ConflictError('Mobile number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await userRepository.create({
      mobile,
      password: hashedPassword,
      role: role || 'teacher',
      name,
      email,
      instituteName,
      city
    });

    if (user.role === 'teacher') {
      await teacherRepository.create({
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        instituteId: user.id,
        isActive: true
      });
    }
    
    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    
    return { user: this.sanitizeUser(user), token, refreshToken };
  }

  async login(mobile, password) {
    const user = await userRepository.findByMobile(mobile);
    if (!user) {
      throw new UnauthorizedError('Invalid mobile or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid mobile or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    
    return { user: this.sanitizeUser(user), token, refreshToken };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedError('User not found or inactive');
      }

      const newToken = this.generateToken(user.id);
      const newRefreshToken = this.generateRefreshToken(user.id);
      
      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId, data) {
    const { name, email, instituteName, city, password } = data;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (instituteName !== undefined) updateData.instituteName = instituteName;
    if (city !== undefined) updateData.city = city;
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await userRepository.update(userId, updateData);
    return this.sanitizeUser(user);
  }

  generateToken(userId) {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}

export default new AuthService();
