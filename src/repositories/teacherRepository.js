import prisma from '../config/database.js';

export class TeacherRepository {
  async create(data) {
    return prisma.teacher.create({ data });
  }

  async findById(id) {
    return prisma.teacher.findUnique({
      where: { id }
    });
  }

  async findByMobile(mobile) {
    return prisma.teacher.findUnique({ where: { mobile } });
  }

  async findByInstitute(instituteId, filters = {}) {
    const teachers = await prisma.teacher.findMany({
      where: { instituteId, isActive: true, ...filters },
      orderBy: { createdAt: 'desc' }
    });

    for (const teacher of teachers) {
      const classes = await prisma.class.findMany({
        where: { teacherId: teacher.id, isActive: true },
        select: { id: true, name: true, subject: true }
      });
      teacher.classes = classes;
    }

    return teachers;
  }

  async update(id, data) {
    return prisma.teacher.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.teacher.delete({ where: { id } });
  }

  async findTrash(instituteId) {
    return prisma.teacher.findMany({
      where: { instituteId, isActive: false },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async permanentDelete(id) {
    return prisma.teacher.delete({ where: { id } });
  }
}

export default new TeacherRepository();
