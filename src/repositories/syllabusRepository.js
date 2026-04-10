import prisma from '../config/database.js';

export class SyllabusRepository {
  async create(data) {
    return prisma.syllabus.create({ data });
  }

  async findById(id) {
    return prisma.syllabus.findUnique({ 
      where: { id },
      include: {
        subjects: {
          include: {
            topics: true
          }
        }
      }
    });
  }

  async findByClass(classId) {
    return prisma.syllabus.findMany({
      where: { classId },
      include: {
        subjects: {
          include: {
            topics: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async update(id, data) {
    return prisma.syllabus.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.syllabus.delete({ where: { id } });
  }

  async getProgressStats(classId) {
    const syllabi = await prisma.syllabus.findMany({
      where: { classId },
      select: { status: true }
    });

    const done = syllabi.filter(s => s.status === 'done').length;
    const ongoing = syllabi.filter(s => s.status === 'ongoing').length;
    const pending = syllabi.filter(s => s.status === 'pending').length;

    return {
      total: syllabi.length,
      done,
      ongoing,
      pending,
      percentage: syllabi.length ? Math.round((done / syllabi.length) * 100) : 0
    };
  }

  async createSubject(syllabusId, data) {
    return prisma.subject.create({
      data: { ...data, syllabusId }
    });
  }

  async getSubjectById(subjectId) {
    return prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        topics: true
      }
    });
  }

  async updateSubject(subjectId, data) {
    return prisma.subject.update({ where: { id: subjectId }, data });
  }

  async deleteSubject(subjectId) {
    return prisma.subject.delete({ where: { id: subjectId } });
  }

  async createTopic(subjectId, data) {
    return prisma.topic.create({
      data: { ...data, subjectId }
    });
  }

  async updateTopic(topicId, data) {
    const topic = await prisma.topic.update({ where: { id: topicId }, data });
    
    if (data.isCompleted !== undefined) {
      await this.updateSubjectStatus(topic.subjectId);
    }
    
    return topic;
  }

  async updateSubjectStatus(subjectId) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { topics: true }
    });

    if (!subject) return;

    const allCompleted = subject.topics.length > 0 && subject.topics.every(t => t.isCompleted);
    
    await prisma.subject.update({
      where: { id: subjectId },
      data: { status: allCompleted ? 'done' : 'ongoing' }
    });
  }

  async deleteTopic(topicId) {
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });
    await prisma.topic.delete({ where: { id: topicId } });
    if (topic) {
      await this.updateSubjectStatus(topic.subjectId);
    }
  }
}

export default new SyllabusRepository();
