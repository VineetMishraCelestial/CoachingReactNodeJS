import homeworkRepository from '../repositories/homeworkRepository.js';
import classRepository from '../repositories/classRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export class HomeworkService {
  async create(classId, instituteId, data) {
    const classData = await classRepository.findById(classId);
    if (!classData || classData.instituteId !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    return homeworkRepository.create({
      ...data,
      classId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    });
  }

  async getById(id) {
    const homework = await homeworkRepository.findById(id);
    if (!homework) {
      throw new NotFoundError('Homework not found');
    }

    const submitted = homework.submissions.filter(s => s.status === 'submitted').length;
    const pending = homework.submissions.filter(s => s.status === 'pending').length;

    return {
      ...homework,
      submittedCount: submitted,
      pendingCount: pending,
      submissions: homework.submissions
    };
  }

  async getByClass(classId, instituteId, filters = {}) {
    const classData = await classRepository.findById(classId);
    if (!classData || classData.instituteId !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    const homeworks = await homeworkRepository.findByClass(classId, filters);

    return homeworks.map(hw => ({
      ...hw,
      submittedCount: hw.submissions.filter(s => s.status === 'submitted').length,
      pendingCount: hw.submissions.filter(s => s.status === 'pending').length
    }));
  }

  async update(id, instituteId, data) {
    const homework = await homeworkRepository.findById(id);
    if (!homework) {
      throw new NotFoundError('Homework not found');
    }

    const classData = await classRepository.findById(homework.classId);
    if (!classData || classData.instituteId !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }

    return homeworkRepository.update(id, data);
  }

  async delete(id, instituteId) {
    const homework = await homeworkRepository.findById(id);
    if (!homework) {
      throw new NotFoundError('Homework not found');
    }

    const classData = await classRepository.findById(homework.classId);
    if (!classData || classData.instituteId !== instituteId) {
      throw new BadRequestError('Invalid class');
    }

    return homeworkRepository.delete(id);
  }

  async submitHomework(homeworkId, studentId) {
    const homework = await homeworkRepository.findById(homeworkId);
    if (!homework) {
      throw new NotFoundError('Homework not found');
    }

    return homeworkRepository.addSubmission(homeworkId, studentId);
  }
}

export default new HomeworkService();
