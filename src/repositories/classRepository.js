import prisma from '../config/database.js';

export class ClassRepository {
  async create(data) {
    return prisma.class.create({ data });
  }

  async findById(id) {
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        teacher: { select: { id: true, name: true, subject: true, mobile: true, email: true } },
        students: { select: { id: true, name: true, parentMobile: true, joiningDate: true } },
        _count: { select: { students: true } }
      }
    });

    return classData;
  }

  async findByInstitute(instituteId, filters = {}) {
    const classes = await prisma.class.findMany({
      where: { instituteId, isActive: true, ...filters },
      include: {
        teacher: { select: { id: true, name: true, subject: true } },
        _count: { select: { students: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return classes;
  }

  async update(id, data) {
    return prisma.class.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.class.delete({ where: { id } });
  }

  async findTrash(instituteId) {
    return prisma.class.findMany({
      where: { instituteId, isActive: false },
      include: { teacher: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async permanentDelete(id) {
    await prisma.homework.deleteMany({ where: { classId: id } });
    await prisma.syllabus.deleteMany({ where: { classId: id } });
    await prisma.attendance.deleteMany({ where: { classId: id } });
    return prisma.class.delete({ where: { id } });
  }

  async getStats(instituteId) {
    const [classes, teachers, students] = await Promise.all([
      prisma.class.count({ where: { instituteId, isActive: true } }),
      prisma.teacher.count({ where: { instituteId, isActive: true } }),
      prisma.student.count({ where: { instituteId, isActive: true } })
    ]);
    return { classes, teachers, students };
  }
}

export default new ClassRepository();
