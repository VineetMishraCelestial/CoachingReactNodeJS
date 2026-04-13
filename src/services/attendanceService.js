import attendanceRepository from '../repositories/attendanceRepository.js';
import classRepository from '../repositories/classRepository.js';
import studentRepository from '../repositories/studentRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class AttendanceService {
  async markAttendance(teacherId, classId, date, records) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    for (const record of records) {
      await attendanceRepository.upsert(record.studentId, classId, date, record.status);
    }

    return this.getClassAttendance(classId, date);
  }

  async getClassAttendance(classId, date) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const attendances = await attendanceRepository.findByClassAndDate(classId, date);
    const students = classData.students;

    return students.map(student => {
      const attendance = attendances.find(a => a.studentId === student.id);
      return {
        studentId: student.id,
        name: student.name,
        status: attendance?.status || 'pending'
      };
    });
  }

  async getClassAttendanceByDate(classId, date) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const attendances = await attendanceRepository.findByClassAndDate(classId, date);
    const students = classData.students;

    return students.map(student => {
      const attendance = attendances.find(a => a.studentId === student.id);
      return {
        studentId: student.id,
        name: student.name,
        status: attendance?.status || 'pending'
      };
    });
  }

  async getStudentAttendance(studentId, month, year) {
    const student = await studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    const stats = await studentRepository.getAttendanceStats(
      studentId,
      month || new Date().getMonth() + 1,
      year || new Date().getFullYear()
    );

    return {
      ...stats,
      percentage: stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0
    };
  }
}

export default new AttendanceService();
