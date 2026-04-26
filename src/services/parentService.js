import studentRepository from '../repositories/studentRepository.js';
import feeRepository from '../repositories/feeRepository.js';
import attendanceRepository from '../repositories/attendanceRepository.js';
import syllabusRepository from '../repositories/syllabusRepository.js';
import userRepository from '../repositories/userRepository.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export class ParentService {
  async getMyChildren(parentId) {
    const students = await studentRepository.findByParentId(parentId);
    if (!students || students.length === 0) {
      throw new NotFoundError('No children found');
    }
    return students;
  }

  async getChildAttendance(parentId, studentId, month, year) {
    await this.validateChild(parentId, studentId);
    return attendanceRepository.findByStudentDateWise(studentId, month, year);
  }

  async getChildFeeHistory(parentId, studentId) {
    await this.validateChild(parentId, studentId);
    return feeRepository.findByStudent(studentId);
  }

  async getChildSyllabus(parentId, studentId) {
    await this.validateChild(parentId, studentId);
    const student = await studentRepository.findById(studentId);
    const classId = student.classId || (student.class && student.class.id);
    if (!classId) {
      throw new NotFoundError('Student has no class assigned');
    }
    return syllabusRepository.findByClass(classId);
  }

  async updateProfile(parentId, data) {
    const { mobile, name, password } = data;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (password !== undefined) {
      const bcrypt = (await import('bcryptjs')).default;
      updateData.password = await bcrypt.hash(password, 12);
    }
    if (mobile !== undefined) {
      const existing = await userRepository.findByMobile(mobile);
      if (existing && existing.id !== parentId) {
        throw new ForbiddenError('Mobile already in use');
      }
      updateData.mobile = mobile;
    }
    const result = await userRepository.update(parentId, updateData);
    const { password: pwd, ...sanitized } = result;
    return sanitized;
  }

  async validateChild(parentId, studentId) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    if (student.parentId?.toString() !== parentId.toString()) {
      throw new ForbiddenError('Access denied');
    }
  }
}

export default new ParentService();