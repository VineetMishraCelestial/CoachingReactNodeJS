import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

export class AttendanceRepository {
  async findByClassAndDate(classId, date) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
    } else {
      localDate = new Date(date);
    }
    
    const startOfDay = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 23, 59, 59, 999));

    return Attendance.find({
      classId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('student');
  }

  async upsert(studentId, classId, date, status) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 0, 0, 0, 0));
    } else {
      localDate = new Date(date);
      localDate = new Date(Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), 0, 0, 0, 0));
    }

    const existing = await Attendance.findOne({ studentId, classId, date: localDate });

    if (existing) {
      existing.status = status;
      return existing.save();
    } else {
      const attendance = new Attendance({
        studentId,
        classId,
        date: localDate,
        status
      });
      return attendance.save();
    }
  }
}

export default new AttendanceRepository();
