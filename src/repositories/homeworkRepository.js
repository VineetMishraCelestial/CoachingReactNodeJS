import prisma from '../config/database.js';

export class HomeworkRepository {
  async create(data) {
    return prisma.homework.create({
      data,
      include: { class: true }
    });
  }

  async findById(id) {
    return prisma.homework.findUnique({
      where: { id },
      include: {
        class: true,
        submissions: { include: { student: true } }
      }
    });
  }

  async findByClass(classId, filters = {}) {
    return prisma.homework.findMany({
      where: { classId, ...filters },
      include: {
        submissions: true,
        _count: { select: { submissions: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id, data) {
    return prisma.homework.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.homework.delete({ where: { id } });
  }

  async addSubmission(homeworkId, studentId) {
    return prisma.homeworkSubmission.upsert({
      where: {
        homeworkId_studentId: { homeworkId, studentId }
      },
      create: {
        homeworkId,
        studentId,
        status: 'submitted',
        submittedAt: new Date()
      },
      update: {
        status: 'submitted',
        submittedAt: new Date()
      }
    });
  }
}

export default new HomeworkRepository();
