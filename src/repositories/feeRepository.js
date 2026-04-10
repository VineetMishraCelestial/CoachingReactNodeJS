import prisma from '../config/database.js';

export class FeeRepository {
  async create(data) {
    return prisma.fee.create({ data });
  }

  async findById(id) {
    return prisma.fee.findUnique({
      where: { id },
      include: { student: true }
    });
  }

  async findByStudent(studentId) {
    return prisma.fee.findMany({
      where: { studentId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
  }

  async findByClass(classId) {
    return prisma.fee.findMany({
      where: { student: { classId } },
      include: { student: { select: { id: true, name: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId, status, month, year } = filters;
    const where = { student: { instituteId } };
    if (classId) where.student = { ...where.student, classId };
    if (status) where.status = status;
    if (month) where.month = month;
    if (year) where.year = parseInt(year);

    return prisma.fee.findMany({
      where,
      include: { student: { include: { class: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPendingCount(instituteId) {
    return prisma.fee.count({
      where: {
        status: 'pending',
        student: { instituteId }
      }
    });
  }

  async getCollectionStats(instituteId) {
    const fees = await prisma.fee.findMany({
      where: { student: { instituteId } },
      select: { amount: true, status: true }
    });

    const collected = fees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0);
    const pending = fees
      .filter(f => f.status === 'pending')
      .reduce((sum, f) => sum + f.amount, 0);

    return { collected, pending };
  }

  async upsert(studentId, month, year, data) {
    return prisma.fee.upsert({
      where: {
        studentId_month_year: { studentId, month, year }
      },
      create: { studentId, month, year, ...data },
      update: data
    });
  }
}

export default new FeeRepository();
