import prisma from '../config/database.js';

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

    return prisma.attendance.findMany({
      where: {
        classId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: { student: true }
    });
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

    return prisma.attendance.upsert({
      where: {
        studentId_classId_date: {
          studentId,
          classId,
          date: localDate
        }
      },
      create: { studentId, classId, date: localDate, status },
      update: { status }
    });
  }
}

export default new AttendanceRepository();