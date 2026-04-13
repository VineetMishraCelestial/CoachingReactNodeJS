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

    const attendanceRecords = records.map(record => ({
      studentId: record.studentId,
      classId,
      teacherId,
      date: new Date(date),
      status: record.status
    }));

    for (const record of attendanceRecords) {
      await attendanceRepository.upsert(record.studentId, record.classId, record.date, record.status);
    }

    return this.getClassAttendance(classId, date);
  }

  async getClassAttendance(classId, date) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const attendances = await attendanceRepository.findByClassAndDate(classId, date || new Date());
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

  async getClassStats(classId, month, year) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    return attendanceRepository.getClassStats(
      classId,
      month || new Date().getMonth() + 1,
      year || new Date().getFullYear()
    );
  }

  async getMonthlyAttendance(classId, year, month) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const attendances = await attendanceRepository.getMonthlyAttendance(
      classId,
      year || new Date().getFullYear(),
      month || new Date().getMonth() + 1
    );

    const students = classData.students;
    const daysInMonth = new Date(year, month, 0).getDate();

    const result = students.map(student => {
      const studentAttendance = attendances.filter(a => a.studentId === student.id);
      const days = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const record = studentAttendance.find(a => {
          const recordDate = new Date(a.date);
          return recordDate.getDate() === day;
        });
        days.push({
          date: date.toISOString().split('T')[0],
          status: record?.status || 'pending'
        });
      }

      return {
        studentId: student.id,
        name: student.name,
        days
      };
    });

    return result;
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
