import prisma from '../config/database.js';

export class AttendanceRepository {
  async create(data) {
    return prisma.attendance.create({ data });
  }

  async createMany(data) {
    return prisma.attendance.createMany({ data, skipDuplicates: true });
  }

  async findByStudentAndDate(studentId, classId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
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

  async upsert(studentId, classId, date, status) {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    return prisma.attendance.upsert({
      where: {
        studentId_classId_date: {
          studentId,
          classId,
          date: dateOnly
        }
      },
      create: { studentId, classId, date: dateOnly, status },
      update: { status }
    });
  }
}

export default new AttendanceRepository();
