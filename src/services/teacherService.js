import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import teacherRepository from '../repositories/teacherRepository.js';
import userRepository from '../repositories/userRepository.js';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.js';

export class TeacherService {
  async register(instituteId, data) {
    const { teacherName, joiningDate, subject, mobile, qualification, email, password } = data;

    const existingTeacher = await teacherRepository.findByMobile(mobile);
    if (existingTeacher) {
      throw new ConflictError('Teacher mobile already registered');
    }

    const existingUser = await userRepository.findByMobile(mobile);
    if (existingUser) {
      throw new ConflictError('Mobile number already registered as user');
    }

    const teacher = await teacherRepository.create({
      name: teacherName,
      joiningDate: new Date(joiningDate),
      subject,
      mobile,
      qualification,
      email,
      password: '',
      instituteId
    });

    const hashedPassword = await bcrypt.hash(password || mobile, 12);

    await userRepository.create({
      mobile,
      password: hashedPassword,
      role: 'teacher',
      name: teacherName,
      email,
      teacherId: teacher.id,
      instituteId
    });

    return this.sanitizeTeacher(teacher);
  }

  async login(mobile, password) {
    const user = await userRepository.findByMobile(mobile);
    if (!user || user.role !== 'teacher') {
      throw new UnauthorizedError('Invalid mobile or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid mobile or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const teacher = await teacherRepository.findByMobile(mobile);

    const token = this.generateToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return { teacher: this.sanitizeTeacher(teacher), token, refreshToken };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
  }

  async getById(id) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    return this.sanitizeTeacher(teacher);
  }

  async getByInstitute(instituteId) {
    const teachers = await teacherRepository.findByInstitute(instituteId);
    return teachers.map(t => this.sanitizeTeacher(t));
  }

  async update(id, data) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const updateData = { ...data };
    if (data.teacherName) {
      updateData.name = data.teacherName;
      delete updateData.teacherName;
    }
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12);
    }

    return teacherRepository.update(id, updateData);
  }

  async delete(id) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }
    return teacherRepository.update(id, { isActive: false });
  }

  async getTrash(instituteId) {
    return teacherRepository.findTrash(instituteId);
  }

  async restore(id, instituteId) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher || teacher.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Teacher not found');
    }
    return teacherRepository.update(id, { isActive: true });
  }

  async permanentDelete(id, instituteId) {
    const teacher = await teacherRepository.findById(id);
    if (!teacher || teacher.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Teacher not found');
    }
    return teacherRepository.permanentDelete(id);
  }

  sanitizeTeacher(teacher) {
    const { password, classIds, ...sanitized } = teacher;
    const classes = teacher.classes || [];
    return {
      ...sanitized,
      classIds: undefined,
      classes: classes,
      classCount: classes.length
    };
  }
}

export default new TeacherService();
