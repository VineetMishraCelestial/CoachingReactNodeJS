import studentRepository from '../repositories/studentRepository.js';
import classRepository from '../repositories/classRepository.js';
import feeRepository from '../repositories/feeRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class StudentService {
  async create(instituteId, data) {
    const classData = await classRepository.findById(data.classId);
    if (!classData || classData.instituteId?.toString() !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    const { initialFee, joiningDate, ...studentData } = data;
    
    const student = await studentRepository.create({
      ...studentData,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      instituteId
    });

    if (initialFee) {
      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'short' });
      const currentYear = now.getFullYear();
      const amount = initialFee.amount || classData.monthlyFee;

      await feeRepository.create({
        studentId: student.id,
        month: currentMonth,
        year: currentYear,
        amount,
        status: initialFee.status || 'pending',
        paidDate: initialFee.status === 'paid' ? new Date() : null,
        paymentMode: initialFee.paymentMode,
        note: initialFee.note || null
      });
    }

    return this.enrichStudent(student, classData);
  }

  async getById(id) {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    const enriched = this.enrichStudent(student);
    return {
      ...enriched,
      initialFee: null
    };
  }

  async getByInstitute(instituteId, filters = {}, pagination = {}) {
    const result = await studentRepository.findByInstitute(instituteId, filters, pagination);
    
    const enrichedStudents = result.students.map(s => {
      const latestFee = s.fees[0];
      return {
        ...s,
        initialFee: latestFee ? {
          amount: latestFee.amount,
          status: latestFee.status,
          paymentMode: latestFee.paymentMode,
          paidDate: latestFee.paidDate,
          note: latestFee.note
        } : null
      };
    });

    return { ...result, students: enrichedStudents };
  }

  async update(id, instituteId, data) {
    const student = await studentRepository.findById(id);
    if (!student || student.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Student not found');
    }

    if (data.classId) {
      const classData = await classRepository.findById(data.classId);
      if (!classData || classData.instituteId?.toString() !== instituteId) {
        throw new BadRequestError('Invalid class');
      }
    }

    return studentRepository.update(id, data);
  }

  async delete(id, instituteId) {
    const student = await studentRepository.findById(id);
    if (!student || student.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Student not found');
    }

    return studentRepository.update(id, { isActive: false });
  }

  async getTrash(instituteId, pagination = {}) {
    return studentRepository.findTrash(instituteId, pagination);
  }

  async restore(id, instituteId) {
    const student = await studentRepository.findById(id);
    if (!student || student.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Student not found');
    }

    return studentRepository.update(id, { isActive: true });
  }

  async permanentDelete(id, instituteId) {
    const student = await studentRepository.findById(id);
    if (!student || student.instituteId?.toString() !== instituteId) {
      throw new NotFoundError('Student not found');
    }

    return studentRepository.permanentDelete(id);
  }

  async getAttendanceStats(studentId, month, year) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return studentRepository.getAttendanceStats(studentId, month || new Date().getMonth() + 1, year || new Date().getFullYear());
  }

  enrichStudent(student, classData = null) {
    const { password, ...sanitized } = student;
    return sanitized;
  }
}

export default new StudentService();
