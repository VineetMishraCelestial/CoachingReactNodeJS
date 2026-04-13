import prisma from '../config/database.js';

export class AttendanceRepository {
  async create(data) {
    return prisma.attendance.create({ data });
  }

  async createMany(data) {
    return prisma.attendance.createMany({ data, skipDuplicates: true });
  }

  async findByStudentAndDate(studentId, classId, date) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      localDate = new Date(date);
    }
    
    const startOfDay = new Date(localDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(localDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.attendance.findFirst({
      where: {
        studentId,
        classId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });
  }

  async findByClassAndDate(classId, date) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      localDate = new Date(date);
    }
    
    const startOfDay = new Date(localDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(localDate);
    endOfDay.setHours(23, 59, 59, 999);

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

  async getClassStats(classId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendance.groupBy({
      by: ['status'],
      where: {
        classId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: true
    });

    return attendances.reduce((acc, curr) => {
      acc[curr.status] = curr._count;
      return acc;
    }, { present: 0, absent: 0, late: 0 });
  }

  async getMonthlyAttendance(classId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        classId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { student: true },
      orderBy: { date: 'asc' }
    });

    return attendances;
  }

  async upsert(studentId, classId, date, status) {
    let localDate;
    if (typeof date === 'string') {
      const parts = date.split('-');
      localDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      localDate = new Date(date);
    }
    localDate.setHours(0, 0, 0, 0);

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