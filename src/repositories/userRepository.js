import prisma from '../config/database.js';

export class UserRepository {
  async create(data) {
    return prisma.user.create({ data });
  }

  async findByMobile(mobile) {
    return prisma.user.findUnique({ where: { mobile } });
  }

  async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where: filters })
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAllInstitutes() {
    return prisma.user.findMany({
      where: { role: 'institute', isActive: true },
      select: { id: true }
    });
  }
}

export default new UserRepository();
