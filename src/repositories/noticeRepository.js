import prisma from '../config/database.js';

export class NoticeRepository {
  async create(data) {
    return prisma.notice.create({ data });
  }

  async findById(id) {
    return prisma.notice.findUnique({ where: { id } });
  }

  async findByInstitute(instituteId, filters = {}) {
    const { classId } = filters;
    const where = { instituteId };
    if (classId) where.classId = classId;

    return prisma.notice.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id, data) {
    return prisma.notice.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.notice.delete({ where: { id } });
  }
}

export default new NoticeRepository();
