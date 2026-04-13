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

  async getClassStats(classId, month, year) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const monthNum = month || new Date().getMonth() + 1;
    const yearNum = year || new Date().getFullYear();

    return attendanceRepository.getClassStats(
      classId,
      monthNum,
      yearNum
    );
  }

  async getMonthlyAttendance(classId, year, month) {
    const classData = await classRepository.findById(classId);
    if (!classData) {
      throw new NotFoundError('Class not found');
    }

    const monthNum = month || new Date().getMonth() + 1;
    const yearNum = year || new Date().getFullYear();

    const attendances = await attendanceRepository.getMonthlyAttendance(
      classId,
      yearNum,
      monthNum
    );

    const students = classData.students;
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    const result = students.map(student => {
      const studentAttendance = attendances.filter(a => a.studentId === student.id);
      const days = [];
      
      for (let day = 1; day <= daysInMonth; day++) {
        const localDate = new Date(yearNum, monthNum - 1, day);
        const record = studentAttendance.find(a => {
          const recordDate = new Date(a.date);
          return recordDate.getDate() === day;
        });
        days.push({
          date: `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
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
