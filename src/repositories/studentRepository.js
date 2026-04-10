import prisma from '../config/database.js';

export class StudentRepository {
  async create(data) {
    return prisma.student.create({
      data,
      include: { class: true }
    });
  }

  async findById(id) {
    return prisma.student.findUnique({
      where: { id },
      include: {
        class: true,
        fees: { orderBy: { createdAt: 'desc' } },
        _count: { select: { attendances: true } }
      }
    });
  }

  async findByInstitute(instituteId, filters = {}, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { instituteId, isActive: true, ...filters },
        include: {
          class: true,
          fees: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.student.count({ where: { instituteId, isActive: true, ...filters } })
    ]);

    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id, data) {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.student.delete({ where: { id } });
  }

  async findTrash(instituteId, pagination = {}) {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { instituteId, isActive: false },
        include: { class: true },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.student.count({ where: { instituteId, isActive: false } })
    ]);

    return { students, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async permanentDelete(id) {
    await prisma.fee.deleteMany({ where: { studentId: id } });
    await prisma.homeworkSubmission.deleteMany({ where: { studentId: id } });
    await prisma.attendance.deleteMany({ where: { studentId: id } });
    return prisma.student.delete({ where: { id } });
  }

  async getAttendanceStats(studentId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendances = await prisma.attendance.count({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return { attended: attendances, total: endDate.getDate() };
  }
}

export default new StudentRepository();
